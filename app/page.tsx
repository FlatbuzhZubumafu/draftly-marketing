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
        <HowItWorks />
        <Features />
        <Integrations />
        <NotForEveryone />
        <ScrollingBands />
        <FAQ faqs={data.faqs.nodes} />
      </main>
      <Footer />
    </>
  );
}
