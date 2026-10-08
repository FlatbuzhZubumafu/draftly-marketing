import type { Metadata } from "next";
import { DEFAULT_OG_IMAGE } from "@/lib/site";
import { Check } from "lucide-react";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CopyUrl } from "@/components/CopyUrl";
import { MCP_URL, TOOLS, toolPlans } from "@/lib/mcp";

export const revalidate = 3600;

const TITLE = "SEO MCP Server for Claude and ChatGPT | Draftly";
const DESCRIPTION =
  "Draftly's SEO MCP server connects Claude, ChatGPT or Cursor to live keyword, SERP and People Also Ask data plus your brand voice. Included on every paid plan.";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: "/mcp" },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article", url: "https://www.draftly.blog/mcp", images: [DEFAULT_OG_IMAGE] },
};

const ALLOWANCES = [
  { plan: "Solopreneur", price: "$29/month", calls: "40 a month", data: "Keyword data" },
  { plan: "Growth", price: "$69/month", calls: "150 a month", data: "Keyword, live Google results and domain data" },
  { plan: "Autopilot", price: "$100/month", calls: "300 a month", data: "Every dataset, including keyword gaps and backlinks" },
];

const CLIENTS: { name: string; steps: React.ReactNode[] }[] = [
  {
    name: "Claude (Web and Desktop App)",
    steps: [
      <>Open <strong>Settings</strong>, then <strong>Connectors</strong>, then <strong>Add custom connector</strong>.</>,
      <>Name it Draftly and paste the connector URL above. Click <strong>Add</strong>.</>,
      <>Click <strong>Connect</strong>, sign in to Draftly and approve the connection.</>,
      <>Start a new chat and ask Claude to use Draftly.</>,
    ],
  },
  {
    name: "ChatGPT",
    steps: [
      <>Open <strong>Settings</strong>, then <strong>Apps and Connectors</strong>. Turn on developer mode under the advanced settings if your workspace asks for it.</>,
      <>Create a connector, paste the connector URL above and choose OAuth sign-in.</>,
      <>Sign in to Draftly and approve the connection.</>,
    ],
  },
  {
    name: "Cursor",
    steps: [
      <>Open <strong>Settings</strong>, then the MCP section, and add a new server. Or add this to <code>~/.cursor/mcp.json</code>:</>,
      <pre key="cursor" className="text-xs sm:text-sm rounded-lg p-3 overflow-x-auto" style={{ background: "#111", color: "#eee" }}>{`{
  "mcpServers": {
    "draftly": { "url": "${MCP_URL}" }
  }
}`}</pre>,
      <>Cursor opens Draftly&apos;s sign-in page. Approve the connection.</>,
    ],
  },
  {
    name: "Claude Code",
    steps: [
      <>Run this in your terminal:</>,
      <pre key="cc" className="text-xs sm:text-sm rounded-lg p-3 overflow-x-auto" style={{ background: "#111", color: "#eee" }}>{`claude mcp add --transport http draftly ${MCP_URL}`}</pre>,
      <>In Claude Code, type <code>/mcp</code>, pick draftly and choose <strong>Authenticate</strong>. Your browser opens Draftly&apos;s sign-in page.</>,
    ],
  },
];

const PROMPTS = [
  "Use Draftly to pull my brand voice, then research the keyword “roof replacement cost” and outline a post that can rank for it.",
  "List my last 5 Draftly posts and tell me which one has the weakest SEO score and why.",
  "Check the live Google results for “best crm for realtors” and tell me what the top pages cover that my draft does not.",
  "Find my competitors and the keywords they rank for that my site is missing. Pick three to write about this month.",
];

const FAQS = [
  {
    q: "What is the Draftly MCP connector?",
    a: "It is a Model Context Protocol server at app.draftly.blog/mcp. Once you connect it, Claude, ChatGPT or Cursor can read your Draftly brand voice, posts and topic ideas, and look up live SEO data while you plan and write.",
  },
  {
    q: "Which plans include it?",
    a: "Every paid plan: Solopreneur, Growth and Autopilot. Free accounts can start the connection, and the sign-in screen offers an upgrade before anything connects.",
  },
  {
    q: "Where does the SEO data come from?",
    a: "Keyword, Google results, domain and backlink data come from DataForSEO. A lookup anyone ran in the last 30 days is served from cache and does not use a data call.",
  },
  {
    q: "What happens when I run out of data calls?",
    a: "The tools tell your assistant how many calls are left. Your allowance resets with your billing period, and a data pack adds 100 calls for $10. Purchased calls carry over every month while you are on a paid plan.",
  },
  {
    q: "Can the connector see my CMS passwords or API keys?",
    a: "No. The connector reads brand settings, posts, topics and SEO data. Your WordPress, Shopify and other publishing credentials stay on Draftly's servers.",
  },
  {
    q: "How do I disconnect?",
    a: "Remove the Draftly connector in your AI app's connector settings. Your Draftly account and posts stay as they are.",
  },
];

export default async function McpPage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: TITLE,
        description: DESCRIPTION,
        url: "https://www.draftly.blog/mcp",
        datePublished: "2026-10-06",
        dateModified: "2026-10-08",
        author: { "@type": "Person", name: "Preston Vawdrey", url: "https://prestonvawdrey.com" },
        publisher: { "@type": "Organization", name: "Draftly", url: "https://www.draftly.blog" },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <article className="container-draftly max-w-4xl">
          <header className="max-w-3xl">
            <h1 className="page-heading mb-6" style={{ fontSize: "clamp(2.1rem, 5vw, 56px)" }}>
              Draftly in Your AI:{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                The SEO MCP Connector
              </em>
            </h1>
            <p className="text-lg mb-8" style={{ color: "var(--color-text-secondary)" }}>
              Paste one URL into Claude, ChatGPT or Cursor. Your assistant gets your brand voice, your posts and your
              topic ideas, plus live keyword, Google and backlink data, so it plans and writes like someone who knows your
              business. Included on every paid plan.
            </p>
            <p className="text-sm font-semibold mb-2">Connector URL</p>
            <CopyUrl url={MCP_URL} />
          </header>

          <section id="what-is-an-seo-mcp" className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              What Is an SEO MCP?
            </h2>
            <div className="space-y-5 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              <p>
                An SEO MCP is a connector that lets an AI assistant like Claude or ChatGPT pull live SEO data, such as
                keyword volumes, SERPs and People Also Ask questions, while it writes. MCP stands for Model Context
                Protocol, the open standard these assistants use to call outside tools.
              </p>
              <p>
                Draftly&apos;s SEO MCP server adds your own context to that data: your brand voice, your published posts and
                your topic ideas. Your assistant can check what people search for, see what already ranks and plan a post
                around both, all in one chat.
              </p>
            </div>
          </section>

          <section className="mt-20">
            <h2 className="text-3xl font-medium mb-8" style={{ letterSpacing: "-0.03em" }}>
              Connect in Two Minutes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {CLIENTS.map((c) => (
                <div key={c.name} className="p-6 card-depth" style={{ background: "var(--color-bg-surface)" }}>
                  <h3 className="font-semibold mb-4">{c.name}</h3>
                  <ol className="space-y-3 text-sm leading-relaxed list-decimal pl-5" style={{ color: "var(--color-text-secondary)" }}>
                    {c.steps.map((step, i) =>
                      typeof step === "object" && step !== null && "type" in step && step.type === "pre" ? (
                        <li key={i} className="list-none -ml-5">{step}</li>
                      ) : (
                        <li key={i}>{step}</li>
                      ),
                    )}
                  </ol>
                </div>
              ))}
            </div>
            <p className="mt-6 text-sm" style={{ color: "var(--color-text-muted)" }}>
              Sign-in uses OAuth. The approval screen shows which app is asking and where it sends you back to, and you
              approve each app once.
            </p>
          </section>

          <section className="mt-20">
            <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              What Your Assistant Can Do
            </h2>
            <p className="mb-8" style={{ color: "var(--color-text-secondary)" }}>
              Ten tools, all read-only. Tools marked with a data call use your monthly SEO data allowance.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[560px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
                    <th className="text-left py-2 pr-4 font-semibold">Tool</th>
                    <th className="text-left py-2 pr-4 font-semibold">What It Returns</th>
                    <th className="text-left py-2 pr-4 font-semibold">Plan</th>
                    <th className="text-left py-2 font-semibold">Data Call</th>
                  </tr>
                </thead>
                <tbody>
                  {TOOLS.map((t) => (
                    <tr key={t.name} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td className="py-3 pr-4 align-top font-mono text-xs whitespace-nowrap">{t.name}</td>
                      <td className="py-3 pr-4 align-top" style={{ color: "var(--color-text-secondary)" }}>{t.does}</td>
                      <td className="py-3 pr-4 align-top whitespace-nowrap" style={{ color: "var(--color-text-secondary)" }}>
                        {toolPlans(t.plan)}
                      </td>
                      <td className="py-3 align-top">
                        {t.data ? <Check className="w-4 h-4" style={{ color: "var(--color-accent)" }} aria-label="Uses a data call" /> : null}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section id="mcp-for-copywriting" className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              MCP for Copywriting
            </h2>
            <div className="space-y-5 leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
              <p>
                Draftly&apos;s connector also covers the writing side. The get_brand_context tool hands your assistant the
                tone sliders, vocabulary, audience notes and writing samples Draftly built from your website. With that
                loaded, Claude or ChatGPT can draft a blog post, a landing page or an email that sounds like your brand.
              </p>
              <p>
                Posts written in Draftly follow the same rules we used in our{" "}
                <a href="/best-ai-for-writing" style={{ color: "var(--color-accent)" }}>
                  test of which AI model writes best
                </a>
                , and each one gets a 0 to 100 human-voice score from a 13-point check for phrasing that reads as
                machine-written. The list_posts and get_post tools bring those posts and scores into your chat, so your
                assistant can match what already works on your site.
              </p>
              <p>
                If you would rather have Draftly write and publish the posts itself, see{" "}
                <a href="/ai-copywriter" style={{ color: "var(--color-accent)" }}>
                  how Draftly works as an AI copywriter
                </a>
                .
              </p>
            </div>
          </section>

          <section className="mt-20">
            <h2 className="text-3xl font-medium mb-8" style={{ letterSpacing: "-0.03em" }}>
              Try These Prompts
            </h2>
            <ul className="space-y-3">
              {PROMPTS.map((p) => (
                <li key={p} className="p-4 rounded-xl text-sm leading-relaxed" style={{ background: "var(--color-bg-subtle)", color: "var(--color-text-secondary)" }}>
                  {p}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-20">
            <h2 className="text-3xl font-medium mb-3" style={{ letterSpacing: "-0.03em" }}>
              SEO Data by Plan
            </h2>
            <p className="mb-8" style={{ color: "var(--color-text-secondary)" }}>
              Each fresh lookup uses one data call. Allowances reset with your billing period. Need more? A data pack adds
              100 calls for $10, and purchased calls carry over every month while you are on a paid plan.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[480px]">
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--color-border-strong)" }}>
                    <th className="text-left py-2 pr-4 font-semibold">Plan</th>
                    <th className="text-left py-2 pr-4 font-semibold">Data Calls</th>
                    <th className="text-left py-2 font-semibold">Datasets</th>
                  </tr>
                </thead>
                <tbody>
                  {ALLOWANCES.map((a) => (
                    <tr key={a.plan} style={{ borderBottom: "1px solid var(--color-border)" }}>
                      <td className="py-3 pr-4">
                        <span className="font-semibold">{a.plan}</span>{" "}
                        <span style={{ color: "var(--color-text-muted)" }}>{a.price}</span>
                      </td>
                      <td className="py-3 pr-4" style={{ color: "var(--color-text-secondary)" }}>{a.calls}</td>
                      <td className="py-3" style={{ color: "var(--color-text-secondary)" }}>{a.data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-20 max-w-3xl">
            <h2 className="text-3xl font-medium mb-8" style={{ letterSpacing: "-0.03em" }}>
              Questions
            </h2>
            <div className="space-y-6">
              {FAQS.map((f) => (
                <div key={f.q}>
                  <h3 className="font-semibold mb-2">{f.q}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>{f.a}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-24 text-center">
            <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
              Start With One Free Post
            </h2>
            <p className="mb-8" style={{ color: "var(--color-text-secondary)" }}>
              Paste your URL and Draftly writes your first post. Upgrade to connect your AI.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <a href={registerUrl} className="btn btn-primary">{s.heroCtaText}</a>
              <a href="/pricing" className="btn btn-secondary">See Pricing</a>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
