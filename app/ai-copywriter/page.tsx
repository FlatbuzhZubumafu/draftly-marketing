import type { Metadata } from "next";
import { APP_URL, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, DarkCta, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { PAID_PLANS, PLANS } from "@/lib/pricing";
import { RULE_CHECK_TEST as T, SAMPLE_POST } from "@/lib/ruleCheck";
import { jsonLdHtml } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { PILLARS } from "@/lib/related";
import { RelatedLinks } from "@/components/RelatedLinks";

export const revalidate = 3600;

// Product page for "ai copywriter" (Ahrefs US: 350/mo, KD 0, traffic potential 3,000
// via "ai copywriting tools"), with "ai seo content writer" and "ai copywriting tool"
// as secondaries. SoftwareApplication schema lives on the homepage and /pricing, so
// this page adds FAQPage only. Prices come from lib/pricing.ts; the test figures
// from lib/ruleCheck.ts.
const PATH = "/ai-copywriter";
const TITLE = "AI Copywriter for Small Business Blogs | Draftly";
const DESCRIPTION =
  "Draftly is an AI copywriter for small business blogs. It learns your brand voice, checks each post against writing rules and posts it to your CMS. Try it free.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: `${SITE_URL}${PATH}`, images: [DEFAULT_OG_IMAGE] },
};

const FIRST_MONTH_OFFER = "50% off the first month";

const STEPS = [
  { title: "Paste your website URL", body: "Draftly reads your site to learn what you sell and who you sell to." },
  {
    title: "Draftly builds your brand voice",
    body: "Tone sliders, vocabulary, audience notes and writing samples, all taken from your own pages. You can adjust any of them.",
  },
  {
    title: "Pick a topic",
    body: "Draftly turns your industry's news and RSS feeds into topic ideas each day, or you bring your own.",
  },
  {
    title: "The post is written and checked",
    body: `${T.model} writes the post, then Draftly checks it against your writing rules. A post that breaks any rule gets one automatic fix pass.`,
  },
  {
    title: "Publish to your CMS",
    body: "Send it to WordPress, Shopify, Ghost, Webflow, HubSpot or Squarespace in one click. On Autopilot, it can publish to WordPress and Shopify on a schedule.",
  },
];

const FAQS: Faq[] = [
  {
    q: "What is an AI copywriter?",
    a: "An AI copywriter is software that drafts marketing copy, such as blog posts, from a brief or a website. Draftly is one built for small-business blogs: it writes in your brand voice, checks each post against writing rules and publishes it to your CMS.",
  },
  {
    q: "Which AI model does Draftly use?",
    a: `${T.model} is the default writer. Paid plans can choose from 8 AI models for each post, including Claude, GPT, Gemini and DeepSeek models.`,
  },
  {
    q: "Will the posts sound like AI wrote them?",
    a: "Draftly bans common filler words and phrasing, checks each post for them and fixes what it finds. Each post also gets a 0 to 100 human-voice score so you can see how it reads before you publish.",
  },
  {
    q: "Is there a free trial?",
    a: `The free plan includes one full blog post, with no credit card required. Paid plans start at $${PAID_PLANS[0].price} a month.`,
  },
];

export default async function AiCopywriterPage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${APP_URL}/register`;

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(faqJsonLd(FAQS)) }} />

        <TocLayout>
          <header className="max-w-3xl">
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              The AI copywriter{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                for small-business blogs
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: "var(--color-text-secondary)" }}>
              Draftly is an AI copywriter that writes blog posts for small businesses in their own brand voice, checks
              each one against a set of writing rules and publishes it to their CMS. Paste your website URL and your first
              post is free.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={registerUrl} className="btn btn-primary">
                {s.heroCtaText}
              </a>
              <a href="/pricing" className="btn btn-secondary">
                See pricing
              </a>
            </div>
          </header>

          <section id="how-it-works" className="mt-20">
            <h2 className="text-3xl font-medium mb-8" style={{ letterSpacing: "-0.03em" }}>
              How the AI copywriter works, from URL to published post
            </h2>
            <ol className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {STEPS.map((step, i) => (
                <li key={step.title} className="p-6 card-depth" style={{ background: "var(--color-bg-surface)" }}>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 font-semibold mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {step.body}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          <Section id="different" title="What makes the copy different">
            <p>
              <B>Each post is checked against rules, and fixed when it fails.</B> The check covers headings, keyword
              placement, meta title and description length, filler words and contrast phrasing. In a {T.briefs}-brief
              test against Draftly&apos;s production rules, {T.model} posts passed every hard rule {T.passAfterFix}% of the
              time after the fix pass. The previous default, {T.previousModel}, passed {T.previousPassAfterFix}% of the
              time.
            </p>
            <p>
              <B>The voice comes from your site.</B> Draftly builds your brand voice from your own pages and learns from
              the feedback you give on each post.
            </p>
            <p>
              <B>No invented numbers.</B>{" "}
              Draftly&apos;s rules forbid made-up statistics, quotes and testimonials. If a
              figure is not in your site or your brief, it stays out of the post.
            </p>
            <p>
              The full list of rules, with before and after examples, is in our guide to{" "}
              <A href="/seo-copywriting">the SEO copywriting rules Draftly checks</A>.
            </p>
          </Section>

          <Section id="sample" title="A sample from our benchmark">
            <p>
              This is the opening of a post {T.model} wrote in Draftly&apos;s benchmark run on {T.date}, after its fix
              pass. The business is {SAMPLE_POST.business}.
            </p>
          </Section>
          <figure className="mt-6 max-w-3xl p-6 sm:p-8 rounded-xl card-depth" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }} data-lint-skip="">
            <blockquote className="space-y-4 leading-relaxed">
              <p className="text-xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
                {SAMPLE_POST.title}
              </p>
              <p style={{ color: "var(--color-text-secondary)" }}>{SAMPLE_POST.intro}</p>
              <p className="font-semibold">{SAMPLE_POST.h2}</p>
              <p style={{ color: "var(--color-text-secondary)" }}>{SAMPLE_POST.h2Body}</p>
            </blockquote>
            <figcaption className="mt-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Example from Draftly&apos;s benchmark, quoted as written.
            </figcaption>
          </figure>

          <section id="pricing" className="mt-20">
            <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              What the AI copywriting tool costs
            </h2>
            <p className="mb-8 max-w-3xl leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Start free with one post. Paid plans add volume, your choice of model and the connector for Claude, ChatGPT
              and Cursor. Your first subscription gets {FIRST_MONTH_OFFER}, on any plan.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {PLANS.map((p) => (
                <div key={p.name} className="p-6 rounded-xl card-depth" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                  <h3 className="font-semibold">{p.name}</h3>
                  <p className="mt-1 text-2xl font-semibold" style={{ letterSpacing: "-0.02em" }}>
                    {`$${p.price}/mo`}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {p.pitch}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Credits, models and data allowances for each plan are on the <A href="/pricing">full pricing page</A>.
            </p>
          </section>

          <Section id="who-its-for" title="Who it suits, and who should look elsewhere">
            <p>
              Draftly suits a small business that wants a steady blog in its own voice without hiring a writer. It does
              not build links, run ads or fix your site&apos;s code. If you need those, an agency is the better fit, and our
              comparison of <A href="/ai-seo-agency-vs-tool">an AI SEO agency and an AI SEO tool</A> walks through the
              choice.
            </p>
          </Section>

          <div className="max-w-3xl">
            <RelatedLinks items={PILLARS.filter((p) => p.href !== "/ai-copywriter").slice(0, 4)} />
          </div>
          <FaqList faqs={FAQS} />

          <DarkCta
            title="Read your first post before you pay"
            body="Paste your website URL. Draftly learns your voice, writes a post and checks it against its rules. The first one is free."
            href={registerUrl}
            label={s.heroCtaText}
            secondary={{ href: "/pricing", label: "See pricing" }}
          />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
