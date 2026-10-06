"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** A URL in a monospace box with a copy button. */
export function CopyUrl({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the URL is still selectable.
    }
  }

  return (
    <div
      className="flex items-center gap-2 rounded-xl px-4 py-3 max-w-full"
      style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border-strong)" }}
    >
      <code className="text-sm sm:text-base font-mono truncate select-all" style={{ color: "var(--color-text-primary)" }}>
        {url}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? "Copied" : "Copy URL"}
        className="ml-auto flex-shrink-0 inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium"
        style={{ background: "var(--color-accent)", color: "#fff" }}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}
