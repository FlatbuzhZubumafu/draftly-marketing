import type { Faq } from "@/components/ArticleParts";

// Data for the /blog-ideas/<industry> pages. One entry per industry; the route renders
// them all the same way, so a new industry is one more entry here plus its keyword check.
// Keyword numbers are Ahrefs Keywords Explorer, US, checked 2026-10-16. Rules and dates in
// `rules` were read on the linked source pages that day (the ABA pages block scripts, so
// those links were not fetched).

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
    "Blog topic ideas for plumbers, HVAC companies, real estate agents and law firms, grouped by what readers need, plus the advertising rules each has to follow.",
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
];

export const topicCount = (i: Industry) => i.groups.reduce((n, g) => n + g.topics.length, 0);

export const industryPath = (i: Industry) => `${INDUSTRIES_HUB.path}/${i.slug}`;

export function getIndustry(slug: string): Industry | undefined {
  return INDUSTRIES.find((i) => i.slug === slug);
}
