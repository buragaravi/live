import Link from "next/link";
import { PageHeader, PageShell, Card } from "@/components/ui";
import { APP_NAME } from "@/lib/constants";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About",
  description:
    "Learn how Locate works — consent-based location sharing with clear disclosure, no hidden tracking, and full recipient control.",
  path: "/about",
  keywords: ["about locate", "how location consent works"],
});

export default function AboutPage() {
  return (
    <PageShell className="max-w-3xl">
      <PageHeader
        title="About"
        description={`${APP_NAME} helps people share GPS location only when everyone involved has clearly agreed.`}
      />

      <div className="space-y-6">
        <Card className="p-6 text-sm leading-relaxed">
          <h2 className="font-semibold">What we do</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            {APP_NAME} is a consent-first tool for requesting and sharing
            location. A sender creates a link with their name and purpose. The
            recipient opens the link, sees exactly who is asking and why, and
            chooses whether to share their GPS coordinates. There is no account
            system, no background tracking, and no hidden redirects.
          </p>
        </Card>

        <Card className="p-6 text-sm leading-relaxed">
          <h2 className="font-semibold">How it works</h2>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-[var(--text-muted)]">
            <li>Create a link with your name, purpose, and destination URL.</li>
            <li>Share the generated link with the recipient.</li>
            <li>
              The recipient sees a clear consent screen before any location is
              requested.
            </li>
            <li>
              If they accept, their browser asks for GPS permission separately.
            </li>
            <li>
              Location is recorded once and viewable only by the link creator
              using a private access code.
            </li>
          </ol>
        </Card>

        <Card className="p-6 text-sm leading-relaxed">
          <h2 className="font-semibold">What we do not do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-[var(--text-muted)]">
            <li>We do not track users without explicit consent.</li>
            <li>We do not disguise links or hide the sender&apos;s identity.</li>
            <li>We do not sell precise location data.</li>
            <li>We do not use location data for advertising.</li>
            <li>We do not support stalking, harassment, or covert surveillance.</li>
          </ul>
        </Card>

        <Card className="p-6 text-sm leading-relaxed">
          <h2 className="font-semibold">Advertising</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            We may display advertisements on general informational pages to
            support the Service. Ads never appear on consent or location-sharing
            screens. Advertising partners may use cookies only if you accept
            them in our cookie banner. See our{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>{" "}
            for details.
          </p>
        </Card>

        <Card className="p-6 text-sm leading-relaxed">
          <h2 className="font-semibold">Questions?</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Visit our{" "}
            <Link href="/contact" className="underline">
              Contact
            </Link>{" "}
            page or read our{" "}
            <Link href="/terms" className="underline">
              Terms of Use
            </Link>
            .
          </p>
        </Card>
      </div>
    </PageShell>
  );
}
