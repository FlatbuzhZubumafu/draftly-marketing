"use client";

import { useEffect, useState } from "react";

type Entry = { id: string; text: string };

const slugify = (text: string) =>
  text.toLowerCase().replace(/&/g, " and ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 60);

/**
 * "On this page" list built from the H2s inside the nearest [data-toc-root].
 * Headings keep the id of their <section> when it has one, so existing #links stay
 * valid; otherwise they get one from their text. Put data-toc-skip on an H2 (or a
 * wrapper) to leave it out, e.g. closing CTA boxes.
 */
export function OnThisPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const root = document.querySelector("[data-toc-root]");
    if (!root) return;
    const used = new Set<string>();
    const headings = [...root.querySelectorAll<HTMLHeadingElement>("h2")].filter(
      (h) => !h.closest("[data-toc-skip]") && h.textContent?.trim(),
    );
    const found = headings.map((h) => {
      const section = h.closest("section[id]");
      let id = h.id || (section && section.querySelector("h2") === h ? section.id : "") || slugify(h.textContent!);
      while (used.has(id)) id += "-2";
      used.add(id);
      if (!h.id && !(section && section.id === id)) h.id = id;
      return { id, text: h.textContent!.trim(), el: (section?.id === id ? section : h) as HTMLElement };
    });
    setEntries(found.map(({ id, text }) => ({ id, text })));

    const observer = new IntersectionObserver(
      (items) => {
        const visible = items.filter((i) => i.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.getAttribute("data-toc-id"));
      },
      { rootMargin: "-96px 0px -65% 0px" },
    );
    found.forEach(({ id, el }) => {
      el.setAttribute("data-toc-id", id);
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  if (entries.length < 3) return null;

  return (
    <nav aria-label="On this page" className="hidden lg:block sticky top-28 self-start max-h-[calc(100vh-8rem)] overflow-y-auto">
      <p className="eyebrow mb-4">On this page</p>
      <ol className="space-y-2.5 text-sm leading-snug border-l" style={{ borderColor: "var(--color-border)" }}>
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className="block -ml-px pl-4 border-l-2 transition-colors"
              style={{
                borderColor: active === e.id ? "var(--color-accent)" : "transparent",
                color: active === e.id ? "var(--color-text-primary)" : "var(--color-text-muted)",
              }}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Article column plus a sticky "On this page" sidebar on large screens. */
export function TocLayout({ children, articleClassName = "max-w-4xl" }: { children: React.ReactNode; articleClassName?: string }) {
  return (
    <div className="container-draftly max-w-6xl lg:grid lg:grid-cols-[minmax(0,1fr)_14rem] lg:gap-14">
      <article data-toc-root className={`min-w-0 ${articleClassName}`}>
        {children}
      </article>
      <OnThisPage />
    </div>
  );
}
