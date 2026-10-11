import type { Metadata } from "next";
import { APP_URL, DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Byline, DarkCta, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { PAID_PLANS } from "@/lib/pricing";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { PILLARS } from "@/lib/related";
import { RelatedLinks } from "@/components/RelatedLinks";
import { CHECKED, COMPLAINTS, TABLE_ROWS, TABLE_SOURCES, TABLE_TOOLS, WHEN_OTHERS_WIN, type Source } from "@/lib/compare-tools";

export const revalidate = 3600;

// Targets "jasper alternatives" (Ahrefs US, 2026-10-11: 250/mo, KD 4; with "jasper alternative",
// "jasper ai alternatives" and "jasper ai alternative" about 540/mo) and "best ai copywriting tools"
// (150/mo, KD 4, traffic potential 2,100). The page is built around what users complain about in
// these tools, each complaint sourced, with where Draftly falls short said plainly.
// Competitor facts live in lib/compare-tools.ts: re-check them there before each update.
const PATH = "/jasper-alternatives";
const PUBLISHED = { iso: CHECKED.iso, label: CHECKED.label };
const TITLE = "Jasper Alternatives: AI Copywriting Tools Compared by User Complaints";
const DESCRIPTION =
  "The complaints people raise most about Jasper and other AI copywriting tools, with sources, and how Draftly answers each one for small-business blogs.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}`, images: [DEFAULT_OG_IMAGE] },
};

const FAQS: Faq[] = [
  {
    q: "What is the best Jasper alternative for a small business?",
    a: `For a small business that mainly needs blog posts, Draftly is built for that job: it writes in your brand voice, checks each post against writing rules and publishes to your CMS, from $${PAID_PLANS[0].price} a month after a free first post. If you need ads, emails and social posts as well, Jasper covers more channels.`,
  },
  {
    q: "Is there a free Jasper alternative?",
    a: "Draftly writes your first full blog post free, with no credit card. Its Free plan also lets you connect Claude, ChatGPT or Cursor and write one more post with your own AI.",
  },
  {
    q: "Can Draftly replace Jasper?",
    a: "For blog posts, yes: research, writing, rule checks and publishing happen in one place. Draftly doesn't write ads, emails or social posts, so a team that uses Jasper for those would still need a tool for them.",
  },
  {
    q: "How did you pick the complaints on this page?",
    a: `We read reviews on G2, Capterra and Trustpilot, vendor help pages and independent review sites, and kept the complaints that came up repeatedly. Each one links to where we found it. We checked everything on ${CHECKED.label}; tell us if something has changed and we will fix the page.`,
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

export default async function JasperAlternativesPage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${APP_URL}/register`;

  const jsonLd = jsonLdHtml(
    {
      "@type": "Article",
      headline: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      datePublished: PUBLISHED.iso,
      dateModified: CHECKED.iso,
      author: authorRef,
      publisher: { "@type": "Organization", name: "Draftly", url: SITE_URL },
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
              Jasper alternatives,{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                judged by what users complain about
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
              The complaints that come up most about Jasper and other AI copywriting tools are price, trials that turn into
              surprise charges, drafts that read like AI, made-up facts and copying posts into WordPress by hand. Draftly was built
              around those complaints for small-business blogs. Jasper is still the better pick for a marketing team
              writing across many channels.
            </p>
            <Byline verb="Checked" date={CHECKED.label} />
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              We make Draftly, so weigh our view with that in mind. Every claim about another tool links to its source.
            </p>
          </header>

          <section id="at-a-glance" className="mt-16">
            <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              How five AI copywriting tools compare
            </h2>
            <p className="mb-6 max-w-3xl leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              &quot;Not found&quot; means we couldn&apos;t find it on the tool&apos;s public pages, which is different
              from proof it doesn&apos;t exist.
            </p>
            {/* Stacked cards on phones, the full table from md up. */}
            <div className="md:hidden space-y-3">
              {TABLE_TOOLS.map((tool) => (
                <div key={tool} className="p-4 rounded-xl" style={{ background: "var(--color-bg-surface)", border: tool === "Draftly" ? "1px solid var(--color-accent)" : "1px solid var(--color-border)" }}>
                  <p className="font-semibold">{tool}</p>
                  <dl className="mt-2 space-y-1 text-sm">
                    {TABLE_ROWS.map((row) => (
                      <div key={row.label} className="flex justify-between gap-4">
                        <dt style={{ color: "var(--color-text-muted)" }}>{row.label}</dt>
                        <dd className="text-right" style={{ color: row.cells[tool].good ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontWeight: row.cells[tool].good ? 600 : 400 }}>
                          {row.cells[tool].text}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <div className="hidden md:block overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
              <table className="w-full text-sm min-w-[760px]">
                <thead style={{ background: "var(--color-bg-surface)" }}>
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold" scope="col">
                      <span className="sr-only">Feature</span>
                    </th>
                    {TABLE_TOOLS.map((tool) => (
                      <th key={tool} className="px-4 py-2 font-semibold" scope="col" style={tool === "Draftly" ? { color: "var(--color-accent)" } : undefined}>
                        {tool}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TABLE_ROWS.map((row) => (
                    <tr key={row.label} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <th scope="row" className="px-4 py-3 align-top text-left font-medium">
                        {row.label}
                      </th>
                      {TABLE_TOOLS.map((tool) => (
                        <td key={tool} className="px-4 py-3 align-top" style={{ color: row.cells[tool].good ? "var(--color-text-primary)" : "var(--color-text-secondary)", fontWeight: row.cells[tool].good ? 600 : 400 }}>
                          {row.cells[tool].text}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm max-w-3xl" style={{ color: "var(--color-text-muted)" }}>
              Prices are list prices for monthly billing as published on {CHECKED.label}. Sources:
              <Sources items={TABLE_SOURCES} />.
            </p>
          </section>

          <Section id="complaints" title="The complaints, and what Draftly does about each">
            <p>
              These are the complaints that came up again and again in reviews of Jasper and the tools people compare it
              with. Under each one is what Draftly does about it, and where it still falls short.
            </p>
          </Section>

          <div className="max-w-3xl space-y-6 mt-8">
            {COMPLAINTS.map((c, i) => (
              <article key={c.id} id={c.id} className="p-6 rounded-xl" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                <h3 className="text-xl font-semibold mb-4">
                  <span style={{ color: "var(--color-text-muted)" }}>{i + 1}. </span>&ldquo;{c.complaint}&rdquo;
                </h3>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-text-muted)" }}>
                  What users say
                </p>
                <ul className="space-y-2 mb-5 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {c.about.map((a) => (
                    <li key={a.tool}>
                      <B>{a.tool}:</B> {a.detail}
                      <Sources items={a.sources} />
                    </li>
                  ))}
                </ul>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--color-accent)" }}>
                  What Draftly does
                </p>
                <p className="leading-relaxed" style={{ color: "var(--color-text-primary)" }}>
                  {c.draftly}
                </p>
                {c.caveat && (
                  <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    <B>Where it falls short:</B> {c.caveat}
                  </p>
                )}
              </article>
            ))}
          </div>

          <Section id="when-others-win" title="When another tool is the better pick">
            <p>Draftly does one job: blog posts for small businesses. Pick something else in these cases.</p>
            <ul className="space-y-3">
              {WHEN_OTHERS_WIN.map((w) => (
                <li key={w.tool}>
                  <B>{w.tool}.</B> {w.when}
                  {w.source ? <Sources items={[w.source]} /> : null}
                </li>
              ))}
            </ul>
          </Section>

          <Section id="how-we-checked" title="How we put this comparison together">
            <p>
              We collected complaints from G2, Capterra and Trustpilot reviews, the tools&apos; own help pages and
              independent review sites, and kept the ones that came up repeatedly. Prices and plan limits come from
              public pricing pages and are dated {CHECKED.label}. Tools change their plans often, so check the vendor&apos;s
              site before you buy.
            </p>
            <p>
              Draftly&apos;s side lists only what it does today. Plan details are on the <A href="/pricing">pricing page</A>, and
              the <A href="/seo-copywriting">writing rules Draftly checks</A> are listed with before and after examples. If
              something here is out of date, email <A href={`mailto:${s.contactEmail || "preston@draftly.blog"}`}>{s.contactEmail || "preston@draftly.blog"}</A>{" "}
              and we will correct it.
            </p>
          </Section>

          <div className="max-w-3xl">
            <RelatedLinks items={PILLARS.filter((p) => p.href !== PATH).slice(0, 4)} />
          </div>
          <FaqList faqs={FAQS} />

          <DarkCta
            title="See how Draftly handles your own site"
            body="Paste your website URL and Draftly writes one post in your brand's voice, checked against its writing rules. No credit card."
            href={registerUrl}
            label={s.heroCtaText || "Generate Free Post"}
            secondary={{ href: "/pricing", label: "Compare plans" }}
          />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
