import { Blocks, CalendarClock, Cpu, LineChart, ListChecks, Newspaper, PenLine, Plug, ScanSearch, Search, Send, SlidersHorizontal, Tags, Users, type LucideIcon } from "lucide-react";
import type { Feature } from "@/lib/features";

const ICONS: Record<Feature["icon"], LucideIcon> = { Blocks, CalendarClock, Cpu, LineChart, ListChecks, Newspaper, PenLine, Plug, ScanSearch, Search, Send, SlidersHorizontal, Tags, Users };

/** A feature's icon in the accent-tinted tile used by the homepage cards. */
export function FeatureIcon({ icon, size = "md" }: { icon: Feature["icon"]; size?: "md" | "lg" }) {
  const Icon = ICONS[icon];
  const box = size === "lg" ? "w-12 h-12" : "w-10 h-10";
  return (
    <span className={`${box} rounded-lg flex items-center justify-center flex-shrink-0`} style={{ background: "var(--color-accent-muted)" }} aria-hidden="true">
      <Icon className={size === "lg" ? "w-6 h-6" : "w-5 h-5"} style={{ color: "var(--color-accent)" }} />
    </span>
  );
}

/** A linked feature card: icon, name and one-line summary. Used on the hub, the homepage and related features. */
export function FeatureCard({ feature, href, className = "" }: { feature: Feature; href: string; className?: string }) {
  return (
    <a href={href} className={`group block h-full p-6 card-depth rounded-2xl ${className}`} style={{ background: "var(--color-bg-primary)", color: "var(--color-text-primary)" }}>
      <FeatureIcon icon={feature.icon} />
      <span className="block font-semibold mt-4 mb-2">{feature.name}</span>
      <span className="block text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
        {feature.summary}
      </span>
      <span className="block text-sm font-semibold mt-4 group-hover:underline" style={{ color: "var(--color-accent)" }}>
        How it works
      </span>
    </a>
  );
}
