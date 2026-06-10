"use client";

import { usePathname } from "next/navigation";
import { SiteNav } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { AdSlot } from "@/components/ad-slot";
import { canShowAds } from "@/lib/ads";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isConsentFlow = pathname.startsWith("/l/");

  if (isConsentFlow) {
    return <>{children}</>;
  }

  return (
    <>
      <SiteNav />
      <main>{children}</main>
      {canShowAds(pathname) ? <AdSlot className="mx-auto max-w-6xl px-4 md:px-6" /> : null}
      <SiteFooter />
    </>
  );
}
