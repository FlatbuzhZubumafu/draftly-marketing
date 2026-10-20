import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, Byline, FaqList, faqJsonLd } from "@/components/ArticleParts";
import { KeepReading } from "@/components/KeepReading";
import { ToolChecker } from "@/components/tools/ToolChecker";
import { FaqSchemaGenerator } from "@/components/tools/FaqSchemaGenerator";
import { GeneratorTool } from "@/components/tools/GeneratorTool";
import { ToolHeroVideo } from "@/components/tools/ToolHeroVideo";
import { AiContentDetector } from "@/components/tools/AiContentDetector";
import { FeatureArt } from "@/components/feature-art/FeatureArt";
import { TINTS, tintVars } from "@/lib/feature-tints";
import { SAMPLE_BRIEF, SAMPLE_IDEAS } from "@/lib/brief-template";
import { aiToolsEnabled } from "@/lib/tools/ai/gateway";
import { FREE_TOOLS, TOOLS_DATE, TOOLS_HUB, type CheckerId, type FreeTool } from "@/lib/free-tools";
import { jsonLdHtml } from "@/lib/schema";
import { APP_URL, SITE_URL } from "@/lib/site";
import { AccentText } from "@/components/AccentText";

const card = { background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" };
const secondary = { color: "var(--color-text-secondary)" };

/** Structured data for one free tool page: WebApplication, FAQPage and breadcrumbs. */
export function toolJsonLd(tool: FreeTool): string {
  return jsonLdHtml(
    {
      "@type": "WebApplication",
      name: `Draftly ${tool.name}`,
      url: `${SITE_URL}${tool.path}`,
      description: tool.description,
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      publisher: { "@id": `${SITE_URL}/#organization` },
      featureList: tool.checks.map((c) => c.label),
    },
    faqJsonLd(tool.faqs),
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Draftly", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Free tools", item: `${SITE_URL}${TOOLS_HUB.path}` },
        { "@type": "ListItem", position: 3, name: tool.name, item: `${SITE_URL}${tool.path}` },
      ],
    },
  );
}

/** "Content brief generator" → "content brief generator"; keeps "AI ..." and "FAQ ..." as written. */
const sentenceCase = (name: string) => (/^[A-Z][A-Z-]/.test(name) ? name : name[0].toLowerCase() + name.slice(1));

export function OtherTools({ exclude, heading = "More free tools" }: { exclude?: string; heading?: string }) {
  const others = FREE_TOOLS.filter((t) => t.path !== exclude);
  return (
    <section data-toc-skip className="mt-20" aria-labelledby="other-tools-heading">
      <h2 id="other-tools-heading" className="text-2xl font-medium mb-5" style={{ letterSpacing: "-0.02em" }}>
        {heading}
      </h2>
      <ul className={`grid gap-4 ${others.length === 4 ? "sm:grid-cols-2" : "sm:grid-cols-3"}`}>
        {others.map((t) => (
          <li key={t.path}>
            <a href={t.path} className="block h-full rounded-2xl p-5 card-depth" style={{ color: "var(--color-text-primary)" }}>
              <span className="eyebrow">Free tool</span>
              <span className="block font-semibold mt-2">{t.name}</span>
              <span className="block text-sm mt-1 leading-relaxed" style={secondary}>
                {t.description.split(". ")[0]}.
              </span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

export async function ToolPage({ tool, children }: { tool: FreeTool; children?: React.ReactNode }) {
  const generator = tool.kind === "generator";
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${APP_URL}/register${tool.registerIntent ? `?intent=${encodeURIComponent(tool.registerIntent)}` : ""}`;
  const detector = tool.kind === "detector";
  const ctaLabel = s.heroCtaText || "Generate Free Post";
  const slug = tool.path.split("/").pop() ?? "";

  return (
    <>
      <Header />
      <main className="pt-28 pb-24" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: toolJsonLd(tool) }} />
        <div className="container-draftly max-w-4xl">
          <nav aria-label="Breadcrumb" className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>
            <a href={TOOLS_HUB.path} className="underline underline-offset-2">
              Free tools
            </a>{" "}
            / {tool.name}
          </nav>
          {/* Wide screens: intro and the hero loop side by side, form below. Phones: intro, form, then the loop. */}
          <div className="grid grid-cols-[minmax(0,1fr)] gap-y-10 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-x-12">
          <header className="max-w-3xl order-1 lg:self-center">
            <p className="eyebrow mb-4">{tool.eyebrow}</p>
            <h1 className="page-heading mb-5" style={{ fontSize: "clamp(2.4rem, 6vw, 64px)" }}>
              {tool.h1}{" "}
              <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
                {tool.h1Accent}
              </AccentText>
            </h1>
            <p className="text-lg leading-relaxed" style={secondary}>
              {tool.intro}
            </p>
          </header>

          {/* The AI generators show a long sample under the form on phones, so their loop is desktop only. */}
          <div className={`order-3 mx-auto w-full max-w-[420px] lg:order-2 lg:max-w-none ${(generator && tool.id !== "faq-schema") || detector ? "hidden lg:block" : ""}`}>
            {detector ? (
              // No hero loop for the detector yet: the feature page's gauge drawing, on the "check" tint.
              <div
                className="graph-paper aspect-square rounded-3xl p-6 flex items-center"
                style={{ ...tintVars("check"), ["--tint-band" as string]: TINTS.check.bg, border: "1.5px solid #111", boxShadow: `8px 8px 0 ${TINTS.check.fill}` }}
              >
                <FeatureArt name="ai-detector" className="w-full" />
              </div>
            ) : (
              <ToolHeroVideo slug={slug} label={`Animation of the ${sentenceCase(tool.name)} working on a made-up plumber's website`} />
            )}
          </div>

          <div className="order-2 lg:order-3 lg:col-span-2">
            {detector ? (
              <AiContentDetector registerUrl={registerUrl} button={tool.input.button} />
            ) : tool.id === "faq-schema" ? (
              <FaqSchemaGenerator />
            ) : generator ? (
              <GeneratorTool
                tool={tool.id as "content-brief" | "blog-ideas"}
                label={tool.input.label}
                placeholder={tool.input.placeholder}
                button={tool.input.button}
                extra={tool.input.extra}
                enabled={aiToolsEnabled()}
                sampleBrief={tool.id === "content-brief" ? SAMPLE_BRIEF : undefined}
                sampleIdeas={tool.id === "blog-ideas" ? SAMPLE_IDEAS : undefined}
              />
            ) : (
              <ToolChecker tool={tool.id as CheckerId} label={tool.input.label} placeholder={tool.input.placeholder} button={tool.input.button} extra={tool.input.extra} />
            )}
          </div>
          </div>

          <section id="what-it-checks" className="mt-20">
            <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              {tool.checksHeading ?? (generator ? "What you get" : "What this checker looks at")}
            </h2>
            <ol className="grid sm:grid-cols-2 gap-3">
              {tool.checks.map((c, i) => (
                <li key={c.label} className="rounded-xl p-4 flex gap-3" style={card}>
                  <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-accent)" }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span>
                    <span className="block font-semibold">{c.label}</span>
                    <span className="block text-sm mt-0.5" style={secondary}>
                      {c.text}
                    </span>
                  </span>
                </li>
              ))}
            </ol>
            <p className="mt-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
              {tool.checksNote ??
                (generator
                  ? "Written by an AI model from what you enter and, if you add it, your homepage and sitemap. Read it with your own judgment before you use it."
                  : "Every check is a fixed rule run on your live pages. Results can differ from what a crawler sees if your site blocks automated visits.")}
            </p>
          </section>

          {children}

          {tool.sections?.map((sec) => (
            <section key={sec.id} id={sec.id} className="mt-20 max-w-3xl">
              <h2 className="text-3xl font-medium mb-5" style={{ letterSpacing: "-0.03em" }}>
                {sec.heading}
              </h2>
              <div className="space-y-4 text-lg leading-relaxed" style={secondary}>
                {sec.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
              {sec.sources?.length ? (
                <p className="mt-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
                  {sec.sources.length === 1 ? "Source: " : "Sources: "}
                  {sec.sources.map((src, i) => (
                    <span key={src.href}>
                      {i ? ", " : ""}
                      <a href={src.href} target="_blank" rel="noopener" className="underline underline-offset-2">
                        {src.label}
                      </a>
                    </span>
                  ))}
                </p>
              ) : null}
            </section>
          ))}

          <section
            id="how-draftly-helps"
            data-toc-skip
            className="mt-20 rounded-2xl p-6 sm:p-10"
            style={{ background: "var(--color-accent-muted)", border: "1px solid var(--color-border-accent)" }}
          >
            <h2 className="text-3xl font-medium mb-5" style={{ letterSpacing: "-0.03em" }}>
              {tool.draftly.title}
            </h2>
            <div style={secondary}>
              <Bullets items={tool.draftly.points} />
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
              <a href={registerUrl} className="btn btn-primary">
                {tool.draftly.button ?? ctaLabel}
              </a>
              <span className="text-sm" style={secondary}>
                {tool.draftly.cta}
              </span>
            </div>
            <p className="mt-4 text-xs" style={{ color: "var(--color-text-muted)" }}>
              Draftly is for <B>US businesses</B> and writes blog posts only. See <A href="/pricing">plans and prices</A>.
            </p>
          </section>

          <OtherTools exclude={tool.path} />

          <FaqList faqs={tool.faqs} />

          <div className="mt-10">
            <Byline verb="Updated" date={TOOLS_DATE.label} />
          </div>

          <KeepReading exclude={tool.path} topic={`${tool.name} ${tool.description} seo ai search`} />
        </div>
      </main>
      <Footer />
    </>
  );
}
