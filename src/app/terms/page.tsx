import Link from "next/link";
import { PageHeader, PageShell, Card } from "@/components/ui";
import { APP_NAME } from "@/lib/constants";
import { CONTACT_EMAIL } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Use",
  description:
    "Terms of use for Locate — lawful consent-based location sharing, user responsibilities, and prohibited uses.",
  path: "/terms",
  keywords: ["terms of use", "location sharing terms"],
});

export default function TermsPage() {
  return (
    <PageShell width="narrow">
      <PageHeader title="Terms of Use" />
      <Card className="space-y-6 p-6 text-sm leading-relaxed text-[var(--text)]">
        <section>
          <h2 className="font-semibold">1. Acceptance of terms</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            By accessing or using {APP_NAME}, you agree to these Terms of Use and
            our{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
            . If you do not agree, do not use the Service.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">2. Purpose of the service</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            The Service enables users to request, share, receive, and view
            location information through a consent-based process. It is intended
            solely for lawful purposes and authorized location sharing.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">3. Definitions</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--text-muted)]">
            <li>&quot;Sender&quot; — a user who requests another user&apos;s location.</li>
            <li>&quot;Recipient&quot; — a user who voluntarily shares their location.</li>
            <li>&quot;Location Data&quot; — GPS coordinates, accuracy, timestamps, and metadata.</li>
            <li>&quot;Service&quot; — the website, APIs, and related systems.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold">4. Consent requirement</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            No location data is collected unless the Recipient receives clear
            disclosure, actively agrees, and grants device or browser permission.
            The Service does not bypass OS or browser permission mechanisms.
            Recipients always see the sender&apos;s identity and stated purpose
            before consenting.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">5. User responsibilities</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            You must not track without authorization, misrepresent requests, use
            the Service for harassment or stalking, obtain location through
            deception, or violate privacy or data protection laws.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">6. Sender obligations</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Senders must have a legitimate purpose, not redistribute location
            without authorization, and not use location to threaten, harass, or
            harm any person.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">7. Recipient rights</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Recipients may decline any request, stop sharing, and request
            deletion of stored data where applicable.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">8. Advertising</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            The Service may display third-party advertisements on general pages.
            Ads do not appear on consent or location-sharing screens. By accepting
            advertising cookies (where offered), you agree that partners such as
            Google and Meta may use cookies as described in our Privacy Policy.
            Location data is never used to target ads.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">9. No guarantee of accuracy</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Location information may be inaccurate or unavailable. Do not rely on
            it for emergency, medical, law enforcement, or safety-critical use.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">10. Prohibited uses</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Stalking, domestic abuse, harassment, human trafficking, unlawful
            surveillance, child exploitation, fraud, and criminal activity are
            strictly prohibited.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">11. Limitation of liability</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            To the maximum extent permitted by law, we are not liable for
            indirect or consequential damages arising from use of the Service.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">12. Suspension</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            We may suspend access for misuse, abuse, fraud, or legal violations.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">13. Contact</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Report misuse or ask questions:{" "}
            <Link href="/contact" className="underline">
              Contact
            </Link>{" "}
            or{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </Card>
    </PageShell>
  );
}
