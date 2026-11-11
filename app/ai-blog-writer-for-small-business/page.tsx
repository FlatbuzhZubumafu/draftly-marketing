import { DecisionPageView, decisionMetadata } from "@/components/DecisionPage";
import { AI_BLOG_WRITER_SMALL_BUSINESS as PAGE } from "@/lib/decision-pages";

export const revalidate = 3600;

export const metadata = decisionMetadata(PAGE);

export default function Page() {
  return <DecisionPageView page={PAGE} />;
}
