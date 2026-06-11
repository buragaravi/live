"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { usePathname } from "next/navigation";
import { useAdsReady } from "@/hooks/use-ads-ready";
import { resolveAdSlot } from "@/lib/ad-slots";
import { canShowAds, isAdSenseConfigured } from "@/lib/ads";

type AdFormat = "auto" | "horizontal" | "rectangle" | "vertical" | "sidebar";

type Props = {
  slot?: string;
  format?: AdFormat;
  className?: string;
  label?: boolean;
};

declare global {
  interface Window {
    adsbygoogle?: Record<string, unknown>[];
  }
}

function slotStyles(format: AdFormat): CSSProperties {
  switch (format) {
    case "sidebar":
    case "vertical":
      return { display: "inline-block", width: "100%", minHeight: 250, maxWidth: 160 };
    case "rectangle":
      return { display: "block", width: "100%", minHeight: 250 };
    case "horizontal":
      return { display: "block", width: "100%", minHeight: 90 };
    default:
      return { display: "block", width: "100%" };
  }
}

export function AdSlot({
  slot,
  format = "auto",
  className = "",
  label = true,
}: Props) {
  const pathname = usePathname();
  const { adsActive } = useAdsReady();
  const pushed = useRef(false);
  const adRef = useRef<HTMLModElement>(null);

  const client = process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT;
  const adSlot = resolveAdSlot(slot);
  const configured = isAdSenseConfigured() && Boolean(adSlot);

  const visible =
    adsActive && configured && canShowAds(pathname);

  useEffect(() => {
    pushed.current = false;
  }, [adSlot, format, pathname]);

  useEffect(() => {
    if (!visible || pushed.current || !adRef.current) return;

    const pushAd = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        pushed.current = true;
      } catch {
        // script not ready
      }
    };

    pushAd();
    const timer = setTimeout(pushAd, 800);
    return () => clearTimeout(timer);
  }, [visible, adSlot, format]);

  if (!visible) return null;

  const isSidebar = format === "sidebar" || format === "vertical";
  const adFormat = isSidebar ? undefined : format === "auto" ? "auto" : format;

  return (
    <div
      className={`${label ? "border border-dashed border-[var(--border-light)] bg-[#fafafa] p-2" : ""} ${className}`}
      aria-label="Advertisement"
    >
      {label ? (
        <p className="mb-2 text-center text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          Advertisement
        </p>
      ) : null}
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={slotStyles(format)}
        data-ad-client={client}
        data-ad-slot={adSlot}
        {...(adFormat ? { "data-ad-format": adFormat } : {})}
        {...(format === "auto" || format === "horizontal"
          ? { "data-full-width-responsive": "true" }
          : {})}
      />
    </div>
  );
}
