"use client";

import Link from "next/link";
import { useCookieConsent } from "@/components/cookie-consent-provider";
import { Button } from "@/components/ui";

export function CookieBanner() {
  const { showBanner, acceptAll, acceptEssential } = useCookieConsent();

  if (!showBanner) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-[var(--border)] bg-white p-4 shadow-lg md:p-6"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="max-w-3xl text-sm text-[var(--text-muted)]">
          <p className="font-medium text-[var(--text)]">Cookie preferences</p>
          <p className="mt-1 leading-relaxed">
            We use essential cookies to run the Service. With your permission, we
            also use cookies for advertising through partners such as Google and
            Meta. Location data is{" "}
            <strong>never</strong> collected for advertising.{" "}
            <Link href="/privacy#cookies" className="underline">
              Privacy Policy
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          <Button type="button" variant="secondary" onClick={acceptEssential}>
            Essential only
          </Button>
          <Button type="button" onClick={acceptAll}>
            Accept all
          </Button>
        </div>
      </div>
    </div>
  );
}
