import { isAdSenseClientConfigured } from "@/lib/adsense";

/** Pages where ads are allowed. Never on consent or sensitive data screens. */
const AD_ALLOWED_PATHS = new Set([
  "/",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/results",
]);

const AD_BLOCKED_PREFIXES = ["/l/", "/create/success", "/results/dashboard"];

export function canShowAds(pathname: string): boolean {
  if (AD_BLOCKED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return false;
  }
  return AD_ALLOWED_PATHS.has(pathname);
}

export function isAdSenseConfigured(): boolean {
  return isAdSenseClientConfigured();
}

export function isMetaPixelConfigured(): boolean {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
  return id.length > 0 && id !== "XXXXXXXXXXXXXXX";
}
