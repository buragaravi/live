import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Badge, Button, Card, PageHeader, PageShell } from "@/components/ui";

export default async function AdminPostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <PageShell>
      <PageHeader
        title="Posts"
        description="Manage all blog posts."
        action={
          <Link href="/admin/posts/new">
            <Button>+ New post</Button>
          </Link>
        }
      />

      <Card className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead className="border-b border-[var(--border-light)] bg-[#fafafa] text-[11px] uppercase tracking-wide text-[var(--text-muted)]">
            <tr>
              <th className="px-4 py-3 font-semibold">Title</th>
              <th className="px-4 py-3 font-semibold">Category</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Published</th>
              <th className="px-4 py-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-[var(--text-muted)]">
                  No posts yet.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-[var(--border-light)] last:border-b-0">
                  <td className="px-4 py-3">
                    <div className="font-medium">{post.title}</div>
                    <div className="text-xs text-[var(--text-muted)]">/blog/{post.slug}</div>
                  </td>
                  <td className="px-4 py-3">{post.category}</td>
                  <td className="px-4 py-3">
                    <Badge tone={post.status === "PUBLISHED" ? "success" : "pending"}>
                      {post.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-[var(--text-muted)]">
                    {post.publishedAt?.toLocaleDateString() ?? "—"}
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
