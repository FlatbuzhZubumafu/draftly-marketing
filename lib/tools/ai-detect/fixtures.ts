// PORTED FROM THE APP. Do not edit the logic here; change it in the app and copy it again.
// Source: FlatbuzhZubumafu/draftly.blog supabase/functions/_shared/ai-detect.fixtures.ts
// at commit 4ecf2cc19683ca0c3192215aa41a8a2b8a954329.
// Copied verbatim: the sample texts the app's Deno tests (ai-detect.test.ts) use.
//
// Sample passages shared by the AI-detector tests (kept out of *.test.ts so other
// test files can import them without registering tests twice).
export const AI_SAMPLE = [
  "# Why regular maintenance matters for your home",
  "",
  "Regular maintenance plays a crucial role in protecting the value of your home. Additionally, it helps homeowners avoid costly repairs and unexpected disruptions. By staying proactive, you can ensure that every system in your home operates efficiently and reliably.",
  "",
  "Furthermore, a well-maintained home provides comfort, safety, and peace of mind for the entire family. Homeowners who invest in routine inspections often enjoy lower energy bills and fewer emergencies. Moreover, consistent care can significantly extend the lifespan of essential appliances and systems.",
  "",
  "When it comes to choosing a maintenance plan, it is essential to consider your specific needs and budget. A comprehensive approach ensures that potential issues are identified early and addressed effectively. Ultimately, investing in maintenance is a valuable decision that delivers lasting benefits for years to come.",
].join("\n");

// A person writing: varied sentences, names and numbers, contractions, an aside.
export const HUMAN_SAMPLE = [
  "# The Rheem in our basement lasted 14 years",
  "",
  "Our Rheem tank finally quit in February, two days before my in-laws flew in from Tucson. Bad timing. The plumber, a guy named Dale who's been fixing heaters in Boise since 1998, took one look at the anode rod and laughed.",
  "",
  "\"Nobody's flushed this thing since Clinton,\" he said. He wasn't wrong; I'd never touched it. Sediment had packed the bottom six inches like wet sand, and the burner was cooking through it every time someone showered.",
  "",
  "So here's what I'd tell anyone with a tank older than ten: drain a few gallons each spring. It takes twenty minutes and a garden hose. If the water comes out brown, keep going until it runs clear (mine never did). And if you hear popping when the burner kicks on, that's the sediment, and you're on borrowed time.",
].join("\n");
