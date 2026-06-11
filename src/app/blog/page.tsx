import { prisma } from "@/lib/prisma";
import { PostCard } from "@/components/blog/post-card";
import { PageHeader, PageShell } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Blog",
  description:
    "Articles about GPS consent, location privacy, safe location sharing, and updates from Locate.",
  path: "/blog",
  keywords: [
    "location privacy blog",
    "GPS consent articles",
    "share location safely",
  ],
});

export default async function BlogPage() {
  const posts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    select: {
      slug: true,
      title: true,
      excerpt: true,
      category: true,
      publishedAt: true,
      authorName: true,
      coverImage: true,
    },
  });

  return (
    <PageShell>
      <PageHeader
        title="Blog"
        description="Guides, privacy tips, and news about consent-based location sharing."
      />

      {posts.length === 0 ? (
        <p className="text-sm text-[var(--text-muted)]">
          No articles published yet. Check back soon.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </PageShell>
  );
}
