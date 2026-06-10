export const GOOGLE_ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT ?? "";

export function getAdSenseClient(): string {
  return GOOGLE_ADSENSE_CLIENT;
}

export function isAdSenseClientConfigured(): boolean {
  return (
    GOOGLE_ADSENSE_CLIENT.length > 0 &&
    GOOGLE_ADSENSE_CLIENT.startsWith("ca-pub-") &&
    GOOGLE_ADSENSE_CLIENT !== "ca-pub-XXXXXXXXXXXXXXXX"
  );
}

/** ads.txt uses pub- ID (strip ca- prefix) */
export function getAdSensePublisherId(): string {
  return GOOGLE_ADSENSE_CLIENT.replace(/^ca-/, "");
}
