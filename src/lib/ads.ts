import { isAdSenseClientConfigured } from "@/lib/adsense";

/** Pages where ads are allowed. Never on consent or sensitive data screens. */
const AD_ALLOWED_PATHS = new Set([
  "/",
  "/about",
  "/contact",
  "/terms",
  "/privacy",
  "/results",
  "/blog",
]);

const AD_BLOCKED_PREFIXES = [
  "/l/",
  "/admin",
  "/create/success",
  "/results/dashboard",
];

export function canShowAds(pathname: string): boolean {
  if (AD_BLOCKED_PREFIXES.some((p) => pathname.startsWith(p))) {
    return false;
  }
  if (AD_ALLOWED_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/blog/")) return true;
  return false;
}

export function isAdSenseConfigured(): boolean {
  return isAdSenseClientConfigured();
}

export function isMetaPixelConfigured(): boolean {
  const id = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
  return id.length > 0 && id !== "XXXXXXXXXXXXXXX";
}
