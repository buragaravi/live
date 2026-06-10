import { PageHeader, PageShell, Card } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact",
  description:
    "Contact Locate for support, privacy requests, data deletion, and abuse reports.",
  path: "/contact",
  keywords: ["contact locate", "privacy request", "report abuse"],
});

export default function ContactPage() {
  return (
    <PageShell className="max-w-3xl">
      <PageHeader
        title="Contact"
        description="Reach us for support, privacy requests, or to report misuse."
      />

      <div className="space-y-6">
        <Card className="p-6 text-sm">
          <h2 className="font-semibold">Email</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            For general enquiries, privacy requests, or abuse reports:
          </p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-3 inline-block text-base font-medium underline"
          >
            {CONTACT_EMAIL}
          </a>
        </Card>

        <Card className="p-6 text-sm leading-relaxed">
          <h2 className="font-semibold">Privacy & data requests</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            To request access, correction, or deletion of data where applicable,
            email us with the subject line &quot;Privacy Request&quot;. Include
            relevant details such as the link slug or access code (never share
            your access code publicly).
          </p>
        </Card>

        <Card className="p-6 text-sm leading-relaxed">
          <h2 className="font-semibold">Report misuse</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            If you believe a link is being used for stalking, harassment, fraud,
            or any prohibited purpose described in our{" "}
            <a href="/terms" className="underline">
              Terms of Use
            </a>
            , contact us immediately with the link URL and a description of the
            issue.
          </p>
        </Card>

        <Card className="p-6 text-sm leading-relaxed">
          <h2 className="font-semibold">Response time</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            We aim to respond to legitimate enquiries within 5 business days.
            Abuse reports are prioritised.
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
