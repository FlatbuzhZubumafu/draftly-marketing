import type { Metadata } from "next";
import { pageImages } from "@/lib/og";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, Section } from "@/components/ArticleParts";
import { BILLING_TERMS_HREF } from "@/lib/pricing";
import { COMPANY, ORG_ID, jsonLdHtml } from "@/lib/schema";

export const revalidate = 3600;

// No form: there is nothing on our side to submit it to. Email is the main channel.
const PATH = "/contact";
const URL = `${SITE_URL}${PATH}`;
const TITLE = "Contact Draftly";
const DESCRIPTION = "Email Preston at preston@draftly.blog for support, billing or privacy requests. Draftly's text line and mailing address are here too.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  ...pageImages(PATH, { title: TITLE, description: DESCRIPTION, type: "website", url: URL }),
};

export default function ContactPage() {
  const jsonLd = jsonLdHtml({
    "@type": "ContactPage",
    "@id": `${URL}#page`,
    url: URL,
    name: TITLE,
    description: DESCRIPTION,
    mainEntity: { "@id": ORG_ID },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  });

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <div className="container-draftly max-w-3xl">
          <header>
            <h1 className="page-heading mb-4" style={{ fontSize: "clamp(2.1rem, 5vw, 52px)" }}>
              Contact Draftly
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              I&apos;m Preston Vawdrey, the founder. Email reaches me directly.
            </p>
          </header>

          <Section id="email" title="Email">
            <p>
              <A href={`mailto:${COMPANY.email}`}>{COMPANY.email}</A>
            </p>
            <p>
              Use it for help with your account, billing questions and privacy requests, like deleting your account. The
              details are in the <A href="/privacy-policy">privacy policy</A>.
            </p>
          </Section>

          <Section id="text" title="Text">
            <p>
              <A href={COMPANY.textHref}>Text {COMPANY.textNumber}</A>
            </p>
          </Section>

          <Section id="mail" title="Mailing address">
            <address className="not-italic leading-relaxed">
              {COMPANY.legalName}
              <br />
              {COMPANY.street}
              <br />
              {COMPANY.city}, {COMPANY.region} {COMPANY.postalCode}
            </address>
            <p>
              Draftly is made by {COMPANY.legalName} and serves businesses in the United States only.
            </p>
          </Section>

          <Section id="more" title="Before you write">
            <p>
              Billing, cancellation and refund terms are in the <A href={BILLING_TERMS_HREF}>terms and conditions</A>.
              You can read who runs Draftly and why on the <A href="/about">about page</A>.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}
