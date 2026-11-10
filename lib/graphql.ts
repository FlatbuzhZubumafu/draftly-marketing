import { cache } from "react";

const WP_GRAPHQL_URL = process.env.WORDPRESS_API_URL || "https://wp.draftly.blog/graphql";

// A hung WordPress shouldn't hold a render (or a build worker) until the platform kills it.
const WP_TIMEOUT_MS = 10_000;

export async function fetchGQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
    signal: AbortSignal.timeout(WP_TIMEOUT_MS),
  });

  if (!res.ok) {
    throw new Error(`GraphQL fetch failed: ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    throw new Error(JSON.stringify(json.errors));
  }
  return json.data as T;
}

// Getters that feed every page (settings, posts, testimonials) fall back to safe
// defaults when WordPress is down, so an outage doesn't 500 the site or fail the
// build. The fallback is never cached for long: Next only stores 200 responses in
// the data cache, and because the fetch asked for `revalidate: 60` the page that
// rendered the fallback is regenerated within a minute of WordPress coming back.
//
// One log line per getter per outage; a success clears it so the next outage logs again.
const failing = new Set<string>();

async function withFallback<T>(label: string, load: () => Promise<T>, fallback: T): Promise<T> {
  try {
    const value = await load();
    failing.delete(label);
    return value;
  } catch (e) {
    if (!failing.has(label)) {
      failing.add(label);
      console.error(`[wordpress] ${label} failed, using fallback:`, e instanceof Error ? e.message : e);
    }
    return fallback;
  }
}

export interface MarketingSettings {
  heroBadge: string;
  heroHeadlineLine1: string;
  heroHeadlineLine2: string;
  heroSubhead: string;
  heroCtaText: string;
  heroNote: string;
  heroVideoUrl: string;
  footerCtaHeadline: string;
  footerCtaSubhead: string;
  footerCtaBody: string;
  footerCtaLoginText: string;
  contactEmail: string;
  footerText: string;
  appName: string;
  companyName: string;
  logoUrl: string;
  personalStoryHeading: string;
  personalStoryBody: string;
  notForEveryoneHeading: string;
  notForEveryoneBody: string;
  notForEveryoneUrgency: string;
  scrollBand1Text: string;
  scrollBand1Color: string;
  scrollBand2Text: string;
  scrollBand2Color: string;
}

export interface WPFeature {
  title: string;
  description: string;
  iconName: string;
}

export interface WPFaq {
  title: string;
  answer: string;
}

export interface WPStep {
  title: string;
  stepNumber: string;
  stepDescription: string;
  iconName: string;
}

export interface WPIntegration {
  title: string;
  colorClasses: string;
}

export interface WPTestimonial {
  personName: string;
  subtitle: string;
  quote: string;
  /**
   * Optional proof fields. Add them to the Testimonial post type in WordPress
   * (text fields, exposed to GraphQL under these names) and getTestimonials()
   * starts reading them; until then it falls back to the three fields above.
   */
  fullName?: string | null;
  company?: string | null;
  /** One specific result in the customer's words, e.g. "Went from 1 post a month to 3 a week". */
  outcome?: string | null;
  /** Square headshot URL, used only with the person's permission. */
  photoUrl?: string | null;
}

export interface WPPost {
  id: string;
  slug: string;
  title: string;
  date: string;
  modified: string;
  excerpt: string;
  content: string;
  featuredImage?: { node: { sourceUrl: string; altText: string } };
  author: { node: { name: string } };
}

const ALL_HOMEPAGE_DATA_QUERY = `
  query HomepageData {
    marketingSettings {
      heroBadge
      heroHeadlineLine1
      heroHeadlineLine2
      heroSubhead
      heroCtaText
      heroNote
      heroVideoUrl
      footerCtaHeadline
      footerCtaSubhead
      footerCtaBody
      footerCtaLoginText
      contactEmail
      footerText
      appName
      companyName
      logoUrl
      personalStoryHeading
      personalStoryBody
      notForEveryoneHeading
      notForEveryoneBody
      notForEveryoneUrgency
      scrollBand1Text
      scrollBand1Color
      scrollBand2Text
      scrollBand2Color
    }
    features(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { title description iconName }
    }
    faqs(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { title answer }
    }
    steps(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { title stepNumber stepDescription iconName }
    }
    integrations(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { title colorClasses }
    }
    testimonials(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { personName subtitle quote }
    }
  }
`;

export interface HomepageData {
  marketingSettings: MarketingSettings;
  features: { nodes: WPFeature[] };
  faqs: { nodes: WPFaq[] };
  steps: { nodes: WPStep[] };
  integrations: { nodes: WPIntegration[] };
  testimonials: { nodes: WPTestimonial[] };
}

/**
 * What the site renders with when WordPress can't be reached. Only the fields
 * components actually print get copy; the copy comes from elsewhere on the site.
 * Sections whose WordPress content is empty (personal story, steps) hide themselves.
 */
export const DEFAULT_MARKETING_SETTINGS: MarketingSettings = {
  heroBadge: "",
  heroHeadlineLine1: "",
  heroHeadlineLine2: "",
  heroSubhead: "Paste your URL and get SEO-ready posts in your brand's voice, free of AI filler.",
  heroCtaText: "Generate Free Post",
  heroNote: "Your first post is free.",
  heroVideoUrl: "",
  footerCtaHeadline: "",
  footerCtaSubhead: "",
  footerCtaBody: "",
  footerCtaLoginText: "",
  contactEmail: "preston@draftly.blog",
  footerText: "",
  appName: "https://app.draftly.blog",
  companyName: "Draftly",
  logoUrl: "",
  personalStoryHeading: "",
  personalStoryBody: "",
  notForEveryoneHeading: "",
  notForEveryoneBody: "",
  notForEveryoneUrgency: "",
  scrollBand1Text: "",
  scrollBand1Color: "",
  scrollBand2Text: "",
  scrollBand2Color: "",
};

const DEFAULT_HOMEPAGE_DATA: HomepageData = {
  marketingSettings: DEFAULT_MARKETING_SETTINGS,
  features: { nodes: [] },
  faqs: { nodes: [] },
  steps: { nodes: [] },
  // The integrations caption names these; they're the same six the homepage copy lists.
  integrations: { nodes: ["WordPress", "Shopify", "Ghost", "Webflow", "HubSpot", "Squarespace"].map((title) => ({ title, colorClasses: "" })) },
  testimonials: { nodes: [] },
};

/** Header, Footer and most sections call this, so it's deduplicated per request. */
export const getHomepageData = cache(
  (): Promise<HomepageData> =>
    withFallback(
      "homepage data",
      async () => {
        const data = await fetchGQL<HomepageData>(ALL_HOMEPAGE_DATA_QUERY);
        if (!data.marketingSettings) throw new Error("marketingSettings is empty");
        // Fields left blank in WordPress can come back null; make them "" so components can call string methods.
        const settings = Object.fromEntries(Object.entries(data.marketingSettings).map(([k, v]) => [k, v ?? ""])) as unknown as MarketingSettings;
        return { ...DEFAULT_HOMEPAGE_DATA, ...data, marketingSettings: settings };
      },
      DEFAULT_HOMEPAGE_DATA,
    ),
);

const POSTS_QUERY = `
  query Posts($after: String) {
    posts(first: 100, after: $after, where: { orderby: { field: DATE, order: DESC } }) {
      pageInfo { hasNextPage endCursor }
      nodes {
        id
        slug
        title
        date
        modified
        excerpt
        featuredImage { node { sourceUrl altText } }
        author { node { name } }
      }
    }
  }
`;

// WPGraphQL caps a page at 100 posts. Past this many, something is wrong; stop paging.
const MAX_POSTS = 1000;

/** Every published post, newest first (without `content`). Empty when WordPress is down. */
export const getPosts = cache(
  (): Promise<WPPost[]> =>
    withFallback(
      "posts",
      async () => {
        const posts: WPPost[] = [];
        let after: string | null = null;
        do {
          const { posts: page }: { posts: { pageInfo?: { hasNextPage: boolean; endCursor: string | null }; nodes: WPPost[] } } =
            await fetchGQL(POSTS_QUERY, { after });
          posts.push(...page.nodes);
          after = page.pageInfo?.hasNextPage ? page.pageInfo.endCursor : null;
        } while (after && posts.length < MAX_POSTS);
        return posts.slice(0, MAX_POSTS);
      },
      [],
    ),
);

const POST_QUERY = `
  query Post($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      date
      modified
      excerpt
      content
      featuredImage { node { sourceUrl altText } }
      author { node { name } }
    }
  }
`;

/**
 * One post, or null when WordPress has no post with that slug. Unlike the list
 * getters this throws when WordPress is unreachable: "missing" (404) and "down"
 * (5xx) need different answers, and a throw during ISR keeps the cached page.
 */
export async function getPost(slug: string) {
  const data = await fetchGQL<{ post: WPPost | null }>(POST_QUERY, { slug });
  return data.post;
}

const PAGE_QUERY = `
  query Page($slug: ID!) {
    page(id: $slug, idType: URI) {
      title
      modified
      content
    }
  }
`;

/** A WordPress page by URI, or null when it doesn't exist. Throws when WordPress is unreachable, like getPost. */
export async function getPage(slug: string) {
  const data = await fetchGQL<{ page: { title: string; modified: string; content: string } | null }>(PAGE_QUERY, { slug });
  return data.page;
}

const TESTIMONIALS_FULL_QUERY = `
  query Testimonials {
    testimonials(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { personName subtitle quote fullName company outcome photoUrl }
    }
  }
`;

const TESTIMONIALS_BASIC_QUERY = `
  query Testimonials {
    testimonials(where: { orderby: { field: MENU_ORDER, order: ASC } }) {
      nodes { personName subtitle quote }
    }
  }
`;

/**
 * Homepage testimonials. Tries the proof fields (photo, full name, company,
 * outcome) first; WordPress rejects the query until those fields exist, so it
 * then falls back to name, role and quote.
 *
 * Quotes from Draftly's own team (role "Owner" or "Founder") are left out:
 * they aren't customer proof.
 */
export async function getTestimonials(): Promise<WPTestimonial[]> {
  const nodes = await withFallback(
    "testimonials",
    async () => {
      try {
        return (await fetchGQL<{ testimonials: { nodes: WPTestimonial[] } }>(TESTIMONIALS_FULL_QUERY)).testimonials.nodes;
      } catch {
        return (await fetchGQL<{ testimonials: { nodes: WPTestimonial[] } }>(TESTIMONIALS_BASIC_QUERY)).testimonials.nodes;
      }
    },
    [],
  );
  return nodes.filter((t) => !/^(owner|founder|co-?founder)$/i.test(t.subtitle?.trim() ?? ""));
}
