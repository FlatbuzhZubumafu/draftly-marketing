// Static content for the AI tool pages: the copyable SEO content brief template
// (what people searching "seo content brief template" want) and one example result
// per tool, shown before the first run and whenever the AI tools are switched off.
// The examples are hand-written and contain no prices or statistics on purpose.
import type { Brief } from "./tools/ai/brief.ts";
import type { IdeasResult } from "./tools/ai/ideas.ts";

export const BRIEF_TEMPLATE = `# SEO content brief

## The basics
- Target keyword:
- Related phrases (2 to 5):
- Search intent (informational, commercial, transactional, local):
- What the searcher wants to walk away with (one sentence):
- Audience:

## Title and meta
- Working title (40 to 60 characters, keyword near the front):
- Meta description (120 to 155 characters, says what the reader gets):
- URL slug:

## Length
- Word count range:
- Why that range (what the top results cover):

## Outline
Put the direct answer in the first section.

### H2:
- Must say:
- Must say:

### H2:
- Must say:
- Must say:

### H2:
- Must say:
- Must say:

## Questions to answer
1.
2.
3.

## What ranking pages cover
- Subtopic:
- Subtopic:
- What none of them cover well (your angle):

## Sources to cite
- Claim that needs a source, and where to find it:

## Links
- Internal links (page, anchor text):
- External links (source, why it's trustworthy):

## Voice and call to action
- Tone notes or brand voice guide:
- Words to avoid:
- Call to action at the end:
`;

export const BRIEF_TEMPLATE_FILENAME = "seo-content-brief-template.md";

export const SAMPLE_BRIEF: Brief = {
  keyword: "water heater repair cost",
  intent: {
    type: "commercial",
    summary: "A homeowner with a broken or failing water heater wants to know what a repair usually costs, what drives the price up and whether replacing the unit makes more sense.",
  },
  audience: "Homeowners deciding whether to call a plumber, fix the unit or replace it.",
  title: "Water Heater Repair Cost: What You'll Pay and Why",
  meta: "What water heater repairs usually cost, which parts drive the price and when replacing the tank is the better deal. Written by a local plumber.",
  wordCount: { min: 1200, max: 1800 },
  outline: [
    { h2: "What most water heater repairs cost", points: ["Give your own price ranges for the five most common repairs", "Say what's included: the visit, the part and the labor"] },
    { h2: "Gas and electric heaters break in different ways", points: ["Thermocouple and gas valve problems on gas units", "Heating elements and thermostats on electric units"] },
    { h2: "What makes a repair cost more", points: ["After-hours calls, hard-to-reach units and older models with scarce parts", "Code updates the repair can trigger, like expansion tanks"] },
    { h2: "Repair or replace?", points: ["A simple rule based on the unit's age and the repair price", "Signs the tank itself is failing: rust in the water, leaks at the base"] },
    { h2: "What you can check before you call", points: ["Pilot light, breaker and thermostat setting", "When to shut off the water and gas and stop there"] },
    { h2: "How we price water heater repairs", points: ["Explain your diagnostic fee and whether it goes toward the repair", "Link to booking"] },
  ],
  questions: [
    "Is it worth repairing a 10-year-old water heater?",
    "How long does a water heater repair take?",
    "Why is my water heater leaking from the bottom?",
    "Does homeowners insurance cover water heater repair?",
    "Can I replace a heating element myself?",
  ],
  mustCover: [
    "Price ranges by repair type, not one average number",
    "Gas versus electric differences",
    "Repair-or-replace guidance based on age",
    "Warning signs that need a plumber right away",
    "Safety steps before any DIY check",
  ],
  sources: [
    "Your own invoices or price list for the cost ranges",
    "Manufacturer warranty pages for typical tank lifespan",
    "Your local building code office for permit and expansion tank rules",
  ],
  internalLinks: [],
  site: null,
  notes: [],
};

export const SAMPLE_IDEAS: IdeasResult = {
  business: "A residential plumbing company that handles repairs, drain cleaning and water heater installs.",
  topic: "residential plumbing",
  site: null,
  notes: [],
  ideas: [
    { title: "How to Keep Your Pipes From Freezing This Winter", angle: "A night-before checklist for a hard freeze, with the three spots in a house that freeze first.", type: "seasonal", reader: "Homeowners before the first cold snap" },
    { title: "Tank or Tankless Water Heater: Which Fits Your House?", angle: "Compare upfront cost, monthly bills and space for a family of four, with no brand pitch.", type: "comparison", reader: "Owners replacing an old tank" },
    { title: "What a Drain Cleaning Visit Costs and What's Included", angle: "Explain your own pricing for snaking versus hydro jetting and when each one is worth it.", type: "cost", reader: "People with a slow or backed-up drain" },
    { title: "5 Things to Do Before the Plumber Arrives", angle: "Shutoff valves, clearing access and photos that make the visit faster and cheaper.", type: "checklist", reader: "Anyone who just booked a plumber" },
    { title: "Why Your Water Heater Makes a Popping Noise", angle: "Sediment buildup explained, how to flush the tank yourself and when the noise means trouble.", type: "faq", reader: "Owners hearing new noises from the tank" },
    { title: "Hosting Thanksgiving? Keep Your Kitchen Drain Clear", angle: "What not to put down the disposal on the busiest cooking day of the year.", type: "seasonal", reader: "Holiday hosts" },
    { title: "The DIY Plumbing Fixes That Usually Make Things Worse", angle: "Chemical drain cleaners, overtightened fittings and tape in the wrong direction.", type: "mistakes", reader: "Handy homeowners" },
    { title: "How to Find and Use Your Main Water Shutoff", angle: "Where it usually is in local homes, what it looks like and how to test it today.", type: "how-to", reader: "New homeowners" },
    { title: "When a Running Toilet Is Costing You Money", angle: "The food-coloring leak test and the two parts that fix most running toilets.", type: "how-to", reader: "Homeowners with a high water bill" },
    { title: "What to Ask Before You Hire a Plumber", angle: "License, warranty, upfront pricing and the questions that separate pros from handymen.", type: "faq", reader: "People comparing quotes" },
  ],
};
