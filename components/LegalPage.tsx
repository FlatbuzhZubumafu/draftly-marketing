import { notFound } from "next/navigation";
import { getPage } from "@/lib/graphql";
import { demoteH1s, fixLegalAnchors, sanitizeHtml } from "@/lib/sanitize";
import { plainExcerpt } from "@/lib/text";
import { COMPANY } from "@/lib/schema";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

const FALLBACK_TITLES: Record<string, string> = { "privacy-policy": "Privacy Policy", "terms-and-conditions": "Terms and Conditions" };

// Legal copy is maintained in WordPress, which supplies the "last updated" line.
// The page title from WordPress is the h1; the copy's numbered sections use h1 in
// WordPress, so they are rendered as h2s.
//
// If WordPress can't be reached the page says so and gives the contact email,
// instead of failing the build or the request. The fetch revalidates every 60
// seconds, so the notice is replaced once WordPress answers again.
export async function LegalPage({ slug }: { slug: string }) {
  const page = await getPage(slug).catch(() => undefined);
  if (page === null) notFound();
  if (page === undefined) {
    return (
      <>
        <Header />
        <main className="pt-16 min-h-screen bg-white">
          <article className="max-w-3xl mx-auto px-4 py-20">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">{FALLBACK_TITLES[slug] ?? "Legal"}</h1>
            <p className="text-lg leading-relaxed text-gray-700">
              This page didn&apos;t load. Refresh in a minute, or email{" "}
              <a href={`mailto:${COMPANY.email}`} className="underline underline-offset-2">{COMPANY.email}</a> for a copy.
            </p>
          </article>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-16 min-h-screen bg-white">
        <article className="max-w-3xl mx-auto px-4 py-20">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-6">{plainExcerpt(page.title, 1000)}</h1>
          <div className="legal-content" dangerouslySetInnerHTML={{ __html: fixLegalAnchors(demoteH1s(sanitizeHtml(page.content))) }} />
        </article>
      </main>
      <Footer />
    </>
  );
}
