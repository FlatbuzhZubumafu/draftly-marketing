import type { Metadata } from "next";
import { ToolPage } from "@/components/tools/ToolPage";
import { toolById } from "@/lib/free-tools";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const TOOL = toolById("faq-schema");

export const metadata: Metadata = {
  title: { absolute: TOOL.title },
  description: TOOL.description,
  alternates: { canonical: TOOL.path },
  openGraph: { title: TOOL.title, description: TOOL.description, type: "website", url: `${SITE_URL}${TOOL.path}` },
};

export default function Page() {
  return <ToolPage tool={TOOL} />;
}
