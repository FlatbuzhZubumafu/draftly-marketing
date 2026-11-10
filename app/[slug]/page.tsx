import { notFound, permanentRedirect } from "next/navigation";
import { getPost } from "@/lib/graphql";

// WordPress links posts at the root (wp.draftly.blog/<slug>/), and wp.draftly.blog
// 301s every path to the same path on www. Any root-level URL that matches a
// WordPress post goes to its /blog page; everything else stays a 404. Static
// routes such as /pricing always win over this segment. Every unknown URL lands
// here, so a WordPress outage answers 404 rather than 500.
export default async function LegacyPostRedirect({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPost(slug).catch(() => null);
  if (post) permanentRedirect(`/blog/${post.slug}`);
  notFound();
}
