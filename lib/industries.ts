import type { Faq } from "@/components/ArticleParts";

// Data for the /blog-ideas/<industry> pages. One entry per industry; the route renders
// them all the same way, so a new industry is one more entry here plus its keyword check.
// Keyword numbers are Ahrefs Keywords Explorer, US, checked 2026-10-16. Rules and dates in
// `rules` were read on the linked source pages that day (the ABA pages block scripts, so
// those links were not fetched; the AICPA code PDF didn't load, so the AICPA mention is general).

export type Source = { label: string; href: string };
export type Topic = { title: string; note: string };
export type TopicGroup = { id: string; heading: string; intro: string; topics: Topic[] };
export type Rule = { heading: string; body: string; sources?: Source[] };

export type Industry = {
  slug: string;
  /** Short name for cards and lists: "Plumbing". */
  name: string;
  /** Who the page is for, used in running copy: "plumbers". */
  audience: string;
  /** Adjective for "Writing ___ posts": "plumbing", "law firm". */
  postNoun: string;
  title: string;
  description: string;
  h1: { lead: string; accent: string };
  /** Opening paragraphs under the H1. */
  intro: string[];
  groups: TopicGroup[];
  rulesHeading: string;
  rulesIntro: string;
  rules: Rule[];
  /** How Draftly fits this industry, one paragraph each. */
  draftly: string[];
  /** The free tool most worth running first, and why, for this industry. */
  tool: { href: string; name: string; why: string };
  /** Product screenshot shown with the Draftly section. */
  shot: "urlToPost" | "brandVoice";
  cta: { heading: string; body: string };
  faqs: Faq[];
  /** Words KeepReading scores guides and posts against. */
  readingTopic: string;
  ogLine: string;
  keywords: string;
};

export const INDUSTRIES_DATE = { iso: "2026-10-16", label: "October 16, 2026" };
export const INDUSTRIES_HUB = {
  path: "/blog-ideas",
  title: "Blog Ideas by Industry, With the Rules for Each",
  description:
    "Blog topic ideas for eight industries, from plumbers and roofers to dentists, law firms and financial advisors, plus the advertising rules each one follows.",
};

const CMS_LINE = "WordPress, Shopify, Webflow, Ghost, Squarespace or HubSpot";

export const INDUSTRIES: Industry[] = [
  {
    slug: "plumbing",
    postNoun: "plumbing",
    name: "Plumbing",
    audience: "plumbers",
    // "plumbing blog ideas" 150/mo KD 0, "plumbing blog topics" 50 KD 0, "plumber blog" 90 KD 0.
    keywords: "plumbing blog ideas, plumbing blog topics, plumber blog",
    title: "Plumbing Blog Ideas: Topics Grouped by What Homeowners Need",
    description:
      "Plumbing blog ideas grouped by what the homeowner is dealing with: leaks right now, replacement costs, seasonal jobs and local trust, plus what to check first.",
    h1: { lead: "Plumbing blog ideas", accent: "homeowners search for" },
    intro: [
      "People look up a plumber in one of two moods. Something is leaking right now, or they're planning a bigger job like a water heater or a repipe. A plumbing blog that brings in calls answers both.",
      "The usual lists give you 100 or more titles. This one is shorter and grouped by what the reader is going through, with a note on what makes each post worth writing. Swap in your city, your prices and your own jobs, because that's the part a national site can't copy.",
    ],
    groups: [
      {
        id: "right-now",
        heading: "When something is leaking right now",
        intro:
          "These readers are on their phone with water on the floor. Keep the steps short, put your phone number near the top, and tell them where the safe DIY part stops.",
        topics: [
          { title: "What to do when a pipe bursts, before the plumber gets there", note: "Main shutoff, power to the water heater, photos for insurance. Say where shutoffs usually sit in homes in your area." },
          { title: "How to find your main water shutoff valve", note: "Basement, crawlspace, garage or the curb box. A photo from a real local job beats a stock image." },
          { title: "Why is my water heater leaking from the bottom?", note: "Tank failure, a drain valve or the relief valve. Explain which ones are a same-day call." },
          { title: "Toilet keeps running: the three parts that usually cause it", note: "Flapper, fill valve, float. One of the few posts where a full DIY fix is fine." },
          { title: "Sewer smell in the basement: what it usually means", note: "Often a dry floor drain trap. Say when it means a cracked vent or sewer line instead." },
          { title: "No hot water: what to check on a gas or electric heater", note: "Pilot, breaker, reset button. Stop at anything that means opening a gas line." },
          { title: "You smell gas: what to do first", note: "Leave the house, then call the gas utility or 911 from outside. Keep this one short and put it where people can find it fast." },
        ],
      },
      {
        id: "planning",
        heading: "Planning a bigger job",
        intro:
          "These readers are comparing quotes. Real price ranges, dated and specific to your market, are what get these posts read and shared.",
        topics: [
          { title: "Tank vs tankless water heater for a family of four", note: "Upfront cost, gas line or electrical upgrades, and how long each lasts in your water." },
          { title: "How long does a water heater last, and when to replace it", note: "Age on the serial number, rust in the water, rumbling. Show how to read the label." },
          { title: "What it costs to repipe a house in your city", note: "Give the range you actually quote, the year, and what moves the price." },
          { title: "PEX or copper for a repipe", note: "Cost, freeze tolerance, and what your local inspectors are used to seeing." },
          { title: "Should a home buyer get a sewer camera inspection?", note: "What it finds that a general home inspection skips, and what it costs." },
          { title: "Do you need a water softener here?", note: "Use the hardness numbers from your water utility's annual Consumer Confidence Report." },
          { title: "What permits a water heater replacement needs in your city", note: "Many cities require one. Link the local permit page and say who pulls it." },
        ],
      },
      {
        id: "seasonal",
        heading: "Seasonal posts",
        intro: "Publish these four to six weeks before the season, so they're indexed when the calls start.",
        topics: [
          { title: "How to winterize outdoor spigots and irrigation lines", note: "Shutoff inside, open the bib, blow out or drain. Mention backflow testing if your city requires it." },
          { title: "Frozen pipes: how to thaw them safely", note: "Hair dryer or space heater, never an open flame. Which walls freeze first in local homes." },
          { title: "Test your sump pump before spring storms", note: "Bucket test, check valve, battery backup. Time it to your local rainy season." },
          { title: "What not to put down the disposal on Thanksgiving", note: "Grease, peels, rice and pasta. The day after Thanksgiving is a busy one for drain calls." },
          { title: "Getting a vacation home or rental ready for winter", note: "Shutoff, drained lines, heat left on, and who checks on it." },
        ],
      },
      {
        id: "trust",
        heading: "Local trust and proof",
        intro: "These posts get little search traffic, and they're what a reader checks right before calling you.",
        topics: [
          { title: "Does my home have a lead service line?", note: "Utilities had to publish service line inventories in October 2024. Link your utility's lookup and explain what replacement involves." },
          { title: "Water pressure too high: what a pressure reducing valve does", note: "A gauge on the hose bib tells them. Explain why high pressure wears out fixtures." },
          { title: "How to check a plumber's license in your state", note: "Link your state board's lookup. Then show your own license number." },
          { title: "A recent job, start to finish", note: "The problem, what you found, what it cost and photos. Ask the customer first and leave out their address." },
          { title: "What our maintenance plan covers", note: "What you check, how often, and what it costs. Readers want the list." },
        ],
      },
    ],
    rulesHeading: "Before you publish a plumbing post",
    rulesIntro: "A few habits keep plumbing posts useful and keep you out of trouble with customers and inspectors.",
    rules: [
      {
        heading: "Say where DIY stops",
        body: "Shutoffs, plungers, running toilets and reset buttons are fine to explain. Gas lines, relief valves and anything that needs a permit belong to a licensed plumber. Write that line into the post so a reader doesn't hurt themselves following it.",
      },
      {
        heading: "Show your license number",
        body: "Many state plumbing boards require a license number on advertising. Check your board's rules and put the number in the blog footer or author box so every post carries it.",
      },
      {
        heading: "Date your prices",
        body: "Give the range you really charge and the year you wrote it. Old prices are the fastest way to get an angry phone call. Update them each spring.",
      },
      {
        heading: "Use local code and water data",
        body: "States and cities adopt different plumbing codes, and water hardness varies by utility. Cite your local code and your utility's water report by name instead of a national average.",
        sources: [
          { label: "EPA: Consumer Confidence Reports", href: "https://www.epa.gov/ccr" },
          { label: "EPA: lead service line inventories", href: "https://www.epa.gov/ground-water-and-drinking-water/revised-lead-and-copper-rule" },
        ],
      },
      {
        heading: "Get permission for job photos",
        body: "Ask the customer before you post their bathroom, and crop out house numbers, faces and anything personal on the walls.",
      },
    ],
    draftly: [
      "Draftly reads your website and sets your brand voice from it, so posts sound like your shop and your service area. Type a topic like \"how to flush a water heater\" and it writes the full post with a URL slug, meta title and meta description. The example on this page is exactly that, written for a made-up plumber.",
      "You add the parts only you have: your prices, your city's permit rules and photos from real jobs. Then publish to " + CMS_LINE + ". Marketing agencies that run blogs for several plumbers can add each client as its own website with its own voice.",
    ],
    tool: { href: "/tools/blog-seo-checker", name: "blog SEO checker", why: "Run your best post through it to see which SEO basics it's missing before you write new ones." },
    shot: "urlToPost",
    cta: {
      heading: "Get a plumbing post written for your site",
      body: "Paste your URL and Draftly writes a full post in your shop's voice, ready for " + CMS_LINE + ". Your first post is free.",
    },
    faqs: [
      {
        q: "How often should a plumbing company blog?",
        a: "Two posts a month is enough to start if they're good. Publish seasonal posts four to six weeks before the season, and update your top posts each year with current prices.",
      },
      {
        q: "What plumbing blog topics get the most calls?",
        a: "Emergency posts like burst pipes, leaking water heaters and no hot water, because the reader needs help now. Put your phone number near the top of those.",
      },
      {
        q: "Should a plumbing blog explain DIY fixes?",
        a: "Yes for simple jobs like running toilets and finding the shutoff. Say clearly where DIY stops, especially for gas, relief valves and anything that needs a permit.",
      },
      {
        q: "Can AI write plumbing blog posts?",
        a: "It can write a solid draft. A plumber should still add local prices, permit rules and job photos, and check the safety steps before it goes live.",
      },
    ],
    readingTopic: "plumbing blog small business local service write blog post brand voice",
    ogLine: "Topics plus what to check first",
  },
  {
    slug: "hvac",
    postNoun: "HVAC",
    name: "HVAC",
    audience: "HVAC companies",
    // "hvac blog topics" 200/mo KD 0, the parent topic for "hvac blog ideas".
    keywords: "hvac blog topics, hvac blog ideas",
    title: "HVAC Blog Topics: Ideas for Heating and Cooling Companies",
    description:
      "HVAC blog topics for breakdowns, replacements and maintenance, plus what homeowners ask about in 2026: new refrigerants and the end of the 25C tax credit.",
    h1: { lead: "HVAC blog topics", accent: "for heating and cooling companies" },
    intro: [
      "HVAC searches follow the weather. The first hot week brings \"AC not cooling\" and the first cold night brings \"furnace won't turn on.\" A good HVAC blog has those posts ready before the phones light up.",
      "2026 also gave homeowners new questions. New systems use different refrigerants, and the federal tax credit many HVAC sites still advertise ended with 2025. Those make good posts, and they're a reason to check your old ones.",
    ],
    groups: [
      {
        id: "breakdowns",
        heading: "Breakdowns and no-heat calls",
        intro: "Short, calm posts with the safe checks first and your phone number near the top.",
        topics: [
          { title: "AC running but not cooling: what to check first", note: "Thermostat setting, filter, breaker, frozen coil. Then when to call." },
          { title: "Furnace short cycling: common causes", note: "Dirty filter, flame sensor, oversized system. Say which ones need a tech." },
          { title: "Heat pump covered in ice: when it's normal and when it isn't", note: "Defrost cycles look alarming. Explain what normal looks like in your climate." },
          { title: "Water around the furnace or air handler", note: "Clogged condensate line is the usual answer. Show where the line runs." },
          { title: "Thermostat screen is blank", note: "Batteries, the breaker, a tripped float switch. Quick wins readers can try." },
          { title: "Your carbon monoxide alarm went off: what to do", note: "Get everyone out and call 911 or the gas utility from outside. Keep it short and skip troubleshooting." },
        ],
      },
      {
        id: "replacement",
        heading: "Repair or replace",
        intro: "These readers are about to spend thousands. Give them real numbers from your market and explain your reasoning.",
        topics: [
          { title: "Repair or replace your AC: how we decide", note: "Age, repair cost, refrigerant type. Share the rule of thumb your techs use." },
          { title: "What the new refrigerants mean if you're replacing an AC", note: "EPA rules are moving new systems from R-410A to refrigerants like R-454B and R-32. What that changes for a homeowner." },
          { title: "Heat pump or furnace in our climate", note: "Winter lows, gas prices and electric rates where you work." },
          { title: "What size system does my house need?", note: "Explain a load calculation and why tonnage by square footage goes wrong." },
          { title: "What SEER2 rating means and the minimum for our region", note: "Efficiency minimums differ by region. Say which one your customers are in." },
          { title: "Ductless mini splits for a garage, addition or bonus room", note: "Cost, what one head can cover, and how it looks on the wall." },
          { title: "My system uses R-22. What now?", note: "R-22 isn't produced anymore, so recharges get expensive. Lay out the options." },
        ],
      },
      {
        id: "maintenance",
        heading: "Maintenance and seasonal posts",
        intro: "Publish these before each season and link them from your maintenance plan page.",
        topics: [
          { title: "Spring AC tune-up: what our techs check", note: "Your real checklist, item by item." },
          { title: "Fall furnace checklist", note: "Filter, flame sensor, heat exchanger, CO test." },
          { title: "How often to change your air filter", note: "By filter type, pets and allergies. Show the size printed on the frame." },
          { title: "Filters and air cleaners for wildfire smoke", note: "Higher-rated filters and portable air cleaners. Link EPA's home air filter guide." },
          { title: "Winter humidity: why your house feels dry", note: "Humidifier options and the window condensation that means it's set too high." },
        ],
      },
      {
        id: "money",
        heading: "Money, rebates and rules",
        intro: "Homeowners search these before they call. Getting them right is how you earn the call.",
        topics: [
          { title: "Is there still a federal tax credit for heat pumps in 2026?", note: "The 25C credit covered equipment installed through December 31, 2025. Point readers to utility and state rebates instead." },
          { title: "Utility rebates for heat pumps and smart thermostats in your area", note: "List the programs by name and link them. Update the post when they change." },
          { title: "What a maintenance plan costs and what it saves", note: "Your price and what's included. Skip savings claims you can't back up." },
          { title: "Financing a new system: what to ask", note: "APR, term, and what happens if you sell the house." },
        ],
      },
    ],
    rulesHeading: "Before you publish an HVAC post",
    rulesIntro: "HVAC posts age fast because the rules and rebates change. These checks keep them accurate.",
    rules: [
      {
        heading: "Fix old tax credit posts",
        body: "The federal Energy Efficient Home Improvement Credit (25C) applied to qualifying equipment placed in service through December 31, 2025. Posts that still promise a 30% credit on a 2026 install will send you upset customers. Update them to point at current utility and state rebates.",
        sources: [{ label: "IRS: Energy Efficient Home Improvement Credit", href: "https://www.irs.gov/credits-deductions/energy-efficient-home-improvement-credit" }],
      },
      {
        heading: "Skip DIY refrigerant posts",
        body: "Under EPA's Section 608 rules, technicians need certification to work with refrigerant. Write about symptoms and what your tech will check. Leave recharge how-tos out.",
        sources: [{ label: "EPA: Section 608", href: "https://www.epa.gov/section608" }],
      },
      {
        heading: "Get refrigerant details right",
        body: "EPA's Technology Transitions program limits higher-impact HFC refrigerants in new air conditioning and heat pump systems. Name the refrigerant your installs use and link the rule.",
        sources: [{ label: "EPA: Technology Transitions", href: "https://www.epa.gov/climate-hfcs-reduction/technology-transitions" }],
      },
      {
        heading: "Treat carbon monoxide as an emergency",
        body: "Any post that mentions CO should tell readers to get out and call for help first. Troubleshooting comes after the house is safe.",
        sources: [{ label: "EPA: carbon monoxide", href: "https://www.epa.gov/indoor-air-quality-iaq/carbon-monoxides-impact-indoor-air-quality" }],
      },
      {
        heading: "Back up efficiency claims",
        body: "\"Cut your bill in half\" needs a source. Use the manufacturer's rated numbers or ENERGY STAR data and link them. If you're a factory-authorized dealer, check your manufacturer's rules for how you name its products.",
      },
    ],
    draftly: [
      "Draftly sets your brand voice from your website and turns industry news and feeds into topic ideas each day, so a rule change or a heat wave shows up as a post idea while it still matters. You can also type your own topic, like \"what the new refrigerants mean for homeowners.\"",
      "Every draft comes with a URL slug, meta title and meta description, and gets checked against writing rules and for AI-sounding phrasing before you see it. You add your prices and rebate links, then publish to " + CMS_LINE + ".",
    ],
    tool: { href: "/tools/content-refresh-checker", name: "content refresh checker", why: "It lists the posts on your blog that haven't been updated in a year, which is where outdated tax credit and refrigerant advice usually sits." },
    shot: "brandVoice",
    cta: {
      heading: "Get an HVAC post written for your site",
      body: "Paste your URL and Draftly writes a full post in your company's voice, ready for " + CMS_LINE + ". Your first post is free.",
    },
    faqs: [
      {
        q: "What should an HVAC company blog about?",
        a: "Breakdown posts for peak season, repair-or-replace posts with your real prices, maintenance checklists, and current rebate and rule changes in your area.",
      },
      {
        q: "When should HVAC companies publish seasonal posts?",
        a: "Four to six weeks before the season, so the posts are indexed when the first heat wave or cold snap hits.",
      },
      {
        q: "Is the heat pump tax credit still available in 2026?",
        a: "The federal 25C credit applied to equipment placed in service through December 31, 2025, per the IRS. Check your utility and state for current rebates.",
      },
      {
        q: "Can AI write HVAC blog posts?",
        a: "It can write the draft. Someone at the company should add local prices and rebates and check every safety and refrigerant detail before it's published.",
      },
    ],
    readingTopic: "hvac heating cooling blog small business local service write blog post brand voice",
    ogLine: "Including the 2026 rule changes",
  },
  {
    slug: "real-estate",
    postNoun: "real estate",
    name: "Real estate",
    audience: "real estate agents",
    // "real estate blog ideas" 100/mo KD 0, "real estate blog topics" 60 KD 0, "real estate blog" 250 KD 12.
    keywords: "real estate blog ideas, real estate blog topics, real estate blog",
    title: "Real Estate Blog Ideas for Agents, With Fair Housing Notes",
    description:
      "Real estate blog ideas for agents: local market posts, buyer and seller guides, and the fair housing wording to check before a neighborhood post goes live.",
    h1: { lead: "Real estate blog ideas", accent: "for agents and brokerages" },
    intro: [
      "Your edge over Zillow and Realtor.com is what you know about your market: which streets flood, what sold last month and why, and how a deal really goes in your county. A real estate blog puts that knowledge where buyers and sellers search.",
      "Neighborhood posts are also where agents get into fair housing trouble, usually by describing who a place is right for. The ideas below come with notes on how to write them so they describe the property and the area.",
    ],
    groups: [
      {
        id: "local",
        heading: "Local market and neighborhood posts",
        intro: "These are the posts portals can't write. Use MLS numbers with a date and describe places by facts.",
        topics: [
          { title: "Monthly market update for your city", note: "Median price, days on market, months of inventory, with the MLS as the source and the month in the title." },
          { title: "Neighborhood guide: what's there and what sold", note: "Parks, commute times, HOA fees and recent sales. Describe the area, never who should live there." },
          { title: "Moving to your city from a nearby metro", note: "Cost of living, commute, weather, property taxes. Pick the city most of your buyers come from." },
          { title: "Property taxes in your county, explained", note: "How assessments work, exemptions and when bills arrive. Link the assessor's site." },
          { title: "New construction communities: what buyers should ask", note: "Builder incentives, lot premiums and why a buyer may still want their own agent." },
          { title: "Flood zones and insurance in your area", note: "How to read the FEMA map and what coverage costs. Useful for buyers and easy to keep factual." },
        ],
      },
      {
        id: "buyers",
        heading: "Buyer guides",
        intro: "First-time buyers search for everything. Answer one question per post and keep it local.",
        topics: [
          { title: "What a buyer agreement is and why you sign one before touring", note: "Since August 2024, NAR members need a written agreement with buyers before touring. Explain yours in plain words." },
          { title: "Closing costs in your state: what to save", note: "Line by line, with a range for a typical local price." },
          { title: "First-time buyer programs in your state", note: "Your state housing finance agency's programs, with income limits and links." },
          { title: "What an inspection contingency protects", note: "Timelines, what's normal to ask for, and when to walk away." },
          { title: "Appraisal gap: what happens if the home appraises low", note: "Options for buyer and seller, with a local example." },
          { title: "Your first offer: what we look at before writing one", note: "Comps, days on market and the seller's situation." },
        ],
      },
      {
        id: "sellers",
        heading: "Seller guides",
        intro: "Sellers are comparing agents. Show how you think, with real numbers from your listings.",
        topics: [
          { title: "What to fix before listing and what to skip", note: "The repairs that paid off on your recent listings and the ones that didn't." },
          { title: "How we price a home", note: "Walk through comps for a real (anonymized) listing." },
          { title: "How agent commissions work now", note: "Commissions are negotiable, and offers of buyer-agent pay can't go on the MLS. Explain how you handle it." },
          { title: "Selling a home with tenants in it", note: "Notice rules in your state, showings and timing." },
          { title: "Staging on a budget", note: "Photos from your own listings, with what each change cost." },
        ],
      },
      {
        id: "trust",
        heading: "Posts that build trust",
        intro: "Short posts a lead reads right before they call you.",
        topics: [
          { title: "A recent closing, start to finish", note: "The problem, the plan and the result. Get the client's OK and leave out their address." },
          { title: "What working with us looks like, week by week", note: "From the first call to the keys." },
          { title: "Questions to ask any agent before you hire one", note: "Answer them for yourself at the end." },
        ],
      },
    ],
    rulesHeading: "Fair housing and advertising rules to check",
    rulesIntro:
      "Your blog counts as advertising. Federal fair housing rules, your state's license law and, for REALTORS®, the NAR Code of Ethics all apply to it.",
    rules: [
      {
        heading: "Describe the property and the area",
        body: "The Fair Housing Act bars ads that show a preference based on race, color, religion, sex, disability, familial status or national origin. HUD's rule covers the words and photos you use. Write \"three bedrooms and a fenced yard\" in place of \"perfect for families,\" and \"a half mile from Lincoln Park\" in place of \"great for young professionals.\"",
        sources: [{ label: "24 CFR 100.75, discriminatory advertising", href: "https://www.ecfr.gov/current/title-24/subtitle-B/chapter-I/subchapter-A/part-100/subpart-B/section-100.75" }],
      },
      {
        heading: "Link school and crime data",
        body: "Calling an area \"safe\" or its schools \"the best\" can read as steering. Name the school district and link its site, and link public crime data if readers ask. Let them decide.",
      },
      {
        heading: "Check your state's extra protected classes",
        body: "Many states and cities add protections, such as source of income or age. Look up your state's list before you write about rentals or neighborhoods.",
      },
      {
        heading: "Follow advertising and brokerage rules",
        body: "State license law usually requires your brokerage name on advertising. NAR's Code of Ethics asks REALTORS® to present a true picture in their ads, and only members may use the REALTOR® mark. Put the brokerage name in the blog footer and date every market number.",
        sources: [
          { label: "NAR Code of Ethics", href: "https://www.nar.realtor/about-nar/governing-documents/code-of-ethics" },
          { label: "NAR: the facts on the settlement", href: "https://www.nar.realtor/the-facts" },
        ],
      },
    ],
    draftly: [
      "Draftly learns your voice from your website and suggests topics from real estate news each day, so a rate change or a new local rule turns into a post idea quickly. You can also type your own topic, like your monthly market update.",
      "Every draft is checked against writing rules and for AI-sounding phrasing. Read neighborhood posts against the fair housing notes above before you publish, add your MLS numbers, then publish to " + CMS_LINE + ". Brokerages can add agents as team members on one plan, with no per-seat charge.",
    ],
    tool: { href: "/tools/blog-seo-checker", name: "blog SEO checker", why: "Run a neighborhood guide through it to check titles, headings and links before you write more." },
    shot: "brandVoice",
    cta: {
      heading: "Get a real estate post written for your site",
      body: "Paste your URL and Draftly writes a full post in your voice, ready for " + CMS_LINE + ". Your first post is free.",
    },
    faqs: [
      {
        q: "What should a real estate agent blog about?",
        a: "Local market updates, neighborhood guides built on facts, buyer and seller guides for your state, and stories from recent closings with the client's permission.",
      },
      {
        q: "What words should real estate agents avoid in blog posts?",
        a: "Anything describing who should live somewhere, like \"perfect for families,\" \"adults only\" or \"great for young professionals,\" plus judgments like \"safe neighborhood.\" Describe the property and the area instead.",
      },
      {
        q: "Does fair housing law apply to a real estate blog?",
        a: "Yes. HUD's advertising rule covers words, phrases and photos used to market housing, and your blog is marketing. State license law and the NAR Code of Ethics also apply.",
      },
      {
        q: "Can AI write real estate blog posts?",
        a: "It can draft them. An agent should add MLS data with dates, check the post against fair housing rules and add the brokerage name before it goes live.",
      },
    ],
    readingTopic: "real estate agent blog local market small business write blog post brand voice",
    ogLine: "With fair housing notes",
  },
  {
    slug: "law-firms",
    postNoun: "law firm",
    name: "Law firms",
    audience: "law firms",
    // "legal blog writing" 150/mo KD 0, "legal blog topics" 100 KD 3, "law firm blog" 70 KD 0.
    keywords: "legal blog writing, legal blog topics, law firm blog",
    title: "Legal Blog Writing: Topics and Ethics Rules for Law Firms",
    description:
      "Legal blog topics that answer what clients search before they call, and the ABA and state bar advertising rules every law firm blog post has to follow.",
    h1: { lead: "Legal blog writing", accent: "for law firm blogs" },
    intro: [
      "People search for a lawyer after something has gone wrong: an accident, an arrest, a divorce, a death in the family. Before they call anyone they search their question. A law firm blog that answers it clearly, for their state, is how they find you.",
      "Legal posts also carry rules most businesses don't have. Your blog is lawyer advertising, so your state's version of the ABA Model Rules applies to every post. The topics below come first, then the rules.",
    ],
    groups: [
      {
        id: "what-next",
        heading: "What happens next",
        intro: "The highest-intent posts on a law firm site. Name the state in the title and answer the question in the first paragraph.",
        topics: [
          { title: "What to do after a car accident in your state", note: "Police report, medical records, insurance calls, and what not to sign." },
          { title: "How long you have to file a personal injury claim in your state", note: "The statute of limitations and the exceptions. Check the number and cite the statute." },
          { title: "What happens at a first DUI arraignment in your county", note: "What the hearing is, how long it takes and what to bring." },
          { title: "How courts decide child custody in your state", note: "The factors your state's statute lists, in plain words." },
          { title: "What probate is and how long it takes in your state", note: "Steps, typical timelines and when an estate can skip it." },
          { title: "Do I need a will or a trust?", note: "Costs, privacy and probate. Use your state's rules." },
        ],
      },
      {
        id: "cost",
        heading: "Cost and process",
        intro: "Clients worry about fees before anything else. Plain answers here make the first call easier.",
        topics: [
          { title: "How contingency fees work", note: "Your percentage, when costs come out, and what happens if you lose." },
          { title: "What a retainer is and how billing works", note: "Hourly rates, trust accounts and invoices, explained once." },
          { title: "What to bring to your first consultation", note: "A checklist by practice area." },
          { title: "How long a divorce takes in your state", note: "Waiting periods, contested and uncontested, with real ranges." },
          { title: "Mediation or court: how to choose", note: "Cost, time and when mediation doesn't fit." },
        ],
      },
      {
        id: "changes",
        heading: "Law changes and seasonal posts",
        intro: "Fresh posts that show you follow the law in your state. Give effective dates and link the source.",
        topics: [
          { title: "A new state law explained for clients", note: "What changed, the effective date and who it affects. Link the bill." },
          { title: "A recent court decision and what it means locally", note: "Short and factual. Say what it doesn't change, too." },
          { title: "Year-end estate planning checklist", note: "Beneficiary forms, guardianship, annual gifts." },
          { title: "Holiday custody schedules: how to plan them", note: "Common arrangements and how to change an order." },
        ],
      },
      {
        id: "firm",
        heading: "About the firm",
        intro: "Posts a prospective client reads right before they call.",
        topics: [
          { title: "How we handle a case like yours, step by step", note: "Your real process, by practice area." },
          { title: "Attorney profile: why I practice this area of law", note: "A real story in the lawyer's voice. Good for E-E-A-T." },
          { title: "A case result, with context", note: "Only with client consent, and with the disclaimer your state requires." },
        ],
      },
    ],
    rulesHeading: "Ethics rules for law firm blog posts",
    rulesIntro:
      "These come from the ABA Model Rules. Your state adopted its own version, and some states go further, so check your state bar's advertising rules before you rely on this list.",
    rules: [
      {
        heading: "No false or misleading statements",
        body: "Model Rule 7.1 bars communications that are false or misleading, including true statements that create unjustified expectations. Case results need context, and many states require a disclaimer that past results don't guarantee future outcomes.",
        sources: [{ label: "ABA Model Rule 7.1", href: "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_7_1_communication_concerning_a_lawyer_s_services/" }],
      },
      {
        heading: "Name the responsible lawyer",
        body: "Model Rule 7.2 requires advertising to include the name and contact information of at least one lawyer or firm responsible for its content. An author box with the attorney's name covers it on every post.",
        sources: [{ label: "ABA Model Rule 7.2", href: "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_7_2_advertising/" }],
      },
      {
        heading: "Careful with \"specialist\"",
        body: "Under Model Rule 7.2, a lawyer can't state or imply certification as a specialist unless an approved organization certified them, and the certifying organization has to be named.",
      },
      {
        heading: "Client stories need consent",
        body: "Model Rule 1.6 protects client information, and details can identify a client even without a name. Get informed consent before writing about a matter.",
        sources: [{ label: "ABA Model Rule 1.6", href: "https://www.americanbar.org/groups/professional_responsibility/publications/model_rules_of_professional_conduct/rule_1_6_confidentiality_of_information/" }],
      },
      {
        heading: "General information, clearly labeled",
        body: "Say that posts are general information and that reading or commenting doesn't create an attorney-client relationship. Turn off comments or keep facts out of them.",
      },
      {
        heading: "Check your state's extra rules",
        body: "Florida and Texas run their own advertising review processes, and New York requires an \"Attorney Advertising\" label on many communications. Your state bar's site lists what applies to you.",
      },
      {
        heading: "Supervise AI drafts",
        body: "ABA Formal Opinion 512 (July 2024) says lawyers using generative AI must understand the tool, check what it produces and protect client confidences. Treat an AI draft like a draft from a new associate: a lawyer reviews it before it goes live.",
        sources: [{ label: "ABA Formal Opinion 512", href: "https://www.americanbar.org/content/dam/aba/administrative/professional_responsibility/ethics-opinions/aba-formal-opinion-512.pdf" }],
      },
    ],
    draftly: [
      "Draftly writes from your website and a topic. It never needs client files, so keep client details out of the topics you type. It sets your firm's voice from your site, suggests topics from legal news each day, and drafts the post with a URL slug, meta title and meta description.",
      "An attorney reviews every draft, checks the law and the citations, and adds the disclaimers your state requires. Publish by hand to " + CMS_LINE + " instead of using Autopilot's automatic publishing, so nothing goes live without that review.",
    ],
    tool: { href: "/tools/eeat-checker", name: "E-E-A-T checker", why: "Google holds legal pages to a high bar for experience and trust, and the checker shows whether your posts carry author bylines, author pages, dates and citations." },
    shot: "brandVoice",
    cta: {
      heading: "Get a draft post for your firm's blog",
      body: "Paste your URL and Draftly writes a full draft in your firm's voice for an attorney to review, ready for " + CMS_LINE + ". Your first post is free.",
    },
    faqs: [
      {
        q: "What should a law firm blog about?",
        a: "The questions clients search before they call: what happens next in their situation, how long they have, what it costs, and how your state's law handles it. Name the state and answer in the first paragraph.",
      },
      {
        q: "Do lawyer advertising rules apply to a law firm blog?",
        a: "Generally yes. Most state bars treat a firm's website and blog as advertising, so their versions of ABA Model Rules 7.1 and 7.2 apply. Check your state bar's rules.",
      },
      {
        q: "Can lawyers use AI to write blog posts?",
        a: "ABA Formal Opinion 512 allows generative AI if lawyers understand the tool, verify the output and protect client confidences. A lawyer should review every AI draft before it's published.",
      },
      {
        q: "How long should a legal blog post be?",
        a: "Long enough to answer the question for your state, often 800 to 1,500 words. A clear answer in the first paragraph matters more than length.",
      },
    ],
    readingTopic: "law firm legal blog lawyer attorney small business write blog post brand voice",
    ogLine: "Topics plus the ethics rules",
  },
  {
    slug: "roofing",
    postNoun: "roofing",
    name: "Roofing",
    audience: "roofing contractors",
    // "roofing blog" 350/mo KD 2, "roofing blog topics" 100 KD 1, "roofing blog ideas" 50 KD 0.
    keywords: "roofing blog, roofing blog topics, roofing blog ideas",
    title: "Roofing Blog Topics: Ideas for Contractors, With Storm Rules",
    description:
      "Roofing blog topics for storm damage, insurance claims, replacement costs and materials, plus the deductible and adjuster rules to check before you publish.",
    h1: { lead: "Roofing blog topics", accent: "for contractors" },
    intro: [
      "Most roofing searches start after something happens: a hailstorm, a stain on the ceiling, an insurance letter. The rest come from homeowners pricing a replacement they've put off for years. A roofing blog that wins jobs has posts ready for both.",
      "Storm posts are also where roofers get into legal trouble. Several states bar contractors from promising to cover a deductible or from acting as the homeowner's adjuster, and website copy counts as advertising. The ideas below come with notes on how to write them so they stay on the right side of those rules.",
    ],
    groups: [
      {
        id: "storm",
        heading: "After a storm",
        intro:
          "These readers are looking at their roof from the driveway. Tell them what to check from the ground, what to photograph, and when to call. Publish them before storm season so they're indexed when the hail hits.",
        topics: [
          { title: "How to spot hail damage from the ground", note: "Dented gutters, downspouts and vents, granules in the gutters. Say why nobody should climb up to check." },
          { title: "What to do in the first 24 hours after a storm", note: "Photos, a tarp if water is coming in, a call to the insurer. Keep the steps short and put your phone number near the top." },
          { title: "Wind damage: missing shingles and what they let in", note: "Creased and lifted shingles, exposed nail heads. Explain why a small spot can turn into a ceiling stain." },
          { title: "How to spot a storm chaser", note: "Out-of-state plates, pressure to sign the same day, an offer to cover the deductible. Link your state's consumer guide." },
          { title: "Emergency tarping: when it's needed and what it costs", note: "Your real price, how fast you can get there, and that most policies expect you to prevent further damage." },
        ],
      },
      {
        id: "insurance",
        heading: "Insurance claims, explained",
        intro:
          "Explain how claims work in general. Don't promise to negotiate with the insurer or get the homeowner paid, because some states treat that as acting as an unlicensed public adjuster.",
        topics: [
          { title: "How a roof insurance claim works, step by step", note: "Claim, adjuster visit, estimate, depreciation, final payment. Describe your part honestly: the inspection and the work." },
          { title: "What recoverable depreciation means for your roof", note: "Why the first check is smaller and what releases the rest." },
          { title: "Why you have to pay your deductible", note: "Explain the law in your state and link it. Readers who got a too-good offer will find this post." },
          { title: "Repair or full replacement: how adjusters decide", note: "Matching shingles, how much of a slope is damaged, local code. Keep it general and say the insurer decides." },
          { title: "What a roof inspection report should include", note: "Photos of each slope, measurements, the damage you found. Show a real one with the address removed." },
        ],
      },
      {
        id: "replacement",
        heading: "Planning a replacement",
        intro:
          "These readers are comparing quotes. Real price ranges, dated and specific to your market, keep them reading.",
        topics: [
          { title: "What a roof replacement costs in your city this year", note: "Your real range by roof size and material, the year, and what moves the price (tear-off layers, decking, pitch)." },
          { title: "Architectural shingles or metal roofing", note: "Upfront cost, lifespan, noise, and how each handles your weather." },
          { title: "How long does an asphalt roof last here?", note: "Climate, ventilation and attic heat. Use what you see on local tear-offs." },
          { title: "What's in a roofing estimate, line by line", note: "Underlayment, drip edge, flashing, ventilation, disposal. Explain why two bids differ." },
          { title: "Manufacturer warranty or workmanship warranty", note: "What each covers and who honors it. Name the warranties you actually offer." },
          { title: "Do you need a permit to replace a roof in your city?", note: "Many cities require one. Link the permit page and say who pulls it." },
        ],
      },
      {
        id: "trust",
        heading: "Seasonal posts and local trust",
        intro: "Lower search volume, and they're what a homeowner reads right before calling you.",
        topics: [
          { title: "Fall roof checklist before the first freeze", note: "Gutters, flashing, attic ventilation. Time it for your region." },
          { title: "Ice dams: why they form and how to prevent them", note: "Attic insulation and ventilation do more than heat cables. Skip this one if you work where it doesn't snow." },
          { title: "How to check a roofer's license or registration in your state", note: "Link the lookup if your state has one. Then show yours." },
          { title: "A recent roof replacement, start to finish", note: "The problem, what you found under the shingles, the cost and photos. Get the homeowner's OK and leave out the address." },
        ],
      },
    ],
    rulesHeading: "Rules to check before you publish a roofing post",
    rulesIntro:
      "Storm and insurance posts are advertising. Here's what to check, with two states' rules as examples. Your state may have its own, so look them up before you rely on this list.",
    rules: [
      {
        heading: "Never offer to cover the deductible",
        body: "Colorado law says a roofing contractor paid from an insurance policy \"shall not advertise or promise to pay, waive, or rebate\" any part of the deductible. Texas bars contractors from offering to waive, rebate or absorb a deductible. Lines like \"we'll work with your deductible\" don't belong in a blog post.",
        sources: [
          { label: "Colorado C.R.S. 6-22-105", href: "https://colorado.public.law/statutes/crs_6-22-105" },
          { label: "Texas Department of Insurance: roofing and insurance", href: "https://www.tdi.texas.gov/consumer/storms/roofing-and-insurance-know-the-law.html" },
        ],
      },
      {
        heading: "Don't write like a public adjuster",
        body: "Texas bars roofers from acting as a public adjuster on jobs they're doing or advertising that they will, and the state says websites count as advertising. Skip promises to negotiate the claim, speak for the homeowner on coverage, or get them \"every dime\" from the insurer.",
        sources: [{ label: "Texas Department of Insurance: roofing and insurance", href: "https://www.tdi.texas.gov/consumer/storms/roofing-and-insurance-know-the-law.html" }],
      },
      {
        heading: "Retire the ENERGY STAR roof claims",
        body: "EPA ended the ENERGY STAR program for roof products on June 1, 2022. If an old post calls a shingle ENERGY STAR certified, update it and use the Cool Roof Rating Council's directory for reflectance numbers instead.",
        sources: [{ label: "Cool Roof Rating Council: ENERGY STAR roofing sunset", href: "https://coolroofs.org/news/energy-star-roofing-program-sunsets" }],
      },
      {
        heading: "No federal tax credit for a new roof",
        body: "The IRS page for the Energy Efficient Home Improvement Credit doesn't list roofs, and the credit covered property placed in service through 2025. Take down any post that says otherwise.",
        sources: [{ label: "IRS: Energy Efficient Home Improvement Credit", href: "https://www.irs.gov/credits-deductions/energy-efficient-home-improvement-credit" }],
      },
      {
        heading: "Reviews have to be real",
        body: "Since October 21, 2024, the FTC's rule on consumer reviews bans fake reviews and paying for reviews that have to be positive. Quote real customers, with permission.",
        sources: [{ label: "FTC: Consumer Reviews and Testimonials Rule Q&A", href: "https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers" }],
      },
    ],
    draftly: [
      "Draftly reads your website and sets your brand voice from it, so posts sound like your crew and your service area. Type a topic like \"how to spot hail damage from the ground\" and it writes the full post with a URL slug, meta title and meta description.",
      "You add what only you have: your prices, your state's deductible rule and photos from real jobs. Then publish to " + CMS_LINE + ". Marketing agencies that run blogs for several roofers can add each client as its own website with its own voice.",
    ],
    tool: { href: "/tools/blog-ideas-generator", name: "blog ideas generator", why: "Enter your website and it suggests 10 posts your customers would search for, skipping topics your blog already covers." },
    shot: "urlToPost",
    cta: {
      heading: "Get a roofing post written for your site",
      body: "Paste your URL and Draftly writes a full post in your company's voice, ready for " + CMS_LINE + ". Your first post is free.",
    },
    faqs: [
      {
        q: "What should a roofing company blog about?",
        a: "Storm damage posts before storm season, plain explanations of how insurance claims work, replacement costs with your real prices, and material comparisons for your climate.",
      },
      {
        q: "Can a roofer offer to pay the deductible in a blog post?",
        a: "Not in states like Colorado and Texas, which bar contractors from offering to pay, waive or rebate a deductible. Check your own state's law before you mention deductibles at all.",
      },
      {
        q: "When should roofers publish storm posts?",
        a: "Four to six weeks before your hail or hurricane season, so they're indexed when the first storm hits.",
      },
      {
        q: "Can AI write roofing blog posts?",
        a: "It can write the draft. Someone at the company should add local prices, check every insurance and safety detail, and make sure nothing reads like a deductible offer before it goes live.",
      },
    ],
    readingTopic: "roofing roofer blog small business local service write blog post brand voice",
    ogLine: "Topics plus the storm and insurance rules",
  },
  {
    slug: "dental",
    postNoun: "dental",
    name: "Dental",
    audience: "dental practices",
    // "dental blog" 350/mo KD 4 (SERP mostly lists of blogs to follow), "content marketing for dentists" 90 KD 0,
    // "dentist blog" 70 KD 3, "dental blog ideas" 20 KD 0, "dental blog topics" 20 KD 2.
    keywords: "dental blog ideas, dental blog topics, dental blog, content marketing for dentists",
    title: "Dental Blog Ideas: Topics Patients Search Before They Book",
    description:
      "Dental blog ideas grouped by what patients search: urgent problems, costs and insurance, family care and treatments, plus the ADA and HIPAA rules to check.",
    h1: { lead: "Dental blog ideas", accent: "patients search before they book" },
    intro: [
      "Patients look up a dentist when something hurts, when a bill surprises them, or when a treatment plan has a word they don't know. A dental blog that fills the schedule answers those questions in your practice's voice, with your fees and your insurance list.",
      "Dental posts carry rules most small businesses don't have. The ADA's ethics code covers bylines and before-and-after claims, and HIPAA covers patient stories and photos. The ideas below come with notes on writing them so they stay inside those lines.",
    ],
    groups: [
      {
        id: "urgent",
        heading: "When something hurts",
        intro:
          "These readers are in pain or scared. Lead with what to do right now, put your phone number near the top, and say when it means the ER instead of your office.",
        topics: [
          { title: "Knocked-out tooth: what to do in the first hour", note: "Hold it by the crown, keep it moist (milk works) and get to a dentist fast. Put this one where people can find it quickly." },
          { title: "Toothache at night: what helps until morning", note: "Rinse, floss around it, an over-the-counter pain reliever. Say which signs mean the ER, like facial swelling with a fever." },
          { title: "Chipped or cracked tooth: does it need same-day care?", note: "Pain, sharp edges and sensitivity. Explain what you can do in one visit." },
          { title: "Lost a filling or crown: what to do", note: "Keep the crown, avoid that side, call. Mention any same-week openings you hold for it." },
          { title: "Bleeding gums when you brush: what it usually means", note: "Usually gingivitis, sometimes a new brush or medication. When to book a visit." },
        ],
      },
      {
        id: "cost",
        heading: "Costs and insurance",
        intro:
          "Patients search prices before they call. Give your real fees or ranges and the year, and list the plans you take by name.",
        topics: [
          { title: "How much does a cleaning cost without insurance here?", note: "Your fee for a cleaning and exam, and any in-house membership plan." },
          { title: "Use your dental benefits before they reset", note: "Many plans reset on January 1. Publish in October and link your booking page." },
          { title: "What our in-house membership plan covers", note: "Price, what's included and the discount on other work. Readers want the list." },
          { title: "Which insurance plans we take, and what in-network means", note: "Name the plans. Explain out-of-network billing in plain words." },
          { title: "Crown cost and what changes the price", note: "Material, a build-up, a root canal first. Give your range." },
        ],
      },
      {
        id: "family",
        heading: "Kids and family",
        intro: "Parents search these, and a family practice can answer them better than a national health site.",
        topics: [
          { title: "When should my child see a dentist for the first time?", note: "The American Academy of Pediatric Dentistry says by the first birthday. Describe what that first visit looks like in your office." },
          { title: "Sealants or fluoride: what does my child need?", note: "What each does and when you recommend them." },
          { title: "Helping a child who's nervous about the dentist", note: "What your team does differently, in your own words." },
          { title: "Halloween candy and kids' teeth", note: "Which treats stick and when to brush. Publish in early October." },
          { title: "Mouthguards for youth sports", note: "Store-bought or custom, and your price for a custom one." },
        ],
      },
      {
        id: "treatment",
        heading: "Treatment choices",
        intro: "Readers with a treatment plan in hand. Explain the choice plainly, give the tradeoffs and skip promises about results.",
        topics: [
          { title: "Implant or bridge: how to choose", note: "Cost, time, bone and the teeth next to the gap." },
          { title: "What happens during a root canal", note: "Step by step, how long it takes, and what recovery feels like." },
          { title: "Clear aligners or braces", note: "Who each one fits and your price range. Name the brand you offer." },
          { title: "Teeth whitening: in-office or take-home", note: "Cost, sensitivity and how long results last. No guarantees about shades." },
          { title: "Meet our new dentist", note: "Training, why they chose the practice and what they enjoy treating. Good for E-E-A-T." },
        ],
      },
    ],
    rulesHeading: "Rules for dental blog posts",
    rulesIntro:
      "These come from the ADA's ethics code, federal privacy law and the FTC. Your state dental board has its own advertising rules too, so check them before you rely on this list.",
    rules: [
      {
        heading: "Disclose who wrote the post",
        body: "The ADA Code says an article published under a dentist's byline without truthful disclosure of its source and authorship is a false or misleading representation. If a writer, an agency or AI drafts the post, say so, or have the dentist rewrite it and stand behind it.",
        sources: [{ label: "ADA Code of Ethics (PDF), 5.F.1", href: "https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/about/ada_code_of_ethics.pdf" }],
      },
      {
        heading: "No unjustified expectations",
        body: "The ADA Code lists statements likely to create an unjustified expectation about results, and unsupported claims of superior quality, as examples of false or misleading advertising. Before-and-after posts need context, and \"best dentist in town\" needs to go.",
        sources: [{ label: "ADA Code of Ethics (PDF), 5.F.2", href: "https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/about/ada_code_of_ethics.pdf" }],
      },
      {
        heading: "Use \"specialist\" only when it's true",
        body: "Under the ADA Code, a dentist can announce as a specialist only in a recognized specialty, such as orthodontics or periodontics, and only with the required training. A general dentist who does implants should say \"we place implants\" and not \"implant specialist.\"",
        sources: [{ label: "ADA Code of Ethics (PDF), 5.H", href: "https://www.ada.org/-/media/project/ada-organization/ada/ada-org/files/about/ada_code_of_ethics.pdf" }],
      },
      {
        heading: "Get written authorization for patient stories",
        body: "HIPAA requires a covered entity to get an authorization before using protected health information for marketing. A patient story, a smile photo or a case write-up on your blog needs that signed form first.",
        sources: [{ label: "45 CFR 164.508(a)(3)", href: "https://www.law.cornell.edu/cfr/text/45/164.508" }],
      },
      {
        heading: "Reviews have to be real",
        body: "The FTC's rule on consumer reviews, in effect since October 21, 2024, bans fake reviews and paying for reviews that have to be positive. Quote real patients, with their authorization.",
        sources: [{ label: "FTC: Consumer Reviews and Testimonials Rule Q&A", href: "https://www.ftc.gov/business-guidance/resources/consumer-reviews-testimonials-rule-questions-answers" }],
      },
    ],
    draftly: [
      "Draftly sets your practice's voice from your website and writes the full post from a topic, with a URL slug, meta title and meta description. It never needs patient records, so keep patient details out of the topics you type.",
      "A dentist reads each draft, checks the clinical details, adds your fees and insurance list, and puts their name on it. Then publish to " + CMS_LINE + ". Agencies that market several practices can add each one as its own website with its own voice.",
    ],
    tool: { href: "/tools/blog-ideas-generator", name: "blog ideas generator", why: "Enter your practice's website and it suggests 10 posts your patients would search for, including a few timed to the next three months." },
    shot: "brandVoice",
    cta: {
      heading: "Get a dental post drafted for your practice",
      body: "Paste your URL and Draftly writes a full draft in your practice's voice for a dentist to review, ready for " + CMS_LINE + ". Your first post is free.",
    },
    faqs: [
      {
        q: "What should a dental practice blog about?",
        a: "Urgent problems like toothaches and broken teeth, real costs and the insurance you take, questions parents ask, and plain explanations of the treatments you offer.",
      },
      {
        q: "Can a dentist use patient photos or stories on a blog?",
        a: "Only with the patient's written HIPAA authorization for marketing use. Your state dental board may also have rules on testimonials and before-and-after photos.",
      },
      {
        q: "Does the ADA allow ghostwritten dental blog posts?",
        a: "The ADA Code says a post under a dentist's byline needs truthful disclosure of its source and authorship. Disclose who wrote it, or have the dentist rewrite it as their own.",
      },
      {
        q: "Can AI write dental blog posts?",
        a: "It can write a draft. A dentist should check every clinical detail, add the practice's own fees and policies, and approve it before it's published.",
      },
    ],
    readingTopic: "dental dentist practice blog small business local service write blog post brand voice",
    ogLine: "Topics plus the ADA and HIPAA rules",
  },
  {
    slug: "financial-advisors",
    postNoun: "financial advisor",
    name: "Financial advisors",
    audience: "financial advisors",
    // "content marketing for financial advisors" 200/mo KD 3 (traffic potential 450), "financial advisor blog topics" 30 KD 2.
    keywords: "content marketing for financial advisors, financial advisor blog topics",
    title: "Financial Advisor Blog Topics, With the SEC and FINRA Rules",
    description:
      "Blog topics for financial advisors built around client life events, taxes and plain explainers, plus the SEC Marketing Rule and FINRA 2210 points to check.",
    h1: { lead: "Financial advisor blog topics", accent: "and the rules that apply" },
    intro: [
      "People rarely search for a financial advisor out of the blue. They search when something changes: an inheritance, a job offer with stock, a parent who needs care, a retirement date. An advisor's blog that brings in clients answers those moments in plain language.",
      "Every post is also a regulated communication. Registered investment advisers answer to the SEC Marketing Rule, and broker-dealer reps answer to FINRA Rule 2210, which usually means a compliance review before anything goes live. The topics below are picked to be useful and to get through that review.",
    ],
    groups: [
      {
        id: "life-events",
        heading: "Life events",
        intro: "These are the searches that turn into first meetings. Walk through the decisions in order and skip product pitches.",
        topics: [
          { title: "Just inherited money: what to do in the first 90 days", note: "Park it, find out the tax treatment, then decide. Cover inherited IRAs separately." },
          { title: "Selling your business: money questions to settle first", note: "Taxes on the sale, what you'll live on, and who else is at the table." },
          { title: "What to do with stock options from a new job", note: "Vesting, the kinds of options and the tax on each. No predictions about the stock." },
          { title: "Money decisions in a divorce", note: "Retirement account splits, the house, and the order things happen in. Work with family law attorneys on this one." },
          { title: "Planning for a parent's long-term care", note: "Costs where you practice, Medicare and Medicaid basics, and the conversation itself." },
          { title: "Retiring in the next five years: a checklist", note: "Income plan, Social Security timing, health coverage before Medicare." },
        ],
      },
      {
        id: "tax",
        heading: "Taxes and year-end",
        intro: "Clients search these every fall. Date them, link the IRS source, and update them each year.",
        topics: [
          { title: "Required minimum distributions: when yours start", note: "SECURE 2.0 changed the starting age. Give the age by birth year and link the IRS page." },
          { title: "Is a Roth conversion worth it this year?", note: "Tax bracket now versus later, and how to pay the tax. Walk through the reasoning and say who it tends to fit." },
          { title: "Year-end money checklist", note: "Contributions, RMDs, charitable gifts, flexible spending deadlines." },
          { title: "Giving to charity from an IRA", note: "How qualified charitable distributions work and who they fit." },
          { title: "What the latest tax law changes mean for retirees", note: "Name the law and link the IRS guidance. Keep it to what changed." },
        ],
      },
      {
        id: "explainers",
        heading: "Choosing an advisor",
        intro: "Prospects read these right before they book a call. Be specific about how you work.",
        topics: [
          { title: "Fee-only, fee-based or commission: what's the difference?", note: "Define each one and say which you are." },
          { title: "What does fiduciary mean?", note: "Plain definition and how it applies to your firm." },
          { title: "What to bring to a first meeting with us", note: "A real checklist. It lowers the bar to booking." },
          { title: "How we charge, with an example", note: "Your actual fee schedule and what it means on a sample account." },
          { title: "What a financial plan includes", note: "The sections of the plan you deliver, with a redacted sample page." },
        ],
      },
      {
        id: "markets",
        heading: "When markets make news",
        intro: "Clients will ask after a big drop or a rate change. Explain what happened and what you're doing. Never predict what comes next.",
        topics: [
          { title: "The market dropped. Here's how we think about it", note: "Your process, in your words. Leave out forecasts and performance claims." },
          { title: "What a Fed rate change means for savers and borrowers", note: "CDs, mortgages, credit cards. Date the post." },
          { title: "Cash, CDs or Treasuries for money you'll need soon", note: "The tradeoffs and the risks, explained evenly." },
        ],
      },
    ],
    rulesHeading: "Compliance rules for financial advisor blog posts",
    rulesIntro:
      "Which rules apply depends on how you're registered. Your compliance team or chief compliance officer has the final say. Use this list to prepare for their review.",
    rules: [
      {
        heading: "SEC Marketing Rule basics (RIAs)",
        body: "Since November 4, 2022, registered investment advisers have had to follow the SEC Marketing Rule. It bars untrue or misleading statements and unsubstantiated material claims, and benefits have to be discussed alongside fair treatment of material risks.",
        sources: [{ label: "SEC: Marketing Rule small entity compliance guide", href: "https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/investment-adviser-marketing" }],
      },
      {
        heading: "Testimonials and performance (RIAs)",
        body: "Under the Marketing Rule, a testimonial or endorsement has to say clearly whether the person is a client and whether they were paid. Gross performance can appear only next to net performance. Most blog posts are easier to approve without either.",
        sources: [{ label: "SEC: Marketing Rule small entity compliance guide", href: "https://www.sec.gov/resources-small-businesses/small-business-compliance-guides/investment-adviser-marketing" }],
      },
      {
        heading: "Principal approval first (broker-dealers)",
        body: "Under FINRA Rule 2210, a communication sent or made available to more than 25 retail investors within 30 days is a retail communication, and a registered principal has to approve it before it's used. A public blog post qualifies. New member firms also file certain retail communications with FINRA 10 business days before first use for their first year.",
        sources: [{ label: "FINRA Rule 2210", href: "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2210" }],
      },
      {
        heading: "No predictions",
        body: "FINRA Rule 2210 says communications may not predict or project performance or imply that past performance will recur, with narrow exceptions. Write about your process and the tradeoffs and leave out where the market is headed.",
        sources: [{ label: "FINRA Rule 2210", href: "https://www.finra.org/rules-guidance/rulebooks/finra-rules/2210" }],
      },
      {
        heading: "AI drafts follow the same rules",
        body: "FINRA's Regulatory Notice 24-09 (June 27, 2024) says Rule 2210's content standards apply whether a person or an AI tool wrote the communication. An AI draft goes through the same review as anything else.",
        sources: [{ label: "FINRA Regulatory Notice 24-09", href: "https://www.finra.org/rules-guidance/notices/24-09" }],
      },
    ],
    draftly: [
      "Draftly writes from your website and a topic, so it never needs client data. It sets your firm's voice from your site and drafts the post with a URL slug, meta title and meta description, checked for AI-sounding phrasing before you see it.",
      "Your compliance reviewer approves the draft and keeps the record. Publish by hand to " + CMS_LINE + " instead of using Autopilot's automatic publishing, so nothing goes live before approval.",
    ],
    tool: { href: "/tools/eeat-checker", name: "E-E-A-T checker", why: "Google holds money pages to a high bar for experience and trust, and the checker shows whether your posts carry bylines, author pages, dates and sources." },
    shot: "brandVoice",
    cta: {
      heading: "Get a draft post for your compliance review",
      body: "Paste your URL and Draftly writes a full draft in your firm's voice, ready for review and for " + CMS_LINE + ". Your first post is free.",
    },
    faqs: [
      {
        q: "What should a financial advisor blog about?",
        a: "The life events that bring clients in, like inheritances, business sales and retirement, plus yearly tax topics and plain explanations of how you work and charge.",
      },
      {
        q: "Do financial advisor blog posts need compliance approval?",
        a: "For broker-dealer reps, FINRA Rule 2210 requires principal approval of retail communications before use, and a public blog post is one. RIAs follow the SEC Marketing Rule and their own compliance policies. Ask your compliance team.",
      },
      {
        q: "Can financial advisors use AI to write blog posts?",
        a: "Yes, with the same review as any other communication. FINRA Regulatory Notice 24-09 says Rule 2210's content standards apply whether or not AI wrote it.",
      },
      {
        q: "Can I share client results or testimonials on my blog?",
        a: "Only within the SEC Marketing Rule or FINRA's testimonial rules, which require specific disclosures. Many firms keep blog posts free of both to make approval simpler.",
      },
    ],
    readingTopic: "financial advisor wealth management blog compliance write blog post brand voice",
    ogLine: "Topics plus the SEC and FINRA rules",
  },
  {
    slug: "accounting-firms",
    postNoun: "accounting firm",
    name: "Accounting firms",
    audience: "CPA and accounting firms",
    // "content marketing for accountants" 150/mo KD 0, "accounting blog topics" 80 KD 0, "accounting blog ideas" 10.
    keywords: "content marketing for accountants, accounting blog topics, accounting blog ideas",
    title: "Accounting Blog Topics for CPA Firms, With the Ethics Rules",
    description:
      "Blog topics for CPA and accounting firms: tax season, small business questions and year-end planning, plus the Circular 230 and confidentiality rules to check.",
    h1: { lead: "Accounting blog topics", accent: "for CPA firms" },
    intro: [
      "An accounting firm's blog runs on the calendar. Clients search for document checklists in January, extensions in April, estimated payments in June and year-end moves in November. The firms that win those searches publish a few weeks early and update the same posts every year.",
      "Small business owners are the other big audience. They search before they hire anyone: which entity to pick, when to run payroll, whether they need a CPA at all. The topics below cover both, with notes on the rules for advertising tax services.",
    ],
    groups: [
      {
        id: "tax-season",
        heading: "Tax season",
        intro: "Publish these in December and January and update the dates each year.",
        topics: [
          { title: "What to bring to your tax appointment", note: "A real checklist by client type: W-2 employee, freelancer, landlord, business owner." },
          { title: "Do you need to file an extension?", note: "An extension gives more time to file. Any tax owed is still due by the April deadline." },
          { title: "Got a letter from the IRS? Here's what to do", note: "Don't ignore it, read which notice it is, call us. Link the IRS page on notices." },
          { title: "What our tax prep costs and what changes the price", note: "Your fee ranges by return type. Readers compare these." },
          { title: "Freelancers: how quarterly estimated taxes work", note: "Who has to pay them, the due dates and how to figure the amount." },
        ],
      },
      {
        id: "small-business",
        heading: "Small business questions",
        intro: "Owners search these before they hire anyone. Answer them well and the call comes to you.",
        topics: [
          { title: "LLC or S corp: which fits your business?", note: "When the S corp election starts to make sense and what it costs to run." },
          { title: "When to hire a bookkeeper, and when you need a CPA", note: "Be honest about the tasks software handles." },
          { title: "Running payroll for your first employee", note: "Registrations, deposits and the forms that come due. Use your state's agencies by name." },
          { title: "Who needs a 1099 from you", note: "Contractors, the forms, the deadline. Link the IRS instructions." },
          { title: "How to read your profit and loss statement", note: "A sample P&L, line by line, with the questions to ask." },
          { title: "Cash or accrual accounting for a small business", note: "Who can use which and how it changes taxes." },
        ],
      },
      {
        id: "year-end",
        heading: "Year-end and planning",
        intro: "Publish in October and November, when clients still have time to act.",
        topics: [
          { title: "Year-end tax moves for small business owners", note: "Equipment purchases, retirement plan deadlines, bonuses. Date it." },
          { title: "What the latest federal tax law changes mean for your return", note: "Name the law and link the IRS guidance. Stick to what changed." },
          { title: "Should you set up a retirement plan for your business?", note: "SEP, SIMPLE and 401(k) compared by cost and setup deadline." },
          { title: "Planning for a big year: bonuses, a home sale or a business sale", note: "What to do before December 31 and what can wait." },
        ],
      },
      {
        id: "firm",
        heading: "About the firm",
        intro: "Prospects read these right before they reach out.",
        topics: [
          { title: "How we work with new clients, step by step", note: "Your real onboarding, including the portal and the timeline." },
          { title: "Our fees, and why we price this way", note: "Fixed fees, hourly or monthly packages. Show the numbers." },
          { title: "Meet the partner who handles your industry", note: "Their background and the clients they serve. Good for E-E-A-T." },
        ],
      },
    ],
    rulesHeading: "Rules for accounting firm blog posts",
    rulesIntro:
      "Tax services advertising is covered by Treasury's Circular 230, and client information is protected by federal law and professional ethics. Your state board of accountancy adds its own rules, so check them before you rely on this list.",
    rules: [
      {
        heading: "No false or misleading claims about tax matters",
        body: "Circular 230 section 10.30 bars practitioners from using public communications with false, deceptive or coercive claims about IRS matters. Enrolled agents can't call themselves \"certified\" or imply they work for the IRS.",
        sources: [{ label: "31 CFR 10.30", href: "https://www.law.cornell.edu/cfr/text/31/10.30" }],
      },
      {
        heading: "Published fees have to hold",
        body: "Section 10.30 allows firms to publish fixed fees, hourly rates, fee ranges and consultation fees, and requires them to honor published rates for at least 30 days. If a post lists prices, date it.",
        sources: [{ label: "31 CFR 10.30", href: "https://www.law.cornell.edu/cfr/text/31/10.30" }],
      },
      {
        heading: "Client stories need consent",
        body: "Federal law (26 U.S.C. 7216) bars tax preparers from disclosing return information or using it for anything other than preparing the return without the client's consent, and the AICPA Code protects confidential client information. Get written consent before a case study, and change the details.",
        sources: [{ label: "26 U.S.C. 7216", href: "https://www.law.cornell.edu/uscode/text/26/7216" }],
      },
      {
        heading: "Check the CPA title rules",
        body: "State laws reserve \"CPA\" for licensees, and some apply that to firm names too. If an unlicensed staff member writes a post, the byline shouldn't suggest they're a CPA.",
      },
      {
        heading: "Date every tax figure",
        body: "Limits, thresholds and deadlines change every year. Put the tax year in the post, link the IRS source and update the post each January.",
      },
    ],
    draftly: [
      "Draftly sets your firm's voice from your website and writes the full post from a topic, with a URL slug, meta title and meta description. It never needs client returns, so keep client details out of the topics you type.",
      "A CPA checks the numbers and the tax year, adds your fees and deadlines, and puts their name on it. Then publish to " + CMS_LINE + ". Firms that serve clients in several niches can run a separate website and voice for each.",
    ],
    tool: { href: "/tools/content-refresh-checker", name: "content refresh checker", why: "Tax posts go stale every year, and the checker lists the posts on your blog that haven't been updated in a year." },
    shot: "urlToPost",
    cta: {
      heading: "Get a post drafted for your firm's blog",
      body: "Paste your URL and Draftly writes a full draft in your firm's voice for a CPA to review, ready for " + CMS_LINE + ". Your first post is free.",
    },
    faqs: [
      {
        q: "What should an accounting firm blog about?",
        a: "Tax season checklists and deadlines, the questions small business owners ask before they hire you, year-end planning, and how your firm works and charges.",
      },
      {
        q: "Can a CPA firm list its fees on its blog?",
        a: "Yes. Circular 230 section 10.30 allows published fee information, and the firm has to honor published rates for at least 30 days. Date any post with prices.",
      },
      {
        q: "When should accounting firms publish tax posts?",
        a: "A few weeks before the deadline they cover: December and January for filing season, March for extensions, and October for year-end planning.",
      },
      {
        q: "Can AI write accounting blog posts?",
        a: "It can write a draft. A CPA should check every figure, threshold and deadline for the right tax year before it's published.",
      },
    ],
    readingTopic: "accounting cpa firm tax blog small business write blog post brand voice",
    ogLine: "Topics plus the Circular 230 rules",
  },
];

export const topicCount = (i: Industry) => i.groups.reduce((n, g) => n + g.topics.length, 0);

export const industryPath = (i: Industry) => `${INDUSTRIES_HUB.path}/${i.slug}`;

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}

/** A stock photo on an industry page. Files are 3:2 webp in public/images/industries/<slug>/. */
export type IndustryPhoto = { src: string; width: number; height: number; alt: string; credit: { name: string; href: string } };
export type IndustryPhotos = { hero: IndustryPhoto; groups: Record<string, IndustryPhoto>; rules: IndustryPhoto };

// Unsplash photos (free under the Unsplash License), downloaded 2026-10-16 and cropped to
// 3:2. `credit` points at each photo's page so every image can be traced to its source.
const photo = (slug: string, slot: string, alt: string, name: string, id: string, width = 1200, height = 800): IndustryPhoto => ({
  src: `/images/industries/${slug}/${slot}.webp`,
  width,
  height,
  alt,
  credit: { name, href: `https://unsplash.com/photos/${id}` },
});

export const INDUSTRY_PHOTOS: Record<string, IndustryPhotos> = {
  plumbing: {
    hero: photo("plumbing", "hero", "A plumber reaching under a bathroom sink to work on the drain pipes", "Timur Shakerzianov", "c314Gh8dXAo"),
    groups: {
      planning: photo("plumbing", "planning", "A wrench on the pipe fittings at the top of a white tank water heater", "Marian Florinel Condruz", "C-oYJoIfgCs"),
      trust: photo("plumbing", "trust", "A plumber in overalls working on the pipes behind a toilet, with a blue toolbox on the floor", "bhagya laxmi", "jaP5ClBdIyU"),
    },
    rules: photo("plumbing", "rules", "A modern kitchen with a dark tile wall, a range and a black faucet over the sink", "Clay Banks", "C-FqIffctHI"),
  },
  hvac: {
    hero: photo("hvac", "hero", "An outdoor air conditioning condenser in the rain, with trees behind it", "Sam Jotham Sutharson", "gSvCiyLnCeU"),
    groups: {
      replacement: photo("hvac", "replacement", "An outdoor heat pump unit mounted on a dark brick wall", "Everett Pachmann", "JsPkVrHMQoo"),
      maintenance: photo("hvac", "maintenance", "A finger pressing a wall thermostat, with a small digital thermometer beside it", "HUUM", "3_nf1qKJGf4"),
    },
    rules: photo("hvac", "rules", "Three outdoor air conditioning units mounted on an orange apartment wall", "Jose Antonio Gallego Vázquez", "bpq1X06_yHQ", 1050, 700),
  },
  "real-estate": {
    hero: photo("real-estate", "hero", "A two-story white house with dark shutters, palm trees and a front walk", "Christian McMenamy", "3gXWURwT1U4"),
    groups: {
      buyers: photo("real-estate", "buyers", "A hand holding up a house key on a house-shaped keychain inside an empty home", "Jakub Żerdzicki", "bqUZEAeWuok"),
      sellers: photo("real-estate", "sellers", "A green and white For Sale sign", "Richard Bell", "z1EIv3nsHJQ"),
    },
    rules: photo("real-estate", "rules", "A tree-lined residential street with cars parked along the curb", "Vincent Y", "jtBaFcdug-E"),
  },
  "law-firms": {
    hero: photo("law-firms", "hero", "A lawyer reviewing a document on a clipboard with a client across the desk", "Vitaly Gariev", "2AOIg7Qvu8w"),
    groups: {
      "what-next": photo("law-firms", "what-next", "A hand signing a printed document with a fountain pen", "Cytonn Photography", "GJao3ZTX9gU"),
      firm: photo("law-firms", "firm", "A quiet office hallway lined with glass-walled rooms", "Nastuh Abootalebi", "yWwob8kwOCk"),
    },
    rules: photo("law-firms", "rules", "A columned county courthouse with an American flag out front", "goodrich kingrey", "W49kEdoe01E"),
  },
  roofing: {
    hero: photo("roofing", "hero", "Two roofers in safety harnesses measuring on a dark shingle roof", "Raze Solar", "MyBBMM317A4"),
    groups: {
      storm: photo("roofing", "storm", "A fallen tree beside a white two-story house after a storm", "Roger Starnes Sr", "oUPBGyhjffU"),
      replacement: photo("roofing", "replacement", "A roofer carrying a bundle of shingles across a roof", "Zohair Mirza", "4XMHsy4Rvi8"),
    },
    rules: photo("roofing", "rules", "Rain running off the edge of an asphalt shingle roof", "Luke Southern", "ZzZouwiQWV0"),
  },
  dental: {
    hero: photo("dental", "hero", "A dentist talking with a smiling patient seated in a dental chair", "Harold Hisona", "Bg81yWKZlMg"),
    groups: {
      family: photo("dental", "family", "A girl brushing her teeth, seen from the side", "Roman Marchenko", "f-QUTyqRS1Y"),
      treatment: photo("dental", "treatment", "Hands holding a dental model of a set of teeth with a probe", "Harold Hisona", "LOgBp87WzIk"),
    },
    rules: photo("dental", "rules", "A dentist pointing to an X-ray on a screen for a patient in the chair", "Caroline LM", "-m-4tYmtLlI"),
  },
  "financial-advisors": {
    hero: photo("financial-advisors", "hero", "Two men in business clothes talking over a laptop showing a chart", "Vitaly Gariev", "YR4zsA7QwRk"),
    groups: {
      "life-events": photo("financial-advisors", "life-events", "An older couple walking arm in arm down a tree-lined road", "Hector Reyes", "GrSfB6-OPoY"),
      markets: photo("financial-advisors", "markets", "A price chart with candlesticks and market data on a dark screen", "Nick Chong", "N__BnvQ_w18"),
    },
    rules: photo("financial-advisors", "rules", "A man in a suit reviewing a bar chart on a tablet beside a calculator and a coffee mug", "Towfiqu barbhuiya", "nApaSgkzaxg"),
  },
  "accounting-firms": {
    hero: photo("accounting-firms", "hero", "Hands typing on a blue calculator beside a keyboard and a yellow mug", "Towfiqu barbhuiya", "JhevWHCbVyw"),
    groups: {
      "tax-season": photo("accounting-firms", "tax-season", "A sheet of paper reading Tax Return in a vintage typewriter", "Markus Winkler", "Ber3q-zEhd4"),
      "small-business": photo("accounting-firms", "small-business", "A salon owner checking in a customer at the front desk on a tablet", "Blake Wisz", "GFrBMipOd_E"),
    },
    rules: photo("accounting-firms", "rules", "Tax withholding worksheets, a phone calculator and sticky notes on a dark desk", "Kelly Sikkema", "M98NRBuzbpc"),
  },
};
