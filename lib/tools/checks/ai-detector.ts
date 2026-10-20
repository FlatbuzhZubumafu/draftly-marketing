// URL mode of the free AI content detector: fetch one page through the SSRF-guarded
// fetcher, pull out the article the same way Draftly's Editor and its
// detect_ai_writing tool do (extractArticle, ported from the app), and send the
// Markdown back. The browser scores it with the same detector it uses for pasted
// text, so a URL and the same text pasted in get the same score.
import { checkUrl, ToolError } from "../ssrf.ts";
import { Scan, UA, loadError } from "../fetcher.ts";
import { countWords, extractArticle } from "../ai-detect/editor-text.ts";

/** Longest article we send back. A very long page is cut at a paragraph break. */
export const MAX_ARTICLE_CHARS = 60_000;

export type ArticleText = {
  tool: "ai-detector";
  /** The URL we read, after redirects. */
  checked: string;
  title: string | null;
  markdown: string;
  words: number;
  notes: string[];
};

export function articleFromHtml(html: string, url: string, truncatedPage = false): ArticleText {
  const { title, markdown: full } = extractArticle(html);
  const notes: string[] = [];
  if (truncatedPage) notes.push("The page is over 2 MB, so we only read the first 2 MB.");
  let markdown = full;
  if (markdown.length > MAX_ARTICLE_CHARS) {
    const cut = markdown.lastIndexOf("\n\n", MAX_ARTICLE_CHARS);
    markdown = markdown.slice(0, cut > MAX_ARTICLE_CHARS / 2 ? cut : MAX_ARTICLE_CHARS).trim();
    notes.push("The article is very long, so we scored the first part of it.");
  }
  return { tool: "ai-detector", checked: url, title: title || null, markdown, words: countWords(markdown), notes };
}

export async function runAiDetectorFetch(input: string): Promise<ArticleText> {
  const start = checkUrl(input, { allowBare: true });
  const scan = new Scan({ budgetMs: 20_000, maxFetches: 6 });
  const res = await scan.fetch(start, { ua: UA.browser, expect: "html" });
  if (!res.ok || res.wrongType) throw new ToolError(loadError(res), 422);
  const article = articleFromHtml(res.body, res.finalUrl, res.truncated);
  if (!article.words) throw new ToolError("We loaded the page but found no article text on it. Paste the text instead.", 422);
  return article;
}
