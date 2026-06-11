function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function isSafeUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function youtubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname.includes("youtu.be")) {
      return parsed.pathname.slice(1).split("/")[0] || null;
    }
    if (parsed.hostname.includes("youtube.com")) {
      if (parsed.pathname.startsWith("/embed/")) {
        return parsed.pathname.split("/")[2] || null;
      }
      return parsed.searchParams.get("v");
    }
    return null;
  } catch {
    return null;
  }
}

function inlineFormat(text: string): string {
  let out = escapeHtml(text);
  out = out.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  out = out.replace(/\*(.+?)\*/g, "<em>$1</em>");
  out = out.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_m, label, href) => {
      if (!isSafeUrl(href)) return escapeHtml(label);
      const isAmazon =
        href.includes("amazon.") || href.includes("amzn.to");
      const rel = isAmazon
        ? ' rel="noopener noreferrer sponsored"'
        : ' rel="noopener noreferrer"';
      const extra = isAmazon ? ' target="_blank"' : ' target="_blank"';
      return `<a href="${escapeHtml(href)}" class="underline"${rel}${extra}>${escapeHtml(label)}</a>`;
    }
  );
  return out;
}

function parseTableRow(line: string): string[] {
  const trimmed = line.trim();
  const inner = trimmed.replace(/^\|/, "").replace(/\|$/, "");
  return inner.split("|").map((cell) => cell.trim());
}

function isTableSeparator(line: string): boolean {
  const trimmed = line.trim();
  if (!trimmed.includes("-")) return false;
  return /^\|?[\s\-:|]+\|?$/.test(trimmed);
}

function tryRenderTable(lines: string[], start: number): { html: string; end: number } | null {
  const headerLine = lines[start]?.trim() ?? "";
  if (!headerLine.includes("|")) return null;

  let j = start + 1;
  while (j < lines.length && !lines[j].trim()) j++;

  const separatorLine = lines[j]?.trim() ?? "";
  if (!isTableSeparator(separatorLine)) return null;

  const headers = parseTableRow(headerLine);
  if (headers.length < 2) return null;

  j++;
  const rows: string[][] = [];

  while (j < lines.length) {
    while (j < lines.length && !lines[j].trim()) j++;
    if (j >= lines.length) break;

    const rowLine = lines[j].trim();
    if (!rowLine.includes("|") || isTableSeparator(rowLine)) break;

    rows.push(parseTableRow(rowLine));
    j++;
  }

  const thead = headers
    .map(
      (h) =>
        `<th class="border border-[var(--border-light)] bg-[#fafafa] px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">${inlineFormat(h)}</th>`
    )
    .join("");

  const tbody = rows
    .map((row) => {
      const cells = headers
        .map((_, idx) => {
          const cell = row[idx] ?? "";
          return `<td class="border border-[var(--border-light)] px-4 py-3 align-top text-sm leading-relaxed">${inlineFormat(cell)}</td>`;
        })
        .join("");
      return `<tr class="even:bg-[#fafafa]">${cells}</tr>`;
    })
    .join("");

  const html = `<div class="my-6 overflow-x-auto border border-[var(--border-light)]">
    <table class="w-full min-w-[480px] border-collapse text-left">
      <thead><tr>${thead}</tr></thead>
      <tbody>${tbody}</tbody>
    </table>
  </div>`;

  return { html, end: j };
}

function renderImage(line: string): string | null {
  const match = line.match(/^!\[([^\]]*)\]\(([^)]+)\)$/);
  if (!match) return null;
  const [, alt, src] = match;
  if (!isSafeUrl(src)) return null;
  return `<figure class="my-6 border border-[var(--border-light)] bg-[#fafafa]">
    <img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" class="w-full object-cover" loading="lazy" />
    ${alt ? `<figcaption class="px-3 py-2 text-xs text-[var(--text-muted)]">${escapeHtml(alt)}</figcaption>` : ""}
  </figure>`;
}

function renderYoutube(line: string): string | null {
  const match = line.match(/^@youtube\s+(\S+)$/i);
  if (!match) return null;
  const id = youtubeId(match[1]);
  if (!id) return null;
  return `<div class="my-6 aspect-video border border-[var(--border-light)] bg-black">
    <iframe
      src="https://www.youtube.com/embed/${escapeHtml(id)}"
      title="YouTube video"
      class="h-full w-full"
      loading="lazy"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>`;
}

function renderInstagram(line: string): string | null {
  const match = line.match(/^@instagram\s+(\S+)$/i);
  if (!match || !isSafeUrl(match[1])) return null;
  const url = match[1];
  return `<div class="my-6 border border-[var(--border-light)] bg-[#fafafa] p-4">
    <p class="text-[11px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">Instagram</p>
    <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer" class="mt-2 inline-block text-sm font-medium underline break-all">${escapeHtml(url)}</a>
    <p class="mt-2 text-xs text-[var(--text-muted)]">Opens on Instagram</p>
  </div>`;
}

type ProductBlock = {
  title?: string;
  url?: string;
  image?: string;
  note?: string;
};

function renderProductCard(block: ProductBlock): string {
  const title = block.title ?? "Recommended product";
  const url = block.url ?? "";
  const image = block.image ?? "";
  const note = block.note ?? "";

  if (!url || !isSafeUrl(url)) return "";

  const isAmazon = url.includes("amazon.") || url.includes("amzn.to");
  const cta = isAmazon ? "View on Amazon" : "View product";

  return `<div class="my-6 border border-[var(--border)] bg-white">
    <div class="flex flex-col sm:flex-row">
      ${image && isSafeUrl(image) ? `<div class="sm:w-40 shrink-0 border-b border-[var(--border-light)] sm:border-b-0 sm:border-r"><img src="${escapeHtml(image)}" alt="${escapeHtml(title)}" class="h-40 w-full object-cover sm:h-full" loading="lazy" /></div>` : ""}
      <div class="flex flex-1 flex-col p-4">
        <p class="text-[10px] font-semibold uppercase tracking-wide text-[var(--text-muted)]">${isAmazon ? "Amazon recommendation" : "Recommended"}</p>
        <h4 class="mt-1 font-semibold">${escapeHtml(title)}</h4>
        ${note ? `<p class="mt-2 text-sm text-[var(--text-muted)]">${escapeHtml(note)}</p>` : ""}
        <a href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer sponsored" class="mt-4 inline-flex w-fit border border-[var(--border)] bg-[var(--accent)] px-4 py-2 text-sm font-medium text-white hover:bg-[#2a2a2a]">${cta}</a>
      </div>
    </div>
  </div>`;
}

function parseProductBlock(lines: string[]): ProductBlock {
  const block: ProductBlock = {};
  for (const line of lines) {
    const [key, ...rest] = line.split(":");
    if (!key || rest.length === 0) continue;
    const value = rest.join(":").trim();
    const k = key.trim().toLowerCase();
    if (k === "title") block.title = value;
    if (k === "url") block.url = value;
    if (k === "image") block.image = value;
    if (k === "note" || k === "description") block.note = value;
  }
  return block;
}

export function renderMarkdown(content: string): string {
  const lines = content.split("\n");
  const html: string[] = [];
  let inList = false;
  let i = 0;

  while (i < lines.length) {
    const trimmed = lines[i].trim();

    if (trimmed.toLowerCase() === "@product") {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      const blockLines: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim().toLowerCase() !== "@end") {
        blockLines.push(lines[i]);
        i++;
      }
      html.push(renderProductCard(parseProductBlock(blockLines)));
      i++;
      continue;
    }

    if (!trimmed) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      i++;
      continue;
    }

    const image = renderImage(trimmed);
    if (image) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(image);
      i++;
      continue;
    }

    const youtube = renderYoutube(trimmed);
    if (youtube) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(youtube);
      i++;
      continue;
    }

    const instagram = renderInstagram(trimmed);
    if (instagram) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(instagram);
      i++;
      continue;
    }

    const table = tryRenderTable(lines, i);
    if (table) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(table.html);
      i = table.end;
      continue;
    }

    if (trimmed.startsWith("### ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h3 class="mt-6 mb-2 text-lg font-semibold">${inlineFormat(trimmed.slice(4))}</h3>`);
      i++;
      continue;
    }

    if (trimmed.startsWith("## ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h2 class="mt-8 mb-3 text-xl font-semibold">${inlineFormat(trimmed.slice(3))}</h2>`);
      i++;
      continue;
    }

    if (trimmed.startsWith("# ")) {
      if (inList) {
        html.push("</ul>");
        inList = false;
      }
      html.push(`<h1 class="mt-8 mb-3 text-2xl font-semibold">${inlineFormat(trimmed.slice(2))}</h1>`);
      i++;
      continue;
    }

    if (trimmed.startsWith("- ")) {
      if (!inList) {
        html.push('<ul class="my-3 list-disc space-y-1 pl-5">');
        inList = true;
      }
      html.push(`<li>${inlineFormat(trimmed.slice(2))}</li>`);
      i++;
      continue;
    }

    if (inList) {
      html.push("</ul>");
      inList = false;
    }

    html.push(`<p class="my-3 leading-relaxed">${inlineFormat(trimmed)}</p>`);
    i++;
  }

  if (inList) html.push("</ul>");

  return html.join("\n");
}
