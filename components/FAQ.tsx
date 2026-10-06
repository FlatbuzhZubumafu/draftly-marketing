"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { WPFaq } from "@/lib/graphql";
import { AccentText } from "./AccentText";

export function FAQ({ faqs }: { faqs: WPFaq[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <section id="faq" className="py-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
      <div className="container-draftly max-w-2xl">
        <div className="reveal text-center mb-12">
          <h2 className="text-3xl font-medium" style={{ letterSpacing: "-0.03em" }}>
            Common{" "}
            <AccentText squiggle="squiggle" color="var(--color-accent)" squiggleColor="#2f8ccc">
              questions
            </AccentText>
          </h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="reveal rounded-lg overflow-hidden transition-all hover:shadow-sm"
              style={{
                background: "var(--color-bg-surface)",
                border: "1px solid var(--color-border)",
                transitionDelay: `${i * 0.05}s`,
              }}
            >
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-sm">{faq.title}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-text-muted)" }} />
                ) : (
                  <ChevronDown className="w-4 h-4 flex-shrink-0" style={{ color: "var(--color-text-muted)" }} />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5">
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
