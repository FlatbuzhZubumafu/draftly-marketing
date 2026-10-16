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
import { SourceLinks } from "@/components/SourceLinks";
import { CompareTable, type CompareRow } from "@/components/CompareTable";
import { GUIDE_SHOTS, imageObjectJsonLd } from "@/lib/product-shots";
import {
  ARTICLE_WORDS,
  AUTOPILOT,
  CHECKED,
  GROWTH,
  KOALA_FREE,
  KOALA_MULTIPLIERS,
  KOALA_PLANS,
  KOALA_PUBLISHING,
  SOLO,
  SOURCES,
  koalaArticles,
} from "@/lib/competitor-reviews";

export const revalidate = 3600;

// Targets "koala writer review" (Ahrefs US: 150/mo, KD 8) and "koala ai review" (80, KD 5),
// checked 2026-10-16. The SERP is first-person reviews, Reddit threads and Koala's own site,
// with "How much does Koala AI cost?" and "Is Koala AI free?" in People Also Ask.
// Koala facts live in lib/competitor-reviews.ts, read on koala.sh. Draftly facts come from lib/pricing.ts.
const PATH = "/koala-ai-review";
const PUBLISHED = { iso: CHECKED.iso, label: CHECKED.label };
const TITLE = "Koala AI Review 2026: Pricing, Features and Who It Fits";
const DESCRIPTION =
  "Koala AI (KoalaWriter) priced by the word, from $25 a month. What each plan includes, how far the words go on each model, and when Draftly fits better.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}` },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION },
};

const [STARTER, PRO, BOOST] = KOALA_PLANS;
const words = (n: number) => n.toLocaleString("en-US");
const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };
const src = (items: { label: string; href: string }[]) => <SourceLinks items={items} month={CHECKED.month} />;

const COMPARE: CompareRow[] = [
  { label: "Starting price", them: `$${STARTER.monthly} a month (Starter)`, draftly: `$${SOLO.price} a month (Solopreneur)` },
  {
    label: "What you buy",
    them: `${words(STARTER.words)} words a month, counted on GPT-6 Luna`,
    draftly: `${SOLO.posts}, counted in posts`,
  },
  { label: "Free option", them: KOALA_FREE, draftly: "Your first full post, no credit card" },
  { label: "Publishes to", them: KOALA_PUBLISHING, draftly: "WordPress, Shopify, Webflow, Ghost, Squarespace and HubSpot" },
  {
    label: "Brand voice",
    them: "Brand DNA from your Google Maps listing or website, 1 brand on Starter",
    draftly: "Built from your website on every plan",
  },
  {
    label: "Scheduled publishing",
    them: `Content Calendar Autopilot on Boost, $${BOOST.monthly} a month`,
    draftly: `Posting schedules on Autopilot, $${AUTOPILOT.price} a month, for WordPress and Shopify`,
  },
  { label: "Affiliate data", them: "Live Amazon data for affiliate articles", draftly: "None" },
  { label: "Team", them: "No seat count listed. Accounts can be shared inside your organization", draftly: `${SOLO.seats} team members on Solopreneur, ${GROWTH.seats} on Growth` },
  { label: "Languages", them: "Not listed on the pricing page", draftly: "English only, US businesses only" },
];

const FAQS: Faq[] = [
  {
    q: "How much does Koala AI cost?",
    a: `As listed on koala.sh in ${CHECKED.month}, Starter is $${STARTER.monthly} a month for ${words(STARTER.words)} words, Professional $${PRO.monthly} for ${words(PRO.words)} and Boost $${BOOST.monthly} for ${words(BOOST.words)}. Plans go up to $2,000 a month. Paying yearly saves 20%.`,
  },
  {
    q: "Is Koala AI free?",
    a: `Every new account gets ${KOALA_FREE}. After that it's a paid plan. Draftly's free option is one full blog post, also with no credit card.`,
  },
  {
    q: "Is Koala AI the same as KoalaWriter?",
    a: "KoalaWriter is Koala's article writer. Koala AI is the whole product, which also includes an SEO agent, KoalaChat, KoalaImages, KoalaLinks for internal links and an MCP server.",
  },
  {
    q: "How many articles do you get on Koala Starter?",
    a: `Koala counts words, so it depends on length and model. At ${words(ARTICLE_WORDS)} words an article, Starter's ${words(STARTER.words)} words cover about ${koalaArticles(STARTER.words, 1)} articles on GPT-6 Luna, ${koalaArticles(STARTER.words, 2)} on Claude Sonnet 5 and ${koalaArticles(STARTER.words, 3)} on Claude Opus 5.5. That's our math from Koala's stated multipliers.`,
  },
  {
    q: "Is Koala AI worth it?",
    a: "For bulk SEO and affiliate articles on WordPress, Shopify, Webflow or Ghost, the entry price is low and the feature list is long. If you want posts in your brand voice, counted per post and published to Squarespace or HubSpot too, Draftly fits better.",
  },
  {
    q: "What's the difference between Koala and Draftly?",
    a: `Koala sells words and adds research, affiliate and linking tools as you move up plans. Draftly sells posts: $${SOLO.price} a month covers ${SOLO.posts.toLowerCase()}, written in your brand voice and checked for AI-sounding writing before you see them.`,
  },
];

export default function KoalaReviewPage() {
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
      about: { "@type": "SoftwareApplication", name: "Koala AI", url: "https://koala.sh/", applicationCategory: "BusinessApplication" },
      citation: [SOURCES.koalaPricing.href, SOURCES.koalaHome.href],
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
              Koala AI review:{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                pricing, features and who it fits
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={secondary}>
              Koala AI, best known for KoalaWriter, is an SEO article writer priced by the word. Starter is $
              {STARTER.monthly} a month for {words(STARTER.words)} words. It&apos;s built for volume: bulk writing, live
              Amazon data for affiliate posts and publishing to WordPress, Shopify, Webflow and Ghost.
            </p>
            <Byline verb="Written" date={PUBLISHED.label} />
            <p className="mt-2 text-sm" style={muted}>
              I built Draftly, which competes with Koala, so weigh my take accordingly. Every Koala fact below comes from
              koala.sh, checked {CHECKED.label}, and links to the page it came from. I haven&apos;t tested a paid Koala
              account for this review.
            </p>
          </header>

          <Section id="what-koala-does" title="What Koala does">
            <p>
              Koala is several tools sold as one plan. KoalaWriter drafts the articles. The rest support them.
              {src([SOURCES.koalaHome])}
            </p>
            <Bullets
              items={[
                <>
                  <B>KoalaWriter</B> writes articles with real-time SERP analysis, a Deep Research mode and your Brand DNA.
                </>,
                <>
                  <B>Brand DNA</B> pulls your business details from Google Maps or your website and drafts a knowledge base
                  of your services and voice.
                </>,
                <>
                  <B>The SEO agent</B> reads your Search Console data, suggests what to publish and hands topics to
                  KoalaWriter. Full agent access starts on Boost.
                </>,
                <>
                  <B>KoalaLinks</B> adds internal links across your site. <B>KoalaImages</B> makes AI images.{" "}
                  <B>KoalaChat</B> is a chat assistant with web data.
                </>,
                <>
                  <B>An MCP server</B> on every paid plan connects AI assistants like Claude to Koala&apos;s SEO tools.
                </>,
              ]}
            />
          </Section>

          <Section id="pricing" title="Koala AI pricing">
            <p>
              Every plan is a monthly word allowance. Paying yearly saves 20%, and yearly credits arrive up front and last
              the year.{src([SOURCES.koalaPricing])}
            </p>
            <Bullets
              items={KOALA_PLANS.map((p) => (
                <>
                  <B>{p.name}:</B> ${p.monthly} a month for {words(p.words)} words, {p.brands}{" "}
                  {p.brands === 1 ? "brand" : "brands"} in Brand DNA.
                </>
              ))}
            />
            <p>
              Plans continue up to Scale III at $2,000 a month for 10 million words. New accounts get {KOALA_FREE}.
            </p>
            <p>
              Features unlock by tier. Starter includes bulk writing, Amazon data, KoalaImages, the API and the MCP
              server. Professional adds the Search Console and Analytics dashboard, the article editor with an SEO score,
              KoalaLinks and Deep Research. Boost adds Content Calendar Autopilot and full SEO agent access.
            </p>
          </Section>

          <Section id="how-far-words-go" title="How far the words go">
            <p>
              Koala&apos;s word counts assume GPT-6 Luna. Better models cost more words for the same article.
              {src([SOURCES.koalaPricing])}
            </p>
            <Bullets
              items={KOALA_MULTIPLIERS.map((m) => (
                <>
                  <B>{m.model}:</B> {m.x}x. Starter covers about {koalaArticles(STARTER.words, m.x)} articles of{" "}
                  {words(ARTICLE_WORDS)} words a month.
                </>
              ))}
            />
            <p className="text-sm" style={muted}>
              Article counts are our math: Starter&apos;s {words(STARTER.words)} words, divided by the multiplier, divided
              by {words(ARTICLE_WORDS)} words an article. Koala doesn&apos;t state an article count.
            </p>
            <p>
              That&apos;s the main thing to plan around. If you want Claude to write, Starter covers about half as many
              articles as the headline number suggests.
            </p>
          </Section>

          <Section id="where-koala-is-strong" title="Where Koala is strong">
            <Bullets
              items={[
                <>
                  <B>Volume.</B> Bulk writing is on every plan, and Scale plans go to 10 million words a month.
                </>,
                <>
                  <B>Affiliate sites.</B> Live Amazon data in articles is unusual. If you run review or product-roundup
                  sites, this is the reason to pick Koala.
                </>,
                <>
                  <B>Many brands.</B> Growth covers 3 brands and Elite covers 7, which suits people running several sites.
                </>,
                <>
                  <B>Low entry price.</B> ${STARTER.monthly} a month, with 5,000 free words to try it first.
                </>,
              ]}
            />
          </Section>

          <Section id="what-to-weigh" title="What to weigh before you buy">
            <Bullets
              items={[
                <>
                  <B>Words, not posts.</B> Your real cost per article depends on length and model, so work it out before you
                  pick a plan.
                </>,
                <>
                  <B>Dashboards and linking start at $49.</B> The Search Console dashboard, KoalaLinks and Deep Research are on
                  Professional. Scheduled publishing and the full SEO agent are on Boost at ${BOOST.monthly}.
                </>,
                <>
                  <B>Publishing targets.</B> Koala lists WordPress, Shopify, Webflow and Ghost, plus webhooks for Zapier and
                  Make. Squarespace and HubSpot aren&apos;t listed.
                </>,
                <>
                  <B>Team access.</B> The pricing page doesn&apos;t list seats. It says you can share an account inside your
                  organization.
                </>,
              ]}
            />
          </Section>

          <section id="koala-vs-draftly" className="mt-16 scroll-mt-28">
            <h2 className="text-3xl font-medium mb-6 max-w-3xl" style={{ letterSpacing: "-0.03em" }}>
              Koala vs Draftly
            </h2>
            <CompareTable them="Koala" rows={COMPARE} />
            <p className="mt-3 max-w-3xl text-sm" style={muted}>
              Koala details from koala.sh as of {CHECKED.month}. Prices change, so check before you buy.
            </p>
          </section>

          <Section id="which-to-pick" title="Which one to pick">
            <p>
              <B>Pick Koala</B> if you publish a lot of articles, run affiliate sites or manage several brands, and you
              publish to WordPress, Shopify, Webflow or Ghost.
            </p>
            <p>
              <B>Pick Draftly</B> if you run one business blog and want posts that sound like you. Draftly reads your
              website, sets your brand voice from it and picks topics from your industry&apos;s news. Every post is checked
              against your <A href="/seo-copywriting">SEO copywriting rules</A> and for AI-sounding writing before you see
              it.
            </p>
            <p>
              Solopreneur is ${SOLO.price} a month for {SOLO.posts.toLowerCase()}, counted per post. Growth is $
              {GROWTH.price} with {GROWTH.seats} team members and no per-seat charge. Draftly writes in English only and
              serves US businesses only.
            </p>
            <ProductFigure shot={GUIDE_SHOTS.urlToPost} className="mt-2" />
            <p>
              Still comparing? <A href="/writesonic-alternatives">Writesonic alternatives</A> puts Koala next to
              SEOWriting.ai, Jasper and Copy.ai. The <A href="/arvow-review">Arvow review</A> covers a tool built around
              automated blogging and backlinks.
            </p>
          </Section>

          <div className="max-w-3xl mt-16">
            <SignupCta
              heading="See what Draftly writes for your site"
              body="Paste your URL and Draftly writes a full blog post in your brand's voice, ready for WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot. No credit card."
            />
          </div>

          <div className="max-w-3xl">
            <KeepReading exclude={PATH} guides={["/writesonic-alternatives", "/best-ai-for-seo"]} topic="koala ai review writer alternative compare pricing" />
          </div>
          <FaqList faqs={FAQS} />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
