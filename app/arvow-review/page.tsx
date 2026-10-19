import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, Byline, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { KeepReading } from "@/components/KeepReading";
import { SignupCta } from "@/components/SignupCta";
import { ProductFigure } from "@/components/ProductFigure";
import { BarChart } from "@/components/BarChart";
import { ContentImage } from "@/components/ContentImage";
import { STOCK } from "@/lib/stock-images";
import { SourceLinks } from "@/components/SourceLinks";
import { CompareTable, type CompareRow } from "@/components/CompareTable";
import { GUIDE_SHOTS, imageObjectJsonLd } from "@/lib/product-shots";
import {
  ARVOW_CREDITS_PER_ARTICLE,
  ARVOW_PLANS,
  AUTOPILOT,
  CHECKED,
  GROWTH,
  SOLO,
  SOURCES,
  arvowArticles,
} from "@/lib/competitor-reviews";

export const revalidate = 3600;

// Targets "arvow review" (Ahrefs US: 60/mo), "arvow ai" (100) and the questions under "arvow"
// (450, KD 4, mostly navigational): "How much does Arvow cost?", "What is Arvow?" and
// "Is Arvow worth it?", checked 2026-10-16. No written reviews ranked in the top 10.
// Arvow facts live in lib/competitor-reviews.ts, read on arvow.com. Draftly facts come from lib/pricing.ts.
const PATH = "/arvow-review";
const PUBLISHED = { iso: CHECKED.iso, label: CHECKED.label };
const TITLE = "Arvow Review 2026: Pricing, Features and Who It Fits";
const DESCRIPTION =
  "Arvow, formerly Journalist AI, from $39 a month billed yearly. What each plan includes, what its backlink exchange means for Google, and when Draftly fits.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}` },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const [AR_SOLO, AR_BUSINESS] = ARVOW_PLANS;
const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };
const src = (items: { label: string; href: string }[]) => <SourceLinks items={items} month={CHECKED.month} />;
const GOOGLE_LINK_SPAM = { label: "Google spam policies", href: "https://developers.google.com/search/docs/essentials/spam-policies#link-spam" };

const COMPARE: CompareRow[] = [
  {
    label: "Starting price",
    them: `$${AR_SOLO.monthly} a month, or $${AR_SOLO.yearlyMonthly} a month billed yearly (Solo)`,
    draftly: `$${SOLO.price} a month (Solopreneur)`,
  },
  {
    label: "What you get",
    them: `${AR_SOLO.credits.toLocaleString("en-US")} credits a month, about ${arvowArticles(AR_SOLO.credits)} articles at ${ARVOW_CREDITS_PER_ARTICLE} credits each`,
    draftly: SOLO.posts,
  },
  { label: "Free option", them: "No free trial listed. Cancel anytime", draftly: "Your first full post, no credit card" },
  {
    label: "Publishes to",
    them: "9 platforms, including WordPress, Shopify, Webflow, Ghost, Squarespace, Framer and Blogger, plus Zapier and webhooks",
    draftly: "WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot",
  },
  {
    label: "Scheduled publishing",
    them: "AutoBlog on every plan",
    draftly: `Posting schedules on Autopilot, $${AUTOPILOT.price} a month, for WordPress and Shopify`,
  },
  { label: "Backlinks", them: "Backlink exchange from Business, plus paid DR40+ links", draftly: "None" },
  { label: "AI visibility tracking", them: "LLM brand visibility tracker from Business", draftly: "None. A free check of AI crawler access" },
  { label: "Languages", them: "150+", draftly: "English only, US businesses only" },
  { label: "Team", them: `1 sub-account on Business, unlimited on Ultimate`, draftly: `${SOLO.seats} team members on Solopreneur, ${GROWTH.seats} on Growth` },
];

const FAQS: Faq[] = [
  {
    q: "How much does Arvow cost?",
    a: `As listed on arvow.com in ${CHECKED.month}, Solo is $${AR_SOLO.monthly} a month, or $${AR_SOLO.yearlyMonthly} a month billed yearly. Business is $${AR_BUSINESS.monthly}, or $${AR_BUSINESS.yearlyMonthly} billed yearly, and Ultimate is $${ARVOW_PLANS[2].monthly}, or $${ARVOW_PLANS[2].yearlyMonthly}. The page marks the yearly prices as a limited-time sale.`,
  },
  {
    q: "What is Arvow?",
    a: "Arvow is an AI SEO platform that writes and publishes articles, runs an automated blog, trades backlinks between member sites and tracks brand mentions in AI search. It was called Journalist AI until its rebrand.",
  },
  {
    q: "Is Arvow the same as Journalist AI?",
    a: "Yes. Journalist AI renamed itself Arvow. Its rebrand post says logins, projects and articles stayed the same, and tryjournalist.com links redirect to arvow.com.",
  },
  {
    q: "Does Arvow have a free trial?",
    a: "Its pricing page doesn't list one. It says you can cancel anytime. Draftly writes your first full post free, with no credit card.",
  },
  {
    q: "Is Arvow's backlink exchange safe for SEO?",
    a: "Google's spam policies list excessive link exchanges and buying links for ranking as link spam. Arvow matches sites by niche and relevance, but read Google's policy and decide how much risk you'll take before you turn it on.",
  },
  {
    q: "Is Arvow worth it?",
    a: `If you want articles, backlinks, AI visibility tracking and 150+ languages in one tool, Business at $${AR_BUSINESS.yearlyMonthly} a month billed yearly covers a lot. If you want blog posts in your brand voice for a US business, Draftly costs $${SOLO.price} a month, billed monthly.`,
  },
];

export default function ArvowReviewPage() {
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
      image: [imageObjectJsonLd(GUIDE_SHOTS.urlToPost)],
      about: { "@type": "SoftwareApplication", name: "Arvow", url: "https://arvow.com/", applicationCategory: "BusinessApplication" },
      citation: [SOURCES.arvowPricing.href, SOURCES.arvowHome.href, SOURCES.arvowRebrand.href, GOOGLE_LINK_SPAM.href],
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
              Arvow review:{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                pricing, features and who it fits
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={secondary}>
              Arvow, formerly Journalist AI, writes and publishes SEO articles, runs an automated blog and trades backlinks
              between member sites. Solo is ${AR_SOLO.monthly} a month, or ${AR_SOLO.yearlyMonthly} a month billed yearly,
              for about {arvowArticles(AR_SOLO.credits)} articles.
            </p>
            <Byline verb="Written" date={PUBLISHED.label} />
            <p className="mt-2 text-sm" style={muted}>
              I built Draftly, which competes with Arvow, so weigh my take accordingly. Every Arvow fact below comes from
              arvow.com, checked {CHECKED.label}, and links to the page it came from. I haven&apos;t tested a paid Arvow
              account for this review.
            </p>
          </header>

          <Section id="what-arvow-does" title="What Arvow does">
            <p>
              Arvow&apos;s homepage reads &quot;Rank on Google and get cited by AI search.&quot; It started as Journalist
              AI, a tool for AI news articles, and renamed itself as it grew into a wider SEO platform.
              {src([SOURCES.arvowHome, SOURCES.arvowRebrand])}
            </p>
            <Bullets
              items={[
                <>
                  <B>Writing:</B> an AI article writer, an SEO editor, a news writer and a video-to-blog-post converter, in
                  150+ languages.
                </>,
                <>
                  <B>Automation:</B> AutoBlog posts on a schedule from keywords, RSS feeds, YouTube videos or news. An SEO
                  agent makes on-site changes, and it can reply to Google reviews and post to your Business Profile.
                </>,
                <>
                  <B>Growth:</B> a backlink exchange between member sites, an AI visibility tracker for ChatGPT, Gemini,
                  Perplexity, Claude, Grok and Google AI Overviews, and white-label SEO reports.
                </>,
                <>
                  <B>Publishing:</B> 9 platforms, including WordPress, Shopify, Webflow, Ghost, Squarespace, Framer and
                  Blogger, plus Zapier and webhooks.
                </>,
              ]}
            />
            <ContentImage
              image={STOCK.workingFromHome}
              caption="Arvow packs writing, automation, backlinks and AI visibility tracking into one subscription."
            />
          </Section>

          <Section id="pricing" title="Arvow pricing">
            <p>
              Arvow sells monthly credits. An article costs {ARVOW_CREDITS_PER_ARTICLE} credits, and AI visibility prompts
              cost 6 each. The yearly prices are marked as a limited-time sale.{src([SOURCES.arvowPricing])}
            </p>
            <Bullets
              items={ARVOW_PLANS.map((p) => (
                <>
                  <B>{p.name}:</B> ${p.monthly} a month, or ${p.yearlyMonthly} a month billed yearly.{" "}
                  {p.credits.toLocaleString("en-US")} credits (about {arvowArticles(p.credits)} articles), {p.websites.toLowerCase()}.
                </>
              ))}
            />
            <p className="text-sm" style={muted}>
              Article counts are our math: credits divided by {ARVOW_CREDITS_PER_ARTICLE}, assuming you spend them only on
              articles. Arvow doesn&apos;t state an article count.
            </p>
            <BarChart
              title="Articles a month on each Arvow plan (our math)"
              rows={ARVOW_PLANS.map((p) => ({ key: p.name, label: `${p.name}, $${p.yearlyMonthly}/mo yearly`, value: arvowArticles(p.credits) }))}
              max={arvowArticles(ARVOW_PLANS[ARVOW_PLANS.length - 1].credits)}
              note={`Monthly credits divided by ${ARVOW_CREDITS_PER_ARTICLE} credits an article, if you spend them only on articles. Checked ${CHECKED.label}.`}
            />
            <p>
              Solo includes AutoBlog, AI chat, the MCP server, the site optimizer, images and the API. Business adds the
              backlink exchange, AI visibility tracking, local SEO tools, custom images and 1 sub-account. Ultimate adds
              unlimited websites and sub-accounts, white-label reports and coaching.
            </p>
          </Section>

          <Section id="where-arvow-is-strong" title="Where Arvow is strong">
            <Bullets
              items={[
                <>
                  <B>Languages.</B> 150+ languages, with auto-translate on Business.
                </>,
                <>
                  <B>Hands-off blogging.</B> AutoBlog is on the cheapest plan, so a scheduled blog starts at $
                  {AR_SOLO.yearlyMonthly} a month billed yearly.
                </>,
                <>
                  <B>One tool for more of SEO.</B> Writing, links, local SEO, review replies and AI visibility tracking sit
                  in one account on Business.
                </>,
                <>
                  <B>Agencies.</B> Ultimate covers unlimited websites with white-label reports.
                </>,
              ]}
            />
          </Section>

          <Section id="what-to-weigh" title="What to weigh before you buy">
            <Bullets
              items={[
                <>
                  <B>The backlink exchange.</B> Google&apos;s spam policies name &quot;excessive link exchanges&quot; and
                  buying links for ranking as link spam. Arvow also sells DR40+ links on a separate page. Read the policy
                  before you turn either on.{src([GOOGLE_LINK_SPAM])}
                </>,
                <>
                  <B>Monthly vs yearly.</B> The headline prices are yearly sale prices. Billed monthly, Solo is $
                  {AR_SOLO.monthly} and Business is ${AR_BUSINESS.monthly}.
                </>,
                <>
                  <B>No trial.</B> The pricing page lists no free trial, only cancel anytime.
                </>,
                <>
                  <B>Credits are shared.</B> Visibility prompts and articles come out of the same credits, so tracking more
                  prompts means fewer articles.
                </>,
              ]}
            />
          </Section>

          <section id="arvow-vs-draftly" className="mt-16">
            <h2 className="text-3xl font-medium mb-6 max-w-3xl" style={{ letterSpacing: "-0.03em" }}>
              Arvow vs Draftly
            </h2>
            <CompareTable them="Arvow" rows={COMPARE} />
            <p className="mt-3 max-w-3xl text-sm" style={muted}>
              Arvow details from arvow.com as of {CHECKED.month}. Prices change, so check before you buy.
            </p>
          </section>

          <Section id="which-to-pick" title="Which one to pick">
            <p>
              <B>Pick Arvow</B> if you publish in languages other than English, want backlinks and AI visibility tracking
              in the same tool, or run many client sites.
            </p>
            <p>
              <B>Pick Draftly</B> if you&apos;re a US business that wants blog posts in its own voice, billed monthly. Solopreneur is ${SOLO.price} a month for {SOLO.posts.toLowerCase()}, and your first
              post is free. Draftly reads your website, sets your brand voice from it and checks every post for
              AI-sounding writing before you see it.
            </p>
            <p>
              Growth is ${GROWTH.price} a month with {GROWTH.seats} team members. Autopilot, at ${AUTOPILOT.price}, adds
              posting schedules that pick topics, write and publish to WordPress or Shopify on your cadence. Draftly doesn&apos;t build links or
              track AI mentions. Its free <A href="/tools/ai-visibility-checker">AI visibility checker</A> tells you
              whether AI crawlers can read your site.
            </p>
            <ProductFigure shot={GUIDE_SHOTS.urlToPost} className="mt-2" />
          </Section>

          <div className="max-w-3xl mt-16">
            <SignupCta
              heading="See what Draftly writes for your site"
              body="Paste your URL and Draftly writes a full blog post in your brand's voice, ready for WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot. No credit card."
            />
          </div>

          <div className="max-w-3xl">
            <KeepReading exclude={PATH} guides={["/koala-ai-review", "/best-ai-for-seo"]} topic="arvow review journalist ai autoblog alternative compare pricing" />
          </div>
          <FaqList faqs={FAQS} />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
