import type { Metadata } from "next";
import { APP_URL, SITE_URL } from "@/lib/site";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, DarkCta, FaqList, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { ProductFigure } from "@/components/ProductFigure";
import { PAID_PLANS } from "@/lib/pricing";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { KeepReading } from "@/components/KeepReading";
import { GUIDE_SHOTS, INTEGRATIONS_SHOT, STEP_SHOTS, imageObjectJsonLd, type ProductShot } from "@/lib/product-shots";
import {
  BAKEOFF,
  BAKEOFF_METHOD,
  BAKEOFF_TOTALS,
  CALLOUTS,
  CHECKED,
  JASPER_PRO,
  JASPER_SOURCES as SRC,
  TABLE,
  type Cell,
  type Excerpt,
  type Score,
  type Source,
} from "@/lib/jasper-vs-draftly";
import { pageImages } from "@/lib/og";

export const revalidate = 3600;

// Search demand (Ahrefs, US, 2026-10-12). The "jasper alternative" cluster: jasper alternatives 200,
// jasper alternative 150, jasper ai free alternative 150, jasper ai alternatives 100, alternative to
// jasper ai 90, jasper ai alternative 40 (KD 0 to 6). Pricing: jasper ai pricing 2026 700, jasper ai
// pricing 500, jasper pricing 300, jasper ai cost 100. Also is jasper ai worth it 150, jasper ai seo 150,
// jasper ai free trial 150, jasper vs 100, brand voice 4,100. The short keyword sections keep one H2 each.
// Jasper facts and the bake-off results live in lib/jasper-vs-draftly.ts.
const PATH = "/jasper-vs-draftly";
const TITLE = "Jasper vs Draftly: Jasper AI Alternative for SEO Blogs";
const DESCRIPTION =
  "Jasper vs Draftly, tested on the same topics for four real businesses. Scores, pricing, brand voice and WordPress publishing compared side by side.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  ...pageImages(PATH, { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}` }),
};

const [SOLO, GROWTH, AUTOPILOT] = PAID_PLANS;
const T = BAKEOFF_TOTALS;

const FAQS: Faq[] = [
  {
    q: "Is Draftly a good Jasper alternative?",
    a: "For small-business blog posts, yes. Draftly writes in your brand voice, checks each post for AI-sounding writing and publishes to your CMS. For ads, emails and social posts, Jasper covers more.",
  },
  {
    q: "How did you test Jasper against Draftly?",
    a: `On ${BAKEOFF_METHOD.date} both tools got the same topic for four real businesses. ${BAKEOFF_METHOD.jasper}. ${BAKEOFF_METHOD.draftly}. Every post was scored with Draftly's own checker.`,
  },
  {
    q: "Is there a free alternative to Jasper AI?",
    a: "Draftly writes your first full blog post free, with no credit card. Jasper offers a 7-day free trial of Pro.",
  },
  {
    q: "How much does Jasper AI cost?",
    a: `As listed on jasper.ai in ${CHECKED.month}, Jasper Pro is $${JASPER_PRO.monthly} per seat a month, or $${JASPER_PRO.yearly} billed yearly. Business has custom pricing with a 12-month minimum.`,
  },
  {
    q: "How much does Draftly cost?",
    a: `Your first post is free. Paid plans start at $${SOLO.price} a month, billed monthly with no annual contract. The price is per plan, not per seat: Solopreneur includes ${SOLO.seats} people, Growth ${GROWTH.seats} and Autopilot unlimited.`,
  },
  {
    q: "Does Jasper publish to WordPress?",
    a: "WordPress isn't on Jasper's integrations page. Draftly publishes to WordPress in one click, and its Autopilot plan publishes on a schedule.",
  },
  {
    q: "Does Draftly work outside the United States?",
    a: "Not yet. Draftly is available to US businesses only, and it writes blog posts only.",
  },
];

const SHOTS: Record<string, ProductShot> = {
  pricing: GUIDE_SHOTS.urlToPost,
  free: STEP_SHOTS[0],
  seo: GUIDE_SHOTS.seoMeta,
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
      ){" "}
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

function Cta({ href, label, note, center = false }: { href: string; label: string; note: string; center?: boolean }) {
  return (
    <div className={`mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 ${center ? "justify-center text-center" : ""}`}>
      <a href={href} className="btn btn-primary">
        {label}
      </a>
      <span className="text-sm" style={muted}>
        {note}
      </span>
    </div>
  );
}

/** Winner of one metric. Within one point counts as a tie. */
function winner(s: Score, lowerWins = false): "jasper" | "draftly" | "tie" {
  if (Math.abs(s.jasper - s.draftly) <= 1) return "tie";
  return (lowerWins ? s.draftly < s.jasper : s.draftly > s.jasper) ? "draftly" : "jasper";
}

function MetricRow({ label, score, lowerWins = false }: { label: string; score: Score; lowerWins?: boolean }) {
  const w = winner(score, lowerWins);
  const num = (who: "jasper" | "draftly") => (
    <span
      className="tabular-nums text-lg font-semibold text-right"
      style={{ color: w === who && who === "draftly" ? "var(--color-accent)" : w === who ? "var(--color-text-primary)" : "var(--color-text-muted)" }}
    >
      {score[who]}
    </span>
  );
  return (
    <div className="grid grid-cols-[1fr_3.5rem_3.5rem] items-center gap-2 py-2.5" style={{ borderTop: "1px solid var(--color-border)" }}>
      <div>
        <p className="text-sm font-medium flex items-center gap-2">
          {label}
          {w === "tie" ? (
            <span className="rounded-full px-2 py-0.5 text-[11px] font-semibold" style={{ background: "var(--color-bg-elevated)", color: "var(--color-text-secondary)" }}>
              Tie
            </span>
          ) : null}
        </p>
      </div>
      {num("jasper")}
      {num("draftly")}
    </div>
  );
}

function ColumnHeads() {
  return (
    <div className="grid grid-cols-[1fr_3.5rem_3.5rem] gap-2 text-xs font-semibold pb-1" aria-hidden="true">
      <span />
      <span className="text-right" style={secondary}>
        Jasper
      </span>
      <span className="text-right" style={{ color: "var(--color-accent)" }}>
        Draftly
      </span>
    </div>
  );
}

function BigStat({ label, hint, score, lowerWins = false, total = false }: { label: string; hint: string; score: Score; lowerWins?: boolean; total?: boolean }) {
  const w = winner(score, lowerWins);
  return (
    <div className="rounded-2xl p-5 sm:p-6" style={card}>
      <p className="font-semibold">{label}</p>
      <p className="text-xs mt-0.5" style={muted}>
        {hint}
      </p>
      <div className="mt-4 flex items-end gap-6">
        <div>
          <p className="text-xs font-semibold" style={secondary}>
            Jasper
          </p>
          <p className="text-4xl font-medium tabular-nums" style={{ color: w === "jasper" ? "var(--color-text-primary)" : "var(--color-text-muted)" }}>
            {score.jasper}
          </p>
        </div>
        <div>
          <p className="text-xs font-semibold" style={{ color: "var(--color-accent)" }}>
            Draftly
          </p>
          <p className="text-5xl font-medium tabular-nums" style={{ color: w === "draftly" ? "var(--color-accent)" : "var(--color-text-primary)" }}>
            {score.draftly}
          </p>
        </div>
      </div>
      <p className="text-xs mt-3" style={muted}>
        {total ? "Total across 4 posts" : "Average of 4 posts"}
      </p>
    </div>
  );
}

/** Renders an excerpt, marking the highlighted phrase (Jasper) or the phrase that was a link (Draftly). */
function Quote({ ex, tone }: { ex: Excerpt; tone: "jasper" | "draftly" }) {
  const phrase = ex.hl ?? ex.link;
  if (!phrase || !ex.text.includes(phrase)) return <>&ldquo;{ex.text}&rdquo;</>;
  const [before, after] = ex.text.split(phrase);
  const mark =
    tone === "jasper" ? (
      <mark className="rounded px-0.5" style={{ background: "rgba(220, 38, 38, 0.14)", color: "inherit", boxShadow: "inset 0 -2px 0 rgba(220, 38, 38, 0.55)" }}>
        {phrase}
      </mark>
    ) : (
      <mark className="rounded px-0.5 underline underline-offset-2" style={{ background: "var(--color-accent-muted)", color: "var(--color-accent)", textDecorationColor: "var(--color-accent)" }}>
        {phrase}
      </mark>
    );
  return (
    <>
      &ldquo;{before}
      {mark}
      {after}&rdquo;
    </>
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

export default async function JasperVsDraftlyPage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${APP_URL}/register`;
  const ctaLabel = s.heroCtaText || "Generate Free Post";

  const jsonLd = jsonLdHtml(
    {
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      datePublished: CHECKED.iso,
      dateModified: CHECKED.iso,
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
          {/* Hero: one line on who each is for, two price cards, one button. */}
          <header className="text-center max-w-3xl mx-auto">
            <p className="eyebrow mb-4">Jasper AI alternative</p>
            <h1 className="page-heading mb-5" style={{ fontSize: "clamp(2.6rem, 7vw, 72px)" }}>
              Jasper vs{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                Draftly
              </em>
            </h1>
            <p className="text-lg sm:text-xl leading-relaxed" style={secondary}>
              Jasper is built for marketing teams. Draftly is built to grow a small business&apos;s blog.
            </p>
          </header>

          <div className="mt-12 grid sm:grid-cols-2 gap-4 sm:gap-6 max-w-3xl mx-auto items-stretch">
            <div className="rounded-2xl p-6 sm:p-8 flex flex-col" style={card}>
              <p className="text-xl font-semibold">Jasper Pro</p>
              <p className="text-sm mt-1" style={muted}>
                For marketing teams
              </p>
              <p className="mt-6">
                <span className="text-5xl font-medium tabular-nums">${JASPER_PRO.monthly}</span>
                <span className="text-sm ml-1" style={muted}>
                  per seat a month
                </span>
              </p>
              <p className="text-sm mt-2" style={secondary}>
                or ${JASPER_PRO.yearly} per seat billed yearly
              </p>
              <p className="text-xs mt-auto pt-6" style={muted}>
                As listed on{" "}
                <a href={SRC.pricing.href} rel="nofollow noopener" target="_blank" className="underline">
                  jasper.ai
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
                for {SOLO.seats} people, not per seat. First post free.
              </p>
              <a href={registerUrl} className="btn btn-primary mt-6 self-start">
                {ctaLabel}
              </a>
            </div>
          </div>
          <p className="mt-4 text-center text-sm" style={muted}>
            Paste your URL. No credit card.
          </p>

          {/* The bake-off: the centerpiece. */}
          <section id="bake-off" className="mt-28">
            <div className="max-w-3xl">
              <p className="eyebrow mb-3">Tested {BAKEOFF_METHOD.date}</p>
              <H2 className="mb-4">Same topic, same business: our Jasper vs Draftly bake-off</H2>
              <p className="text-lg leading-relaxed" style={secondary}>
                We gave Jasper and Draftly the same blog topic for four real businesses, then scored all eight posts.
              </p>
            </div>

            <div className="mt-8 grid sm:grid-cols-3 gap-4">
              <BigStat label="Human voice" hint="0 to 100, higher is better" score={T.humanVoice} />
              <BigStat label="Reads as AI" hint="0 to 100, lower is better" score={T.readsAsAi} lowerWins />
              <BigStat label="Links to the business's pages" hint="Internal links in the post" score={T.ownLinks} total />
            </div>

            <div className="mt-6 grid md:grid-cols-2 gap-4">
              {BAKEOFF.map((r) => (
                <div key={r.business} className="rounded-2xl p-5 sm:p-6" style={card}>
                  <p className="font-semibold">{r.business}</p>
                  <p className="text-sm mt-0.5 mb-3" style={secondary}>
                    Topic: {r.topic}
                  </p>
                  <ColumnHeads />
                  <MetricRow label="Human voice" score={r.humanVoice} />
                  <MetricRow label="Reads as AI" score={r.readsAsAi} lowerWins />
                  <MetricRow label="Own-site links" score={r.ownLinks} />
                  {r.note ? (
                    <p className="text-xs mt-3" style={muted}>
                      {r.note}
                    </p>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl p-4 sm:p-5 text-sm leading-relaxed" style={{ background: "var(--color-bg-elevated)" }}>
              <p className="font-semibold mb-1">Scored with Draftly&apos;s own checker</p>
              <p style={secondary}>
                {BAKEOFF_METHOD.jasper}. {BAKEOFF_METHOD.draftly}. Tested {BAKEOFF_METHOD.date}, with the businesses&apos; permission.
                Within one point counts as a tie.
              </p>
            </div>

            <Cta href={registerUrl} label={ctaLabel} note="Run the same test on your own site. Your first post is free." />
          </section>

          {/* Quoted differences, side by side. */}
          <section id="what-they-wrote" className="mt-28">
            <H2 className="mb-3 max-w-3xl">What each one wrote</H2>
            <div className="mt-8 space-y-10">
              {CALLOUTS.map((c) => (
                <div key={c.title}>
                  <p className="text-xs font-semibold uppercase tracking-wide" style={muted}>
                    {c.business}
                  </p>
                  <h3 className="text-xl font-semibold mt-1 mb-4">{c.title}</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <figure className="rounded-2xl p-5 sm:p-6" style={card}>
                      <figcaption className="text-xs font-semibold mb-3" style={secondary}>
                        Jasper wrote
                      </figcaption>
                      <blockquote className="text-base leading-relaxed">
                        <Quote ex={c.jasper} tone="jasper" />
                      </blockquote>
                    </figure>
                    <figure className="rounded-2xl p-5 sm:p-6" style={accentCard}>
                      <figcaption className="text-xs font-semibold mb-3" style={{ color: "var(--color-accent)" }}>
                        Draftly wrote
                      </figcaption>
                      <blockquote className="text-base leading-relaxed">
                        <Quote ex={c.draftly} tone="draftly" />
                      </blockquote>
                    </figure>
                  </div>
                  <p className="text-sm mt-3 max-w-3xl leading-relaxed" style={secondary}>
                    {c.takeaway}
                  </p>
                </div>
              ))}
            </div>
            <p className="text-xs mt-6" style={muted}>
              Highlighted in red: claims the business didn&apos;t give Jasper. Underlined in orange: a link to the business&apos;s own page in the original post.
            </p>
          </section>

          {/* Checkmark table. */}
          <section id="comparison" className="mt-28">
            <H2 className="mb-3">Jasper AI vs Draftly, feature by feature</H2>
            <p className="mb-8 max-w-3xl leading-relaxed" style={secondary}>
              Jasper&apos;s side is what its own pages list as of {CHECKED.label}.
              <SourceLinks items={[SRC.pricing, SRC.trial, SRC.integrations, SRC.mcp]} />
            </p>
            <div className="rounded-2xl overflow-hidden" style={{ border: "1px solid var(--color-border)" }}>
              <div className="grid grid-cols-[1.3fr_1fr_1fr] gap-3 px-4 sm:px-6 py-3 text-sm font-semibold" style={{ background: "var(--color-bg-surface)" }}>
                <span className="sr-only sm:not-sr-only" style={muted}>
                  Feature
                </span>
                <span style={{ color: "var(--color-accent)" }}>Draftly</span>
                <span>Jasper</span>
              </div>
              <dl>
                {TABLE.map((r) => (
                  <div key={r.label} className="grid sm:grid-cols-[1.3fr_1fr_1fr] gap-x-3 gap-y-2 px-4 sm:px-6 py-3.5" style={{ borderTop: "1px solid var(--color-border)" }}>
                    <dt className="text-sm font-medium">{r.label}</dt>
                    <dd className="grid grid-cols-2 sm:contents gap-3">
                      <CheckCell value={r.draftly} note={r.draftlyNote} draftly />
                      <CheckCell value={r.jasper} note={r.jasperNote} />
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
            <p className="mt-3 text-sm" style={muted}>
              &ldquo;Not listed&rdquo; means we didn&apos;t find it on Jasper&apos;s site. Draftly plans are on the <A href="/pricing">pricing page</A>.
            </p>
            <Cta href={registerUrl} label={ctaLabel} note="See a finished post for your business before you pay." />
          </section>

          {/* Short keyword sections, one real screenshot each. */}
          <KeywordSection id="pricing" title="Jasper AI pricing vs Draftly pricing" shot={SHOTS.pricing}>
            <p>
              Jasper Pro is <B>${JASPER_PRO.monthly} per seat a month</B>, or ${JASPER_PRO.yearly} billed yearly, so a two-person team pays $
              {JASPER_PRO.monthly * 2} a month and a five-person team pays ${JASPER_PRO.monthly * 5}.
              <SourceLinks items={[SRC.pricing]} /> Draftly charges for the plan, not per seat, with no annual contract. Solopreneur is{" "}
              <B>${SOLO.price} a month for {SOLO.seats} people</B>, Growth is <B>${GROWTH.price} a month for {GROWTH.seats}</B>, and Autopilot is ${AUTOPILOT.price}{" "}
              a month with no limit on people. Everyone on the account shares the plan&apos;s credits. See <A href="/pricing">every Draftly plan</A>.
            </p>
          </KeywordSection>

          <KeywordSection
            id="free-alternative"
            title="Is there a free Jasper AI alternative?"
            shot={SHOTS.free}
            cta={<Cta href={registerUrl} label={ctaLabel} note="No credit card." />}
          >
            <p>
              Jasper offers a 7-day free trial of Pro.
              <SourceLinks items={[SRC.trial]} /> Draftly&apos;s Free plan has no time limit: paste your website URL and it writes your first
              full blog post, thumbnail included, free.
            </p>
          </KeywordSection>

          <KeywordSection id="seo-blog-posts" title="Jasper alternative for SEO blog posts" shot={SHOTS.seo}>
            <p>
              Jasper&apos;s Blog Post and SEO agents sit inside a platform built for many kinds of marketing.
              <SourceLinks items={[SRC.seo]} /> Draftly does one job: it writes the post with question-style headings, links your own
              pages, and drafts the slug, meta title and meta description every time.
            </p>
          </KeywordSection>

          <KeywordSection id="brand-voice" title="Brand voice: Jasper vs Draftly" shot={SHOTS.voice}>
            <p>
              Jasper Pro includes 2 brand voices, and Business includes unlimited.
              <SourceLinks items={[SRC.pricing]} /> Draftly builds your voice from your own website on every plan, Free included, and shows it
              as sliders you can move. It also learns from the edits you make before you publish.
            </p>
          </KeywordSection>

          <KeywordSection
            id="wordpress"
            title="Publish to WordPress automatically"
            shot={SHOTS.wordpress}
            cta={<Cta href={registerUrl} label={ctaLabel} note="Connect your CMS after your first post." />}
          >
            <p>
              WordPress isn&apos;t on Jasper&apos;s integrations page.
              <SourceLinks items={[SRC.integrations]} /> Draftly publishes in one click to WordPress, Shopify, Webflow, Ghost, HubSpot and
              Squarespace. On Autopilot (${AUTOPILOT.price} a month) it writes and publishes to WordPress and Shopify on a schedule you set.
            </p>
          </KeywordSection>

          <section id="when-jasper-wins" className="mt-28 max-w-3xl">
            <H2 className="mb-6">When Jasper is the better choice</H2>
            <div className="leading-relaxed" style={secondary}>
              <Bullets
                items={[
                  <>
                    <B>You write for many channels.</B> Jasper lists 100+ agents for ads, emails and product copy.
                  </>,
                  <>
                    <B>You have a larger team.</B> Jasper Business adds SSO, SCIM, roles and admin controls.
                  </>,
                  <>
                    <B>You work outside the US.</B> Jasper lists 30+ languages. Draftly serves US businesses only.
                  </>,
                ]}
              />
            </div>
          </section>

          <div className="max-w-3xl">
            <FaqList faqs={FAQS} />
            <div className="mt-16">
              <KeepReading exclude={PATH} guides={["/ai-copywriter", "/best-ai-for-writing"]} topic="AI blog writer Jasper alternative brand voice SEO blog posts" />
            </div>
          </div>

          <DarkCta
            title="Run your own bake-off"
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
