import Link from "next/link";
import { CreateLinkForm } from "@/components/create-link-form";
import { Card, PageHeader, PageShell } from "@/components/ui";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Create Consent Link",
  description:
    "Generate a consent-based location request link. Recipients see who you are, why you are asking, and must explicitly agree before GPS is collected.",
  path: "/",
  keywords: ["create location link", "GPS consent request"],
});

export default function HomePage() {
  return (
    <PageShell>
      <PageHeader
        title="Create link"
        description="Generate a consent-based location request link. Recipients see who you are, why you are asking, and must explicitly agree before any GPS data is collected."
      />

      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <Card className="p-4 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Step 1
          </p>
          <p className="mt-2 font-medium">Create a link</p>
          <p className="mt-1 text-[var(--text-muted)]">
            Enter your name, purpose, and the destination URL recipients expect.
          </p>
        </Card>
        <Card className="p-4 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Step 2
          </p>
          <p className="mt-2 font-medium">Recipient consents</p>
          <p className="mt-1 text-[var(--text-muted)]">
            They see your identity and must accept before GPS is requested.
          </p>
        </Card>
        <Card className="p-4 text-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
            Step 3
          </p>
          <p className="mt-2 font-medium">View results privately</p>
          <p className="mt-1 text-[var(--text-muted)]">
            Use your access code on the{" "}
            <Link href="/results" className="underline">
              Results
            </Link>{" "}
            page — only you can see them.
          </p>
        </Card>
      </div>

      <CreateLinkForm />

      <Card className="mt-8 p-4 text-sm text-[var(--text-muted)]">
        <strong className="text-[var(--text)]">Transparency:</strong> This is not
        covert tracking. Every recipient sees who is requesting their location and
        why. Read our{" "}
        <Link href="/about" className="underline">
          About
        </Link>
        ,{" "}
        <Link href="/terms" className="underline">
          Terms
        </Link>
        , and{" "}
        <Link href="/privacy" className="underline">
          Privacy Policy
        </Link>
        .
      </Card>
    </PageShell>
  );
}
