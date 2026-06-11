"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import {
  ADMIN_COOKIE_NAME,
  createAdminToken,
  verifyPassword,
  hashPassword,
  getAdmin,
} from "@/lib/admin-auth";
import { slugifyTitle } from "@/lib/post-slug";
import { PostStatus } from "@prisma/client";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password required"),
});

const postSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters").max(200),
  slug: z.string().min(3).max(100).regex(/^[a-z0-9-]+$/, "Slug: lowercase letters, numbers, hyphens only"),
  excerpt: z.string().min(10, "Excerpt must be at least 10 characters").max(500),
  content: z.string().min(50, "Content must be at least 50 characters"),
  coverImage: z.string().url().optional().or(z.literal("")),
  category: z.string().min(1).max(50),
  tags: z.string().max(200).optional(),
  metaTitle: z.string().max(70).optional(),
  metaDescription: z.string().max(160).optional(),
  keywords: z.string().max(200).optional(),
  status: z.enum(["DRAFT", "PUBLISHED"]),
  authorName: z.string().min(1).max(100),
});

export async function adminLogin(
  _prev: { error?: string },
  formData: FormData
): Promise<{ error?: string }> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors.email?.[0] ?? "Invalid login" };
  }

  const admin = await prisma.admin.findUnique({
    where: { email: parsed.data.email.toLowerCase().trim() },
  });

  if (!admin) {
    return { error: "Invalid email or password" };
  }

  const ok = await verifyPassword(parsed.data.password, admin.passwordHash);
  if (!ok) {
    return { error: "Invalid email or password" };
  }

  const token = await createAdminToken(admin.id);
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  redirect("/admin/dashboard");
}

export async function adminLogout() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE_NAME);
  redirect("/admin");
}

export async function createPost(
  _prev: { error?: string; fieldErrors?: Record<string, string[]> },
  formData: FormData
): Promise<{ error?: string; fieldErrors?: Record<string, string[]> }> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin");

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug") || slugifyTitle(String(formData.get("title") ?? "")),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || "",
    category: formData.get("category") || "General",
    tags: formData.get("tags") || "",
    metaTitle: formData.get("metaTitle") || "",
    metaDescription: formData.get("metaDescription") || "",
    keywords: formData.get("keywords") || "",
    status: formData.get("status"),
    authorName: formData.get("authorName") || admin.name,
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = parsed.data;
  const existing = await prisma.post.findUnique({ where: { slug: data.slug } });
  if (existing) {
    return { error: "A post with this slug already exists" };
  }

  const isPublished = data.status === "PUBLISHED";

  await prisma.post.create({
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage || null,
      category: data.category,
      tags: data.tags ?? "",
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      keywords: data.keywords ?? "",
      status: data.status as PostStatus,
      authorName: data.authorName,
      authorId: admin.id,
      publishedAt: isPublished ? new Date() : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");
  revalidatePath("/sitemap.xml");
  redirect("/admin/posts");
}

export async function updatePost(
  postId: string,
  _prev: { error?: string; fieldErrors?: Record<string, string[]> },
  formData: FormData
): Promise<{ error?: string; fieldErrors?: Record<string, string[]> }> {
  const admin = await getAdmin();
  if (!admin) redirect("/admin");

  const existing = await prisma.post.findUnique({ where: { id: postId } });
  if (!existing) return { error: "Post not found" };

  const raw = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    content: formData.get("content"),
    coverImage: formData.get("coverImage") || "",
    category: formData.get("category") || "General",
    tags: formData.get("tags") || "",
    metaTitle: formData.get("metaTitle") || "",
    metaDescription: formData.get("metaDescription") || "",
    keywords: formData.get("keywords") || "",
    status: formData.get("status"),
    authorName: formData.get("authorName") || admin.name,
  };

  const parsed = postSchema.safeParse(raw);
  if (!parsed.success) {
    return { fieldErrors: parsed.error.flatten().fieldErrors as Record<string, string[]> };
  }

  const data = parsed.data;
  const slugConflict = await prisma.post.findFirst({
    where: { slug: data.slug, NOT: { id: postId } },
  });
  if (slugConflict) {
    return { error: "A post with this slug already exists" };
  }

  const wasPublished = existing.status === "PUBLISHED";
  const isPublished = data.status === "PUBLISHED";

  await prisma.post.update({
    where: { id: postId },
    data: {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt,
      content: data.content,
      coverImage: data.coverImage || null,
      category: data.category,
      tags: data.tags ?? "",
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      keywords: data.keywords ?? "",
      status: data.status as PostStatus,
      authorName: data.authorName,
      publishedAt:
        isPublished && !wasPublished
          ? new Date()
          : isPublished
            ? existing.publishedAt
            : null,
    },
  });

  revalidatePath("/blog");
  revalidatePath(`/blog/${existing.slug}`);
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");
  revalidatePath("/sitemap.xml");
  redirect("/admin/posts");
}

export async function deletePost(postId: string) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin");

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) return;

  await prisma.post.delete({ where: { id: postId } });

  revalidatePath("/blog");
  revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/admin/posts");
  revalidatePath("/admin/dashboard");
  revalidatePath("/sitemap.xml");
  redirect("/admin/posts");
}
