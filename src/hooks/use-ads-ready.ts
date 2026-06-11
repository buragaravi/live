"use client";

import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/components/cookie-consent-provider";
import { canShowAds, isAdSenseConfigured } from "@/lib/ads";
import { hasAnyAdSlot } from "@/lib/ad-slots";

export function useAdsReady() {
  const pathname = usePathname();
  const { consent, ready } = useCookieConsent();

  const pageAllowsAds = canShowAds(pathname);
  const slotConfigured = hasAnyAdSlot();
  const clientConfigured = isAdSenseConfigured();

  const adsActive =
    ready &&
    consent === "all" &&
    pageAllowsAds &&
    slotConfigured &&
    clientConfigured;

  return {
    ready,
    adsActive,
    pageAllowsAds,
    sidebarActive: adsActive,
  };
}
