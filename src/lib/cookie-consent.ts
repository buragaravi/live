export const COOKIE_CONSENT_KEY = "locate_cookie_consent";

export type CookieConsent = "essential" | "all" | null;

export function parseConsent(value: string | null): CookieConsent {
  if (value === "essential" || value === "all") return value;
  return null;
}
