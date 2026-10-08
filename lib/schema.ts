import { PLANS } from "@/lib/pricing";
import { APP_URL, LOGO_URL, SITE_URL } from "@/lib/site";

// Structured data shared across pages. Organization and WebSite render once in
// the root layout; SoftwareApplication renders on the homepage and /pricing.

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/#preston-vawdrey`;

export const organizationJsonLd = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Draftly",
  url: SITE_URL,
  logo: LOGO_URL,
  email: "preston@draftly.blog",
  founder: { "@id": PERSON_ID },
  // Only verified Draftly profiles. Add LinkedIn, X and directory listings here once they exist.
  sameAs: [APP_URL],
};

/** Preston Vawdrey, founder and author. sameAs lists the profiles his own site links to. */
export const personJsonLd = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Preston Vawdrey",
  url: "https://prestonvawdrey.com",
  jobTitle: "Founder",
  worksFor: { "@id": ORG_ID },
  sameAs: ["https://prestonvawdrey.com", "https://www.linkedin.com/in/preston-vawdrey/", "https://www.youtube.com/@Preston-V8"],
};

/** Author reference for Article/BlogPosting nodes; resolves to personJsonLd in the layout graph. */
export const authorRef = { "@type": "Person", "@id": PERSON_ID, name: "Preston Vawdrey", url: "https://prestonvawdrey.com" };

export const websiteJsonLd = {
  "@type": "WebSite",
  "@id": SITE_ID,
  name: "Draftly",
  url: SITE_URL,
  publisher: { "@id": ORG_ID },
};

export const softwareApplicationJsonLd = {
  "@type": "SoftwareApplication",
  name: "Draftly",
  url: SITE_URL,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  description:
    "AI blog writer for small businesses. Draftly learns your brand's voice from your website and writes SEO-ready blog posts that publish to your CMS.",
  publisher: { "@id": ORG_ID },
  offers: PLANS.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    price: plan.price.toFixed(2),
    priceCurrency: "USD",
    description: `${plan.posts}. ${plan.pitch}`,
    url: `${SITE_URL}/pricing`,
    ...(plan.price > 0
      ? { priceSpecification: { "@type": "UnitPriceSpecification", price: plan.price.toFixed(2), priceCurrency: "USD", unitText: "MONTH" } }
      : {}),
  })),
};

/** Serializes a JSON-LD graph for a <script> tag, escaping "<" so content cannot close the tag. */
export function jsonLdHtml(...nodes: object[]): string {
  const data = nodes.length === 1 ? { "@context": "https://schema.org", ...nodes[0] } : { "@context": "https://schema.org", "@graph": nodes };
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
