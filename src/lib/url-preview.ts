export type UrlPreview = {
  url: string;
  hostname: string;
  title: string | null;
};

export async function fetchUrlPreview(url: string): Promise<UrlPreview> {
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return { url, hostname: url, title: null };
  }

  const hostname = parsed.hostname;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);

    const res = await fetch(url, {
      signal: controller.signal,
      headers: { "User-Agent": "LocateBot/1.0 (+preview)" },
      redirect: "follow",
    });
    clearTimeout(timeout);

    if (!res.ok) {
      return { url, hostname, title: null };
    }

    const html = await res.text();
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    const title = titleMatch?.[1]?.trim().slice(0, 200) ?? null;

    return { url, hostname, title };
  } catch {
    return { url, hostname, title: null };
  }
}
