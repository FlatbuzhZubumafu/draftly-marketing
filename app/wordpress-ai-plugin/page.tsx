import type { Metadata } from "next";
import { Check } from "lucide-react";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, DarkCta, FaqList, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { ProductFigure } from "@/components/ProductFigure";
import { RelatedLinks } from "@/components/RelatedLinks";
import { WordPressPlans } from "@/components/WordPressPlans";
import { PILLARS } from "@/lib/related";
import { PAID_PLANS } from "@/lib/pricing";
import { imageObjectJsonLd } from "@/lib/product-shots";
import { jsonLdHtml } from "@/lib/schema";
import { WP_COMPARED_ON, WP_PLANS, WP_PLUGIN_DOWNLOAD_PATH, WP_PLUGIN_PATH, WP_PLUGIN_VERSION, WP_SHOTS, WP_SIGNUP_URL, WP_TOP_UPS } from "@/lib/wordpress-plugin";

export const revalidate = 3600;

// Landing page for the Draftly WordPress plugin. Primary keyword "ai plugin for
// wordpress" (Ahrefs US 200/mo, KD 0, TP 700); secondaries "wordpress ai plugins",
// "ai plugins for wordpress", "ai seo plugin for wordpress", "ai content editor",
// "humanize ai content" and "wordpress ai writer" (marketplace-plans/analysis.md).
// The plugin's Plans link and readme point here. The WordPress plans live on this
// page only. The share image is ./opengraph-image.tsx.
const TITLE = "AI Post Optimizer: The WordPress AI Plugin | Draftly";
const DESCRIPTION =
  "Draftly is an AI plugin for WordPress that checks your posts, suggests edits in your voice and saves the ones you approve as revisions you can revert.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: WP_PLUGIN_PATH },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "website", url: `${SITE_URL}${WP_PLUGIN_PATH}` },
};

const STEPS = [
  {
    title: "Connect your site",
    body: "Install the plugin, open Draftly > Connection and click Connect to Draftly. Approve the site in your Draftly account and you're done. No WordPress password or application password changes hands.",
    shots: [WP_SHOTS.connect],
  },
  {
    title: "Check a post, then review each edit",
    body: "Check scores a post for human voice, SEO and readability. Optimize suggests edits in your brand voice, each one shown as the sentence before and after. Untick anything you don't like.",
    shots: [WP_SHOTS.review],
  },
  {
    title: "Approve it as a revision, revert any time",
    body: "Approved edits are saved as a normal WordPress revision. Changed your mind? Revert restores the version from before Draftly touched the post, SEO title and description included.",
    shots: [WP_SHOTS.approved, WP_SHOTS.reverted],
  },
];

const FIXES: { title: string; body: string; soon?: boolean }[] = [
  {
    title: "Writing that sounds machine-made",
    body: "Throat-clearing openers, filler phrases and stiff transitions get flagged, then rewritten in your voice. Each post gets a 0 to 100 human-voice score.",
  },
  {
    title: "Hard-to-read sentences",
    body: "The readability score flags hard-to-read passages, and Optimize suggests plainer versions. You see the new score after you approve.",
  },
  {
    title: "Weak on-page SEO",
    body: "The SEO score points at what's missing, and Optimize suggests the fixes alongside the writing edits.",
  },
  {
    title: "Meta titles and descriptions",
    body: "Written straight into Yoast SEO, Rank Math or All in One SEO, so they show up where you already edit them.",
  },
  {
    title: "Bulk meta for the whole site",
    body: "Generate missing or weak meta titles and descriptions for many posts at once, with the same review step.",
    soon: true,
  },
  {
    title: "Internal links",
    body: "Link suggestions drawn from your own pages, so old posts point readers to the newer ones.",
    soon: true,
  },
  {
    title: "De-AI your own drafts",
    body: "Paste a draft you wrote with AI help and get it back reading like you wrote it. It already runs in the Draftly web editor; the button inside the plugin is next.",
    soon: true,
  },
  {
    title: "Image alt text",
    body: "Descriptive alt text for the images in your posts, on the Grow plan.",
    soon: true,
  },
];

const SEO_PLUGINS = [
  { name: "Yoast SEO", where: "The SEO title and meta description fields in the Yoast box on each post" },
  { name: "Rank Math", where: "The title and description in Rank Math's snippet editor on each post" },
  { name: "All in One SEO", where: "AIOSEO's title and description for each post (version 4 or later)" },
  { name: "No SEO plugin", where: "The post excerpt is used as the description" },
];

const COMPETITORS = [
  {
    name: "Draftly",
    price: "Free plan. Paid from $4 a month billed yearly ($48), or $5 monthly",
    ai: "Scores existing posts for human voice, SEO and readability, suggests sentence-level edits in your brand voice, saves approved edits as a revision with one-click revert. Works alongside Yoast SEO, Rank Math or AIOSEO.",
    source: null,
  },
  {
    name: "Rank Math Content AI",
    price: "€5.99, €10.99 or €16.99 a month, billed yearly. The Starter tier includes 15 articles, 500 AI fixes and 100 bulk meta",
    ai: "AI writing and SEO suggestions inside Rank Math, including bulk-generated SEO titles and descriptions.",
    source: { href: "https://rankmath.com/content-ai/", label: "rankmath.com/content-ai" },
  },
  {
    name: "Yoast SEO Premium",
    price: "$118.80 a year",
    ai: "AI Generate for titles and meta descriptions, AI Optimize suggestions for selected SEO checks that you apply, dismiss or edit, AI Summarize and an AI bulk editor.",
    source: { href: "https://yoast.com/ai-features/", label: "yoast.com/ai-features" },
  },
  {
    name: "GetGenie",
    price: "Starter at $9.99 a month, or $5.50 a month billed yearly, for 20,000 AI words a month",
    ai: "An AI writing assistant for WordPress, with plans sold by the number of AI words.",
    source: { href: "https://getgenie.ai/pricing/", label: "getgenie.ai/pricing" },
  },
];

const FAQS: Faq[] = [
  {
    q: "Does it publish without asking?",
    a: "No. Optimize only suggests edits, and nothing on your site changes until you approve them. Each approval is saved as a WordPress revision you can revert. A post reaches your site from Draftly only when you send it from the Draftly app yourself, or when you turn on scheduled publishing on Draftly's Autopilot plan.",
  },
  {
    q: "Will it change my SEO plugin settings?",
    a: "No. The plugin writes only the SEO title and meta description (and the focus keyword, when Draftly sends one) on posts you approve, in the fields Yoast SEO, Rank Math or All in One SEO already use. Sitemaps, schema, redirects and every other setting stay as they are. Revert puts the previous title and description back.",
  },
  {
    q: "What data is sent to Draftly?",
    a: "Nothing until an administrator clicks Connect to Draftly. Connecting sends your site address, REST API address, the Connection screen's address and the plugin and WordPress versions. When someone clicks Check or Optimize, that post's title, address and content are sent. Approving edits sends the post's current content and the approved edits. The Connection screen asks Draftly for your account email, plan and remaining credits, and disconnecting tells Draftly to revoke the site's key. The plugin collects no analytics or tracking data.",
  },
  {
    q: "Is it in the WordPress plugin directory?",
    a: "Not yet. The plugin is in beta and coming to the WordPress plugin directory. Create a free Draftly account to join the beta.",
  },
  {
    q: "How do I undo a change?",
    a: "Click Revert next to the post on Draftly > Optimize posts. It restores the version from just before Draftly's last change. The change is also in the post's normal revision history.",
  },
  {
    q: "Does it need my WordPress password?",
    a: "No. The connection uses a key that only your site and Draftly know, and every request is signed with it. Disconnect any time from Draftly > Connection or from your Draftly account.",
  },
  {
    q: "Can it humanize AI content I wrote?",
    a: "That is what De-AI is for. It rewrites a draft with Claude Sonnet 5.5 so it reads like you: plain sentences, your vocabulary, no filler. It runs in the Draftly web editor today and is coming to the plugin. It is built for your readers and makes no promise about AI detectors.",
  },
  {
    q: "Can it write new posts too?",
    a: `The plugin plans cover the posts you already have. Writing new posts, topic ideas from industry news, AI images and scheduled publishing are on Draftly's main plans, from $${PAID_PLANS[0].price} a month.`,
  },
];

export default function WordPressAiPluginPage() {
  const softwareApp = {
    "@type": "SoftwareApplication",
    name: "Draftly AI Post Optimizer for WordPress",
    url: `${SITE_URL}${WP_PLUGIN_PATH}`,
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "WordPress plugin",
    operatingSystem: "WordPress 6.2 or later",
    softwareVersion: WP_PLUGIN_VERSION,
    downloadUrl: `${SITE_URL}${WP_PLUGIN_DOWNLOAD_PATH}`,
    description: DESCRIPTION,
    publisher: { "@id": `${SITE_URL}/#organization` },
    screenshot: Object.values(WP_SHOTS).map(imageObjectJsonLd),
    offers: WP_PLANS.map((p) => ({
      "@type": "Offer",
      name: p.name,
      price: p.monthly.toFixed(2),
      priceCurrency: "USD",
      description: p.pitch,
      url: `${SITE_URL}${WP_PLUGIN_PATH}#pricing`,
      ...(p.monthly > 0
        ? {
            priceSpecification: [
              { "@type": "UnitPriceSpecification", price: p.monthly.toFixed(2), priceCurrency: "USD", unitText: "MONTH" },
              { "@type": "UnitPriceSpecification", price: p.yearly.toFixed(2), priceCurrency: "USD", unitText: "YEAR" },
            ],
          }
        : {}),
    })),
  };

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdHtml(softwareApp, faqJsonLd(FAQS)) }} />

        <section className="container-draftly max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 lg:gap-14 items-center">
          <div className="min-w-0">
            <p className="text-sm font-semibold uppercase mb-4" style={{ color: "var(--color-accent)", letterSpacing: "0.08em" }}>
              Draftly AI Post Optimizer for WordPress, in beta
            </p>
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              The AI post optimizer{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                for WordPress
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
              Draftly AI Post Optimizer is the AI plugin for WordPress that fixes the posts you already have. Your SEO
              plugin scores your posts. Draftly rewrites the weak sentences in your voice, and you approve every change.
            </p>
            <p className="leading-relaxed mb-8" style={{ color: "var(--color-text-secondary)" }}>
              Check any post on your site, review each suggested edit side by side and approve the ones
              you want. They&apos;re saved as a WordPress revision, so Revert is always one click away. Nothing goes live
              without your approval.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href={WP_SIGNUP_URL} className="btn btn-primary">
                Join the beta, get it free
              </a>
              <a href={WP_PLUGIN_DOWNLOAD_PATH} className="btn btn-secondary" download>
                Download the plugin (v{WP_PLUGIN_VERSION})
              </a>
              <a href="#pricing" className="btn btn-secondary">
                See plans
              </a>
            </div>
            <p className="mt-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
              To install: in WordPress go to Plugins, Add New, Upload Plugin, choose the zip, then Activate and click
              Connect to Draftly. Coming to the WordPress plugin directory. Works with Yoast SEO, Rank Math and All in
              One SEO.
            </p>
          </div>
          <ProductFigure shot={WP_SHOTS.review} className="min-w-0" />
        </section>

        <section id="how-it-works" className="container-draftly max-w-5xl mt-24">
          <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
            How the plugin works
          </h2>
          <p className="mb-10 max-w-3xl leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Three steps, all inside wp-admin. The screenshots are the plugin running on Roof Repair Blog, an example
            test site.
          </p>
          <ol className="space-y-16">
            {STEPS.map((step, i) => (
              <li key={step.title} className="grid grid-cols-1 md:grid-cols-[1fr_1.6fr] gap-6 md:gap-10 items-start">
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--color-accent)" }}>
                    Step {i + 1}
                  </p>
                  <h3 className="mt-1 text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    {step.body}
                  </p>
                </div>
                <div className="space-y-6 min-w-0">
                  {step.shots.map((s) => (
                    <ProductFigure key={s.src} shot={s} />
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section id="what-it-fixes" className="container-draftly max-w-5xl mt-24">
          <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
            What it fixes on posts you already have
          </h2>
          <p className="mb-10 max-w-3xl leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Most WordPress AI plugins are built to write new posts. Draftly works as an AI content editor for the ones
            already on your site, the posts that used to rank and the drafts that read like a chatbot wrote them.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FIXES.map((f) => (
              <div key={f.title} className="p-6 card-depth" style={{ background: "var(--color-bg-surface)" }}>
                <h3 className="font-semibold mb-2">
                  {f.title}
                  {f.soon ? (
                    <span className="ml-2 inline-block px-1.5 rounded text-[11px] font-semibold align-middle" style={{ background: "#fff3d6", color: "#7a5300" }}>
                      Coming soon
                    </span>
                  ) : null}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                  {f.body}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="seo-plugins" className="container-draftly max-w-5xl mt-24 grid grid-cols-1 md:grid-cols-[1fr_1.3fr] gap-10">
          <div>
            <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
              Works with Yoast, Rank Math and AIOSEO
            </h2>
            <div className="space-y-4 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              <p>
                Keep the SEO plugin you have. Draftly reads and writes meta titles and descriptions in the same fields
                it uses, so they show up in its snippet preview like any title you typed yourself.
              </p>
              <p>
                Think of it as the AI SEO plugin for WordPress that sits on top: your SEO plugin flags the problem,
                Draftly writes the fix, and you approve it.
              </p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
                  <th className="text-left py-2 pr-4 font-semibold">Your SEO plugin</th>
                  <th className="text-left py-2 font-semibold">Where Draftly writes the meta</th>
                </tr>
              </thead>
              <tbody>
                {SEO_PLUGINS.map((p) => (
                  <tr key={p.name} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td className="py-3 pr-4 align-top font-semibold whitespace-nowrap">{p.name}</td>
                    <td className="py-3 align-top" style={{ color: "var(--color-text-secondary)" }}>{p.where}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="pricing" className="container-draftly max-w-6xl mt-24">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              WordPress plugin plans
            </h2>
            <p className="leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              Every plan gets the same plugin. Plans set how much you can use each month. Billed by Draftly through
              Stripe.
            </p>
          </div>

          <WordPressPlans />

          <div className="mt-8 max-w-3xl mx-auto space-y-3 text-sm leading-relaxed text-center" style={{ color: "var(--color-text-muted)" }}>
            <p>{WP_TOP_UPS}</p>
            <p>
              <B>Coming soon</B>{" "}marks features in your plan that aren&apos;t in the plugin yet. Version 1.0.0 does
              Check, Optimize with review and approval, Revert, and meta titles and descriptions for Yoast SEO, Rank
              Math and All in One SEO. De-AI already runs in the Draftly web editor.
            </p>
            <p>
              Want Draftly to write new posts as well? Topic ideas from your industry&apos;s news, AI images and
              autopilot publishing are on the <A href="/pricing">main Draftly plans</A>, from ${PAID_PLANS[0].price} a
              month.
            </p>
          </div>
        </section>

        <section id="compare" className="container-draftly max-w-5xl mt-24">
          <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
            How it compares to other AI plugins for WordPress
          </h2>
          <p className="mb-8 max-w-3xl leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            Prices and features as each vendor listed them in {WP_COMPARED_ON}. Check their pages for current terms.
            If you mainly want a WordPress AI writer for brand-new posts, GetGenie or Rank Math&apos;s Content AI may suit
            you better.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[680px]">
              <thead>
                <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
                  <th className="text-left py-2 pr-4 font-semibold">Tool</th>
                  <th className="text-left py-2 pr-4 font-semibold">Price</th>
                  <th className="text-left py-2 pr-4 font-semibold">What the AI does</th>
                  <th className="text-left py-2 font-semibold">Source</th>
                </tr>
              </thead>
              <tbody>
                {COMPETITORS.map((c) => (
                  <tr key={c.name} style={{ borderBottom: "1px solid var(--color-border)" }}>
                    <td className="py-3 pr-4 align-top font-semibold whitespace-nowrap">
                      {c.name === "Draftly" ? (
                        <span className="inline-flex items-center gap-1.5">
                          <Check className="w-4 h-4" style={{ color: "var(--color-accent)" }} aria-hidden="true" />
                          {c.name}
                        </span>
                      ) : (
                        c.name
                      )}
                    </td>
                    <td className="py-3 pr-4 align-top" style={{ color: "var(--color-text-secondary)" }}>{c.price}</td>
                    <td className="py-3 pr-4 align-top" style={{ color: "var(--color-text-secondary)" }}>{c.ai}</td>
                    <td className="py-3 align-top whitespace-nowrap">
                      {c.source ? (
                        <a href={c.source.href} rel="nofollow noopener" target="_blank" style={{ color: "var(--color-accent)" }}>
                          {c.source.label}
                        </a>
                      ) : (
                        <a href="#pricing" style={{ color: "var(--color-accent)" }}>
                          Plans above
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="container-draftly max-w-5xl">
          <FaqList faqs={FAQS} />
          <p className="mt-6 max-w-3xl text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            Draftly&apos;s <A href="/terms-and-conditions">Terms and Conditions</A> and{" "}
            <A href="/privacy-policy">Privacy Policy</A> apply to the data the plugin sends to Draftly.
          </p>

          <div className="max-w-3xl">
            <RelatedLinks items={PILLARS.filter((p) => ["/seo-copywriting", "/ai-copywriter", "/mcp", "/best-ai-for-writing"].includes(p.href))} />
          </div>

          <DarkCta
            title="Fix one post free"
            body="Create a free Draftly account to join the beta. Your first post optimization is free, with no credit card."
            href={WP_SIGNUP_URL}
            label="Join the beta, get it free"
            secondary={{ href: "#pricing", label: "See plans" }}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
