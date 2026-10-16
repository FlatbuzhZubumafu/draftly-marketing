// Quality check for the free AI tools: runs the content brief and blog ideas
// generators on 10 real inputs and writes every result to ai-tools-samples.md.
// Needs a gateway key; spends about 2 to 4 cents in total.
//
//   TOOLS_AI_GATEWAY_API_KEY=... node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/try-ai-tools.mjs
import fs from "node:fs";

const { runBrief } = await import("../lib/tools/ai/brief.ts");
const { runIdeas } = await import("../lib/tools/ai/ideas.ts");

const BRIEFS = [
  { keyword: "water heater repair cost", url: "https://www.mrrooter.com" },
  { keyword: "how often should you get a dental cleaning", url: null },
  { keyword: "project management for agencies", url: "https://basecamp.com" },
  { keyword: "best shoes for walking all day", url: "https://www.allbirds.com" },
  { keyword: "ai blog writer for small business", url: "https://www.draftly.blog" },
];
const IDEAS = [
  { url: "https://www.mrrooter.com", topic: null },
  { url: null, topic: "family dental practice" },
  { url: "https://basecamp.com", topic: null },
  { url: "https://www.allbirds.com", topic: null },
  { url: null, topic: "residential roofing" },
];

let spent = 0;
const out = ["# AI tools sample run", `Model: ${process.env.TOOLS_AI_MODEL || "openai/gpt-6-luna"}. ${new Date().toISOString()}`, ""];
for (const b of BRIEFS) {
  const t = Date.now();
  try {
    const r = await runBrief({ ...b, audience: null }, (c) => (spent += c));
    out.push(`## Brief: ${b.keyword}${b.url ? ` (${b.url})` : ""} (${Date.now() - t} ms)`, "```json", JSON.stringify(r, null, 2), "```", "");
  } catch (e) {
    out.push(`## Brief: ${b.keyword}: ERROR ${e.publicMessage ?? e.message}`, "");
  }
}
for (const i of IDEAS) {
  const t = Date.now();
  try {
    const r = await runIdeas(i, (c) => (spent += c));
    out.push(`## Ideas: ${i.url ?? i.topic} (${Date.now() - t} ms)`, r.business, "", ...r.ideas.map((x, n) => `${n + 1}. **${x.title}** (${x.type}): ${x.angle}`), "");
  } catch (e) {
    out.push(`## Ideas: ${i.url ?? i.topic}: ERROR ${e.publicMessage ?? e.message}`, "");
  }
}
out.push(`Total spend: $${spent.toFixed(4)} for ${BRIEFS.length + IDEAS.length} runs ($${(spent / (BRIEFS.length + IDEAS.length)).toFixed(4)} each).`);
fs.writeFileSync("ai-tools-samples.md", out.join("\n"));
console.log(out.at(-1), "Results in ai-tools-samples.md");
