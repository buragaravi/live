import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge, Button, Card, PageHeader, PageShell, StatCard } from "@/components/ui";

export default async function AdminDashboardPage() {
  const [total, published, drafts, recent] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.post.count({ where: { status: "DRAFT" } }),
    prisma.post.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        updatedAt: true,
        slug: true,
      },
    }),
  ]);

  return (
    <PageShell>
      <PageHeader
        title="Dashboard"
        description="Overview of your blog content."
        action={
          <Link href="/admin/posts/new">
            <Button>+ New post</Button>
          </Link>
        }
      />

      <Card className="mb-8 flex flex-col divide-y divide-[var(--border-light)] md:flex-row md:divide-x md:divide-y-0">
        <StatCard label="Total posts" value={total} />
        <StatCard label="Published" value={published} />
        <StatCard label="Drafts" value={drafts} />
      </Card>

      <Card className="overflow-x-auto">
        <div className="border-b border-[var(--border-light)] px-4 py-3 text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
          Recent posts
        </div>
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--border-light)] bg-[#fafafa] text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Updated</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-[var(--text-muted)]">
                  No posts yet.{" "}
                  <Link href="/admin/posts/new" className="underline">
                    Create your first post
                  </Link>
                </td>
              </tr>
            ) : (
              recent.map((post) => (
                <tr key={post.id} className="border-b border-[var(--border-light)] last:border-b-0">
                  <td className="px-4 py-3 font-medium">{post.title}</td>
                  <td className="px-4 py-3">
                    <Badge tone={post.status === "PUBLISHED" ? "success" : "pending"}>
                      {post.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">
                    {post.updatedAt.toLocaleString()}
                  </td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/posts/${post.id}`} className="text-xs underline">
                      Edit
                    </Link>
                    {post.status === "PUBLISHED" ? (
                      <>
                        {" · "}
                        <Link href={`/blog/${post.slug}`} className="text-xs underline" target="_blank">
                          View
                        </Link>
                      </>
                    ) : null}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </PageShell>
  );
}
