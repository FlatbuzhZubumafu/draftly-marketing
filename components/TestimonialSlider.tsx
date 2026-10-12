"use client";

import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { WPTestimonial } from "@/lib/graphql";
import { AccentText } from "./AccentText";

export function TestimonialSlider({ testimonials }: { testimonials: WPTestimonial[] }) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  );

  useEffect(() => {
    if (emblaApi) emblaApi.reInit();
  }, [emblaApi]);

  if (!testimonials || testimonials.length === 0) return null;

  return (
    <section id="testimonials" className="py-24 px-4" style={{ background: "var(--color-bg-surface)" }}>
      <div className="container-draftly max-w-5xl">
        <div className="reveal text-center mb-14">
          <h2 className="text-3xl font-medium" style={{ letterSpacing: "-0.03em" }}>
            Early users are already seeing{" "}
            <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
              the value
            </AccentText>
          </h2>
        </div>
        <div className="relative">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t, i) => (
                <div key={i} className="flex-[0_0_100%] min-w-0 sm:flex-[0_0_50%] lg:flex-[0_0_40%] pl-4">
                  <TestimonialCard t={t} />
                </div>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => emblaApi?.scrollPrev()}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow-sm"
              style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", background: "var(--color-bg-primary)" }}
              aria-label="Previous"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => emblaApi?.scrollNext()}
              className="w-10 h-10 rounded-full flex items-center justify-center transition-all hover:shadow-sm"
              style={{ border: "1px solid var(--color-border)", color: "var(--color-text-secondary)", background: "var(--color-bg-primary)" }}
              aria-label="Next"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * One quote. Photo, full name, company and outcome show when WordPress has them
 * (see WPTestimonial); without them the card is name, role and quote as before.
 */
function TestimonialCard({ t }: { t: WPTestimonial }) {
  const name = t.fullName?.trim() || t.personName;
  const role = [t.subtitle, t.company?.trim()].filter(Boolean).join(", ");
  return (
    <figure
      className="relative rounded-xl p-8 flex flex-col justify-between min-h-[280px] card-depth"
      style={{ background: "var(--color-bg-primary)" }}
    >
      <span
        className="absolute top-4 left-6 text-5xl leading-none pointer-events-none"
        style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)", opacity: 0.15 }}
        aria-hidden="true"
      >
        &ldquo;
      </span>
      <div className="relative mb-6">
        {t.outcome?.trim() && (
          <p className="font-semibold mb-3" style={{ color: "var(--color-accent)" }}>
            {t.outcome}
          </p>
        )}
        <blockquote className="leading-relaxed text-base" style={{ color: "var(--color-text-primary)" }}>
          {t.quote}
        </blockquote>
      </div>
      <figcaption className="flex items-center gap-3">
        {t.photoUrl?.trim() && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={t.photoUrl} alt="" width={48} height={48} loading="lazy" className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
        )}
        <span>
          <span className="block font-semibold">{name}</span>
          <span className="block text-sm" style={{ color: "var(--color-text-secondary)" }}>{role}</span>
        </span>
      </figcaption>
    </figure>
  );
}
