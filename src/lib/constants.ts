export const TERMS_VERSION = "1.0";
export const APP_NAME = "Locate";

export const EXPIRY_OPTIONS = [
  { value: "FIFTEEN_MIN", label: "15 minutes", minutes: 15 },
  { value: "ONE_HOUR", label: "1 hour", minutes: 60 },
  { value: "TWENTY_FOUR_HOURS", label: "24 hours", minutes: 1440 },
] as const;

export type ExpiryValue = (typeof EXPIRY_OPTIONS)[number]["value"];

export function expiryToDate(option: ExpiryValue): Date {
  const found = EXPIRY_OPTIONS.find((o) => o.value === option);
  const minutes = found?.minutes ?? 60;
  return new Date(Date.now() + minutes * 60 * 1000);
}
