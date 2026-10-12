"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

/** An email address as a mailto link with a small copy button beside it. */
export function CopyEmail({ email, color = "#888" }: { email: string; color?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard blocked: the address is still selectable.
    }
  }

  return (
    <span className="inline-flex items-center gap-2">
      <a href={`mailto:${email}`} className="text-sm transition-colors hover:text-white" style={{ color }}>
        {email}
      </a>
      <button
        type="button"
        onClick={copy}
        className="p-1 rounded transition-colors hover:text-white"
        style={{ color }}
        aria-label={copied ? "Email address copied" : "Copy email address"}
      >
        {copied ? <Check className="w-3.5 h-3.5" aria-hidden="true" /> : <Copy className="w-3.5 h-3.5" aria-hidden="true" />}
      </button>
    </span>
  );
}
