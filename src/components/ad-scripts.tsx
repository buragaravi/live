"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCookieConsent } from "@/components/cookie-consent-provider";
import { canShowAds, isMetaPixelConfigured } from "@/lib/ads";

export function AdScripts() {
  const pathname = usePathname();
  const { consent, ready } = useCookieConsent();

  const metaPixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;

  const allowMeta =
    ready &&
    consent === "all" &&
    canShowAds(pathname) &&
    isMetaPixelConfigured();

  if (!allowMeta) return null;

  return (
    <>
      {isMetaPixelConfigured() && metaPixelId ? (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '${metaPixelId}');
            fbq('track', 'PageView');
          `}
        </Script>
      ) : null}
    </>
  );
}
