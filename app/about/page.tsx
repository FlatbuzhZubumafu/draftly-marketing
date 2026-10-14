import type { Metadata } from "next";
import { pageImages } from "@/lib/og";
import { APP_URL, SITE_URL } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { A, Section } from "@/components/ArticleParts";
import { AUTHOR_HEADSHOT, AUTHOR_URL, COMPANY, ORG_ID, PERSON_ID, jsonLdHtml } from "@/lib/schema";

export const revalidate = 3600;

// Every fact here comes from Preston's own writing: the two blog posts linked below
// and what he told us on 2026-10-13 about learning SEO. Don't add stats, credentials
// or team members he hasn't stated.
const PATH = "/about";
const TITLE = "About Draftly and Preston Vawdrey";
const DESCRIPTION =
  "Preston Vawdrey built Draftly after a domain migration wiped out his company's search traffic. Here is the story, who runs Draftly and how this blog is written.";

const ORIGIN_POST = "/blog/how-i-accidentally-built-an-ai-content-platform-while-trying-to-save-my-companys-seo";
const SHIFT_POST = "/blog/draftly-blog-shifts-from-agency-to-customer-focus";

export const metadata: Metadata = {
  title: { absolute: TITLE },
  description: DESCRIPTION,
  alternates: { canonical: PATH },
  ...pageImages(PATH, { title: TITLE, description: DESCRIPTION, type: "website", url: AUTHOR_URL }),
};

export default function AboutPage() {
  const jsonLd = jsonLdHtml({
    "@type": "AboutPage",
    "@id": `${AUTHOR_URL}#page`,
    url: AUTHOR_URL,
    name: TITLE,
    description: DESCRIPTION,
    mainEntity: { "@id": PERSON_ID },
    about: [{ "@id": PERSON_ID }, { "@id": ORG_ID }],
    isPartOf: { "@id": `${SITE_URL}/#website` },
  });

  return (
    <>
      <Header />
      <main className="pt-28 pb-24 px-4" style={{ background: "var(--color-bg-primary)" }}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} />
        <div className="container-draftly max-w-3xl">
          <header className="flex flex-col sm:flex-row sm:items-center gap-6">
            <img
              src={AUTHOR_HEADSHOT}
              alt="Preston Vawdrey, founder of Draftly"
              width={112}
              height={112}
              className="w-28 h-28 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <h1 className="page-heading mb-3" style={{ fontSize: "clamp(2.1rem, 5vw, 52px)" }}>
                I&apos;m Preston Vawdrey.{" "}
                <em className="italic" style={{ color: "var(--color-accent)" }}>
                  I built Draftly.
                </em>
              </h1>
              <p className="text-lg leading-relaxed" style={{ color: "var(--color-text-secondary)" }}>
                I&apos;m a marketer and the founder of Draftly. I know how to make APIs talk to each other, and
                Draftly grew out of that.
              </p>
            </div>
          </header>

          <Section id="learning-seo" title="I learned SEO the slow way">
            <p>
              It took me probably a year of just writing new blogs over and over. Then one day I decided I would spend
              $100 on some SEO data.
            </p>
            <p>
              At that time Ahrefs cost about $100 a month and just gave you data. There was no AI to write and optimize
              content, so I had to fight to figure it out.
            </p>
            <p>I put the heart and soul of that work into Draftly so you don&apos;t have to work nearly as hard.</p>
          </Section>

          <Section id="how-it-started" title="Draftly started as a script to save my company's traffic">
            <p>
              In 2024 I joined a data company that had decades of brand recognition. Then it migrated domains, and the
              organic traffic collapsed.
            </p>
            <p>
              I was brought on to fix it. My boss and I did the audit, made the technical fixes and waited for Google to
              sort it out. After months of waiting, it was clear the brand wasn&apos;t going to bounce back on its own.
              We needed a lot of content, fast, and every post had to sound like us.
            </p>
            <p>
              So one weekend I built a Google Apps Script. It had RSS feeds hard-coded into it, called the OpenAI,
              Claude and Gemini APIs, and carried big blocks of context about our brand, voice and products.
            </p>
            <p>
              It was ugly and fragile. Within weeks our executives couldn&apos;t tell its posts apart from the ones our
              team wrote by hand, and our traffic started recovering.
            </p>
            <p>
              The full story is in <A href={ORIGIN_POST}>how I accidentally built an AI blog writer</A>.
            </p>
          </Section>

          <Section id="small-businesses" title="Why Draftly is built for small businesses">
            <p>The first version of Draftly I offered to other people was built for agencies.</p>
            <p>
              In December 2025, after testing it with a few inside users, I saw it was making SEO work more
              complicated. Too many clients, too many settings, too many decisions.
            </p>
            <p>
              So I cut Draftly down to one business and one website per account. That let me spend my time on the part
              that decides whether a post is worth publishing: the writing. I explained the change in{" "}
              <A href={SHIFT_POST}>why Draftly went from agency tool to self-serve blog writer</A>.
            </p>
          </Section>

          <Section id="company" title="Who runs Draftly">
            <p>
              Draftly is made by {COMPANY.legalName}, a Utah company. It serves businesses in the United States only.
            </p>
            <p>
              You can reach me at <A href={`mailto:${COMPANY.email}`}>{COMPANY.email}</A>. The mailing address and text
              line are on the <A href="/contact">contact page</A>.
            </p>
          </Section>

          <Section id="editorial-standards" title="How posts on this blog are written">
            <p>I rely heavily on AI to help me communicate ideas clearly, and the posts here are written with its help.</p>
            {/* Confirmed by Preston 2026-10-14: he does not review every post before it publishes. Keep process claims to what he has confirmed. */}
            <p>
              I don&apos;t read every post before it goes live. I do read every support request, and every piece of
              feedback people send after Draftly writes a post for them. That feedback is what shapes how Draftly writes.
            </p>
            <p>When a post changes after it&apos;s published, the page shows an Updated date next to the original one.</p>
            <p>
              If you spot something wrong, email me at <A href={`mailto:${COMPANY.email}`}>{COMPANY.email}</A>. I read
              every one.
            </p>
          </Section>

          <Section id="try-it" title="Try it on your own site">
            <p>
              Your first post is free, with no credit card. <A href={`${APP_URL}/register`}>Create a free account</A>{" "}
              or see the plans on the <A href="/pricing">pricing page</A>.
            </p>
          </Section>
        </div>
      </main>
      <Footer />
    </>
  );
}
