// robots.txt parsing and matching, following Google's published rules: a crawler
// obeys the most specific group naming it (else "*"); within a group the longest
// matching rule wins, and allow wins a tie. Supports * and $ in paths.

export type RobotsRule = { allow: boolean; path: string };
export type RobotsGroup = { agents: string[]; rules: RobotsRule[] };
export type Robots = { groups: RobotsGroup[]; sitemaps: string[] };

export function parseRobots(text: string): Robots {
  const groups: RobotsGroup[] = [];
  const sitemaps: string[] = [];
  let current: RobotsGroup | null = null;
  let lastWasAgent = false;
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*/, "").trim();
    if (!line) continue;
    const idx = line.indexOf(":");
    if (idx < 0) continue;
    const key = line.slice(0, idx).trim().toLowerCase();
    const value = line.slice(idx + 1).trim();
    if (key === "user-agent") {
      if (!current || !lastWasAgent) {
        current = { agents: [], rules: [] };
        groups.push(current);
      }
      current.agents.push(value.toLowerCase());
      lastWasAgent = true;
      continue;
    }
    lastWasAgent = false;
    if (key === "sitemap") {
      if (value) sitemaps.push(value);
      continue;
    }
    if (!current) continue;
    if (key === "allow" || key === "disallow") {
      // An empty Disallow allows everything; it adds no rule.
      // Very long or wildcard-heavy patterns are skipped so a hostile file can't make matching slow.
      if (value && value.length <= 256 && (value.match(/\*/g) ?? []).length <= 6 && current.rules.length < 1000) {
        current.rules.push({ allow: key === "allow", path: value.replace(/\*+/g, "*") });
      }
    }
  }
  return { groups, sitemaps };
}

/** The rules a crawler with product token `bot` obeys, and whether a named group applied. */
export function rulesFor(robots: Robots, bot: string): { rules: RobotsRule[]; named: boolean } {
  const token = bot.toLowerCase();
  // Google matches the product token whole and case-insensitively; "GPTBot/1.1" counts as "gptbot".
  const named = robots.groups.filter((g) => g.agents.some((a) => a.split("/")[0].trim() === token));
  if (named.length) return { rules: named.flatMap((g) => g.rules), named: true };
  return { rules: robots.groups.filter((g) => g.agents.includes("*")).flatMap((g) => g.rules), named: false };
}

function patternToRegex(path: string): RegExp {
  const anchored = path.endsWith("$");
  const body = (anchored ? path.slice(0, -1) : path)
    .split("*")
    .map((s) => s.replace(/[.+?^${}()|[\]\\]/g, "\\$&"))
    .join(".*");
  return new RegExp(`^${body}${anchored ? "$" : ""}`);
}

/** True when `bot` may fetch `path` under these robots rules. */
export function isAllowed(robots: Robots, bot: string, path: string): boolean {
  const { rules } = rulesFor(robots, bot);
  let best: RobotsRule | null = null;
  for (const r of rules) {
    if (!patternToRegex(r.path).test(path)) continue;
    if (!best || r.path.length > best.path.length || (r.path.length === best.path.length && r.allow && !best.allow)) best = r;
  }
  return best ? best.allow : true;
}

export type BotVerdict = "allowed" | "blocked" | "partial";

/**
 * Whole-site verdict: "blocked" when the homepage is disallowed, "partial" when the
 * homepage is allowed but one of `samplePaths` (the blog, a post) is not. Rules that
 * only keep bots out of admin or cart pages don't count against the site.
 */
export function botVerdict(robots: Robots, bot: string, samplePaths: string[] = []): { verdict: BotVerdict; named: boolean; blockedPaths: string[] } {
  const { named } = rulesFor(robots, bot);
  if (!isAllowed(robots, bot, "/")) return { verdict: "blocked", named, blockedPaths: ["/"] };
  const blockedPaths = samplePaths.filter((p) => !isAllowed(robots, bot, p));
  return { verdict: blockedPaths.length ? "partial" : "allowed", named, blockedPaths };
}
