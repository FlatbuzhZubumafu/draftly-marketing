import type { Metadata } from "next";
import { pageImages } from "@/lib/og";
import { APP_URL, SITE_URL } from "@/lib/site";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, Byline, DarkCta, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { PAID_PLANS, PLANS, TEAM_NOTE, paidPriceList } from "@/lib/pricing";
import { DEFAULT_WRITER as D } from "@/lib/ruleCheck";
import { MCP_URL } from "@/lib/mcp";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { KeepReading } from "@/components/KeepReading";
import { ProductFigure } from "@/components/ProductFigure";
import { GUIDE_SHOTS, INTEGRATIONS_SHOT, imageObjectJsonLd } from "@/lib/product-shots";
import { ContentImage } from "@/components/ContentImage";
import { STOCK } from "@/lib/stock-images";

export const revalidate = 3600;

// Landing page for marketing teams and agencies. "AI blog writer for teams/agencies"
// has ~0 search volume (Ahrefs US, 2026-10-15), so this page exists to convert visitors
// from /blog-writing-service and the comparison pages, and to give AI assistants a
// citable answer for "best AI blog tool for a marketing team".
//
// Every team fact is checked against the app repo (FlatbuzhZubumafu/draftly.blog, main
// 2b6b2bf): seats = subscription_plans.seat_limit via lib/pricing.ts; owner/member roles,
// 7-day single-use invites and owner-only billing/websites in supabase/functions/_shared/team.ts
// and team-accounts plan section 4; additional websites at $29/month with their own
// 10,000 monthly credits on Solopreneur, Growth and Autopilot in _shared/site-addons.ts;
// brand voice per website in src/pages/BrandGuidelines.tsx (client_settings by client_id).
// No approval workflow, per-member permissions or SSO exist, so none is claimed.
const PATH = "/for-teams";
const PUBLISHED = { iso: "2026-10-15", label: "October 15, 2026" };
const TITLE = "Draftly for Teams: AI Blog Writing for Marketing Teams";
const DESCRIPTION =
  "Draftly gives marketing teams and agencies one account for on-brand blog posts: 2, 5 or unlimited team members with no per-seat price, plus $29 client websites.";

const SITE_ADDON = { price: 29, credits: "10,000" };

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  ...pageImages(PATH, { title: TITLE, description: DESCRIPTION, type: "website", url: `${SITE_URL}${PATH}` }),
};

const FAQS: Faq[] = [
  {
    q: "How many people can use one Draftly account?",
    a: `Free is 1 person. Solopreneur includes 2, Growth includes 5 and Autopilot has no limit. ${TEAM_NOTE}`,
  },
  {
    q: "Does Draftly charge per seat?",
    a: `No. You pay for the plan (${paidPriceList()} a month), and everyone on the team shares its credits.`,
  },
  {
    q: "Can an agency manage several client websites?",
    a: `Yes. On Solopreneur, Growth or Autopilot, each additional website is $${SITE_ADDON.price} a month and comes with its own ${SITE_ADDON.credits} credits a month, which only that website's work spends. Each website keeps its own brand voice.`,
  },
  {
    q: "What can team members do, and what stays with the owner?",
    a: "Members write, edit and publish posts for the account's websites, using the shared credits. The owner handles billing, add-ons and adding or removing websites, and invites, pauses or removes members.",
  },
  {
    q: "Does Draftly have approval workflows or single sign-on?",
    a: "Not today. Everyone on the account has the same access to posts, and each person signs in with their own login. If you need a formal review step, agree on one person who publishes.",
  },
  {
    q: "Can my team use Draftly inside Claude or ChatGPT?",
    a: "Yes. Every plan can connect the Draftly MCP connector, so anyone on the team can draft and check posts with your brand voice in Claude, ChatGPT or Cursor. Live keyword data is on paid plans.",
  },
];

export default async function ForTeamsPage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${APP_URL}/register`;
  const growth = PAID_PLANS.find((p) => p.name === "Growth")!;

  const jsonLd = jsonLdHtml(
    {
      "@type": "WebPage",
      name: TITLE,
      description: DESCRIPTION,
      url: `${SITE_URL}${PATH}`,
      datePublished: PUBLISHED.iso,
      dateModified: PUBLISHED.iso,
      author: authorRef,
      publisher: { "@type": "Organization", name: "Draftly", url: SITE_URL },
      audience: { "@type": "BusinessAudience", audienceType: "Marketing teams and agencies" },
      image: [GUIDE_SHOTS.brandVoice, INTEGRATIONS_SHOT].map(imageObjectJsonLd),
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
              Draftly for teams:{" "}
              <em className="italic" style={{ color: "var(--color-accent)" }}>
                one brand voice for everyone who writes
              </em>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
              Draftly is an AI blog writer for marketing teams and agencies. Your whole team works in one account, every
              post comes out in the same brand voice, and it publishes to the CMS you already use. Paid plans include 2, 5
              or unlimited team members with no per-seat price, and agencies can add client websites for $
              {SITE_ADDON.price} a month each.
            </p>
            <Byline verb="Written" date={PUBLISHED.label} />
          </header>

          <section id="plans" className="mt-16 max-w-3xl">
            <h2 className="text-3xl font-medium mb-6" style={{ letterSpacing: "-0.03em" }}>
              Team members on each plan
            </h2>
            <div className="overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
              <table className="w-full text-sm">
                <thead style={{ background: "var(--color-bg-surface)" }}>
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold" scope="col">Plan</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Price</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Team members</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Posts a month</th>
                  </tr>
                </thead>
                <tbody>
                  {PLANS.map((p) => (
                    <tr key={p.name} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <th scope="row" className="px-4 py-3 text-left font-semibold">{p.name}</th>
                      <td className="px-4 py-3">{p.price === 0 ? "$0" : `$${p.price}/mo`}</td>
                      <td className="px-4 py-3">{p.seats ?? "Unlimited"}</td>
                      <td className="px-4 py-3" style={{ color: "var(--color-text-secondary)" }}>{p.posts.replace(/ a month$/, "")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-sm" style={{ color: "var(--color-text-muted)" }}>
              {TEAM_NOTE} Full details on the <A href="/pricing">pricing page</A>.
            </p>
          </section>

          <Section id="how-teams-work" title="How a team account works">
            <p>
              One person owns the account. They invite teammates by email, and each invite link works once and expires
              after 7 days. Once someone joins, they see the same websites, posts and brand settings as everyone else.
            </p>
            <Bullets
              items={[
                <>
                  <B>Members</B>{" "}write, edit and publish posts and spend the plan&apos;s shared credits. They can leave the
                  account at any time.
                </>,
                <>
                  <B>The owner</B> also handles billing, add-ons and adding or removing websites, and can pause, restore
                  or remove a member.
                </>,
                <>
                  <B>Seats follow the plan.</B> When every seat is taken, the owner removes someone or moves to a bigger
                  plan. {growth.name} is ${growth.price} a month for {growth.seats} people.
                </>,
              ]}
            />
            <p>
              Two limits worth knowing before you sign up. There&apos;s no approval step or per-member permission yet, so
              anyone on the account can publish. And Draftly serves businesses in the United States only, so teammates
              outside the US can&apos;t create a login.
            </p>
            <ContentImage
              image={STOCK.teamAtCafeTable}
              caption="Everyone signs in with their own login and works from the same websites, posts and brand settings."
            />
          </Section>

          <Section id="agencies" title="For agencies running several client blogs">
            <p>
              Each client gets their own website in your Draftly account. Switch between them from the website menu, and
              each one keeps its own brand voice sliders, brand details and writing rules, so a dental client never
              sounds like a roofing client.
            </p>
            <p>
              On Solopreneur, Growth or Autopilot, each additional website is <B>${SITE_ADDON.price} a month</B> and comes
              with its own {SITE_ADDON.credits}{" "}credits a month. Only that website&apos;s work spends them, so one busy client
              can&apos;t drain the others. The account owner adds and removes websites.
            </p>
            <p>
              If you already sell SEO retainers, Draftly covers the writing side. Strategy, links and technical fixes stay
              with your team. The <A href="/ai-seo-agency-vs-tool">AI SEO agency vs tool guide</A> splits up who does what.
            </p>
            <ContentImage
              image={STOCK.teamWorkingTogether}
              caption="Each client website keeps its own voice, details and credits, so the whole team can work across clients without mixing them up."
            />
          </Section>

          <Section id="brand-voice" title="Every writer on the team sounds like the brand">
            <p>
              Draftly builds each website&apos;s voice from its own pages. Tone sliders, vocabulary and audience notes are
              set on day one, and anyone on the team can see them. Change a slider and every new post follows.
            </p>
            <ProductFigure shot={GUIDE_SHOTS.brandVoice} className="mt-2" />
            <p>
              Each post is then checked against your <A href="/seo-copywriting">writing rules</A> and gets a 0 to 100
              human-voice score. In a {D.briefs}-brief test, {D.model} posts passed every hard rule {D.rulePass}% of the
              time after Draftly&apos;s automatic fix pass. That matters more on a team, because five people prompting
              ChatGPT get five different voices.
            </p>
          </Section>

          <Section id="publishing" title="Publishing to the CMS your team already uses">
            <p>
              Posts go to WordPress, Shopify, Ghost, Webflow, HubSpot or Squarespace in one click. On {growth.name} and
              above, Draftly emails you when posts are ready. Autopilot adds posting schedules: Draftly picks topics,
              writes and publishes to WordPress and Shopify on the cadence you set.
            </p>
            <ProductFigure shot={INTEGRATIONS_SHOT} className="mt-2" />
          </Section>

          <Section id="tools" title="Working from Claude, ChatGPT and WordPress">
            <p>
              Your team can also work outside the Draftly app. The <A href="/mcp">Draftly MCP connector</A>, at{" "}
              <code className="text-sm">{MCP_URL}</code>, works on every plan, so anyone can bring your brand voice into Claude, ChatGPT or
              Cursor and draft from there. Paid plans add live keyword data.
            </p>
            <p>
              The <A href="/wordpress-ai-plugin">Draftly WordPress plugin</A>{" "}improves posts you&apos;ve already published.
              By default only Editors and Administrators see it, since it spends credits, and only Administrators can
              connect it or turn on auto mode.
            </p>
          </Section>

          <div className="max-w-3xl">
            <KeepReading exclude={PATH} guides={["/blog-writing-service", "/jasper-vs-draftly"]} topic="marketing team agency brand voice blog posts" />
          </div>
          <FaqList faqs={FAQS} />

          <DarkCta
            title="Start with one post, then invite the team"
            body="Paste your website URL and Draftly writes a full post in your brand's voice for free. Upgrade when you're ready to add teammates or client websites."
            href={registerUrl}
            label={s.heroCtaText}
            secondary={{ href: "/pricing", label: "Compare plans" }}
          />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
