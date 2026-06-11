export function resolveAdSlot(slot?: string): string | undefined {
  const value =
    slot ??
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT ??
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR;
  if (!value || value === "XXXXXXXXXX") return undefined;
  return value;
}

export function sidebarAdSlot(side: "left" | "right"): string | undefined {
  if (side === "left") {
    return resolveAdSlot(
      process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_LEFT ??
        process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR
    );
  }
  return resolveAdSlot(
    process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_RIGHT ??
      process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR
  );
}

export function hasAnyAdSlot(): boolean {
  return Boolean(
    resolveAdSlot() ||
      resolveAdSlot(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_SIDEBAR) ||
      resolveAdSlot(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_LEFT) ||
      resolveAdSlot(process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_SLOT_RIGHT)
  );
}

/** Shared horizontal padding for the whole app shell */
export const APP_GUTTER = "px-4 sm:px-6 lg:px-8 xl:px-10";

/** Max width when side ads are active (nav, footer, layout) */
export const APP_MAX_WITH_ADS = "max-w-[1680px]";

/** Full bleed max on ultra-wide without side ads */
export const APP_MAX_FULL = "max-w-[1920px]";
