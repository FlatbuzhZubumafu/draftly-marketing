"use client";

import { useState, useEffect } from "react";

export function HeaderInteractions() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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

  useEffect(() => {
    const menu = document.getElementById("mobile-menu");
    if (!menu) return;
    menu.style.display = mobileOpen ? "block" : "none";
  }, [mobileOpen]);

  useEffect(() => {
    const btn = document.getElementById("mobile-toggle");
    if (!btn) return;
    btn.addEventListener("click", () => setMobileOpen(prev => !prev));
    const links = document.querySelectorAll("#mobile-menu a");
    links.forEach(link => link.addEventListener("click", () => setMobileOpen(false)));
  }, []);

  return null;
}
