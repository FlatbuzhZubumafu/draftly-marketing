import type { Metadata } from "next";
import { pageImages } from "@/lib/og";
import { APP_URL, SITE_URL } from "@/lib/site";
import { getHomepageData } from "@/lib/graphql";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, B, Bullets, Byline, DarkCta, FaqList, Section, faqJsonLd, type Faq } from "@/components/ArticleParts";
import { PAID_PLANS, paidPriceList } from "@/lib/pricing";
import { DEFAULT_WRITER as D } from "@/lib/ruleCheck";
import { jsonLdHtml, authorRef } from "@/lib/schema";
import { TocLayout } from "@/components/OnThisPage";
import { KeepReading } from "@/components/KeepReading";
import { ProductFigure } from "@/components/ProductFigure";
import { GUIDE_SHOTS, STEP_SHOTS, imageObjectJsonLd } from "@/lib/product-shots";
import { ContentImage } from "@/components/ContentImage";
import { STOCK } from "@/lib/stock-images";
import { AccentText } from "@/components/AccentText";
import { BENCHMARK } from "@/lib/benchmark";

export const revalidate = 3600;

// Targets "seo content writing services" (Ahrefs US: 3,000/mo, KD 0), "blog writing
// service" (500, KD 0), "outsource blog writing" (250, KD 0) and "affordable blog
// writing services" (80, KD 0), checked 2026-10-15. Freelance rates come from the
// EFA 2026 rate chart (cited on the page). No agency price is quoted, because there is
// no independent public benchmark to cite. Draftly prices come from lib/pricing.ts.
const PATH = "/blog-writing-service";
const PUBLISHED = { iso: "2026-10-15", label: "October 15, 2026" };
const TITLE = "Blog Writing Service or AI: What a Post Really Costs";
const DESCRIPTION =
  "What a blog writing service, a freelance writer and Draftly cost per post, what you get from each, and when hiring a human writer is still the better call.";

const EFA = {
  href: "https://www.the-efa.org/rates/",
  label: "Editorial Freelancers Association 2026 rate chart",
  // "Blog posts", work-for-hire row: 25¢ to 45¢ a word, from a survey of members' 2025 rates.
  low: 0.25,
  high: 0.45,
};
const GOOGLE_AI_GUIDANCE = "https://developers.google.com/search/blog/2023/02/google-search-and-ai-content";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
const efaRange = (words: number) => `${usd(words * EFA.low)} to ${usd(words * EFA.high)}`;

const SOLO = PAID_PLANS[0];
const soloPosts = Number(SOLO.posts.replace(/\D+/g, ""));
const soloPerPost = `${Math.round((SOLO.price / soloPosts) * 100)} cents`;

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  ...pageImages(PATH, { title: TITLE, description: DESCRIPTION, type: "article", url: `${SITE_URL}${PATH}` }),
};

type Row = { label: string; freelancer: string; agency: string; draftly: string };

const ROWS: Row[] = [
  {
    label: "Price per post",
    freelancer: `${efaRange(1000)} for 1,000 words, ${efaRange(1500)} for 1,500 words`,
    agency: "Usually bundled into a monthly retainer. Ask for the per-post price in writing.",
    draftly: `First post free. Solopreneur is $${SOLO.price} a month for ${SOLO.posts.toLowerCase()}, about ${soloPerPost} a post.`,
  },
  {
    label: "How you pay",
    freelancer: "Per word, per hour or per post",
    agency: "Retainer or project fee",
    draftly: "Flat monthly plan, no per-seat charge, cancel from Settings",
  },
  {
    label: "Who writes it",
    freelancer: "One writer",
    agency: "A writer, usually with an editor and an account manager",
    draftly: `${D.model} by default, checked against your writing rules`,
  },
  {
    label: "Time to a first draft",
    freelancer: "Set by the writer's schedule",
    agency: "Set by the agency's calendar",
    draftly: "One to two minutes",
  },
  {
    label: "Brand voice",
    freelancer: "Learned from your brief and edits over time",
    agency: "Learned from your brief and a style guide",
    draftly: "Built from your website on day one, with sliders you can adjust",
  },
  {
    label: "Publishing",
    freelancer: "Usually a Google Doc you paste in",
    agency: "Often included, depends on the contract",
    draftly: "One click to WordPress, Shopify, Ghost, Webflow, HubSpot or Squarespace",
  },
  {
    label: "Original interviews and reporting",
    freelancer: "Yes, if you pay for the time",
    agency: "Yes, on most retainers",
    draftly: "No. Draftly writes from your site and your industry's news.",
  },
];

const FAQS: Faq[] = [
  {
    q: "How much does a blog writing service cost?",
    a: `Freelance writers in the ${EFA.label} charge 25 to 45 cents a word for blog posts, so a 1,500-word post runs ${efaRange(1500)}. Agencies usually bill a monthly retainer, and quotes vary with scope. Draftly's first post is free, and paid plans cost ${paidPriceList()} a month.`,
  },
  {
    q: "Is AI-written blog content bad for SEO?",
    a: "Google's published guidance says it rewards helpful content however it was made, and that using AI to manipulate rankings breaks its spam policies. A post ranks on whether it answers the search well, so have someone who knows your business read every post before it goes live.",
  },
  {
    q: "Can I outsource blog writing and keep my brand voice?",
    a: "Yes. With a writer or agency, send a style guide and a few posts you like. Draftly reads your website and sets your voice sliders from it, so the first post already uses your words, and you can adjust the sliders at any time.",
  },
  {
    q: "Do I still need to edit AI blog posts?",
    a: "Yes. Draftly checks every post against writing rules and scores how human it sounds, but it doesn't know your prices this week or the story a customer told you. Plan a few minutes to read and adjust each post.",
  },
  {
    q: "Can a freelance writer or agency use Draftly?",
    a: "Yes. Paid plans include 2, 5 or unlimited team members at no per-seat charge, and each additional client website is $29 a month with its own brand voice and credits.",
  },
  {
    q: "What is the most affordable way to get SEO blog posts?",
    a: `Write them yourself, which costs time. After that, an AI blog writer is the cheapest option per post: Draftly's first post is free and its $${SOLO.price} plan covers ${SOLO.posts.toLowerCase()}. Pay a writer for posts that need interviews or expert credentials.`,
  },
];

export default async function BlogWritingServicePage() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${APP_URL}/register`;

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
      image: [GUIDE_SHOTS.urlToPost, GUIDE_SHOTS.brandVoice].map(imageObjectJsonLd),
      citation: [EFA.href, GOOGLE_AI_GUIDANCE],
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
              Blog writing service or AI:{" "}
              <AccentText squiggle="basic" color="var(--color-accent)" squiggleColor="#ffce59">
                what a post really costs
              </AccentText>
            </h1>
            <p className="text-lg leading-relaxed mb-4" style={{ color: "var(--color-text-secondary)" }}>
              A freelance writer charges {efaRange(1500)}{" "}for a 1,500-word blog post, going by the Editorial Freelancers
              Association&apos;s 2026 rates. Draftly writes posts in your brand voice from ${SOLO.price} a month, and your first
              post is free. Below is what each option costs per post, what you get for it and when a human writer is worth it.
            </p>
            <Byline verb="Written" date={PUBLISHED.label} />
            <p className="mt-2 text-sm" style={{ color: "var(--color-text-muted)" }}>
              I built Draftly, so I&apos;m biased. The freelance rates come from an outside survey.
            </p>
          </header>

          <Section id="cost" title="Cost per post: freelancer, agency or Draftly">
            <p>
              Freelance prices come from the <A href={EFA.href}>{EFA.label}</A>, which lists blog posts at 25 to 45 cents a
              word. Agencies mostly sell monthly retainers, and I couldn&apos;t find an independent survey of their per-post
              prices, so the agency column describes what&apos;s included.
            </p>
          </Section>

          <section id="compare" className="mt-10">
            {/* Stacked cards on phones, the full table from sm up. */}
            <div className="sm:hidden space-y-3">
              {ROWS.map((r) => (
                <div key={r.label} className="p-4 rounded-xl" style={{ background: "var(--color-bg-surface)", border: "1px solid var(--color-border)" }}>
                  <p className="text-sm font-semibold">{r.label}</p>
                  <dl className="mt-2 space-y-2 text-sm leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                    <div>
                      <dt className="font-medium" style={{ color: "var(--color-text-primary)" }}>Freelance writer</dt>
                      <dd>{r.freelancer}</dd>
                    </div>
                    <div>
                      <dt className="font-medium" style={{ color: "var(--color-text-primary)" }}>Content agency</dt>
                      <dd>{r.agency}</dd>
                    </div>
                    <div>
                      <dt className="font-medium" style={{ color: "var(--color-accent)" }}>Draftly</dt>
                      <dd>{r.draftly}</dd>
                    </div>
                  </dl>
                </div>
              ))}
            </div>
            <div className="hidden sm:block overflow-x-auto rounded-xl" style={{ border: "1px solid var(--color-border)" }}>
              <table className="w-full text-sm min-w-[720px]">
                <thead style={{ background: "var(--color-bg-surface)" }}>
                  <tr className="text-left">
                    <th className="px-4 py-2 font-semibold" scope="col"><span className="sr-only">Compared on</span></th>
                    <th className="px-4 py-2 font-semibold" scope="col">Freelance writer</th>
                    <th className="px-4 py-2 font-semibold" scope="col">Content agency</th>
                    <th className="px-4 py-2 font-semibold" scope="col" style={{ color: "var(--color-accent)" }}>Draftly</th>
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((r) => (
                    <tr key={r.label} style={{ borderTop: "1px solid var(--color-border)" }}>
                      <th scope="row" className="px-4 py-3 align-top text-left font-semibold">{r.label}</th>
                      <td className="px-4 py-3 align-top" style={{ color: "var(--color-text-secondary)" }}>{r.freelancer}</td>
                      <td className="px-4 py-3 align-top" style={{ color: "var(--color-text-secondary)" }}>{r.agency}</td>
                      <td className="px-4 py-3 align-top">{r.draftly}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 max-w-3xl text-sm" style={{ color: "var(--color-text-muted)" }}>
              Draftly&apos;s per-post figure divides the plan price by its estimated posts on the default model.
            </p>
            <ContentImage
              className="mt-8"
              image={STOCK.shopOwnerAtLaptop}
              caption="Most small business owners don't have time to write every week. The question is who does it, and at what price per post."
            />
          </section>

          <Section id="what-you-get" title="What you get for the money">
            <p>
              A good freelancer gives you judgment. They push back on a weak topic, call a customer for a quote and notice
              when your pricing page contradicts the post. That costs real hours, which is why the rate looks the way it
              does.
            </p>
            <p>
              An agency adds an editor, a content calendar and someone to chase. You pay for the coordination as much as
              the writing.
            </p>
            <p>
              Draftly gives you volume and consistency. It reads your site, picks topics from your industry&apos;s news and
              writes in your voice. Every post is checked against your <A href="/seo-copywriting">SEO copywriting rules</A>{" "}
              and gets an automatic fix pass when it misses one. In a {D.briefs}-brief test, {D.model} posts passed every
              hard rule {D.rulePass}% of the time after that pass.
            </p>
            <ProductFigure shot={GUIDE_SHOTS.urlToPost} className="mt-2" />
          </Section>

          <Section id="human-writer" title="When to hire a human writer instead">
            <p>Pay a person when the post depends on something only a person can get.</p>
            <Bullets
              items={[
                <>
                  <B>Interviews and original reporting.</B>{" "}Case studies, customer stories and anything quoting a real
                  person. Draftly can&apos;t make the call.
                </>,
                <>
                  <B>Expert bylines in medicine, law or finance.</B> If readers need a licensed professional behind the
                  advice, hire one to write or review it.
                </>,
                <>
                  <B>Founder stories.</B> A post about why you started the company should come from you. A ghostwriter who
                  interviews you does this well.
                </>,
                <>
                  <B>Nobody on your team can review posts.</B>{" "}Draftly drafts fast, and someone who knows the business still
                  needs to read each post. If that person doesn&apos;t exist, a full-service agency covers the gap.
                </>,
              ]}
            />
            <p>
              You can also use both. The writer handles the two big pieces a month, and Draftly covers the weekly SEO
              posts in between. If you&apos;re weighing a full SEO agency, the <A href="/ai-seo-agency-vs-tool">AI SEO agency
              vs tool comparison</A> covers strategy and links too.
            </p>
          </Section>

          <Section id="how-it-works" title="How Draftly writes a post in three steps">
            <ol className="list-decimal pl-5 space-y-3">
              <li>
                <B>Paste your website URL.</B> Draftly reads your site and sets your brand voice sliders from it. Change any
                slider and every new post follows.
              </li>
              <li>
                <B>Pick a topic.</B>{" "}Take one of the ideas Draftly pulls from your industry&apos;s news each day, or type your
                own.
              </li>
              <li>
                <B>Review and publish.</B> Read the draft, edit what you want and send it to your CMS in one click. Each draft
                comes with a URL slug, meta title and meta description.
              </li>
            </ol>
            <div className="mt-2 grid gap-5 sm:grid-cols-2">
              <ProductFigure shot={STEP_SHOTS[1]} aspect="16 / 10" />
              <ProductFigure shot={GUIDE_SHOTS.brandVoice} aspect="16 / 10" fit="contain" />
            </div>
            <p>
              Want to know which AI model writes best before you trust one with your blog? We tested {BENCHMARK.length} of them in the{" "}
              <A href="/best-ai-for-writing">best AI for writing benchmark</A>. Every plan and what it includes is on the{" "}
              <A href="/pricing">pricing page</A>.
            </p>
          </Section>

          <div className="max-w-3xl">
            <KeepReading exclude={PATH} guides={["/ai-seo-agency-vs-tool", "/ai-copywriter"]} topic="outsource blog writing cost freelance writer agency" />
          </div>
          <FaqList faqs={FAQS} />

          <DarkCta
            title="Read one post before you hire anyone"
            body="Paste your website URL and Draftly writes a full post in your brand's voice for free. Compare it with what a writer would send you."
            href={registerUrl}
            label={s.heroCtaText}
            secondary={{ href: "/pricing", label: "See plans" }}
          />
        </TocLayout>
      </main>
      <Footer />
    </>
  );
}
