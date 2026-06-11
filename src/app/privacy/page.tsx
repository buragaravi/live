import Link from "next/link";
import { PageHeader, PageShell, Card } from "@/components/ui";
import { APP_NAME } from "@/lib/constants";
import { CONTACT_EMAIL, PRIVACY_LAST_UPDATED } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "Locate privacy policy — location data, cookies, advertising partners, your rights, and opt-out options.",
  path: "/privacy",
  keywords: ["privacy policy", "location data privacy", "cookie policy"],
});

export default function PrivacyPage() {
  return (
    <PageShell width="narrow">
      <PageHeader
        title="Privacy Policy"
        description={`Last updated: ${PRIVACY_LAST_UPDATED}`}
      />
      <Card className="space-y-8 p-6 text-sm leading-relaxed text-[var(--text)]">
        <section>
          <h2 className="font-semibold">1. Introduction</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            {APP_NAME} (&quot;we&quot;, &quot;us&quot;, &quot;the Service&quot;)
            respects your privacy and your right to control personal information.
            This Privacy Policy explains what we collect, how we use it, how
            advertising works on our site, and your rights.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">2. Information we collect</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--text-muted)]">
            <li>GPS coordinates, accuracy, and timestamps (only after consent)</li>
            <li>IP address and browser/device information</li>
            <li>Consent records and audit logs</li>
            <li>Creator name and stated purpose of a location request</li>
            <li>Cookie preferences you select</li>
          </ul>
          <p className="mt-3 text-[var(--text-muted)]">
            <strong>We do not use location data for advertising.</strong> Location
            is collected solely to fulfil a consented location-sharing request.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">3. Legal basis</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Location data is processed only after explicit, informed consent.
            Consent may be withdrawn by declining a request or contacting us.
            Essential cookies are used based on legitimate interest to operate
            the Service. Advertising cookies are used only with your consent.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">4. How location is collected</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Location is collected only when a request is shown, the user
            voluntarily accepts our terms and privacy policy, and the device or
            browser grants GPS permission. We do not bypass operating system or
            browser controls. There is no silent or background location tracking.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">5. How we use data</h2>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-[var(--text-muted)]">
            <li>Facilitate consented location sharing</li>
            <li>Verify consent and maintain audit logs</li>
            <li>Prevent fraud and abuse</li>
            <li>Maintain and improve the Service</li>
            <li>Comply with legal obligations</li>
          </ul>
        </section>

        <section>
          <h2 className="font-semibold">6. How data is shared</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Location data is shared only with the authorized requester identified
            to the recipient at the time of consent. We do not sell precise
            location data. We may disclose information if required by law or to
            protect safety and rights.
          </p>
        </section>

        <section id="cookies">
          <h2 className="font-semibold">7. Cookies and similar technologies</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            We use cookies and similar technologies as follows:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-[var(--text-muted)]">
            <li>
              <strong>Essential cookies</strong> — required to operate the
              Service (e.g. results session, cookie preference storage).
            </li>
            <li>
              <strong>Advertising cookies</strong> — only if you click
              &quot;Accept all&quot; on our cookie banner. Used by partners to
              deliver and measure ads.
            </li>
          </ul>
          <p className="mt-3 text-[var(--text-muted)]">
            You can change your choice at any time via &quot;Cookie settings&quot;
            in the site footer.
          </p>
        </section>

        <section id="advertising">
          <h2 className="font-semibold">8. Advertising partners</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            We may display advertisements on non-sensitive pages to support the
            Service. Ads are <strong>never</strong> shown on consent screens,
            location-sharing flows, or pages displaying user location results.
          </p>
          <p className="mt-3 text-[var(--text-muted)]">Our partners may include:</p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-[var(--text-muted)]">
            <li>
              <strong>Google (AdSense)</strong> —{" "}
              <a
                href="https://policies.google.com/technologies/ads"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                How Google uses data
              </a>
              {" · "}
              <a
                href="https://adssettings.google.com/"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Google ad settings (opt out)
              </a>
            </li>
            <li>
              <strong>Meta (Facebook)</strong> —{" "}
              <a
                href="https://www.facebook.com/privacy/policy/"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meta Privacy Policy
              </a>
              {" · "}
              <a
                href="https://www.facebook.com/settings?tab=ads"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Meta ad preferences (opt out)
              </a>
            </li>
          </ul>
          <p className="mt-3 text-[var(--text-muted)]">
            EU/UK users: where required, advertising cookies load only after
            consent. You may also visit{" "}
            <a
              href="https://www.youronlinechoices.eu/"
              className="underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Your Online Choices (EU)
            </a>{" "}
            for industry opt-out tools.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">9. Your rights</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Depending on your jurisdiction, you may have the right to access,
            correct, delete, restrict, or object to processing of your data, and
            to withdraw consent. Contact us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="font-semibold">10. Data retention</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Data is retained only as long as necessary to provide the Service,
            resolve disputes, detect abuse, and comply with law. Expired link data
            may be deleted or anonymized.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">11. Security</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            We use encryption in transit, access controls, and audit logging.
            No system is completely secure.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">12. Children&apos;s privacy</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            The Service is not intended for children under the minimum age required
            by applicable law without legally valid authorization.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">13. Human rights</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            We are committed to protecting privacy, dignity, and autonomy. The
            Service must not be used for harassment, coercion, unlawful
            surveillance, or other conduct that infringes human rights.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">14. International transfers</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Where data is transferred internationally, appropriate safeguards are
            applied consistent with applicable law.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">15. Changes</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            We may update this policy from time to time. Material changes will be
            posted on this page with an updated date.
          </p>
        </section>

        <section>
          <h2 className="font-semibold">16. Contact</h2>
          <p className="mt-2 text-[var(--text-muted)]">
            Questions about this policy:{" "}
            <Link href="/contact" className="underline">
              Contact page
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
