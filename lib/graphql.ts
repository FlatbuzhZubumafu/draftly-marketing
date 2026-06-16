const WP_GRAPHQL_URL = process.env.WORDPRESS_API_URL || "https://draftly.blog/graphql";

export async function fetchGQL<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(WP_GRAPHQL_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
    next: { revalidate: 60 },
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
}

export interface WPPost {
  id: string;
  slug: string;
  title: string;
  date: string;
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

export async function getHomepageData() {
  return fetchGQL<{
    marketingSettings: MarketingSettings;
    features: { nodes: WPFeature[] };
    faqs: { nodes: WPFaq[] };
    steps: { nodes: WPStep[] };
    integrations: { nodes: WPIntegration[] };
    testimonials: { nodes: WPTestimonial[] };
  }>(ALL_HOMEPAGE_DATA_QUERY);
}

const POSTS_QUERY = `
  query Posts {
    posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
      nodes {
        id
        slug
        title
        date
        excerpt
        featuredImage { node { sourceUrl altText } }
        author { node { name } }
      }
    }
  }
`;

export async function getPosts() {
  const data = await fetchGQL<{ posts: { nodes: WPPost[] } }>(POSTS_QUERY);
  return data.posts.nodes;
}

const POST_QUERY = `
  query Post($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      slug
      title
      date
      content
      featuredImage { node { sourceUrl altText } }
      author { node { name } }
    }
  }
`;

export async function getPost(slug: string) {
  const data = await fetchGQL<{ post: WPPost | null }>(POST_QUERY, { slug });
  return data.post;
}
