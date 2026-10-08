import type { Metadata } from "next";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HeroDemo } from "@/components/HeroDemo";
import { VideoSection } from "@/components/VideoSection";
import { PersonalStory } from "@/components/PersonalStory";
import { TestimonialSlider } from "@/components/TestimonialSlider";
import { HowItWorks } from "@/components/HowItWorks";
import { Features } from "@/components/Features";
import { Integrations } from "@/components/Integrations";
import { NotForEveryone } from "@/components/NotForEveryone";
import { ScrollingBands } from "@/components/ScrollingBands";
import { FAQ } from "@/components/FAQ";
import { HomePricing } from "@/components/HomePricing";
import { CtaBand } from "@/components/CtaBand";
import { PAID_PLANS } from "@/lib/pricing";
import { jsonLdHtml, softwareApplicationJsonLd } from "@/lib/schema";
import { HOME_DESCRIPTION, HOME_TITLE } from "@/lib/site";

export const metadata: Metadata = {
  title: { absolute: HOME_TITLE },
  description: HOME_DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: HOME_TITLE,
    description: HOME_DESCRIPTION,
    siteName: "Draftly",
    type: "website",
    url: "/",
  },
  twitter: { card: "summary_large_image", title: HOME_TITLE, description: HOME_DESCRIPTION },
};

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <>
      <Header />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(softwareApplicationJsonLd) }} />
        <HeroDemo settings={data.marketingSettings} startingPrice={PAID_PLANS[0].price} />
        <VideoSection />
        <PersonalStory />
        <TestimonialSlider testimonials={data.testimonials.nodes} />
        <CtaBand
          heading={<>See What Draftly Writes <em className="italic" style={{ color: "var(--color-accent)" }}>for Your Site</em></>}
          body="Paste your URL and get a finished, SEO-ready post in your brand's voice in about a minute."
          secondary={{ href: "/pricing", label: "See Pricing" }}
        />
        <HowItWorks />
        <Features />
        <Integrations />
        <CtaBand
          tone="accent"
          heading="Publish Your First Post Today"
          body="Draftly writes it, scores it and sends it to WordPress, Shopify, Ghost, Webflow, HubSpot or Squarespace."
          secondary={{ href: "/best-ai-for-writing", label: "See Which AI Model Writes Best" }}
        />
        <NotForEveryone />
        <ScrollingBands />
        <HomePricing />
        <FAQ faqs={data.faqs.nodes} />
        <CtaBand
          heading={<>Your First Post <em className="italic" style={{ color: "var(--color-accent)" }}>Is on Us</em></>}
          body={`Paste your URL, read the draft, then decide. Paid plans start at $${PAID_PLANS[0].price} a month when you want more.`}
          secondary={{ href: "/mcp", label: "SEO MCP for Claude and ChatGPT" }}
        />
      </main>
      <Footer />
    </>
  );
}
