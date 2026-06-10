import Script from "next/script";
import { getAdSenseClient, isAdSenseClientConfigured } from "@/lib/adsense";

/**
 * AdSense loader for site verification & auto ads.
 * Meta tag is in root metadata (google-adsense-account).
 * Ad units still respect cookie consent via AdScripts + AdSlot.
 */
export function AdSenseScript() {
  if (!isAdSenseClientConfigured()) return null;

  const client = getAdSenseClient();

  return (
    <Script
      id="google-adsense"
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />
  );
}
