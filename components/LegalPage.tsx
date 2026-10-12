import { notFound } from "next/navigation";
import { getPage } from "@/lib/graphql";
import { demoteH1s, fixLegalAnchors, sanitizeHtml } from "@/lib/sanitize";
import { plainExcerpt } from "@/lib/text";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Legal copy is maintained in WordPress, which supplies the "last updated" line.
// The page title from WordPress is the h1; the copy's numbered sections use h1 in
// WordPress, so they are rendered as h2s.
export async function LegalPage({ slug }: { slug: string }) {
  const page = await getPage(slug);
  if (!page) notFound();

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
