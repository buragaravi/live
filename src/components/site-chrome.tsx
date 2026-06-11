"use client";

import { usePathname } from "next/navigation";
import { SiteNav } from "@/components/ui";
import { SiteFooter } from "@/components/site-footer";
import { AppContentLayout } from "@/components/app-content-layout";
import { AdSenseScript } from "@/components/adsense-script";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isMinimalChrome =
    pathname.startsWith("/l/") || pathname.startsWith("/admin");

  if (isMinimalChrome) {
    return <>{children}</>;
  }

  return (
    <>
      <AdSenseScript />
      <SiteNav />
      <main className="w-full">
        <AppContentLayout>{children}</AppContentLayout>
      </main>
      <SiteFooter />
    </>
  );
}
