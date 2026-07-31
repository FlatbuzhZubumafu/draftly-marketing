"use client";

import { useState, useEffect } from "react";

export function HeaderInteractions() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [heroInView, setHeroInView] = useState(true);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const header = document.getElementById("site-header");
    if (!header) return;
    if (scrolled) {
      header.style.background = "rgba(255, 255, 255, 0.92)";
      header.style.backdropFilter = "blur(12px)";
      (header.style as unknown as Record<string, string>).webkitBackdropFilter = "blur(12px)";
      header.style.borderBottom = "1px solid var(--color-border)";
    } else {
      header.style.background = "transparent";
      header.style.backdropFilter = "none";
      (header.style as unknown as Record<string, string>).webkitBackdropFilter = "none";
      header.style.borderBottom = "1px solid transparent";
    }
  }, [scrolled]);

  // The hero carries its own CTA, so the sticky bar stays out of the way while it is on screen.
  useEffect(() => {
    const hero = document.getElementById("hero");
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setHeroInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const bar = document.getElementById("mobile-cta-bar");
    if (!bar) return;
    // Pages without a hero (the blog) have no CTA of their own, so the bar rides along there.
    const hero = document.getElementById("hero");
    const show = !mobileOpen && !(hero && heroInView);
    bar.style.transform = show ? "translateY(0)" : "translateY(120%)";
    bar.style.opacity = show ? "1" : "0";
    bar.style.visibility = show ? "visible" : "hidden";
    bar.style.pointerEvents = show ? "auto" : "none";
  }, [heroInView, mobileOpen]);

  useEffect(() => {
    const menu = document.getElementById("mobile-menu");
    if (menu) menu.style.display = mobileOpen ? "block" : "none";
    const btn = document.getElementById("mobile-toggle");
    if (btn) btn.setAttribute("aria-expanded", String(mobileOpen));
  }, [mobileOpen]);

  useEffect(() => {
    const btn = document.getElementById("mobile-toggle");
    const toggle = () => setMobileOpen(prev => !prev);
    const close = () => setMobileOpen(false);
    const links = Array.from(document.querySelectorAll("#mobile-menu a"));
    btn?.addEventListener("click", toggle);
    links.forEach(link => link.addEventListener("click", close));
    return () => {
      btn?.removeEventListener("click", toggle);
      links.forEach(link => link.removeEventListener("click", close));
    };
  }, []);

  return null;
}
