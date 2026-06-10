"use client";

import { useState } from "react";
import { Button } from "@/components/ui";

export function CopyBlock({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={`border p-4 ${
        highlight
          ? "border-[var(--border)] bg-[#fafafa]"
          : "border-[var(--border-light)] bg-white"
      }`}
    >
      <div className="text-[11px] font-semibold uppercase tracking-wider text-[var(--text-muted)]">
        {label}
      </div>
      <div className="mt-2 break-all font-mono text-sm">{value}</div>
      <Button
        type="button"
        variant="secondary"
        className="mt-3"
        onClick={copy}
      >
        {copied ? "Copied" : "Copy"}
      </Button>
    </div>
  );
}
