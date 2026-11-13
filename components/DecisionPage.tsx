import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { B, Byline, FaqList, Section, faqJsonLd } from "@/components/ArticleParts";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { KeepReading } from "@/components/KeepReading";
import { SignupCta } from "@/components/SignupCta";
import { BarChart } from "@/components/BarChart";
import { AccentText } from "@/components/AccentText";
import { pageImages } from "@/lib/og";
import {
  CHECKED_NOTE,
  TOOLS,
  WRITTEN,
  isPublishable,
  pageChecked,
  pageTools,
  type DecisionPage,
  type Tool,
} from "@/lib/decision-pages";

// Shared layout for the decision pages in lib/decision-pages.ts. A page with any fact not
// yet read on the vendor's own site is noindex everywhere and 404s on production, so it
// can be reviewed on a preview deployment without going live.

const muted = { color: "var(--color-text-muted)" };
const secondary = { color: "var(--color-text-secondary)" };
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const isProduction = () => process.env.VERCEL_ENV === "production";

export function decisionMetadata(page: DecisionPage): Metadata {
  return {
    title: { absolute: page.title },
    description: page.description,
    alternates: { canonical: page.path },
    ...(isPublishable(page) ? {} : { robots: { index: false, follow: false } }),
    ...pageImages(page.path, { title: page.title, description: page.description, type: "article", url: `${SITE_URL}${page.path}` }),
  };
}

function NotChecked() {
  return (
    <span
      className="ml-1 inline-block rounded px-1.5 py-0.5 text-xs font-semibold align-middle"
      style={{ background: "#ffce59", color: "#1a1a1a" }}
      title="Not yet read on the vendor's own site. This page stays unpublished until it is."
    >
      Not checked
    </span>
  );
}

function SourceLinks({ tool }: { tool: Tool }) {
  if (tool.draftly) return null;
  if (!tool.verified) return <NotChecked />;
  return (
    <span className="text-sm" style={muted}>
      {" "}
      (
      {tool.sources.map((s, i) => (
        <span key={s.href}>
          {i > 0 ? ", " : ""}
          <a href={s.href} rel="nofollow noopener" target="_blank" className="underline">
            {s.label}
          </a>
        </span>
      ))}
      , checked {tool.checked.label})
    </span>
  );
}

function Fact({ tool, children }: { tool: Tool; children: React.ReactNode }) {
  return (
    <>
      {children}
      {!tool.verified && <NotChecked />}
    </>
  );
}

export function DecisionPageView({ page }: { page: DecisionPage }) {
  if (!isPublishable(page) && isProduction()) notFound();

  const checked = pageChecked(page);
  const target = page.target ? TOOLS[page.target] : undefined;
  const rows = page.entries.map((e) => ({ entry: e, tool: TOOLS[e.tool] as Tool }));
  const chartTools = pageTools(page).filter((t): t is Tool & { perPost: number } => t.verified && t.perPost !== null);
  const chartMax = Math.max(...chartTools.map((t) => t.perPost));

  const jsonLd = jsonLdHtml(
    {
      "@type": "Article",
      headline: page.title,
      description: page.description,
      url: `${SITE_URL}${page.path}`,
      datePublished: WRITTEN.iso,
      dateModified: WRITTEN.iso,
      author: authorRef,
      publisher: { "@type": "Organization", name: "Draftly", url: SITE_URL },
      citation: pageTools(page).flatMap((t) => (t.verified ? t.sources.map((s) => s.href) : [])),
    },
    {
      "@type": "ItemList",
      name: page.h1,
      itemListElement: rows.map(({ tool }, i) => ({ "@type": "ListItem", position: i + 1, name: tool.name, url: `${SITE_URL}${page.path}#${tool.id}` })),
    },
    faqJsonLd(page.faqs),
  );

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />

        <TocLayout>
          <header className="max-w-3xl">
            {!isPublishable(page) && (
              <p className="mb-6 rounded-xl p-4 text-sm" style={{ background: "#fff4d6", color: "#1a1a1a", border: "1px solid #ffce59" }}>
                Draft. Facts marked <NotChecked /> haven&apos;t been read on the vendor&apos;s own site yet. This page is
                noindex and returns 404 on production until they are.
              </p>
            )}
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              {page.h1}{" "}
              <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
                {page.h1Accent}
              </AccentText>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={secondary}>
              {page.answer}
            </p>
            <Byline verb="Written" date={WRITTEN.label} />
            <p className="mt-2 text-sm" style={muted}>
              I built Draftly, so weigh my take on it accordingly. That&apos;s also why it isn&apos;t first on this list.
              Every competitor price links to that company&apos;s own pricing page, with the date I read it.
            </p>
          </header>

          {target && (
            <Section id={target.id} title={`What ${target.name} costs`}>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <B>Starting price:</B> <Fact tool={target}>{target.startingPrice}</Fact>
                </li>
                <li>
                  <B>Publishes to:</B> <Fact tool={target}>{target.publishing}</Fact>
                </li>
                <li>
                  <B>Free option:</B> <Fact tool={target}>{target.freeOption}</Fact>
                </li>
                {target.perPost !== null && (
                  <li>
                    <B>Per article:</B>{" "}
                    <Fact tool={target}>
                      about {usd2(target.perPost)} ({target.perPostBasis})
                    </Fact>
                  </li>
                )}
              </ul>
              {page.targetNote && (
                <p>
                  <Fact tool={target}>{page.targetNote}</Fact>
                </p>
              )}
              {target.verified && (
                <p>
                  <SourceLinks tool={target} />
                </p>
              )}
            </Section>
          )}

          <section id="at-a-glance" className="mt-16">
            <h2 className="text-3xl font-medium mb-6 max-w-3xl" style={{ letterSpacing: "-0.03em" }}>
              The options at a glance
            </h2>
            <div className="sm:hidden space-y-3">
              {rows.map(({ entry, tool }) => (
                <div key={tool.id} className="p-4 rounded-xl" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                  <p className="font-semibold" style={tool.draftly ? { color: "var(--color-accent)" } : undefined}>
                    {tool.name}
                    {!tool.verified && <NotChecked />}
                  </p>
                  <dl className="mt-2 space-y-2 text-sm leading-relaxed" style={secondary}>
                    {[
                      ["Best for", capitalize(entry.bestFor)],
                      ["Starting price", tool.startingPrice],
                      ["Publishes to", tool.publishing],
                      ["Free option", tool.freeOption],
                    ].map(([k, v]) => (
                      <div key={k}>
                        <dt className="font-medium" style={{ color: "var(--color-text-primary)" }}>{k}</dt>
                        <dd>{v}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
              <table className="w-full text-sm min-w-[760px]">
                <thead style={{ background: "var(--color-bg-surface)" }}>
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold" scope="col">Tool</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Best for</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Starting price</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Publishes to</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Free option</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(({ entry, tool }) => (
                    <tr key={tool.id} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <th scope="row" className="px-4 py-3 align-top text-left font-semibold" style={tool.draftly ? { color: "var(--color-accent)" } : undefined}>
                        {tool.name}
                        {!tool.verified && <NotChecked />}
                      </th>
                      <td className="px-4 py-3 align-top" style={secondary}>{capitalize(entry.bestFor)}</td>
                      <td className="px-4 py-3 align-top">{tool.startingPrice}</td>
                      <td className="px-4 py-3 align-top" style={secondary}>{tool.publishing}</td>
                      <td className="px-4 py-3 align-top" style={secondary}>{tool.freeOption}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 max-w-3xl text-sm" style={muted}>
              {CHECKED_NOTE}, the oldest on {checked.label}. Prices change, so check before you buy.
            </p>
          </section>

          {rows.map(({ entry, tool }, i) => (
            <Section key={tool.id} id={tool.id} title={`${i + 1}. ${tool.name}: ${entry.bestFor}`}>
              <p>
                {entry.summary}
                <SourceLinks tool={tool} />
              </p>
              <p>
                <B>Pick it if:</B> {entry.pickIf}
              </p>
              <p>
                <B>Skip it if:</B> {entry.skipIf}
              </p>
            </Section>
          ))}

          {chartTools.length > 1 && (
            <Section id="cost-per-post" title="What one post costs on each entry plan">
              <p>
                This is the monthly price split across the posts or articles each entry plan includes. It ignores
                everything else the price pays for, so count only what you&apos;d use. Tools that don&apos;t sell a set number
                of posts are left out.
              </p>
              <BarChart
                title="Price per post or article, entry plan"
                rows={[...chartTools]
                  .sort((a, b) => a.perPost - b.perPost)
                  .map((t) => ({ key: t.id, label: t.name, value: t.perPost }))}
                max={chartMax}
                format={usd2}
                defaultColor="var(--color-accent)"
                note={chartTools.map((t) => `${t.name}: ${t.perPostBasis}.`).join(" ")}
              />
            </Section>
          )}

          <div className="max-w-3xl mt-16">
            <SignupCta heading={page.cta.heading} body={page.cta.body} />
          </div>

          <div className="max-w-3xl">
            <KeepReading exclude={page.path} guides={page.keepReading.guides} topic={page.keepReading.topic} />
          </div>
          <FaqList faqs={page.faqs} />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
