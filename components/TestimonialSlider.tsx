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
                  <div
                    className="relative rounded-xl p-8 flex flex-col justify-between min-h-[280px] card-depth"
                    style={{ background: "var(--color-bg-primary)" }}
                  >
                    <span
                      className="absolute top-4 left-6 text-5xl leading-none pointer-events-none"
                      style={{ fontFamily: "var(--font-display)", color: "var(--color-accent)", opacity: 0.15 }}
                    >
                      &ldquo;
                    </span>
                    <p className="relative leading-relaxed text-base mb-6" style={{ color: "var(--color-text-primary)" }}>
                      {t.quote}
                    </p>
                    <div>
                      <p className="font-semibold">{t.personName}</p>
                      <p className="text-sm" style={{ color: "var(--color-text-secondary)" }}>{t.subtitle}</p>
                    </div>
                  </div>
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
