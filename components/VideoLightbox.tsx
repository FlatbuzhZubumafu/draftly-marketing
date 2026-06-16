"use client";

import { useState, useEffect } from "react";
import { Play, X } from "lucide-react";

interface VideoLightboxProps {
  videoUrl: string;
}

export function VideoLightbox({ videoUrl }: VideoLightboxProps) {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onScroll = () => setIsOpen(false);
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);

    window.addEventListener("keydown", onEsc);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onEsc);
      window.removeEventListener("scroll", onScroll);
    };
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="group relative flex items-center gap-4 cursor-pointer"
        aria-label="Watch demo video"
      >
        <span
          className="flex items-center justify-center w-16 h-16 rounded-full transition-all group-hover:scale-110"
          style={{
            background: "var(--color-accent)",
            boxShadow: "var(--shadow-accent), 0 8px 24px rgba(255,107,61,0.3)",
          }}
        >
          <Play className="w-6 h-6 text-white ml-1" fill="white" />
        </span>
        <span className="text-[15px] font-semibold underline underline-offset-4" style={{ color: "var(--color-blue)" }}>
          Watch the demo
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-12"
          onClick={() => setIsOpen(false)}
          style={{ background: "rgba(0,0,0,0.97)", animation: "fadeIn 0.2s ease" }}
        >
          <button
            onClick={() => setIsOpen(false)}
            className="fixed top-6 right-6 z-[101] flex items-center justify-center w-12 h-12 rounded-full transition-all hover:scale-110"
            style={{ background: "rgba(255,255,255,0.1)", color: "#fff" }}
            aria-label="Close video"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <video
              className="w-full h-full"
              style={{ objectFit: "contain" }}
              autoPlay
              controls
              controlsList="nodownload"
            >
              <source src={videoUrl} type="video/mp4" />
            </video>
          </div>
        </div>
      )}
    </>
  );
}
