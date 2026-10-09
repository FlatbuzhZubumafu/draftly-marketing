import type { Metadata } from "next";
import { APP_URL, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, Byline, DarkCta, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { PAID_PLANS, paidPriceList } from "@/lib/pricing";
import { DEFAULT_WRITER as D } from "@/lib/ruleCheck";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { PILLARS } from "@/lib/related";
import { RelatedLinks } from "@/components/RelatedLinks";
import { ProductFigure } from "@/components/ProductFigure";
import { GUIDE_SHOTS, imageObjectJsonLd } from "@/lib/product-shots";

export const revalidate = 3600;

// Targets "ai seo agency" (Ahrefs US: 3,800/mo, KD 10). A fair comparison: agencies
// get credit for what a tool cannot do. No agency prices are quoted, because we have
// no public source to cite on the page. Draftly prices come from lib/pricing.ts.
const PATH = "/ai-seo-agency-vs-tool";
const PUBLISHED = { iso: "2026-10-08", label: "October 8, 2026" };
const TITLE = "AI SEO Agency or AI SEO Tool: Which Should You Pay For?";
const DESCRIPTION =
  "An AI SEO agency brings strategy, links and technical fixes. An AI SEO tool writes steady on-brand posts for less. Here is how a small business can choose.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}`, images: [DEFAULT_OG_IMAGE] },
};

const DECISIONS = [
  { situation: "Pages are not getting indexed, the site is slow or redirects are broken", choice: "Agency", why: "These are fixes to your site's code and setup, which a writing tool does not touch." },
  { situation: "You need a steady blog in your voice on a small budget", choice: "Tool", why: "A tool produces posts each week for a flat monthly price." },
  { situation: "Your competitors win on backlinks", choice: "Agency", why: "Link building and digital PR take outreach by people." },
  { situation: "You know your topics and want posts out each week", choice: "Tool", why: "The work is writing and publishing, which a tool handles end to end." },
  { situation: "New site with no SEO plan yet", choice: "Both, in order", why: "Pay an agency for an audit and a plan, then use a tool to write the posts it calls for." },
  { situation: "Your agency is short on writing time", choice: "Both", why: "The agency keeps strategy and links, and a tool drafts posts its team reviews." },
  { situation: "You want one person to answer for traffic goals", choice: "Agency", why: "A tool reports numbers. An agency owns the plan and adjusts it." },
];

const FAQS: Faq[] = [
  {
    q: "What is an AI SEO agency?",
    a: "An AI SEO agency is an SEO agency that uses AI in its own work, for research, drafting or reporting. You still pay for people: strategists, technical specialists and outreach staff who plan the work and answer for it.",
  },
  {
    q: "Is an AI SEO tool enough for a small business?",
    a: "It can be when your site is technically sound and your main gap is regular content. If pages are not indexed or competitors win on links, a tool alone will not close that gap.",
  },
  {
    q: "Can I use Draftly alongside an SEO agency?",
    a: "Yes. The agency can own strategy, technical fixes and links while Draftly writes posts in your voice. Its connector also lets an agency's team use your brand voice inside Claude or ChatGPT.",
  },
  {
    q: "How much does an AI SEO tool cost?",
    a: `Prices vary by tool. Draftly's first post is free, and paid plans cost ${paidPriceList()} a month.`,
  },
];

export default async function AgencyVsToolPage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${APP_URL}/register`;

  const jsonLd = jsonLdHtml(
    {
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      datePublished: PUBLISHED.iso,
      dateModified: PUBLISHED.iso,
      author: authorRef,
      publisher: { "@type": "Organization", name: "Draftly", url: SITE_URL },
      image: [GUIDE_SHOTS.urlToPost, GUIDE_SHOTS.modelPicker].map(imageObjectJsonLd),
    },
    faqJsonLd(FAQS),
  );

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        <TocLayout>
          <header className="max-w-3xl">
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              AI SEO agency or AI SEO tool:{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                what should a small business pay for?
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
              Pay an AI SEO agency when you need strategy, technical fixes, link building and someone accountable for
              results. Pay for an AI SEO tool when your main need is steady, on-brand content at a lower monthly cost.
              You can start with one and add the other later, and the two work well together.
            </p>
            <Byline verb="Written" date={PUBLISHED.label} />
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Draftly makes an AI SEO tool, so weigh our view with that in mind.
            </p>
          </header>

          <Section id="agency" title="What an AI SEO agency does that a tool does not">
            <p>
              An AI SEO agency is an SEO agency that uses AI inside its own process. What you pay for is the people, and
              they cover four jobs software does not do well on its own.
            </p>
            <Bullets
              items={[
                <>
                  <B>Strategy.</B> An audit of your site and competitors, a decision on which pages to build first and a
                  plan tied to your sales goals.
                </>,
                <>
                  <B>Technical fixes.</B> Indexing problems, slow pages, broken redirects and structured data on your own
                  site. These need access to your code or CMS settings.
                </>,
                <>
                  <B>Link building.</B> Outreach and digital PR to earn links from other sites. That work runs on
                  relationships and follow-up.
                </>,
                <>
                  <B>Accountability.</B> A named person who reports on results, explains what changed and adjusts the
                  plan.
                </>,
              ]}
            />
          </Section>

          <Section id="tool" title="What an AI SEO tool like Draftly does">
            <p>
              An AI SEO tool does the repeatable part of the job, which for most small businesses is writing and
              publishing posts. Here is what Draftly covers.
            </p>
            <Bullets
              items={[
                <>
                  <B>Consistent, on-brand posts.</B> Draftly builds your brand voice from your website and writes each
                  post in it.
                </>,
                <>
                  <B>Rule checks on every post.</B> Each post is checked against your{" "}
                  <A href="/seo-copywriting">SEO copywriting rules</A> and gets one automatic
                  fix pass if it breaks any. In a {D.briefs}-brief test, {D.model} posts, Draftly&apos;s default, passed every hard
                  rule {D.rulePass}% of the time after that pass. Our <A href="/best-ai-for-writing">14-model writing test</A>{" "}
                  shows how other models handle the same rules.
                </>,
                <>
                  <B>Publishing.</B> One click to WordPress, Shopify, Ghost, Webflow, HubSpot or Squarespace.
                </>,
                <>
                  <B>A fixed monthly cost.</B> Your first post is free, and paid plans cost {paidPriceList()} a month.
                </>,
              ]}
            />
            <ProductFigure shot={GUIDE_SHOTS.urlToPost} className="mt-2" />
            <p>
              Draftly also shows your Google Analytics and Search Console reports on every plan, and paid plans add
              keyword data through its connector. It does not build links or change your site&apos;s code. The <A href="/ai-copywriter">Draftly AI
              copywriter page</A> covers how a post gets made.
            </p>
          </Section>

          <Section id="cost" title="How the costs compare">
            <p>
              Agencies usually bill a monthly retainer or a project fee, and the price reflects the people assigned to
              your account. Quotes vary widely by scope, so ask each agency for a written list of what is included each
              month and how results are reported.
            </p>
            <p>
              A tool costs a flat subscription. Draftly starts at ${PAID_PLANS[0].price} a month after one free post (see{" "}
              <A href="/pricing">every plan and what it includes</A>).
              The trade is that you, or someone on your team, still decides what to write about and reviews each post
              before it goes live.
            </p>
            <ProductFigure shot={GUIDE_SHOTS.modelPicker} className="mt-2" />
          </Section>

          <section id="decision" className="mt-20">
            <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              Which one fits your situation?
            </h2>
            <p className="mb-6 max-w-3xl leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Find the row closest to where your business is today.
            </p>
            {/* Stacked rows on phones, the full table from sm up. */}
            <div className="sm:hidden space-y-3">
              {DECISIONS.map((d) => (
                <div key={d.situation} className="p-4 rounded-xl" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                  <p className="text-sm font-medium">{d.situation}</p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                    {d.choice}
                  </p>
                  <p className="mt-1 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {d.why}
                  </p>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
              <table className="w-full text-sm min-w-[640px]">
                <thead style={{ background: "var(--color-bg-surface)" }}>
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold">Situation</th>
                    <th className="px-4 py-2 font-semibold">Better choice</th>
                    <th className="px-4 py-2 font-semibold">Why</th>
                  </tr>
                </thead>
                <tbody>
                  {DECISIONS.map((d) => (
                    <tr key={d.situation} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <td className="px-4 py-3 align-top">{d.situation}</td>
                      <td className="px-4 py-3 align-top font-semibold whitespace-nowrap">{d.choice}</td>
                      <td className="px-4 py-3 align-top" style={{ color: "var(--color-text-secondary)" }}>
                        {d.why}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <Section id="both" title="When to use both">
            <p>
              Use both when you need expert direction and a steady flow of posts. The agency sets the plan, fixes the
              technical problems and earns links. The tool writes the posts the plan calls for, in your voice, and the
              agency reviews them.
            </p>
            <p>
              Draftly&apos;s Growth plan is built for teams and agencies publishing most days of the week, and the{" "}
              <A href="/mcp">Draftly connector for Claude and ChatGPT</A>{" "}
              lets an agency&apos;s team plan posts with your
              brand voice and live keyword data in the AI app they already use.
            </p>
          </Section>

          <Section id="checklist" title="Questions to ask before you pay for either">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Is my site technically healthy, with pages indexed and loading quickly?</li>
              <li>Do I know which topics my customers search for?</li>
              <li>Who on my team will review posts before they go live?</li>
              <li>Do my competitors outrank me because of content or because of links?</li>
              <li>What will I measure after three months to decide whether it worked?</li>
            </ol>
          </Section>

          <div className="max-w-3xl">
            <RelatedLinks items={PILLARS.filter((p) => p.href !== "/ai-seo-agency-vs-tool").slice(0, 4)} />
          </div>
          <FaqList faqs={FAQS} />

          <DarkCta
            title="Try the tool side first, free"
            body="Paste your website URL and Draftly writes one post in your brand's voice at no cost. Read it, then decide what your business needs."
            href={registerUrl}
            label={s.heroCtaText}
          />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
