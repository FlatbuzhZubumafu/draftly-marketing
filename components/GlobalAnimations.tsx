"use client";

import { useEffect } from "react";

export function GlobalAnimations() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -60px 0px" }
    );

    document.querySelectorAll(".reveal, .squiggle-path").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return null;
}
