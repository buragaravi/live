import type { Metadata } from "next";
import { CopyBlock } from "@/components/copy-block";
import { Card, PageHeader, PageShell } from "@/components/ui";

export const metadata: Metadata = {
  title: "Link Created",
  robots: { index: false, follow: false, nocache: true },
};

type Props = {
  searchParams: Promise<{ slug?: string; code?: string }>;
};

export default async function CreateSuccessPage({ searchParams }: Props) {
  const params = await searchParams;
  const slug = params.slug;
  const code = params.code;

  if (!slug || !code) {
    return (
      <PageShell>
        <PageHeader title="Missing information" />
        <Card className="p-6 text-sm text-[var(--text-muted)]">
          Link details are unavailable. Please create a new link.
        </Card>
      </PageShell>
    );
  }

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ??
    (process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000");

  const shareUrl = `${baseUrl}/l/${slug}`;

  return (
    <PageShell>
      <PageHeader
        title="Link created"
        description="Save your access code now. It will not be shown again. Share only the public link with recipients."
      />

      <div className="space-y-4">
        <CopyBlock label="Share this link with recipients" value={shareUrl} />
        <CopyBlock
          label="Your private access code (keep secret)"
          value={code}
          highlight
        />
      </div>

      <Card className="mt-6 border-[var(--border)] p-4 text-sm">
        <strong>Important:</strong> Use your access code on the{" "}
        <a href="/results" className="underline">
          Results
        </a>{" "}
        page to view consent logs and locations. Recipients never see this
        dashboard.
      </Card>
    </PageShell>
  );
}
