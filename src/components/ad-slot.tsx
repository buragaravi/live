"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/components/cookie-consent-provider";
import { canShowAds, isAdSenseConfigured } from "@/lib/ads";

type Props = {
  slot?: string;
  format?: "auto" | "rectangle" | "horizontal";
  className?: string;
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

export function AdSlot({
  slot,
  format = "auto",
  className = "",
}: Props) {
  const pathname = usePathname();
  const { consent, ready } = useCookieConsent();
  const pushed = useRef(false);
  const adRef = useRef<HTMLModElement>(null);

  const client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;
  const adSlot = slot ?? process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT;
  const configured = isAdSenseConfigured() && Boolean(adSlot);

  const visible =
    ready &&
    consent === "all" &&
    configured &&
    canShowAds(pathname);

  useEffect(() => {
    if (!visible || pushed.current || !adRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      // AdSense not loaded yet
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`my-6 border border-dashed border-[var(--border-light)] bg-[#fafafa] p-2 ${className}`}
      aria-label="Advertisement"
    >
      <p className="mb-2 text-center text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        Advertisement
      </p>
      <ins
        ref={adRef}
        className="adsbygoogle block"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={adSlot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
