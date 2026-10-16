import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { BriefTemplate } from "@/components/tools/BriefTemplate";
import { toolById } from "@/lib/free-tools";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const TOOL = toolById("content-brief");

export const metadata: Metadata = {
  title: { absolute: TOOL.title },
  description: TOOL.description,
  alternates: { canonical: TOOL.path },
  openGraph: { title: TOOL.title, description: TOOL.description, type: "website", url: `${SITE_URL}${TOOL.path}` },
};

const secondary = { color: "var(--color-text-secondary)" };

export default function Page() {
  return (
    <ToolPage tool={TOOL}>
      <section id="seo-content-brief-template" className="mt-20">
        <h2 className="text-3xl font-medium mb-4" style={{ letterSpacing: "-0.03em" }}>
          Free SEO content brief template
        </h2>
        <div className="max-w-3xl space-y-4 text-lg leading-relaxed mb-6" style={secondary}>
          <p>Prefer to write the brief yourself? Here&apos;s the template the generator fills in. Copy it into a doc or download it as a Markdown file.</p>
          <p>Fill in the basics first. The search intent decides everything after it: a &ldquo;how much does it cost&rdquo; search needs prices up top, and a &ldquo;how to&rdquo; search needs steps.</p>
        </div>
        <BriefTemplate />
      </section>
    </ToolPage>
  );
}
