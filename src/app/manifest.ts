import type { MetadataRoute } from "next";
import { APP_NAME } from "@/lib/constants";
import { SITE_TAGLINE, getSiteUrl } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  const siteUrl = getSiteUrl();

  return {
    name: `${APP_NAME} — Consent-Based Location Sharing`,
    short_name: APP_NAME,
    description: SITE_TAGLINE,
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#f7f7f5",
    theme_color: "#111111",
    lang: "en",
    dir: "ltr",
    categories: ["utilities", "productivity"],
    id: siteUrl,
    icons: [
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/apple-icon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  };
}
