import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, DarkCta, FaqList, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { ProductFigure } from "@/components/ProductFigure";
import { RelatedLinks } from "@/components/RelatedLinks";
import { WordPressCompare } from "@/components/WordPressCompare";
import { WordPressPlans } from "@/components/WordPressPlans";
import { PILLARS } from "@/lib/related";
import { PAID_PLANS } from "@/lib/pricing";
import { imageObjectJsonLd } from "@/lib/product-shots";
import { jsonLdHtml } from "@/lib/schema";
import { WP_PLANS, WP_PLUGIN_DOWNLOAD_PATH, WP_PLUGIN_PATH, WP_PLUGIN_VERSION, WP_SHOTS, WP_TOP_UPS } from "@/lib/wordpress-plugin";

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
    body: "In WordPress, go to Plugins, Add New, Upload Plugin and choose the zip you downloaded, then Activate. Open Draftly > Connection, click Connect to Draftly and approve the site in your free Draftly account. No WordPress password or application password changes hands.",
    shots: [WP_SHOTS.connect],
  },
  {
    title: "Check a post, then review each edit",
    body: "Check scores a post for human voice and readability. Optimize suggests edits in your brand voice, each one shown as the sentence before and after. Untick anything you don't like.",
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
    title: "Old posts nobody has time for",
    body: "Turn on auto mode and Draftly works through your published posts a few at a time, at Safe or Full. Every change is a revision you can revert.",
  },
  {
    title: "Missing meta titles and descriptions",
    body: "Auto mode fills them in Yoast SEO, Rank Math or All in One SEO, so they show up where you already edit them.",
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


const FAQS: Faq[] = [
  {
    q: "Does it publish without asking?",
    a: "No. By default Optimize only suggests edits, and nothing on your site changes until you approve them. On a paid plan you can turn on auto mode, which applies edits to your posts by itself at the level you choose: Safe (writing-rule fixes, AI-sounding phrases, headings, missing SEO titles and descriptions) or Full (everything Optimize suggests). It works only on posts, never pages, and stays within your plan's monthly allowance. Every change, approved or automatic, is saved as a WordPress revision you can revert. A post reaches your site from Draftly only when you send it from the Draftly app yourself, or when you turn on scheduled publishing on Draftly's Autopilot plan.",
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
    q: "Can I use it outside the United States?",
    a: "Not yet. Draftly is available to businesses in the United States only, so new accounts and new plugin connections have to be set up from the US. If you're elsewhere, the sign-up page lets you leave your email and we'll tell you when Draftly opens in your country.",
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
            <div className="mt-8">
              <a href={WP_PLUGIN_DOWNLOAD_PATH} className="btn btn-primary" download data-download-location="hero" data-plugin-version={WP_PLUGIN_VERSION}>
                Download for Free
              </a>
            </div>
            <p className="mt-4 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Version {WP_PLUGIN_VERSION}. Works with Yoast SEO, Rank Math and All in One SEO.
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Available to businesses in the United States only.
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
            <p>Available to businesses in the United States only.</p>
            <p>
              <B>Coming soon</B>{" "}marks features in your plan that aren&apos;t in the plugin yet. Version {WP_PLUGIN_VERSION}{" "}
              does Check, Optimize with review and approval, Revert, auto mode, and SEO titles and descriptions in Yoast
              SEO, Rank Math and All in One SEO. De-AI already runs in the Draftly web editor.
            </p>
            <p>
              Want Draftly to write new posts as well? Topic ideas from your industry&apos;s news, AI images and
              autopilot publishing are on the <A href="/pricing">main Draftly plans</A>, from ${PAID_PLANS[0].price} a
              month.
            </p>
          </div>
        </section>

        <section id="compare" className="container-draftly max-w-6xl mt-24">
          <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
            Draftly vs. Rank Math, Yoast, AIOSEO and GetGenie
          </h2>
          <div className="mb-8 max-w-3xl space-y-3 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
            <p>
              If you want one plugin that runs your whole SEO setup, with AI meta in bulk, get Rank Math or Yoast. If
              you mostly want AI to write new posts, GetGenie and AIOSEO&apos;s AI credits are built for that.
            </p>
            <p>
              Pick Draftly when the posts you already have need fixing. It edits them sentence by sentence in your
              voice, shows every edit before and after, and saves it as a revision you can revert. It runs next to the
              SEO plugin you have, and ${WP_PLANS.find((p) => p.yearly > 0)?.yearly} a year is the lowest entry price
              here. The SEO plugins do a lot more than AI
              for that money, though.
            </p>
          </div>
          <WordPressCompare />
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
            title="Try it on up to 5 posts free"
            body="Download the plugin, connect it to a free Draftly account and optimize up to 5 posts. No credit card."
            href={WP_PLUGIN_DOWNLOAD_PATH}
            label="Download for Free"
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
