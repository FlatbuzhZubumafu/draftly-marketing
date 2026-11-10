import { getHomepageData } from "@/lib/graphql";
import { SiteUrlForm } from "@/components/SiteUrlForm";

type Props = {
  heading?: string;
  body?: string;
  className?: string;
};

/**
 * In-body call to action for posts, the blog index and the tools hub. Same next
 * step as CtaBand (the free first post), sized to sit inside a content column.
 */
export async function SignupCta({
  heading = "Want posts like this for your own site?",
  body = "Paste your URL and Draftly writes a blog post in your brand's voice, ready to publish to WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot.",
  className = "",
}: Props) {
  const { marketingSettings: s } = await getHomepageData();

  return (
    <aside
      data-toc-skip
      aria-label="Try Draftly"
      className={`rounded-2xl p-6 sm:p-8 ${className}`}
      style={{ background: "var(--color-accent-muted)", border: "1px solid var(--color-border-accent)" }}
    >
      <p className="text-2xl font-medium mb-3" style={{ letterSpacing: "-0.02em", color: "var(--color-text-primary)" }}>
        {heading}
      </p>
      <p className="leading-relaxed mb-6" style={{ color: "var(--color-text-secondary)" }}>
        {body}
      </p>
      <SiteUrlForm label={s.heroCtaText || "Generate Free Post"} />
      <p className="text-sm mt-3" style={{ color: "var(--color-text-muted)" }}>
        Free first post. No credit card.
      </p>
    </aside>
  );
}
