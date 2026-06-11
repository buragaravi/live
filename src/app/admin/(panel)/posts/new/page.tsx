import { requireAdmin } from "@/lib/admin-auth";
import { PostForm } from "@/components/admin/post-form";
import { EmbedHelp } from "@/components/admin/embed-help";
import { PageHeader, PageShell } from "@/components/ui";

export default async function NewPostPage() {
  const admin = await requireAdmin();

  return (
    <PageShell>
      <PageHeader
        title="New post"
        description="Write a new blog article. Use Markdown for formatting."
      />
      <EmbedHelp />
      <PostForm defaultAuthorName={admin.name} />
    </PageShell>
  );
}
