"use client";

import Link from "next/link";
import { useCookieConsent } from "@/components/cookie-consent-provider";
import { APP_NAME } from "@/lib/constants";
import { APP_GUTTER, APP_MAX_FULL } from "@/lib/ad-slots";

const contactEmail =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "contact@example.com";

export function SiteFooter() {
  const { openPreferences } = useCookieConsent();

  return (
    <footer className="mt-12 border-t border-[var(--border-light)] bg-white">
      <div className={`mx-auto w-full ${APP_MAX_FULL} ${APP_GUTTER} py-8`}>
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="text-sm font-semibold">{APP_NAME}</p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Consent-based location sharing. No hidden tracking. Recipients
              always see who is asking and why.
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Legal
            </p>
            <nav className="mt-2 flex flex-col gap-2 text-sm">
              <Link href="/blog" className="hover:underline">
                Blog
              </Link>
              <Link href="/about" className="hover:underline">
                About
              </Link>
              <Link href="/contact" className="hover:underline">
                Contact
              </Link>
              <Link href="/terms" className="hover:underline">
                Terms of Use
              </Link>
              <Link href="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
              <button
                type="button"
                onClick={openPreferences}
                className="text-left hover:underline"
              >
                Cookie settings
              </button>
            </nav>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
              Contact
            </p>
            <a
              href={`mailto:${contactEmail}`}
              className="mt-2 block text-sm hover:underline"
            >
              {contactEmail}
            </a>
          </div>
        </div>
        <p className="mt-8 border-t border-[var(--border-light)] pt-6 text-xs text-[var(--text-muted)]">
          © {new Date().getFullYear()} {APP_NAME}. Location data is collected
          only with explicit user consent and is never used for advertising.
        </p>
      </div>
    </footer>
  );
}
