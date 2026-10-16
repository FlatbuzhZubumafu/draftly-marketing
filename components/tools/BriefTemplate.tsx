"use client";

import { useState } from "react";
import { BRIEF_TEMPLATE, BRIEF_TEMPLATE_FILENAME } from "@/lib/brief-template";

/** The blank SEO content brief template, with copy and download buttons. Works without the AI tool. */
export function BriefTemplate() {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(BRIEF_TEMPLATE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  }

  function download() {
    const url = URL.createObjectURL(new Blob([BRIEF_TEMPLATE], { type: "text/markdown;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = BRIEF_TEMPLATE_FILENAME;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="rounded-2xl p-5 sm:p-6" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
      <div className="flex flex-wrap gap-3 mb-4">
        <button type="button" onClick={copy} className="btn btn-primary text-sm">
          {copied ? "Copied" : "Copy the template"}
        </button>
        <button type="button" onClick={download} className="btn btn-secondary text-sm">
          Download as Markdown
        </button>
      </div>
      <pre className="text-sm leading-relaxed whitespace-pre-wrap overflow-x-auto max-h-[28rem] overflow-y-auto rounded-xl p-4" style={{ background: "var(--color-bg-primary)", border: "1px solid var(--color-border)" }}>
        {BRIEF_TEMPLATE}
      </pre>
    </div>
  );
}
