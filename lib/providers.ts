// Which company makes a model, from its display name. Tables and lists call
// providerOf() so a new model gets its logo without touching the page.

const RULES: [RegExp, string][] = [
  [/^claude\b/i, "Anthropic"],
  [/^(gpt|chatgpt|o\d)\b/i, "OpenAI"],
  [/^gemini\b/i, "Google"],
  [/^qwen\b/i, "Alibaba"],
  [/^kimi\b/i, "Moonshot AI"],
  [/^deepseek\b/i, "DeepSeek"],
  [/^grok\b/i, "xAI"],
  [/^(mistral|magistral|codestral)\b/i, "Mistral AI"],
  [/^cursor\b/i, "Cursor"],
  [/^muse\b/i, "Meta"],
  [/^minimax\b/i, "MiniMax"],
];

/** The provider behind a model or app name, e.g. "Claude Sonnet 5.5" -> "Anthropic". */
export function providerOf(model: string): string | undefined {
  return RULES.find(([re]) => re.test(model.trim()))?.[1];
}
