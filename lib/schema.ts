import { PLANS } from "@/lib/pricing";
import { APP_URL, LOGO_URL, SITE_URL } from "@/lib/site";
import { ALL_PRODUCT_SHOTS, imageObjectJsonLd } from "@/lib/product-shots";

// Structured data shared across pages. Organization and WebSite render once in
// the root layout; SoftwareApplication renders on the homepage and /pricing.

const ORG_ID = `${SITE_URL}/#organization`;
const SITE_ID = `${SITE_URL}/#website`;
const PERSON_ID = `${SITE_URL}/#preston-vawdrey`;

/** Preston's About page: the author page every byline and author schema points to. */
export const AUTHOR_URL = `${SITE_URL}/about`;
export const AUTHOR_HEADSHOT = "/images/team/preston-headshot.jpg";

/** Draftly's legal entity and the only mailing address to publish. */
export const COMPANY = {
  legalName: "Meta-Marketing LLC",
  email: "preston@draftly.blog",
  // Text line from the footer; reuse the same number and link everywhere.
  textNumber: "385-722-4497",
  textHref: "sms:+13857224497?&body=Hi%2C%20I%20am%20interested%20in%20learning%20more%20about%20Draftly.",
  street: "826 Expressway Ln Unit #665",
  city: "Spanish Fork",
  region: "UT",
  postalCode: "84660",
  country: "US",
};

export const organizationJsonLd = {
  "@type": "Organization",
  "@id": ORG_ID,
  name: "Draftly",
  legalName: COMPANY.legalName,
  url: SITE_URL,
  logo: LOGO_URL,
  email: COMPANY.email,
  founder: { "@id": PERSON_ID },
  address: {
    "@type": "PostalAddress",
    streetAddress: COMPANY.street,
    addressLocality: COMPANY.city,
    addressRegion: COMPANY.region,
    postalCode: COMPANY.postalCode,
    addressCountry: COMPANY.country,
  },
  contactPoint: { "@type": "ContactPoint", contactType: "customer support", email: COMPANY.email, url: `${SITE_URL}/contact`, areaServed: "US" },
  areaServed: "US",
  // Only verified Draftly profiles. Add LinkedIn, X and directory listings here once they exist.
  sameAs: [APP_URL],
};

/**
 * Preston Vawdrey, founder and author. One node, rendered site-wide by the root
 * layout; articles reference it by @id. sameAs lists his own site and the profiles
 * it links to (checked 2026-10-13).
 */
export const personJsonLd = {
  "@type": "Person",
  "@id": PERSON_ID,
  name: "Preston Vawdrey",
  url: AUTHOR_URL,
  image: `${SITE_URL}${AUTHOR_HEADSHOT}`,
  jobTitle: "Founder",
  worksFor: { "@id": ORG_ID },
  sameAs: ["https://prestonvawdrey.com", "https://www.linkedin.com/in/preston-vawdrey/", "https://www.youtube.com/@Preston-V8"],
};

/** Author reference for Article/BlogPosting nodes; resolves to personJsonLd in the layout graph. */
export const authorRef = { "@type": "Person", "@id": PERSON_ID, name: "Preston Vawdrey", url: AUTHOR_URL };

export { ORG_ID, PERSON_ID };

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
  screenshot: ALL_PRODUCT_SHOTS.map(imageObjectJsonLd),
  offers: PLANS.map((plan) => ({
    "@type": "Offer",
    name: plan.name,
    price: plan.price.toFixed(2),
    priceCurrency: "USD",
    description: `${plan.posts}. Team members: ${plan.seats ?? "unlimited"}. ${plan.pitch}`,
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
