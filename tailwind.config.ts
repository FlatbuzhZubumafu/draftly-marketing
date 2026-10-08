import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // Blog and legal pages render WordPress HTML inside `prose`. Without this
      // plugin `prose` did nothing: no paragraph spacing, list bullets or heading
      // margins.
      typography: {
        DEFAULT: {
          css: {
            "--tw-prose-body": "#333333",
            "--tw-prose-headings": "var(--color-text-primary)",
            "--tw-prose-links": "var(--color-accent-hover)",
            "--tw-prose-bold": "var(--color-text-primary)",
            "--tw-prose-bullets": "var(--color-accent)",
            "--tw-prose-counters": "var(--color-text-secondary)",
            "--tw-prose-quotes": "var(--color-text-primary)",
            "--tw-prose-quote-borders": "var(--color-accent)",
            "--tw-prose-code": "var(--color-text-primary)",
            "--tw-prose-hr": "rgba(0, 0, 0, 0.08)",
            lineHeight: "1.75",
            "h2, h3, h4": { letterSpacing: "-0.01em", lineHeight: "1.25" },
            a: { textDecorationThickness: "1px", textUnderlineOffset: "3px" },
            "code::before": { content: "none" },
            "code::after": { content: "none" },
            code: { backgroundColor: "rgba(0, 0, 0, 0.05)", padding: "0.15em 0.35em", borderRadius: "4px", fontWeight: "500" },
            img: { borderRadius: "12px" },
            figcaption: { textAlign: "center" },
          },
        },
      },
      colors: {
        accent: "var(--color-accent)",
        "accent-hover": "var(--color-accent-hover)",
        "accent-muted": "var(--color-accent-muted)",
        blue: "var(--color-blue)",
        "blue-muted": "var(--color-blue-muted)",
        yellow: "var(--color-yellow)",
        "yellow-muted": "var(--color-yellow-muted)",
        purple: "var(--color-purple)",
        "purple-muted": "var(--color-purple-muted)",
        "bg-primary": "var(--color-bg-primary)",
        "bg-surface": "var(--color-bg-surface)",
        "bg-elevated": "var(--color-bg-elevated)",
        "bg-subtle": "var(--color-bg-subtle)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",
        "text-inverted": "var(--color-text-inverted)",
        "footer-bg": "var(--color-footer-bg)",
        "footer-text": "var(--color-footer-text)",
        "footer-muted": "var(--color-footer-muted)",
        "footer-border": "var(--color-footer-border)",
        border: {
          DEFAULT: "var(--color-border)",
          strong: "var(--color-border-strong)",
          accent: "var(--color-border-accent)",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)"],
      },
      fontSize: {
        body: ["17px", { lineHeight: "30px", letterSpacing: "-0.02em" }],
      },
      borderRadius: {
        xl: "var(--radius-xl)",
        "2xl": "var(--radius-2xl)",
      },
      boxShadow: {
        accent: "var(--shadow-accent)",
        glow: "var(--shadow-glow)",
        card: "var(--shadow-md)",
      },
      letterSpacing: {
        heading: "-0.03em",
        logo: "-0.04em",
        wide: "0.06em",
        widest: "0.12em",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "fade-up": "fade-up 0.6s ease forwards",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [typography],
};

export default config;
