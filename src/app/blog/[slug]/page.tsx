import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { renderMarkdown } from "@/lib/markdown";
import { absoluteUrl, pageMetadata } from "@/lib/seo";
import { Badge, Card, PageShell } from "@/components/ui";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
  });

  if (!post) return { title: "Post not found" };

  const keywords = post.keywords
    ? post.keywords.split(",").map((k) => k.trim()).filter(Boolean)
    : [];

  return pageMetadata({
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt,
    path: `/blog/${post.slug}`,
    keywords,
  });
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;

  const post = await prisma.post.findFirst({
    where: { slug, status: "PUBLISHED" },
  });

  if (!post) notFound();

  const html = renderMarkdown(post.content);
  const tags = post.tags
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.publishedAt?.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: { "@type": "Person", name: post.authorName },
    publisher: { "@type": "Organization", name: "Locate" },
    mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
    ...(post.coverImage ? { image: post.coverImage } : {}),
  };

  return (
    <PageShell width="full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <article>
        <div className="mb-6 flex flex-wrap items-center gap-2">
          <Badge tone="neutral">{post.category}</Badge>
          {post.publishedAt ? (
            <time
              dateTime={post.publishedAt.toISOString()}
              className="text-xs text-[var(--text-muted)]"
            >
              {post.publishedAt.toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </time>
          ) : null}
          <span className="text-xs text-[var(--text-muted)]">
            · By {post.authorName}
          </span>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-[2.5rem] lg:leading-tight">
          {post.title}
        </h1>
        <p className="mt-3 max-w-5xl text-lg text-[var(--text-muted)] md:text-xl">
          {post.excerpt}
        </p>

        {post.coverImage ? (
          <div className="my-8 border border-[var(--border-light)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt=""
              className="w-full object-cover"
            />
          </div>
        ) : null}

        <Card className="p-6 md:p-8 lg:p-10">
          <div
            className="prose-blog text-base leading-relaxed text-[var(--text)] md:text-[17px]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </Card>

        {tags.length > 0 ? (
          <div className="mt-6 flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="border border-[var(--border-light)] px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--text-muted)]"
              >
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="mt-8 border-t border-[var(--border-light)] pt-6">
          <Link href="/blog" className="text-sm underline">
            ← Back to blog
          </Link>
        </div>
      </article>
    </PageShell>
  );
}
