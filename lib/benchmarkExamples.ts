// Worked examples for each criterion on /best-ai-for-writing. Every quote is copied
// verbatim from a model's output in the edition 1 run (~/draftly-work/bakeoff/out for blog
// posts, ~/draftly-work/bakeoff/copy-out for copy packs), and every pass or miss is what
// the scoring script or the judges recorded for that output. [[double brackets]] mark the
// words the check was about. Don't add an example that isn't in the run files. The
// `example` before and after lines in each lesson are made up to show the pattern.

export type Business = "Boise roofer" | "AP software" | "Phoenix dentist";

/** One quoted line. `tag` labels what it is (H1, Subject, ...); `note` sits under it. */
export type ExampleLine = { tag?: string; text: string; note?: string };

export type Example = {
  verdict: "pass" | "miss";
  /** Chip text when "Pass" or "Miss" would mislead, e.g. "Best line". */
  label?: string;
  model: string;
  business: Business;
  lines?: ExampleLine[];
  /** Post length, drawn as a bar against the 1,000 to 1,200 word brief. */
  words?: number;
  note?: string;
};

export type Criterion = {
  id: string;
  title: string;
  /** The copy principle: what it is, what it looks like and why models write this way. */
  lesson: string;
  /** A short made-up before and after for the lesson. Illustrative, not from the run files. */
  example?: { before: string; after: string };
  /** How the benchmark scored it. */
  body: string;
  examples: Example[];
  /**
   * What Draftly does for this criterion. Every claim is checked against the app code
   * (supabase/functions/_shared: writing-rules.ts, post-checks.ts, post-pipeline.ts,
   * editor-engine.ts, quality-gate.ts, content-prompt.ts). Leave it out rather than overclaim.
   */
  draftly?: string;
};

export const CONTENT_CRITERIA: Criterion[] = [
  {
    id: "ai-vocabulary",
    title: "Overused AI Words",
    lesson: "Some words turn up far more often in AI drafts than in human writing: leverage, seamless, delve, landscape, robust, elevate. Models learn from huge amounts of web text, and much of it is marketing copy and SEO filler where these words are everywhere, so they become the statistically likely choice. Each one sounds polished and says very little, and readers who have seen enough AI copy spot them within a line or two.",
    example: { before: "Leverage our seamless platform to elevate your accounts payable workflow.", after: "Match each invoice to its PO and receiving slip without retyping either." },
    body: "The script searched every post for words AI models lean on, such as leverage, seamless, delve and landscape. Each one cost 4 points.",
    draftly: "The writer’s system prompt bans a fixed list of these words and phrases and asks for the literal thing in their place. After the draft is written, a code check scans for the same list. A hit sends the draft back for one repair pass that names each word, and Draftly keeps the repaired version only if it breaks fewer rules. In the Draftly Editor, each flagged sentence is rewritten on its own and the rest of the text stays as it was.\n\nOur test script matched words literally, so it also caught literal uses: four roofing posts lost points for crews wearing safety harnesses (Claude Opus 5.5, Claude Sonnet 5.5, Gemini 3 Flash and Gemini 3.8 Flash), and GPT 5.5 lost points for telling homeowners to unlock their gates. Draftly’s check skips literal phrases like unlocking a gate, only flags harness in phrases like “harness your data”, and ignores any word that appears in your own brief or brand vocabulary.",
    examples: [
      {
        verdict: "miss",
        model: "Claude Haiku 4.5",
        business: "AP software",
        lines: [{ text: "The real [[leverage]] isn't just speed." }],
        note: "Claude Haiku 4.5 used three listed words across its posts: leverage, landscape and crucial.",
      },
      {
        verdict: "pass",
        model: "Qwen 3.8 Max",
        business: "Phoenix dentist",
        lines: [{ text: "At Bright Arch Dental in Phoenix, we treat this as a family dentistry question and a cosmetic question at the same time." }],
        note: "Qwen 3.8 Max used none of the listed words in three posts.",
      },
    ],
  },
  {
    id: "contrast-phrasing",
    title: "“Not Just X” Contrast Phrasing",
    lesson: "Contrast phrasing sets up a claim nobody made so the writer can knock it down: “it’s not X, it’s Y”, “not just X”, “more than just X”. It is a rhetorical template that sounds like insight, and models overuse it because it is so common in the persuasive writing they learned from. One in a post can work. Three in a post read like a formula, and the idea being denied is usually one the reader never held.",
    example: { before: "It’s not just a roof. It’s peace of mind for your family.", after: "A new roof stops the leak over the kitchen before the next storm." },
    body: "Lines like “it’s not X, it’s Y” and “not just X” argue with a claim nobody made. Each one cost 5 points, up to 15 per post. The script also counted “rather than” and “instead of”, which are often fine, so a count of one or two in the table can be a plain comparison.",
    draftly: "The writer’s rules ban every form, including hidden ones such as a denial followed by a correction. The code check fails a draft on the explicit forms, such as “not just” and “it’s not X, it’s Y”, and sends it back for one repair pass. “Instead of” and “rather than” are recorded as warnings only, since they are often plain comparisons. The Editor flags each of these sentences and rewrites only those.",
    examples: [
      {
        verdict: "miss",
        model: "Claude Sonnet 4.6",
        business: "AP software",
        lines: [{ text: "The receiving document is what makes three-way matching a genuine audit trail, [[not just]] a price check." }],
        note: "Claude Sonnet 4.6 had six contrast hits, the most of any model.",
      },
      {
        verdict: "pass",
        model: "Qwen 3.8 Max",
        business: "Phoenix dentist",
        lines: [{ text: "A dental implant replaces the tooth root and supports a crown on its own. A bridge fills the gap by resting on the teeth beside it." }],
        note: "A comparison stated directly. Qwen 3.8 Max had no contrast hits in three posts.",
      },
    ],
  },
  {
    id: "em-dashes",
    title: "Em Dash Overuse",
    lesson: "The em dash is the long dash writers use to break into a sentence with an aside. People use it, but AI models tend to use it much more often, sometimes twice in one sentence. It is a punctuation habit of the models, and many readers now treat a page full of dashes as a sign a model wrote it. A comma, a period or parentheses usually does the same job.",
    example: { before: "The fix is simple—reseal the flashing—and it takes an afternoon.", after: "The fix is simple. Resealing the flashing takes an afternoon." },
    body: "The rules allow about one em dash per 300 words. Each dash past that cost 3 points, up to 15. Claude Haiku 4.5 used 29 in three posts, more than every other model put together.",
    draftly: "By default the writer is told to use at most one em dash per 300 words, and each website can switch to banning them entirely. Over the limit, the code check records a warning on the post. With the ban on, any dash fails the draft and sends it back for repair. In the Editor, when a text is over the limit, each sentence with a dash is flagged and rewritten with a comma or a period.",
    examples: [
      {
        verdict: "miss",
        model: "Claude Haiku 4.5",
        business: "AP software",
        lines: [
          {
            text: "This creates friction in the short term[[—]]someone has to close the receipt in your system[[—]]but eliminates the category of errors that slip past two-way matching entirely.",
          },
        ],
        note: "Two of 13 dashes in a 1,124-word post, where the allowance was 3.",
      },
      {
        verdict: "pass",
        model: "Claude Opus 5.5",
        business: "AP software",
        lines: [{ text: "The match works because each document comes from a different person with a different incentive." }],
        note: "Claude Opus 5.5 used no em dashes in three posts.",
      },
    ],
  },
  {
    id: "faq-section",
    title: "FAQ Section",
    lesson: "An FAQ section groups the questions readers ask under one heading, each with a short, direct answer. Skimmers can find their question, and search engines get a clean question and answer. Models tend to treat a list of questions in a brief as topics to cover, so when they miss this check they usually still answer the questions, spread through the post as ordinary headings.",
    body: "Each brief listed three questions readers ask. The post needed an FAQ section that answered them, or it lost 8 points.",
    draftly: "Draftly puts the questions people ask about the topic into the writer’s brief and asks the post to address them. It doesn’t require an FAQ section. When a post has one, the rules say to use those real questions, answer each in one to three sentences and never repeat a heading as a question, and the code check warns on any longer answer.",
    examples: [
      {
        verdict: "miss",
        model: "DeepSeek V3.2",
        business: "Phoenix dentist",
        lines: [
          { tag: "H2", text: "Which lasts longer, an implant or a bridge?" },
          { tag: "H2", text: "How do cost and dental insurance factor in?" },
          { tag: "H2", text: "Choose based on health first, not just price." },
        ],
        note: "It answered the questions as ordinary H2s and never gave them an FAQ section.",
      },
      {
        verdict: "pass",
        model: "Kimi K3",
        business: "AP software",
        lines: [
          { tag: "H2", text: "Automation clears the matches; your team clears the exceptions" },
          { tag: "H2", text: "[[Three-way matching FAQ]]" },
          { tag: "H2", text: "Fix receiving before you tune anything else" },
        ],
        note: "Every model except DeepSeek V3.2 and Gemini 3.1 Pro (preview) included one in all three posts.",
      },
    ],
  },
  {
    id: "call-to-action",
    title: "Closing Call to Action",
    lesson: "The call to action is the step you want the reader to take next, with a link to take it. Without the link, an interested reader has to go looking. Models often write the right words and drop the link, or close on a summary of the post, because recap endings are common in the articles and essays they learned from.",
    example: { before: "In summary, three-way matching reduces errors and saves your team time.", after: "To see it on your own invoices, book a 20-minute demo." },
    body: "Each brief gave a call to action and a link. The last section had to end on it, or the post lost 8 points.",
    draftly: "Each website can set a standard call to action with a button label and URL. When it is set, the writer must end the final section on that offer, and the code check confirms the exact link appears once, in the last section, or sends the draft back for repair. With none set, the model picks a relevant call to action and the link isn’t checked. The rules also ban recap endings and “in conclusion”.",
    examples: [
      {
        verdict: "miss",
        model: "Claude Haiku 4.5",
        business: "AP software",
        lines: [{ tag: "Last line", text: "See Ledgerline match invoices in a 20-minute demo to watch three-way matching in action with real AP workflows." }],
        note: "The right words, with no link to the demo page.",
      },
      {
        verdict: "pass",
        model: "Claude Sonnet 5.5",
        business: "AP software",
        lines: [{ tag: "Last line", text: "If you want to see how that looks on your own invoices, [[See Ledgerline match invoices in a 20-minute demo]]." }],
        note: "Ends on the call to action from the brief, linked to the demo page.",
      },
    ],
  },
];

export const COPY_CRITERIA: Criterion[] = [
  {
    id: "google-ad-limits",
    title: "Google Search Ad Headline and Description",
    lesson: "Google search ads allow 30 characters per headline and 90 per description, and Google rejects text that runs over. AI models write in tokens, which are chunks of words, and they don’t see a running character count as they write. That makes hard character limits easy to overshoot, especially on the longer description line.",
    body: "Google search ads allow 30 characters per headline and 90 per description, spaces included. Each pack asked for three headlines and two descriptions, so every model had 15 limits to hit.",
    draftly: "Draftly writes blog posts, not ads, so it has no search ad check. The same kind of limit runs on every post’s meta title (50 to 60 characters) and meta description (150 to 160): the code counts both, and a draft outside either range goes back for a repair pass.",
    examples: [
      {
        verdict: "miss",
        model: "Claude Haiku 4.5",
        business: "Phoenix dentist",
        lines: [
          { tag: "Headline", text: "Anxiety-Friendly Dentistry Phoenix", note: "34 characters. Limit 30." },
          {
            tag: "Description",
            text: "Sedation options for anxious patients. Saturday appointments available. Free consultation with zero pressure.",
            note: "109 characters. Limit 90.",
          },
        ],
        note: "Claude Haiku 4.5 met 7 of its 15 ad limits.",
      },
      {
        verdict: "pass",
        model: "Gemini 3.8 Flash",
        business: "AP software",
        lines: [
          { tag: "Headline", text: "Under 2 Mins Per Invoice", note: "24 characters." },
          { tag: "Description", text: "Automate three-way matching and post to NetSuite or QuickBooks. Book a 20-minute demo.", note: "86 characters." },
        ],
        note: "Gemini 3.8 Flash met all 15.",
      },
    ],
  },
  {
    id: "landing-headlines",
    title: "Landing Page Headlines",
    lesson: "A landing page headline says what the page offers in one short line. Testing five options teaches you something only when each takes a different angle. Models tend to run long here, trying to fit the whole offer into one line, and the character counting problem from search ads applies too.",
    body: "Each pack needed five headline options of 60 characters or less, different enough from each other to be worth testing. No model wrote two headlines close enough to trip our duplicate check.",
    draftly: "Draftly doesn’t write landing pages, so there is no headline check in the app. The closest thing is the post title, which the rules ask to be the reader’s question or its answer in plain words.",
    examples: [
      {
        verdict: "miss",
        model: "DeepSeek V3.2",
        business: "Boise roofer",
        lines: [{ text: "Is Your Boise Roof Aging or Storm-Damaged? Get a Free Estimate.", note: "63 characters. Limit 60." }],
      },
      {
        verdict: "pass",
        model: "Claude Opus 5.5",
        business: "Boise roofer",
        lines: [{ text: "Boise roofers since 1998. Same family, same phone number.", note: "57 characters." }],
        note: "Both judges picked it as the strongest line in the pack.",
      },
    ],
  },
  {
    id: "hero-section",
    title: "Hero Section",
    lesson: "The hero is the top of a landing page: a headline, a subhead that adds a fact or two, and a button. A button label works best as a short action in the reader’s words, like Book My Inspection. Models tend to over-explain, so the label grows into a phrase and the subhead tries to carry every benefit at once.",
    example: { before: "See How Our Platform Can Help You Today", after: "Book My Inspection" },
    body: "The hero needed a headline of 60 characters or less, a subhead of 25 words or less, and a button label of two to four words.",
    examples: [
      {
        verdict: "miss",
        model: "Claude Haiku 4.5",
        business: "AP software",
        lines: [
          { tag: "Headline", text: "Stop manual invoice entry. Process them in 2 minutes." },
          { tag: "Button", text: "[[See it in 20 minutes]]", note: "Five words. Limit four." },
        ],
      },
      {
        verdict: "pass",
        model: "Claude Opus 5.5",
        business: "Boise roofer",
        lines: [
          { tag: "Headline", text: "Get your roof looked at this week, free" },
          { tag: "Subhead", text: "We'll climb up, check for wear and storm damage, and hand you a free written estimate. Family-owned in Boise since 1998." },
          { tag: "Button", text: "Book My Inspection" },
        ],
      },
    ],
  },
  {
    id: "email-subject-lines",
    title: "Email Subject Line and Preview Text",
    lesson: "Inboxes cut off long subject lines and preview text, so the first few words carry the message. A common miss is a slogan-style subject that saves its point for the end, where it gets cut. Models also run past the limits for the same reason as with ads: they don’t count characters as they write.",
    example: { before: "2 minutes per invoice. That’s the Ledgerline difference.", after: "How old is your roof, roughly?" },
    body: "Each pack needed three subject lines of 50 characters or less and preview text of 90 or less, the line most inboxes show after the subject.",
    examples: [
      {
        verdict: "miss",
        model: "Claude Haiku 4.5",
        business: "AP software",
        lines: [
          { tag: "Subject", text: "2 minutes per invoice. That's the Ledgerline difference.", note: "56 characters. Limit 50." },
          {
            tag: "Preview",
            text: "Invoices processed and matched in under 2 minutes. See how Ledgerline works with your accounting software.",
            note: "106 characters. Limit 90.",
          },
        ],
      },
      {
        verdict: "pass",
        model: "Claude Opus 5.5",
        business: "Boise roofer",
        lines: [
          { tag: "Subject", text: "How old is your roof, roughly?", note: "30 characters." },
          { tag: "Preview", text: "Free same-week inspection and a written estimate. If it's fine, we'll tell you that too.", note: "88 characters." },
        ],
      },
    ],
  },
  {
    id: "benefit-bullets",
    title: "Benefit Bullets",
    lesson: "A benefit bullet names one concrete thing the reader gets, short enough to take in at a glance. Every model stayed under 15 words here. AI bullets usually go wrong on content: a feature with no payoff, or three bullets that say the same thing in different words, a habit that comes from the model’s fondness for groups of three.",
    example: { before: "Fast, reliable and efficient service you can count on.", after: "Saturday appointments that fit around work and school." },
    body: "Each pack ended with three benefit bullets of 15 words or less. No model went over on any bullet, so this check separated no one.",
    draftly: "Draftly writes blog posts, and the same rules cover lists inside a post: use a list only when the items are truly parallel, never to pad, and never three items that all mean the same thing.",
    examples: [
      {
        verdict: "pass",
        model: "Kimi K3",
        business: "Phoenix dentist",
        lines: [
          { tag: "Bullet", text: "In-house membership plan from $29 a month, no insurance needed.", note: "10 words." },
          { tag: "Bullet", text: "Saturday appointments that fit around work, school and family schedules.", note: "10 words." },
        ],
      },
    ],
  },
  {
    id: "brief-facts",
    title: "Factual Accuracy: Only the Facts We Gave",
    lesson: "Copy is only as good as its facts. A 25-year workmanship warranty or a $29 monthly plan gives the reader a reason to choose you, and “quality service” fits any company. Models default to generic claims because those are the most common phrasing in their training data. When a detail is missing, they may fill the gap with one that sounds plausible, which is the more dangerous habit.",
    example: { before: "Trusted by homeowners for quality service.", after: "Every roof comes with a 25-year workmanship warranty." },
    body: "Each brief listed four facts the copy could use, such as a 25-year workmanship warranty or a $29 monthly plan, and asked for those over generic claims. The script checked that every pack used all four. It does not catch an invented claim.",
    draftly: "One rule can’t be switched off: never invent statistics, quotes, testimonials or facts about the business, such as prices, warranties or years in business. A code check then compares every number in the draft with the material the writer was given. An unsourced figure fails the draft and goes back for repair, while a hedged rule of thumb (“most tank water heaters last 8 to 12 years”) is flagged for review. A judge model also scores each post for factual safety. Like our test script, the code checks numbers, so a claim made in words relies on the rule and the judge.",
    examples: [
      {
        verdict: "pass",
        model: "Gemini 3.8 Flash",
        business: "AP software",
        lines: [
          { tag: "Headline", text: "Process vendor invoices [[in under 2 minutes]]" },
          {
            tag: "Subhead",
            text: "Ledgerline runs [[automated three-way matching]] and syncs directly with [[NetSuite and QuickBooks]], removing manual keying from your month-end close.",
          },
          { tag: "Button", text: "Book a [[20-minute demo]]" },
        ],
        note: "All four facts from the brief, in the hero alone.",
      },
      {
        verdict: "miss",
        label: "Scored miss",
        model: "Gemini 3 Flash",
        business: "AP software",
        lines: [{ tag: "Headline", text: "Process invoices in under [[two minutes]]" }],
        note: "Our script looked for “2 minutes” and missed “two minutes”, which cost Gemini 3 Flash its only fact point. In practice every model used every fact.",
      },
    ],
  },
  {
    id: "judge-criteria",
    title: "Judge Criteria: Clarity, Persuasion, Voice and Specificity",
    lesson: "Code can count characters. It can’t tell whether copy is clear, persuasive, on-brand or specific, so two judge models read every pack. Models lean toward safe, even-toned claims that would fit any brand, which is why persuasion scored lowest. A reason to act now usually comes from a specific fact in the brief.",
    body: "Two judge models scored each pack from 1 to 10 on four questions, then named its strongest and weakest line. Persuasion was the lowest score for every model, topping out at 7.2.",
    draftly: "Each Draftly post is scored by a judge model on seven reader questions, including whether it is specific to this business, reads like a knowledgeable person wrote it and makes no invented claims. Below the bar, the flagged sentences get one repair pass, and a post still below it is marked for review. The writing rules also ask the model to take a position, name the tradeoff and use concrete names and numbers from the material.",
    examples: [
      {
        verdict: "pass",
        label: "Strongest line",
        model: "Claude Opus 5.5",
        business: "Boise roofer",
        lines: [{ text: "Boise roofers since 1998. Same family, same phone number." }],
        note: "Picked by both judges. Gemini 3 Flash gave this pack 10 out of 10 for voice.",
      },
      {
        verdict: "miss",
        label: "Weakest line",
        model: "Claude Sonnet 4.6",
        business: "AP software",
        lines: [{ text: "Your AP Stack Was Missing Ledgerline" }],
        note: "Picked by both judges as the weakest line in the pack.",
      },
    ],
  },
];

/** What each judge criterion asked, from the judge prompt. */
export const JUDGE_CRITERIA = [
  { name: "Clarity", def: "A busy reader understands the offer, and why it matters, right away." },
  { name: "Persuasion", def: "It gives this reader a concrete reason to act now." },
  { name: "Voice", def: "It matches the brand voice in the brief." },
  { name: "Specificity", def: "It uses concrete details over generic claims." },
];

export const SEO_CRITERIA: Criterion[] = [
  {
    id: "keyword-title",
    title: "Target Keyword in the Title",
    lesson: "The target keyword is the phrase people type into search. Having it in the title tells searchers and search engines what the page answers. Models tend to paraphrase: they keep the question and drop the word that made it a specific search, like “timeline” below. To a model, a title with the same meaning looks as good as one with the exact words.",
    body: "Each brief named a target keyword, and the H1 had to contain every word of it. This and the next two placements were worth 3 points each.",
    draftly: "When a post has a target keyword, the code check fails a draft whose title (H1) or the first 120 characters of its meta description is missing any of the keyword’s words, and sends it back for repair.",
    examples: [
      {
        verdict: "miss",
        model: "Claude Haiku 4.5",
        business: "Boise roofer",
        lines: [{ tag: "H1", text: "How Long Does a Roof Replacement Take?" }],
        note: "Target: roof replacement timeline. The title drops “timeline”.",
      },
      {
        verdict: "pass",
        model: "Qwen 3.8 Max",
        business: "Boise roofer",
        lines: [{ tag: "H1", text: "How long does a roof replacement take? A Boise [[roof replacement timeline]]" }],
        note: "Keeps the question people search and adds the keyword.",
      },
    ],
  },
  {
    id: "keyword-first-100",
    title: "Target Keyword in the First 100 Words",
    lesson: "The opening lines tell readers and search engines whether they are in the right place, and the keyword near the top confirms it. Models often open with a good direct answer in different words, so the exact phrase shows up later or not at all.",
    body: "The keyword had to appear in the opening 100 words, where readers and search engines decide what the page is about.",
    draftly: "The writer is asked to use the keyword once in the opening paragraph where it reads naturally. The code check records a warning when it is missing from the first 100 words but never forces it in, since a forced keyword reads worse than none.",
    examples: [
      {
        verdict: "miss",
        model: "Gemini 3 Flash",
        business: "Boise roofer",
        lines: [{ text: "A standard 2,500-square-foot asphalt shingle roof in the Treasure Valley takes two days to complete." }],
        note: "A good direct answer, but “timeline” never appears in the first 100 words.",
      },
      {
        verdict: "pass",
        model: "Qwen 3.8 Max",
        business: "Boise roofer",
        lines: [
          {
            text: "A straightforward asphalt shingle replacement in Boise takes one to three working days once the crew starts tear-off. The [[roof replacement timeline]] stretches when the deck needs repairs, the pitch is steep, or rain moves in.",
          },
        ],
        note: "The keyword lands in the second sentence.",
      },
    ],
  },
  {
    id: "keyword-h2",
    title: "Target Keyword in an H2",
    lesson: "H2s are the outline of a page. A keyword in at least one tells skimmers and search engines the page covers the topic in depth. Models write headings around each section’s point, which is good practice, and the full keyword often doesn’t fit those headings naturally.",
    body: "At least one H2 had to carry the full keyword.",
    draftly: "Draftly asks for the keyword in an H2 only where it reads naturally, and the check that runs when a post is written doesn’t test H2s. The Editor’s keyword check notes when no H2 contains it.",
    examples: [
      {
        verdict: "miss",
        model: "Claude Sonnet 5.5",
        business: "AP software",
        lines: [
          { tag: "H2", text: "What a three-way match actually compares" },
          { tag: "H2", text: "Most three-way match exceptions come from six causes" },
        ],
        note: "Target: three-way match accounts payable. No H2 includes “accounts payable”.",
      },
      {
        verdict: "pass",
        model: "Kimi K3",
        business: "AP software",
        lines: [{ tag: "H2", text: "What a [[three-way match in accounts payable]] actually checks" }],
      },
    ],
  },
  {
    id: "meta-title",
    title: "Meta Title Length",
    lesson: "The meta title is the clickable line in search results. Google cuts off long titles, usually somewhere past 60 characters, and a short one wastes room for the words searchers scan for. Models don’t keep a character count as they write, so they miss in both directions.",
    body: "The brief asked for a meta title of 50 to 60 characters. We passed anything from 45 to 65, and docked 3 points outside that.",
    draftly: "The writer is asked for 50 to 60 characters, and the code counts the result. Outside that range, the draft goes back for a repair pass.",
    examples: [
      {
        verdict: "miss",
        model: "Claude Haiku 4.5",
        business: "AP software",
        lines: [{ tag: "Meta title", text: "Three-Way Match in Accounts Payable", note: "35 characters." }],
      },
      {
        verdict: "pass",
        model: "Qwen 3.8 Max",
        business: "Boise roofer",
        lines: [{ tag: "Meta title", text: "Roof replacement timeline in Boise | Summit Ridge Roofing", note: "57 characters." }],
      },
    ],
  },
  {
    id: "meta-description",
    title: "Meta Description Length",
    lesson: "The meta description is the summary under the title in search results. Google often shows it as the snippet and cuts off long ones. A good one says what the page answers and gives a reason to click. Models tend to stop once the summary is complete, wherever the count lands, which is how the 121-character miss below happened.",
    body: "The brief asked for 150 to 160 characters. We passed anything from 140 to 170, and docked 3 points outside that.",
    draftly: "Draftly asks for 150 to 160 characters with the keyword in the first 120, and the code check sends a draft outside the range back for repair.",
    examples: [
      {
        verdict: "miss",
        model: "Claude Haiku 4.5",
        business: "AP software",
        lines: [
          {
            tag: "Meta description",
            text: "Three-way matching in AP compares invoice, PO, and receipt. Learn what causes exceptions and how to automate the process.",
            note: "121 characters.",
          },
        ],
      },
      {
        verdict: "pass",
        model: "Qwen 3.8 Max",
        business: "Boise roofer",
        lines: [
          {
            tag: "Meta description",
            text: "Most Boise roof replacements take one to three days once work starts. Summit Ridge explains the roof replacement timeline, weather delays, and living at home.",
            note: "158 characters.",
          },
        ],
      },
    ],
  },
  {
    id: "seo-faq",
    title: "FAQ Section",
    lesson: "Search engines and AI answer engines pull short, self-contained answers from pages. A question heading followed by a two or three sentence answer is the easiest kind to quote. Models know the FAQ format well, but when a brief doesn’t spell out the layout they often spread the answers through the post, with nothing grouping them.",
    body: "The check looked for a heading with FAQ, frequently asked or questions in it.",
    draftly: "Draftly doesn’t force an FAQ section. Its rules ask for one 40 to 80 word paragraph that answers the post’s core question on its own, so search engines and AI assistants can quote it, and when a post has an FAQ, each answer runs one to three sentences.",
    examples: [
      {
        verdict: "miss",
        model: "Gemini 3.1 Pro (preview)",
        business: "Phoenix dentist",
        lines: [
          { tag: "H2", text: "Which lasts longer, an implant or a bridge?" },
          { tag: "H2", text: "Does dental insurance cover implants?" },
          { tag: "H2", text: "How painful is getting an implant?" },
        ],
        note: "All three questions answered, spread through the post with no FAQ section to group them.",
      },
      {
        verdict: "pass",
        model: "Qwen 3.8 Max",
        business: "Boise roofer",
        lines: [{ tag: "H2", text: "Straight answers to roof replacement timeline [[questions]]" }],
        note: "An FAQ heading that also carries the keyword.",
      },
    ],
  },
];

export const BLOG_CRITERIA: Criterion[] = [
  {
    id: "word-count",
    title: "Word Count Against the Brief",
    lesson: "Length should fit the question, and a brief’s word count is how the writer and editor agree on depth. Models pad to sound thorough: they restate points, add background nobody asked for and close with a summary. Others stop short when they run out of things to say or hit an output limit.",
    body: "The brief asked for 1,000 to 1,200 words and at least 750. Posts from 950 to 1,500 words kept full marks, posts outside that lost 5 points, and posts under 750 lost 20.",
    draftly: "The writer is asked for 750 to 1,100 words and told to stop once the question is answered, never padding to reach a count. A draft under 750 words fails the code check and goes back for repair. There is no check for running long.",
    examples: [
      {
        verdict: "miss",
        model: "GPT 5.5",
        business: "Phoenix dentist",
        words: 1841,
        note: "GPT 5.5 ran long on all three posts and averaged 1,774 words.",
      },
      {
        verdict: "pass",
        model: "Kimi K3",
        business: "Boise roofer",
        words: 1107,
        note: "Kimi K3 averaged 27 words from the middle of the brief.",
      },
    ],
  },
  {
    id: "structure",
    title: "Structure Held to the End",
    lesson: "A post’s structure is a promise to the reader: a title, sections with clear headings, an FAQ when the brief asks for one, and a closing step. Long outputs are where models drift. They lose track of the plan, or run out of output room and stop mid-sentence, as in the miss below.",
    body: "A full post keeps its H2s, the FAQ and the call to action all the way through. Long outputs are where a model is most likely to drop one.",
    draftly: "The writer’s brief sets the shape: an H1, an opening with no heading, H2 sections, and a final H2 that ends on a next step. The code check fails a draft with no H1 or more than one, no final H2 section, a bare label heading like Conclusion, or fewer than 750 words, and sends it back for repair.",
    examples: [
      {
        verdict: "miss",
        model: "Gemini 3.1 Pro (preview)",
        business: "Boise roofer",
        lines: [
          { tag: "H2", text: "The standard roof replacement timeline phase by phase" },
          { tag: "H2", text: "Hidden rot and structural repairs add hours or days" },
          { tag: "H2", text: "Material choice dictates the pace of the work" },
          { tag: "Last line", text: "Metal roofing demands a different pace. Standing seam" },
        ],
        note: "The post stopped mid-sentence at 500 words, with no FAQ and no call to action. It scored 64, against 87 and 95 for its other two posts.",
      },
      {
        verdict: "pass",
        model: "Qwen 3.8 Max",
        business: "Phoenix dentist",
        lines: [
          { tag: "H2", text: "Insurance treats bridges and implants differently" },
          { tag: "H2", text: "[[Common questions from Phoenix patients]]" },
          { tag: "H2", text: "Start with one exam and one clear plan" },
          { tag: "Last line", text: "Your next step is simple: [[Book a free implant consultation]]." },
        ],
        note: "Ten H2s, with the FAQ second to last and the call to action as the final line.",
      },
    ],
  },
  {
    id: "long-paragraphs",
    title: "Long Paragraphs",
    lesson: "A paragraph over about 120 words fills a phone screen with unbroken text, and readers start skimming. Models tend to write long, even paragraphs because each one tries to carry a full point, its setup and its caveats in one block.",
    body: "Any paragraph over 120 words cost 3 points. On a phone, that is several screens of unbroken text.",
    draftly: "The rules cap paragraphs at 120 words and aim for 40 to 80. A longer paragraph is recorded as a warning, and the Editor lists it as an issue to split by hand. Draftly doesn’t rewrite it automatically.",
    examples: [
      {
        verdict: "miss",
        model: "DeepSeek V3.2",
        business: "Boise roofer",
        lines: [
          {
            text: "The crew arrives early on the first scheduled day, usually by 7:00 AM. They begin by removing the old shingles, underlayment, and roofing nails. This is the tear-off. …",
          },
        ],
        note: "This paragraph runs 123 words before a break. DeepSeek V3.2 was the only model with any.",
      },
      {
        verdict: "pass",
        model: "Qwen 3.8 Max",
        business: "Boise roofer",
        lines: [
          {
            text: "Before anyone climbs a ladder, the crew confirms the permit, drops off the dumpster, and stacks shingles near the driveway. That prep keeps tear-off day from starting with a supply run.",
          },
        ],
        note: "Two sentences, one point, then a break.",
      },
    ],
  },
  {
    id: "mechanical-openers",
    title: "Mechanical Openers",
    lesson: "Words like Additionally, Furthermore and Moreover glue sentences together without saying how they relate. School essays and formal reports are full of them, and models picked up the habit of opening sentences with them to sound connected. Most can be deleted with no loss, or swapped for the real link: because, so, but.",
    example: { before: "Furthermore, the warranty covers labor.", after: "The warranty covers labor too." },
    body: "Sentences that start with Additionally, Furthermore, Moreover or That said cost 3 points each. The word adds length and no meaning.",
    draftly: "The writer’s rules ban a list of these openers, including Ultimately, Notably and That said. The code check records each one as a warning on the post. In the Editor, each sentence that opens with one is flagged and rewritten on its own.",
    examples: [
      {
        verdict: "miss",
        model: "Gemini 3 Flash",
        business: "Phoenix dentist",
        lines: [{ text: "[[Furthermore,]] because the bridge does not replace the root, the bone underneath the gap will continue to thin over time." }],
        note: "GPT 5.4 had two, both “That said,”.",
      },
      {
        verdict: "pass",
        model: "Kimi K3",
        business: "AP software",
        lines: [{ text: "If your exception queue is long, start at the dock." }],
        note: "The final section opens on the advice itself.",
      },
    ],
  },
];

/** The 12 formatting checks, grouped by what they catch. Each links to its example above. */
export const CHECK_GROUPS = [
  {
    id: "writing-habit-checks",
    title: "Writing Habit Checks",
    checks: [
      { rule: "Em dashes kept to about one per 300 words", cost: "3 points per extra dash, up to 15", result: "Claude Haiku 4.5 used 29 in three posts.", href: "#em-dashes" },
      { rule: "No AI vocabulary such as seamless, leverage, delve or landscape", cost: "4 points per word, up to 20", result: "Claude Haiku 4.5 used three.", href: "#ai-vocabulary" },
      { rule: "No “it’s not X, it’s Y” contrast phrasing", cost: "5 points each, up to 15", result: "Claude Sonnet 4.6 had six.", href: "#contrast-phrasing" },
      { rule: "No mechanical openers such as Additionally or Furthermore", cost: "3 points each, up to 10", result: "GPT 5.4 had two.", href: "#mechanical-openers" },
      { rule: "No emoji", cost: "5 points", result: "No model used one." },
    ],
  },
  {
    id: "structure-checks",
    title: "Structure Checks",
    checks: [
      { rule: "Length between 950 and 1,500 words", cost: "5 points, or 20 under 750 words", result: "GPT 5.5 averaged 1,774 words.", href: "#word-count" },
      { rule: "One H1, at least three H2s, and no section titled Introduction or Conclusion", cost: "5 to 10 points", result: "Every post passed." },
      { rule: "No paragraph over 120 words", cost: "3 points each, up to 10", result: "Only DeepSeek V3.2 missed, twice in one post.", href: "#long-paragraphs" },
      { rule: "An FAQ section answering the brief’s questions", cost: "8 points", result: "Gemini 3.1 Pro (preview) left it out of two posts.", href: "#faq-section" },
      { rule: "The post ends on the call to action from the brief", cost: "8 points", result: "Three models missed it once each.", href: "#call-to-action" },
    ],
  },
  {
    id: "seo-checks",
    title: "SEO Checks",
    checks: [
      { rule: "Target keyword in the title, the first 100 words and an H2", cost: "3 points per placement", result: "Claude Haiku 4.5 and Gemini 3 Flash each missed four of nine.", href: "#keyword-title" },
      { rule: "Meta title and meta description at the right length", cost: "3 points each", result: "Claude Haiku 4.5 and GPT 5.4 each missed four of six.", href: "#meta-title" },
    ],
  },
];

/**
 * Draftly's 13-point human-voice audit, ordered by how often the two judges flagged each
 * point across the 42 posts (84 judge reads). Counts come from the judges' tells in out/.
 */
export const AUDIT_POINTS = [
  { name: "Rhetorical questions", def: "A question the writer answers in the same breath.", flagged: 44 },
  { name: "Recap endings", def: "Closing by summarizing what the reader just read.", flagged: 41 },
  { name: "Padding structure", def: "Lists or headings that fill space without adding meaning.", flagged: 30 },
  { name: "Name swap", def: "Value claims that would still work with a competitor’s name in place of yours.", flagged: 28 },
  { name: "Punctuation", def: "Too many em dashes, Title Case headings, scattered bold or emoji bullets.", flagged: 26 },
  { name: "Contrast phrasing", def: "“It’s not X, it’s Y”, “not just X” and “more than just”.", flagged: 24 },
  { name: "No opinion", def: "Even, upbeat neutrality with no position taken and no tradeoff admitted.", flagged: 22 },
  { name: "Vague sections", def: "Whole sections with no names, numbers or concrete examples.", flagged: 13 },
  { name: "Throat-clearing openers", def: "A first sentence with no claim, number or observation in it.", flagged: 9 },
  { name: "Hedging", def: "“May help”, “can potentially” or “is designed to” where a position belongs.", flagged: 9 },
  { name: "Empty lists of three", def: "Three parallel items that all mean the same thing.", flagged: 8 },
  { name: "Buzzwords", def: "AI-typical vocabulary, the same family of words the formatting script checks.", flagged: 5 },
  { name: "Flat rhythm", def: "Every sentence about the same length, in a steady beat.", flagged: 4 },
];
export const AUDIT_READS = 84;
