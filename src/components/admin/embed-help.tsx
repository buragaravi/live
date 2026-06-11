import { Card } from "@/components/ui";

export function EmbedHelp() {
  return (
    <Card className="mb-6 p-4 text-sm text-[var(--text-muted)]">
      <p className="font-medium text-[var(--text)]">Embed images, videos & products</p>
      <ul className="mt-3 space-y-2 text-xs leading-relaxed">
        <li>
          <strong>Image:</strong>{" "}
          <code className="bg-[#f3f3f3] px-1">![description](https://image-url.jpg)</code>
        </li>
        <li>
          <strong>YouTube:</strong>{" "}
          <code className="bg-[#f3f3f3] px-1">@youtube https://youtube.com/watch?v=...</code>
        </li>
        <li>
          <strong>Instagram:</strong>{" "}
          <code className="bg-[#f3f3f3] px-1">@instagram https://instagram.com/p/...</code>
        </li>
        <li>
          <strong>Amazon / product card:</strong> use{" "}
          <code className="bg-[#f3f3f3] px-1">@product</code> block with Title, URL, Image, Note, then{" "}
          <code className="bg-[#f3f3f3] px-1">@end</code>
        </li>
        <li>
          <strong>Table:</strong> use pipe rows —{" "}
          <code className="bg-[#f3f3f3] px-1">| A | B |</code> then{" "}
          <code className="bg-[#f3f3f3] px-1">|---|---|</code> then data rows (no blank lines between rows)
        </li>
        <li>
          <strong>Amazon affiliate:</strong> add your tag to Amazon URLs:{" "}
          <code className="bg-[#f3f3f3] px-1">?tag=your-affiliate-id</code>
        </li>
      </ul>
    </Card>
  );
}
