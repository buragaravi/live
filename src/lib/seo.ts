import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";
import { CONTACT_EMAIL } from "@/lib/site";

export const SITE_TAGLINE =
  "Consent-based location sharing with clear disclosure for every request.";

export const DEFAULT_DESCRIPTION =
  "Create consent-based location request links. Recipients see who is asking and why before sharing GPS. No hidden tracking, no accounts required.";

export const DEFAULT_KEYWORDS = [
  "consent location sharing",
  "GPS consent link",
  "share location with permission",
  "location request tool",
  "privacy location sharing",
  "consent based tracking",
  "locate link",
  "GPS permission request",
];

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}

export function absoluteUrl(path = ""): string {
  const base = getSiteUrl().replace(/\/$/, "");
  if (!path || path === "/") return base;
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

function getOgImageUrl(): string {
  const custom = process.env.NEXT_PUBLIC_OG_IMAGE_URL;
  if (custom) return custom.startsWith("http") ? custom : absoluteUrl(custom);
  return absoluteUrl("/og-image.svg");
}

export function rootMetadata(): Metadata {
  const siteUrl = getSiteUrl();
  const ogImage = getOgImageUrl();
  const googleVerification =
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ?? "";

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${APP_NAME} — Consent-Based Location Sharing`,
      template: `%s | ${APP_NAME}`,
    },
    description: DEFAULT_DESCRIPTION,
    keywords: DEFAULT_KEYWORDS,
    applicationName: APP_NAME,
    authors: [{ name: APP_NAME, url: siteUrl }],
    creator: APP_NAME,
    publisher: APP_NAME,
    category: "technology",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    alternates: {
      canonical: siteUrl,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: siteUrl,
      siteName: APP_NAME,
      title: `${APP_NAME} — Consent-Based Location Sharing`,
      description: SITE_TAGLINE,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: `${APP_NAME} — consent-based location sharing`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${APP_NAME} — Consent-Based Location Sharing`,
      description: SITE_TAGLINE,
      images: [ogImage],
    },
    icons: {
      icon: [
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        { url: "/apple-icon.svg", type: "image/svg+xml" },
      ],
    },
    manifest: "/manifest.webmanifest",
    ...(googleVerification
      ? { verification: { google: googleVerification } }
      : {}),
    other: {
      contact: CONTACT_EMAIL,
    },
  };
}

type PageSeoOptions = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  noIndex?: boolean;
};

export function pageMetadata({
  title,
  description,
  path,
  keywords = [],
  noIndex = false,
}: PageSeoOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = getOgImageUrl();
  const allKeywords = [...new Set([...DEFAULT_KEYWORDS, ...keywords])];

  return {
    title,
    description,
    keywords: allKeywords,
    alternates: { canonical: url },
    robots: noIndex
      ? { index: false, follow: false, nocache: true }
      : { index: true, follow: true },
    openGraph: {
      title: `${title} | ${APP_NAME}`,
      description,
      url,
      type: "website",
      siteName: APP_NAME,
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${APP_NAME}`,
      description,
      images: [ogImage],
    },
  };
}
