// Stock photos on the guide and comparison pages. All from Unsplash under the Unsplash
// License (free for commercial use, no attribution required); we credit the photographer
// anyway. Checked 2026-10-16. Cropped to 3:2 and saved as 1200x800 webp in
// public/images/content/<page>/. Natural scenes only: no brand logos, and nobody shown
// is a Draftly customer.

export type StockImage = {
  src: string;
  width: number;
  height: number;
  alt: string;
  photographer: string;
  source: string;
};

const photo = (page: string, file: string, alt: string, photographer: string, source: string): StockImage => ({
  src: `/images/content/${page}/${file}.webp`,
  width: 1200,
  height: 800,
  alt,
  photographer,
  source,
});

export const STOCK = {
  writingAtDesk: photo("claude-vs-chatgpt-for-writing", "writing-at-desk",
    "Overhead view of someone typing on a laptop at a round white table, with a notebook, pencils and a small plant beside it",
    "Corinne Kutz", "https://unsplash.com/photos/person-using-laptop-computer-beside-aloe-vera-tMI2_-r5Nfo"),
  typingByWindow: photo("best-ai-for-writing", "typing-by-window",
    "A person in a mustard sweater typing on a laptop at a wooden desk by a window",
    "Christin Hume", "https://unsplash.com/photos/person-sitting-front-of-laptop-mfB1B1s4sMc"),
  contentStrategyPlanner: photo("writesonic-alternatives", "content-strategy-planner",
    "A spiral planner open to a page with Content Strategy written in pen",
    "Walls.io", "https://unsplash.com/photos/a-spiral-notebook-with-a-notepad-and-pen-on-top-of-it-VGAl6JCHlTY"),
  analyticsOnLaptop: photo("best-ai-for-seo", "analytics-on-laptop",
    "Hands typing on a laptop showing a website analytics dashboard, next to a coffee mug and pens",
    "Myriam Jessier", "https://unsplash.com/photos/person-using-macbook-pro-on-black-table-eveI7MOcSmw"),
  readingOnLaptop: photo("koala-ai-review", "reading-on-laptop",
    "Close-up of a person working on a laptop at a bright table, with a coffee cup nearby",
    "Etienne Boulanger", "https://unsplash.com/photos/person-seated-at-the-table-using-laptop-aafOjsh-9jU"),
  workingFromHome: photo("arvow-review", "working-from-home",
    "A woman typing on a laptop at a desk in a bright living room",
    "Vitaly Gariev", "https://unsplash.com/photos/woman-working-on-a-laptop-in-a-cozy-living-room-OfuwkI80iPY"),
  planningWithStickyNotes: photo("copy-ai-alternatives", "planning-with-sticky-notes",
    "A team placing sticky notes on a printed customer journey map spread across a table",
    "UX Indonesia", "https://unsplash.com/photos/team-collaborating-with-sticky-notes-w00FkE6e8zE"),
  shopOwnerAtLaptop: photo("blog-writing-service", "shop-owner-at-laptop",
    "A small clothing studio owner on the phone at her laptop, with sewing patterns pinned on the wall behind her",
    "Vitaly Gariev", "https://unsplash.com/photos/kk4J92iaSBk"),
  teamAtCafeTable: photo("for-teams", "team-at-cafe-table",
    "Three coworkers laughing together at a wooden table with two laptops open",
    "Brooke Cagle", "https://unsplash.com/photos/g1Kr4Ozfoac"),
  teamWorkingTogether: photo("for-teams", "team-working-together",
    "A small team working on laptops around one long wooden table",
    "Annie Spratt", "https://unsplash.com/photos/QckxruozjRg"),
} satisfies Record<string, StockImage>;
