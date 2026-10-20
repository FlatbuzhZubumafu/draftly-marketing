// PORTED FROM THE APP. Do not edit the logic here; change it in the app and copy it again.
// Source: FlatbuzhZubumafu/draftly.blog supabase/functions/_shared/visual-suggestions.ts
// at commit 4ecf2cc19683ca0c3192215aa41a8a2b8a954329.
// Only stripVisualSuggestions and what it needs, copied verbatim.
//
/**
 * Visual suggestions: the writer's ideas for an in-post image ("a chart of
 * repair costs by roof type"). The model writes them inline as
 * [VISUAL SUGGESTION: ...] markers, but they never belong in a post body:
 * the writers pull them out before saving (content.visual_suggestions keeps
 * them, each with the heading it followed), and every reader of
 * content_text (the app, publishers, exports, MCP, the Editor) strips any
 * that older posts still carry. The app shows them only when the user asks
 * for suggested images.
 *
 * Pure functions, no Deno or browser APIs, so the edge functions and the
 * React app share one parser.
 */

export interface VisualSuggestion {
  /** What the image should show. */
  text: string;
  /** The heading the suggestion followed in the draft; null before the first heading. */
  heading: string | null;
}

/** Most suggestions kept per post, and the longest suggestion text. */
export const VISUAL_SUGGESTION_LIMITS = { count: 20, textLength: 600 } as const;

// Either form, anywhere in a line:
//   [VISUAL SUGGESTION: ...]   (any case, optionally wrapped in * / ** / _)
//   **Visual Suggestion:** ... (an older generator's whole-line form)
// Whitespace around a marker and the line break after it go with it.
const MARKER =
  /(?:^[ \t]*\*\*Visual Suggestion:?\*\*:?[ \t]*([^\n]*)(?:\r?\n)?)|(?:[ \t]*(?:\*\*|\*|_)?\[VISUAL SUGGESTION:[ \t]*([^\]\n]*)\](?:\*\*|\*|_)?[ \t]*(?:\r?\n)?)/gim;

const HEADING = /^#{1,6}[ \t]+(.+?)[ \t]*#*[ \t]*$/gm;

function cleanBody(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n');
}

/** The post text without any visual suggestion markers, and the suggestions in order. */
export function extractVisualSuggestions(text: string | null | undefined): { body: string; suggestions: VisualSuggestion[] } {
  const source = text ?? '';
  if (!/visual suggestion/i.test(source)) return { body: source, suggestions: [] };
  const headings = [...source.matchAll(HEADING)].map((m) => ({ at: m.index ?? 0, text: m[1].trim() }));
  const suggestions: VisualSuggestion[] = [];
  const body = source.replace(MARKER, (_m, lineForm: string | undefined, bracketForm: string | undefined, offset: number) => {
    const t = (lineForm ?? bracketForm ?? '').trim().slice(0, VISUAL_SUGGESTION_LIMITS.textLength);
    if (t && suggestions.length < VISUAL_SUGGESTION_LIMITS.count) {
      const heading = headings.filter((h) => h.at < offset).pop()?.text ?? null;
      suggestions.push({ text: t, heading });
    }
    return '';
  });
  return { body: cleanBody(body), suggestions };
}

/** Removes every visual suggestion marker (and the blank lines it leaves). */
export function stripVisualSuggestions(text: string | null | undefined): string {
  return extractVisualSuggestions(text).body;
}
