import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";
import { PostForm } from "@/components/admin/post-form";
import { EmbedHelp } from "@/components/admin/embed-help";
import { DeletePostButton } from "@/components/admin/delete-post-button";
import { PageHeader, PageShell } from "@/components/ui";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditPostPage({ params }: Props) {
  const admin = await requireAdmin();
  const { id } = await params;

  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <PageShell>
      <PageHeader
        title="Edit post"
        description={post.title}
        action={<DeletePostButton postId={post.id} />}
      />
      <EmbedHelp />
      <PostForm post={post} defaultAuthorName={admin.name} />
    </PageShell>
  );
}
