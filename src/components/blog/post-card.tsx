import Link from "next/link";
import { Badge, Card } from "@/components/ui";
import type { Post } from "@prisma/client";

type PostPreview = Pick<
  Post,
  "slug" | "title" | "excerpt" | "category" | "publishedAt" | "authorName" | "coverImage"
>;

export function PostCard({ post }: { post: PostPreview }) {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      {post.coverImage ? (
        <div className="aspect-[2/1] border-b border-[var(--border-light)] bg-[#fafafa]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.coverImage}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-2">
          <Badge tone="neutral">{post.category}</Badge>
          {post.publishedAt ? (
            <span className="text-xs text-[var(--text-muted)]">
              {post.publishedAt.toLocaleDateString()}
            </span>
          ) : null}
        </div>
        <h2 className="mt-3 text-lg font-semibold leading-snug">
          <Link href={`/blog/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </h2>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--text-muted)]">
          {post.excerpt}
        </p>
        <p className="mt-4 text-xs text-[var(--text-muted)]">By {post.authorName}</p>
      </div>
    </Card>
  );
}
