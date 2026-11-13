import { DecisionPageView, decisionMetadata } from "@/components/DecisionPage";
import { DISTRIBB_ALTERNATIVES as PAGE } from "@/lib/decision-pages";

export const revalidate = 3600;

export const metadata = decisionMetadata(PAGE);

export default function Page() {
  return <DecisionPageView page={PAGE} />;
}
