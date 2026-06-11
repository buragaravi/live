"use client";

import { AdSlot } from "@/components/ad-slot";
import { useAdsReady } from "@/hooks/use-ads-ready";
import { sidebarAdSlot, APP_GUTTER, APP_MAX_FULL, APP_MAX_WITH_ADS } from "@/lib/ad-slots";

type Props = {
  children: React.ReactNode;
};

function SidebarColumn({ side }: { side: "left" | "right" }) {
  const { sidebarActive } = useAdsReady();
  const slot = sidebarAdSlot(side);
  if (!sidebarActive || !slot) return null;

  return (
    <aside
      className="sticky top-[4.5rem] hidden w-[100px] shrink-0 sm:top-20 md:w-[110px] lg:block lg:w-[120px] xl:w-[140px]"
      aria-label={`${side} advertisement`}
    >
      <AdSlot
        slot={slot}
        format="sidebar"
        label={false}
        className="border-0 bg-transparent p-0"
      />
    </aside>
  );
}

export function AppContentLayout({ children }: Props) {
  const { adsActive, pageAllowsAds, sidebarActive } = useAdsReady();

  const hasLeftSlot = Boolean(sidebarAdSlot("left"));
  const hasRightSlot = Boolean(sidebarAdSlot("right"));
  const showSidebars =
    adsActive && pageAllowsAds && sidebarActive && (hasLeftSlot || hasRightSlot);

  /* No ads or no slots → full width content */
  if (!showSidebars) {
    return (
      <div
        className={`mx-auto w-full ${APP_MAX_FULL} ${APP_GUTTER} py-4 sm:py-6`}
      >
        {children}
        {adsActive && pageAllowsAds ? (
          <div className="mt-6">
            <AdSlot format="horizontal" />
          </div>
        ) : null}
      </div>
    );
  }

  /* Side ads active → content fills all space between sidebars */
  return (
    <div
      className={`mx-auto w-full ${APP_MAX_WITH_ADS} ${APP_GUTTER} py-4 sm:py-6`}
    >
      <div className="flex w-full items-start gap-2 sm:gap-4 lg:gap-5 xl:gap-6">
        {hasLeftSlot ? <SidebarColumn side="left" /> : null}

        <div className="min-w-0 flex-1 basis-0 w-full">{children}</div>

        {hasRightSlot ? <SidebarColumn side="right" /> : null}
      </div>

      {/* Horizontal ad on smaller screens where sidebars are hidden */}
      <div className="mt-6 lg:hidden">
        <AdSlot format="horizontal" />
      </div>
    </div>
  );
}
