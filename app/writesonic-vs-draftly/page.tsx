import type { Metadata } from "next";
import { APP_URL, SITE_URL } from "@/lib/site";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, DarkCta, FaqList, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { ProductFigure } from "@/components/ProductFigure";
import { BarChart } from "@/components/BarChart";
import { PAID_PLANS } from "@/lib/pricing";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { KeepReading } from "@/components/KeepReading";
import { GUIDE_SHOTS, INTEGRATIONS_SHOT, STEP_SHOTS, imageObjectJsonLd, type ProductShot } from "@/lib/product-shots";
import {
  CHECKED,
  DRAFTLY_PER_POST,
  SOURCES as SRC,
  TABLE,
  VS_JASPER,
  WRITESONIC_MONTHLY_FROM,
  WRITESONIC_PER_ARTICLE,
  WRITESONIC_PLANS,
  draftlyPosts,
  type Cell,
} from "@/lib/writesonic-vs-draftly";
import { JASPER_SOURCES, type Source } from "@/lib/jasper-vs-draftly";
import { pageImages } from "@/lib/og";
import { AccentText } from "@/components/AccentText";
import { featurePathById } from "@/lib/features";

export const revalidate = 3600;

// Search demand (Ahrefs, US, 2026-10-23): writesonic pricing 600 (KD 0), writesonic ai 450 (KD 0),
// writesonic review 150 (KD 20), writesonic free trial 150 (KD 49), writesonic vs jasper 70 (KD 1),
// is writesonic worth it 50. "writesonic vs draftly" has no measured volume yet; the pricing and
// review terms carry the page. Writesonic facts live in lib/writesonic-alternatives.ts, read on
// writesonic.com on CHECKED; the table and per-post math are in lib/writesonic-vs-draftly.ts.
const PATH = "/writesonic-vs-draftly";
const PUBLISHED = { iso: "2026-10-23", label: "October 23, 2026" };
const TITLE = "Writesonic vs Draftly: Pricing, Cost per Post and Features";
const DESCRIPTION =
  "Writesonic vs Draftly compared on price, articles per plan, brand voices, team size and WordPress publishing, with Writesonic's plans from its own pricing page.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  ...pageImages(PATH, { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}` }),
};

const [SOLO, GROWTH, AUTOPILOT] = PAID_PLANS;
const [WS_STARTER, WS_BASIC, WS_GROWTH] = WRITESONIC_PLANS;
const [WS_STARTER_COST] = WRITESONIC_PER_ARTICLE;
const [SOLO_COST, GROWTH_COST] = DRAFTLY_PER_POST;
const soloPosts = draftlyPosts(SOLO.posts);
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const cents = (n: number) => `${Math.round(n * 100)} cents`;
const usd = (n: number) => `$${n.toLocaleString("en-US")}`;

const FAQS: Faq[] = [
  {
    q: "How much does Writesonic cost?",
    a: `As listed on writesonic.com in ${CHECKED.month}, Starter is $${WS_STARTER.yearlyMonthly} a month billed yearly (${usd(WS_STARTER.yearly)} a year), Basic is $${WS_BASIC.yearlyMonthly} and Growth is $${WS_GROWTH.yearlyMonthly}. Month to month, self-serve plans start at $${WRITESONIC_MONTHLY_FROM}.`,
  },
  {
    q: "Is Writesonic worth it?",
    a: `It is if you'll use the AI visibility tracking, site audits and ads monitoring that come with every plan. If you only want blog posts, Starter works out to about ${usd2(WS_STARTER_COST.perArticle)} an article, and Draftly's $${SOLO.price} plan comes to about ${cents(SOLO_COST.perPost)} a post.`,
  },
  {
    q: "Does Writesonic have a free trial?",
    a: "Yes. Writesonic's pricing page lists a free trial with no credit card. Draftly writes your first full blog post free, also with no credit card, and the Free plan has no time limit.",
  },
  {
    q: "Is Draftly a good Writesonic alternative?",
    a: "For small-business blog posts, yes. Draftly writes in your brand voice, checks every draft for AI-sounding writing and publishes to six CMSs. It doesn't track how ChatGPT or Gemini mention your brand, which is the main thing Writesonic sells now.",
  },
  {
    q: "Writesonic vs Jasper: which is cheaper?",
    a: `Jasper. For one person, Jasper Pro is $${VS_JASPER.jasper.monthly} a month, or $${VS_JASPER.jasper.yearly} billed yearly, and Writesonic Starter is $${VS_JASPER.writesonic.yearlyMonthly} a month billed yearly. Three people on Jasper Pro pay $${VS_JASPER.jasper.monthly * 3} a month; Writesonic Growth covers ${WS_GROWTH.users} users for $${WS_GROWTH.yearlyMonthly}, with AI search tracking included.`,
  },
  {
    q: "Does Draftly work outside the United States?",
    a: "Not yet. Draftly is available to US businesses only, and it writes blog posts only.",
  },
];

const SHOTS: Record<string, ProductShot> = {
  pricing: GUIDE_SHOTS.urlToPost,
  free: STEP_SHOTS[0],
  voice: GUIDE_SHOTS.brandVoice,
  wordpress: INTEGRATIONS_SHOT,
};

const card = { background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" };
const accentCard = { background: "var(--color-accent-muted)", border: "1px solid var(--color-border-accent)" };
const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };

function SourceLinks({ items }: { items: Source[] }) {
  return (
    <span className="text-sm" style={muted}>
      {" "}
      (
      {items.map((s, i) => (
        <span key={s.href}>
          {i > 0 ? ", " : ""}
          <a href={s.href} rel="nofollow noopener" target="_blank" className="underline">
            {s.label}
          </a>
        </span>
      ))}
      , as of {CHECKED.month}){" "}
    </span>
  );
}

function H2({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2 className={`text-3xl sm:text-4xl font-medium ${className}`} style={{ letterSpacing: "-0.03em" }}>
      {children}
    </h2>
  );
}

function Cta({ href, label, note }: { href: string; label: string; note: string }) {
  return (
    <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2">
      <a href={href} className="btn btn-primary">
        {label}
      </a>
      <span className="text-sm" style={muted}>
        {note}
      </span>
    </div>
  );
}

function CheckCell({ value, note, draftly }: { value: Cell; note?: string; draftly?: boolean }) {
  const icon =
    value === true ? (
      <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: draftly ? "var(--color-accent)" : "#111", color: "#fff" }}>
        <span aria-hidden="true">✓</span>
        <span className="sr-only">Yes</span>
      </span>
    ) : value === false ? (
      <span className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold" style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-muted)" }}>
        <span aria-hidden="true">✗</span>
        <span className="sr-only">No</span>
      </span>
    ) : null;
  return (
    <div className="flex items-center gap-2 text-sm">
      {icon}
      {typeof value === "string" ? <span className="font-medium">{value}</span> : null}
      {note ? <span style={muted}>{note}</span> : null}
    </div>
  );
}

function KeywordSection({ id, title, shot, children, cta }: { id: string; title: string; shot: ProductShot; children: React.ReactNode; cta?: React.ReactNode }) {
  return (
    <section id={id} className="mt-24 grid md:grid-cols-2 gap-8 md:gap-12 items-center">
      <div>
        <H2 className="mb-5">{title}</H2>
        <div className="space-y-4 leading-relaxed" style={secondary}>
          {children}
        </div>
        {cta}
      </div>
      <ProductFigure shot={shot} />
    </section>
  );
}

export default async function WritesonicVsDraftlyPage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${APP_URL}/register`;
  const ctaLabel = s.heroCtaText || "Generate Free Post";

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
      image: Object.values(SHOTS).map(imageObjectJsonLd),
    },
    faqJsonLd(FAQS),
  );

  return (
    <>
      <Header />
      <main className="pt-28 pb-24" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        <div className="container-draftly max-w-5xl">
          {/* Hero: who each is for, two price cards, one button. */}
          <header className="text-center max-w-3xl mx-auto">
            <p className="eyebrow mb-4">Writesonic alternative</p>
            <h1 className="page-heading mb-5" style={{ fontSize: "clamp(2.6rem, 7vw, 72px)" }}>
              Writesonic vs{" "}
              <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
                Draftly
              </AccentText>
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed" style={secondary}>
              Writesonic tracks how AI search talks about your brand. Draftly writes your blog and publishes it.
            </p>
            <p className="mt-4 text-sm" style={muted}>
              I built Draftly, so weigh my take accordingly. Writesonic&apos;s side comes from its own pricing page, checked {CHECKED.label}.
            </p>
          </header>

          <div className="mt-12 grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto items-stretch">
            <div className="rounded-2xl p-6 sm:p-8 flex flex-col" style={card}>
              <p className="text-xl font-semibold">Writesonic {WS_STARTER.name}</p>
              <p className="text-sm mt-1" style={muted}>
                For AI search visibility
              </p>
              <p className="mt-6">
                <span className="text-5xl font-medium tabular-nums">${WS_STARTER.yearlyMonthly}</span>
                <span className="text-sm ml-1" style={muted}>
                  a month, billed yearly
                </span>
              </p>
              <p className="text-sm mt-2" style={secondary}>
                {WS_STARTER.users} user, {WS_STARTER.articles} AI articles a month, {WS_STARTER.voices} brand voice
              </p>
              <p className="text-xs mt-auto pt-6" style={muted}>
                As listed on{" "}
                <a href={SRC.writesonicPricing.href} rel="nofollow noopener" target="_blank" className="underline">
                  writesonic.com
                </a>
                , {CHECKED.month}
              </p>
            </div>
            <div className="relative order-first sm:order-none rounded-2xl p-6 sm:p-8 flex flex-col" style={{ ...accentCard, borderWidth: 2, borderColor: "var(--color-accent)" }}>
              <span className="absolute -top-3 left-6 rounded-full px-3 py-1 text-xs font-semibold" style={{ background: "var(--color-accent)", color: "#fff" }}>
                Better for small-business blogs
              </span>
              <p className="text-xl font-semibold">Draftly {SOLO.name}</p>
              <p className="text-sm mt-1" style={muted}>
                For small-business blogs
              </p>
              <p className="mt-6">
                <span className="text-5xl font-medium tabular-nums">${SOLO.price}</span>
                <span className="text-sm ml-1" style={muted}>
                  a month
                </span>
              </p>
              <p className="text-sm mt-2" style={secondary}>
                {SOLO.seats} people, {SOLO.posts.toLowerCase()}. First post free.
              </p>
              <a href={registerUrl} className="btn btn-primary mt-6 self-start">
                {ctaLabel}
              </a>
            </div>
          </div>
          <p className="mt-4 text-center text-sm" style={muted}>
            Paste your URL. No credit card.
          </p>

          {/* Cost per post: the number most people come here for. */}
          <section id="cost-per-post" className="mt-28 max-w-3xl">
            <H2 className="mb-4">What a blog post costs on each</H2>
            <div className="space-y-4 text-lg leading-relaxed" style={secondary}>
              <p>
                Writesonic {WS_STARTER.name} is {usd(WS_STARTER.yearly)} a year for {WS_STARTER.articles * 12} AI articles. That&apos;s about{" "}
                <B>{usd2(WS_STARTER_COST.perArticle)} an article</B>. Draftly {SOLO.name} is ${SOLO.price} a month for about {soloPosts} posts, or about{" "}
                <B>{cents(SOLO_COST.perPost)} a post</B>, billed monthly. On {GROWTH.name} it drops to about {cents(GROWTH_COST.perPost)}.
              </p>
              <p>
                That math flatters Draftly. Writesonic&apos;s price also pays for brand tracking in ChatGPT, Gemini and Google AI Overviews, site audits and
                ads monitoring. If you&apos;d use those, count them.
              </p>
            </div>
            <BarChart
              title="Price per article or post, billed as listed"
              rows={[
                ...WRITESONIC_PER_ARTICLE.map((w) => ({ key: `ws-${w.name}`, label: `Writesonic ${w.name}`, value: w.perArticle })),
                ...DRAFTLY_PER_POST.map((d) => ({ key: `draftly-${d.name}`, label: `Draftly ${d.name}`, value: d.perPost })),
              ]}
              max={Math.max(...WRITESONIC_PER_ARTICLE.map((w) => w.perArticle))}
              format={(n) => `$${n.toFixed(2)}`}
              note={`Writesonic billed yearly, Draftly billed monthly. Draftly's post counts are its estimate on the default model. Writesonic prices checked ${CHECKED.label}.`}
            />
            <Cta href={registerUrl} label={ctaLabel} note="See a finished post for your business before you pay." />
          </section>

          {/* Checkmark table. */}
          <section id="comparison" className="mt-28">
            <H2 className="mb-3">Writesonic vs Draftly, feature by feature</H2>
            <p className="mb-8 max-w-3xl leading-relaxed" style={secondary}>
              Writesonic&apos;s column only lists what its own pages say.
              <SourceLinks items={[SRC.writesonicPricing, SRC.writesonicHome]} />
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
              <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-3 px-4 sm:px-6 py-3 text-sm font-semibold" style={{ background: "var(--color-bg-surface)" }}>
                <span className="sr-only sm:not-sr-only" style={muted}>
                  Feature
                </span>
                <span style={{ color: "var(--color-accent)" }}>Draftly</span>
                <span>Writesonic</span>
              </div>
              <dl>
                {TABLE.map((r) => (
                  <div key={r.label} className="grid sm:grid-cols-[1.3fr_1fr_1fr] gap-x-3 gap-y-2 px-4 sm:px-6 py-3.5" style={{ borderTop: "1px solid var(--color-border)" }}>
                    <dt className="text-sm font-medium">{r.feature ? <a href={featurePathById(r.feature)} className="underline underline-offset-2" style={{ color: "inherit" }}>{r.label}</a> : r.label}</dt>
                    <dd className="grid grid-cols-2 sm:contents gap-3">
                      <CheckCell value={r.draftly} note={r.draftlyNote} draftly />
                      <CheckCell value={r.writesonic} note={r.writesonicNote} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-3 text-sm" style={muted}>
              Draftly plans are on the <A href="/pricing">pricing page</A>.
            </p>
          </section>

          {/* Short keyword sections, one real screenshot each. */}
          <KeywordSection id="pricing" title="Writesonic pricing vs Draftly pricing" shot={SHOTS.pricing}>
            <p>
              Writesonic sells three self-serve plans, billed yearly: <B>{WS_STARTER.name} at ${WS_STARTER.yearlyMonthly} a month</B>, {WS_BASIC.name} at $
              {WS_BASIC.yearlyMonthly} and {WS_GROWTH.name} at ${WS_GROWTH.yearlyMonthly}. Month to month, plans start at ${WRITESONIC_MONTHLY_FROM}.
              <SourceLinks items={[SRC.writesonicPricing]} />
            </p>
            <p>
              Draftly bills monthly with no annual contract. {SOLO.name} is <B>${SOLO.price} a month for {SOLO.seats} people</B>, {GROWTH.name} is $
              {GROWTH.price} for {GROWTH.seats}, and {AUTOPILOT.name} is ${AUTOPILOT.price} with no limit on people. See <A href="/pricing">every Draftly plan</A>.
            </p>
          </KeywordSection>

          <KeywordSection
            id="free-trial"
            title="Writesonic free trial vs Draftly's free post"
            shot={SHOTS.free}
            cta={<Cta href={registerUrl} label={ctaLabel} note="No credit card." />}
          >
            <p>
              Writesonic lists a free trial with no credit card.
              <SourceLinks items={[SRC.writesonicPricing]} /> Draftly&apos;s Free plan has no time limit. Paste your website URL and it writes your first
              full blog post, thumbnail included.
            </p>
          </KeywordSection>

          <KeywordSection id="brand-voice" title="Brand voice: Writesonic vs Draftly" shot={SHOTS.voice}>
            <p>
              Writesonic counts brand voices by plan: {WS_STARTER.voices} on {WS_STARTER.name}, {WS_BASIC.voices} on {WS_BASIC.name}, {WS_GROWTH.voices} on{" "}
              {WS_GROWTH.name}.
              <SourceLinks items={[SRC.writesonicPricing]} /> Draftly builds your voice from your website on every plan, Free included, and shows it as
              sliders you can move. It also learns from the edits you make before you publish.
            </p>
          </KeywordSection>

          <KeywordSection
            id="wordpress"
            title="Publishing to WordPress and other CMSs"
            shot={SHOTS.wordpress}
            cta={<Cta href={registerUrl} label={ctaLabel} note="Connect your CMS after your first post." />}
          >
            <p>
              Both publish to WordPress. Draftly also publishes in one click to Shopify, Webflow, Ghost, HubSpot and Squarespace, and on {AUTOPILOT.name} ($
              {AUTOPILOT.price} a month) it writes and publishes to WordPress and Shopify on a schedule you set.
            </p>
          </KeywordSection>

          <section id="writesonic-vs-jasper" className="mt-28 max-w-3xl">
            <H2 className="mb-5">Writesonic vs Jasper</H2>
            <div className="space-y-4 leading-relaxed" style={secondary}>
              <p>
                For one person, Jasper Pro is ${VS_JASPER.jasper.monthly} a month, or ${VS_JASPER.jasper.yearly} billed yearly, with {VS_JASPER.jasper.voices}{" "}
                brand voices. Writesonic {WS_STARTER.name} is ${VS_JASPER.writesonic.yearlyMonthly} a month billed yearly with {VS_JASPER.writesonic.voices}.
                <SourceLinks items={[JASPER_SOURCES.pricing, SRC.writesonicPricing]} />
              </p>
              <p>
                Jasper is cheaper on price alone, and it stays cheaper for a small team: three people on Pro pay ${VS_JASPER.jasper.monthly * 3} a month.
                Writesonic needs {WS_GROWTH.name} for {WS_GROWTH.users} users, at ${WS_GROWTH.yearlyMonthly} a month billed yearly, though that adds{" "}
                {WS_GROWTH.articles} articles and the AI search tracking. Pick Jasper for ads, emails and social posts, and Writesonic for tracking where AI
                search mentions you. More in <A href="/jasper-vs-draftly">Jasper vs Draftly</A>.
              </p>
            </div>
          </section>

          <section id="when-writesonic-wins" className="mt-28 max-w-3xl">
            <H2 className="mb-6">When Writesonic is the better choice</H2>
            <div className="leading-relaxed" style={secondary}>
              <Bullets
                items={[
                  <>
                    <B>You want to know where AI search mentions you.</B> Writesonic shows which prompts in ChatGPT, Gemini and Google AI Overviews recommend
                    your competitors. Draftly&apos;s free <A href="/tools/ai-visibility-checker">AI visibility checker</A> only tells you whether AI crawlers can
                    read your site.
                  </>,
                  <>
                    <B>You want site audits in the same tool.</B> Every Writesonic plan includes them. Draftly doesn&apos;t audit your site.
                  </>,
                  <>
                    <B>You work outside the US.</B> Draftly serves US businesses only.
                  </>,
                ]}
              />
            </div>
          </section>

          <div className="max-w-3xl">
            <FaqList faqs={FAQS} />
            <div className="mt-16">
              <KeepReading exclude={PATH} guides={["/writesonic-alternatives", "/jasper-vs-draftly"]} topic="writesonic pricing review alternative blog posts" />
            </div>
          </div>

          <DarkCta
            title="Try it on your own site"
            body="Paste your website URL and Draftly writes one post in your brand's voice, linked to your own pages. No credit card."
            href={registerUrl}
            label={ctaLabel}
            secondary={{ href: "/pricing", label: "Compare plans" }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
