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

export default async function HomePage() {
  const data = await getHomepageData();

  return (
    <>
      <Header />
      <main>
        <HeroDemo settings={data.marketingSettings} />
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
          secondary={{ href: "/best-ai-for-writing", label: "See the AI Benchmark" }}
        />
        <NotForEveryone />
        <ScrollingBands />
        <HomePricing />
        <FAQ faqs={data.faqs.nodes} />
        <CtaBand
          heading={<>Your First Post <em className="italic" style={{ color: "var(--color-accent)" }}>Is on Us</em></>}
          body="Paste your URL, read the draft, then decide. Paid plans start at $29 a month when you want more."
          secondary={{ href: "/mcp", label: "Use Draftly in Claude or ChatGPT" }}
        />
      </main>
      <Footer />
    </>
  );
}
