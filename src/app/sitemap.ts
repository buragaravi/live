import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/seo";

const PUBLIC_ROUTES: {
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[0]["changeFrequency"];
}[] = [
  { path: "", priority: 1.0, changeFrequency: "weekly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.7, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.5, changeFrequency: "yearly" },
  { path: "/privacy", priority: 0.5, changeFrequency: "yearly" },
  { path: "/results", priority: 0.6, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return PUBLIC_ROUTES.map(({ path, priority, changeFrequency }) => ({
    url: absoluteUrl(path === "" ? "/" : path),
    lastModified,
    changeFrequency,
    priority,
  }));
}
