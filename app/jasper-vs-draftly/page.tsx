import type { Metadata } from "next";
import { APP_URL, SITE_URL } from "@/lib/site";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, Byline, DarkCta, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { ProductFigure } from "@/components/ProductFigure";
import { PAID_PLANS, PLANS } from "@/lib/pricing";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { PILLARS } from "@/lib/related";
import { RelatedLinks } from "@/components/RelatedLinks";
import { GUIDE_SHOTS, INTEGRATIONS_SHOT, imageObjectJsonLd } from "@/lib/product-shots";
import { CHECKED, JASPER_PRO, OG_IMAGE, JASPER_SOURCES as SRC, ROWS, type Edge, type Source } from "@/lib/jasper-vs-draftly";

export const revalidate = 3600;

// Search demand (Ahrefs, US, 2026-10-12). The "jasper alternative" cluster: jasper alternatives 200,
// jasper alternative 150, jasper ai free alternative 150, jasper ai alternatives 100, alternative to
// jasper ai 90, jasper ai alternative 40 (KD 0 to 6). Pricing: jasper ai pricing 2026 700, jasper ai
// pricing 500, jasper pricing 300, jasper ai cost 100. Also is jasper ai worth it 150, jasper ai seo 150,
// jasper ai free trial 150, jasper vs 100, brand voice 4,100. Each H2 targets one of these.
// Jasper facts and their sources live in lib/jasper-vs-draftly.ts.
const PATH = "/jasper-vs-draftly";
const TITLE = "Jasper vs Draftly: Jasper AI Alternative for SEO Blogs";
const DESCRIPTION =
  "Jasper vs Draftly compared on pricing, brand voice, SEO blog posts and WordPress publishing. Where each one wins, with sources. Your first Draftly post is free.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}`, images: [OG_IMAGE] },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: [OG_IMAGE.url] },
};

const [SOLO, GROWTH, AUTOPILOT] = PAID_PLANS;

const FAQS: Faq[] = [
  {
    q: "Is Draftly a good Jasper alternative?",
    a: "If your main job is blog posts for a small business, yes. Draftly writes them in your brand voice, checks each one for AI-sounding writing and publishes to your CMS. If you also need ads, emails and social posts, Jasper covers more of that work.",
  },
  {
    q: "Is there a free alternative to Jasper AI?",
    a: "Draftly writes your first full blog post free, with no credit card, and the Free plan stays free. Jasper offers a 7-day free trial of its Pro plan.",
  },
  {
    q: "How much does Jasper AI cost?",
    a: `As listed on jasper.ai in ${CHECKED.month}, Jasper Pro is $${JASPER_PRO.monthly} per seat a month billed monthly, or $${JASPER_PRO.yearly} per seat a month billed yearly. Business has custom pricing with a 12-month minimum. Check Jasper's pricing page for current prices.`,
  },
  {
    q: "How much does Draftly cost?",
    a: `Your first post is free. Solopreneur is $${SOLO.price} a month, Growth is $${GROWTH.price} a month and Autopilot is $${AUTOPILOT.price} a month, billed monthly with no annual contract.`,
  },
  {
    q: "Does Jasper publish to WordPress?",
    a: "WordPress isn't on Jasper's integrations page. It lists a Webflow app, a Chrome extension, Google Docs, Microsoft Word, and Zapier and Make for connecting other apps. Draftly publishes to WordPress in one click, and its Autopilot plan publishes on a schedule.",
  },
  {
    q: "Is Jasper AI worth it for a small business?",
    a: "It can be if you have a marketing team writing for many channels and want shared brand settings, agents and admin controls. If you mainly need a steady blog, you'd pay per seat for a lot you won't use, and you'd still copy posts into your CMS.",
  },
  {
    q: "Can I use Draftly inside Claude or ChatGPT?",
    a: "Yes, on every plan. Connect the Draftly connector and your assistant can read your brand voice and writing rules, check drafts and save posts to Draftly. Jasper's MCP server is for Business plans only and needs API access.",
  },
  {
    q: "Does Draftly write ads, emails or social posts?",
    a: "No. Draftly writes blog posts only. A team that uses Jasper for ads and email would still need a tool for those.",
  },
  {
    q: "Does Draftly work outside the United States?",
    a: "Not yet. Draftly is available to businesses in the United States only.",
  },
];

function Sources({ items }: { items: Source[] }) {
  return (
    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
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
      )
    </span>
  );
}

const EDGE_LABEL: Record<Edge, string> = { draftly: "Draftly", jasper: "Jasper", tie: "Depends" };

function EdgeChip({ edge }: { edge: Edge }) {
  const draftly = edge === "draftly";
  return (
    <span
      className="inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap"
      style={{
        background: draftly ? "var(--color-accent-muted)" : "var(--color-bg-elevated)",
        color: draftly ? "var(--color-accent)" : "var(--color-text-secondary)",
      }}
    >
      {EDGE_LABEL[edge]}
    </span>
  );
}

function Verdict({ who, children }: { who: "Draftly" | "Jasper"; children: React.ReactNode }) {
  const draftly = who === "Draftly";
  return (
    <div className="p-6 rounded-xl h-full" style={{ background: draftly ? "var(--color-accent-muted)" : "var(--color-bg-surface)", border: `1px solid ${draftly ? "var(--color-border-accent)" : "var(--color-border)"}` }}>
      <p className="font-semibold mb-3" style={{ color: draftly ? "var(--color-accent)" : "var(--color-text-primary)" }}>
        Pick {who} if
      </p>
      <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
        {children}
      </div>
    </div>
  );
}

function InlineCta({ href, label, note }: { href: string; label: string; note: string }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2" data-toc-skip>
      <a href={href} className="btn btn-primary">
        {label}
      </a>
      <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
        {note}
      </span>
    </div>
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
      image: [imageObjectJsonLd(GUIDE_SHOTS.brandVoice), imageObjectJsonLd(GUIDE_SHOTS.genericVsDraftly), imageObjectJsonLd(INTEGRATIONS_SHOT)],
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
            <p className="eyebrow mb-4">Jasper AI alternative</p>
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.4rem, 6vw, 64px)" }}>
              Jasper vs{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                Draftly
              </em>
            </h1>
            <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Jasper is an AI platform for marketing teams. Draftly is an AI blog writer for small businesses: paste your URL and
              it writes posts in your voice, checks them for AI-sounding copy and publishes them to your site. Here is how the
              two compare, and when each one is the better buy.
            </p>
          </header>

          {/* The two brands side by side, then the main call to action. */}
          <div className="mt-10 max-w-3xl grid grid-cols-[1fr_auto_1fr] items-stretch gap-3 sm:gap-5" aria-label="Jasper compared with Draftly">
            <div className="rounded-xl p-4 sm:p-6" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
              <p className="text-xl sm:text-2xl font-semibold">Jasper</p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                jasper.ai
              </p>
              <p className="text-sm mt-4" style={{ color: "var(--color-text-secondary)" }}>
                For marketing teams. From ${JASPER_PRO.monthly} per seat a month.
              </p>
            </div>
            <div className="self-center flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full text-sm font-semibold" style={{ background: "#111", color: "#fff" }} aria-hidden="true">
              vs
            </div>
            <div className="rounded-xl p-4 sm:p-6" style={{ background: "var(--color-accent-muted)", border: "1px solid var(--color-border-accent)" }}>
              <p className="text-xl sm:text-2xl font-semibold flex items-center gap-2">
                {s.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={s.logoUrl} alt="" className="hidden sm:block h-7 w-auto" />
                ) : null}
                Draftly
              </p>
              <p className="text-xs sm:text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
                draftly.blog
              </p>
              <p className="text-sm mt-4" style={{ color: "var(--color-text-secondary)" }}>
                For small-business blogs. First post free, then ${SOLO.price} a month.
              </p>
            </div>
          </div>
          <InlineCta href={registerUrl} label={ctaLabel} note="Paste your URL. No credit card." />
          <div className="mt-6 max-w-3xl">
            <Byline verb="Checked" date={CHECKED.label} />
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              We make Draftly, so weigh our view with that in mind. Every Jasper fact comes from Jasper&apos;s own pages and links to
              them.
            </p>
          </div>

          <section id="verdict" className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              Jasper vs Draftly: the quick verdict
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <Verdict who="Draftly">
                <Bullets
                  items={[
                    "Your blog is the main thing you need written",
                    "You want posts in your voice without rewriting them",
                    "You want posts to land in WordPress, Shopify or your CMS without copy and paste",
                    `You'd rather pay $${SOLO.price} a month than pay per seat`,
                  ]}
                />
              </Verdict>
              <Verdict who="Jasper">
                <Bullets
                  items={[
                    "A marketing team writes ads, emails, product copy and campaigns",
                    "You need SSO, roles and admin controls",
                    "You write in languages other than English",
                    "You're outside the United States",
                  ]}
                />
              </Verdict>
            </div>
          </section>

          <section id="comparison" className="mt-20">
            <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              Jasper AI vs Draftly, feature by feature
            </h2>
            <p className="mb-6 max-w-3xl leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Jasper&apos;s side is what its own pages list as of {CHECKED.label}. &quot;Not listed&quot; means we didn&apos;t find it there.
            </p>
            {/* Stacked cards on phones, the full table from md up. */}
            <div className="md:hidden space-y-3">
              {ROWS.map((r) => (
                <div key={r.label} className="p-4 rounded-xl" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-semibold text-sm">{r.label}</p>
                    <EdgeChip edge={r.edge} />
                  </div>
                  <dl className="mt-2 space-y-1.5 text-sm">
                    <div>
                      <dt className="inline font-semibold" style={{ color: "var(--color-accent)" }}>Draftly: </dt>
                      <dd className="inline">{r.draftly}</dd>
                    </div>
                    <div>
                      <dt className="inline font-semibold">Jasper: </dt>
                      <dd className="inline" style={{ color: "var(--color-text-secondary)" }}>{r.jasper}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
              <table className="w-full text-sm min-w-[700px]">
                <thead style={{ background: "var(--color-bg-surface)" }}>
                  <tr className="text-left">
                    <th className="px-4 py-3 font-semibold" scope="col">
                      <span className="sr-only">Feature</span>
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col" style={{ color: "var(--color-accent)" }}>
                      Draftly
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Jasper
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      Edge
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.label} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <th scope="row" className="px-4 py-3 align-top text-left font-medium">
                        {r.label}
                      </th>
                      <td className="px-4 py-3 align-top" style={{ fontWeight: r.edge === "draftly" ? 600 : 400 }}>
                        {r.draftly}
                      </td>
                      <td className="px-4 py-3 align-top" style={{ color: "var(--color-text-secondary)", fontWeight: r.edge === "jasper" ? 600 : 400 }}>
                        {r.jasper}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <EdgeChip edge={r.edge} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm max-w-3xl" style={{ color: "var(--color-text-muted)" }}>
              Jasper facts are from its own pages
              <Sources items={[SRC.pricing, SRC.trial, SRC.integrations, SRC.mcp]} />. Draftly plans are on the <A href="/pricing">pricing page</A>.
            </p>
          </section>

          <Section id="pricing" title="Jasper AI pricing vs Draftly pricing">
            <p>
              As listed on jasper.ai in {CHECKED.month}, Jasper Pro costs <B>${JASPER_PRO.monthly} per seat a month</B> billed monthly, or $
              {JASPER_PRO.yearly} per seat billed yearly. Business has custom pricing and a 12-month minimum.
              <Sources items={[SRC.pricing]} /> A two-person team on Pro pays ${JASPER_PRO.monthly * 2} a month.
            </p>
            <p>
              Draftly prices by plan, not by seat, and bills monthly with no annual contract:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {PLANS.map((p) => (
                <div key={p.name} className="rounded-xl p-4" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
                    {p.name}
                  </p>
                  <p className="text-2xl font-medium mt-1" style={{ color: "var(--color-text-primary)" }}>
                    ${p.price}
                    <span className="text-sm" style={{ color: "var(--color-text-muted)" }}>
                      {p.price ? "/mo" : ""}
                    </span>
                  </p>
                  <p className="text-xs mt-1">{p.posts}</p>
                </div>
              ))}
            </div>
            <p>
              Jasper&apos;s Pro seat buys a lot more than blog posts: chat, image generation, 100+ marketing agents and 30+ languages.
              If you&apos;d use all of that, the per-seat price can be fair. If you mainly want a blog that keeps publishing, Draftly
              covers that job for less. See <A href="/pricing">what each Draftly plan includes</A>.
            </p>
          </Section>

          <Section id="free-alternative" title="Is there a free Jasper AI alternative?">
            <p>
              Jasper offers a <B>7-day free trial of Pro</B>.
              <Sources items={[SRC.trial]} /> Draftly has a Free plan with no time limit: paste your website URL and it writes your first
              full blog post, with its thumbnail, and no credit card. You can also connect Claude, ChatGPT or Cursor on the Free plan and
              write one more post with your own AI.
            </p>
            <p>
              That first post is the fairest test. You read a finished post written for your business before you decide to pay
              anything.
            </p>
            <InlineCta href={registerUrl} label={ctaLabel} note="Your first post is free." />
          </Section>

          <Section id="seo-blog-posts" title="Jasper alternative for SEO blog posts">
            <p>
              Jasper has a Blog Post agent and SEO, AEO and GEO agents, and its GEO agent can read your Semrush data.
              <Sources items={[SRC.seo]} /> Those agents are part of a wider platform built for marketing teams.
            </p>
            <p>
              Draftly does one job end to end. It reads your site, suggests topics from news in your industry, writes the post with
              question-style headings, drafts the URL slug, meta title and meta description, scores the post for SEO, and publishes it.
              Every plan shows your Google Analytics and Search Console reports. Paid plans add keyword data through the Draftly
              connector: volume, difficulty and intent from Solopreneur up, live Google results from Growth, and keyword gaps and
              backlinks on Autopilot.
            </p>
            <ProductFigure shot={GUIDE_SHOTS.urlToPost} />
          </Section>

          <Section id="brand-voice" title="Brand voice: Jasper vs Draftly">
            <p>
              Jasper Pro includes 2 brand voices, and Business includes unlimited brand voices plus a Style Guide.
              <Sources items={[SRC.pricing]} />
            </p>
            <p>
              Draftly builds your brand voice from your own website on every plan, Free included, and shows it as sliders you can move.
              It learns from the edits you make before you publish, and every change it learns is listed in Brand memory, where you can
              undo it.
            </p>
            <ProductFigure shot={GUIDE_SHOTS.brandVoice} />
          </Section>

          <Section id="sounds-human" title="An AI writer that sounds human">
            <p>
              Most of the work with AI copy is taking the AI out of it. Draftly checks every post against writing rules for the habits
              that make copy read as machine-made: stock AI words, &quot;not just X&quot; framing, hedging, throat-clearing openers and more. A
              post that breaks a rule gets a fix pass before you see it, and each post gets a 0 to 100 human-voice score.
            </p>
            <p>
              In the Draftly Editor, an AI-writing detector marks sentences that read as AI and labels the draft likely human, mixed or
              likely AI-written, so you know where to look. The <A href="/seo-copywriting">rules Draftly checks</A> are listed with before and
              after examples.
            </p>
            <ProductFigure shot={GUIDE_SHOTS.genericVsDraftly} />
            <p>
              Jasper&apos;s equivalent is its Style Guide, which its pricing page lists on the Business plan.
              <Sources items={[SRC.pricing]} /> Rules catch patterns, not taste, so read every post before it goes live whichever tool you
              use.
            </p>
          </Section>

          <Section id="wordpress" title="Publish to WordPress automatically">
            <p>
              Jasper&apos;s integrations page lists a Webflow app, a Chrome extension, Google Docs, Microsoft Word, Slack, and Zapier and Make
              for connecting other apps. WordPress isn&apos;t on the list.
              <Sources items={[SRC.integrations]} />
            </p>
            <p>
              Draftly publishes in one click to <B>WordPress, Shopify, Webflow, Ghost, HubSpot and Squarespace</B>. On the Autopilot plan
              (${AUTOPILOT.price} a month) you set a schedule once and Draftly picks topics, writes and publishes to WordPress and Shopify on
              its own, then emails you a weekly digest of what went out. Draftly also has a <A href="/wordpress-ai-plugin">WordPress plugin</A>{" "}
              for checking and improving posts already on your site.
            </p>
            <ProductFigure shot={INTEGRATIONS_SHOT} />
            <InlineCta href={registerUrl} label={ctaLabel} note="Connect your CMS after your first post." />
          </Section>

          <Section id="claude-chatgpt" title="Use your brand voice in Claude and ChatGPT">
            <p>
              Jasper&apos;s MCP server brings its brand context into Claude, ChatGPT and Microsoft 365 Copilot. Jasper&apos;s help center says it
              is for Business plans only and needs API access.
              <Sources items={[SRC.mcp]} />
            </p>
            <p>
              The Draftly connector works on every plan, Free included. Your assistant reads your brand voice and writing rules, checks
              drafts against them and saves posts to Draftly. See <A href="/mcp">how the Draftly SEO MCP server works</A>.
            </p>
          </Section>

          <Section id="when-jasper-wins" title="Where Jasper is the better pick">
            <Bullets
              items={[
                <>
                  <B>Many channels.</B> Jasper lists 100+ marketing agents for work like ads, emails and product descriptions. Draftly writes
                  blog posts only.
                  <Sources items={[SRC.pricing]} />
                </>,
                <>
                  <B>Larger teams.</B> Jasper Business adds SSO, SCIM, role-based permissions, admin controls and a dedicated customer
                  success manager. Draftly has no SSO or team roles.
                  <Sources items={[SRC.pricing]} />
                </>,
                <>
                  <B>Other languages and countries.</B> Jasper lists 30+ languages. Draftly serves US businesses only.
                  <Sources items={[SRC.pricing]} />
                </>,
                <>
                  <B>Custom workflows.</B> Jasper Business includes a no-code builder for custom agents, Jasper Grid and API access.
                  <Sources items={[SRC.pricing]} />
                </>,
              ]}
            />
          </Section>

          <Section id="worth-it" title="Is Jasper AI worth it for a small-business blog?">
            <p>
              For a marketing team that uses everything in a Pro seat, it can be. For a small business that mainly needs a blog, these
              are the reasons people pick Draftly instead:
            </p>
            <Bullets
              items={[
                <>
                  <B>Lower cost for one blog.</B> ${SOLO.price} a month for the plan, against ${JASPER_PRO.monthly} per seat a month for
                  Jasper Pro.
                </>,
                <>
                  <B>Try it on your own site.</B> A finished first post, free, with no credit card.
                </>,
                <>
                  <B>Less rewriting.</B> Every post is checked for AI-sounding writing and fixed before you see it.
                </>,
                <>
                  <B>No copy and paste.</B> One click to six CMSs, or scheduled publishing on Autopilot.
                </>,
                <>
                  <B>Works in the AI app you already use.</B> The Claude and ChatGPT connector is on every plan.
                </>,
              ]}
            />
          </Section>

          <div className="max-w-3xl">
            <RelatedLinks items={PILLARS.filter((p) => p.href !== PATH).slice(0, 4)} />
          </div>
          <FaqList faqs={FAQS} />

          <DarkCta
            title="See what Draftly writes for your site"
            body="Paste your website URL and Draftly writes one post in your brand's voice, checked for AI-sounding writing. No credit card."
            href={registerUrl}
            label={ctaLabel}
            secondary={{ href: "/pricing", label: "Compare plans" }}
          />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
