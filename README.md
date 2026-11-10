# draftly-marketing

The marketing site for [Draftly](https://www.draftly.blog), an AI blog writer for small businesses. It serves the homepage, pricing, feature and comparison pages, the blog, and a set of free SEO tools. The product itself lives at `app.draftly.blog` in a separate repo; this site links to it for signup and login.

## Stack

- **Next.js 16** (App Router, React 19, Turbopack) with Tailwind CSS 3. This Next.js version has breaking changes from older releases, so read the guides in `node_modules/next/dist/docs/` before changing framework code (see `AGENTS.md`).
- **Headless WordPress** at `wp.draftly.blog`, read through **WPGraphQL**. WordPress holds blog posts, the legal pages and the editable homepage settings. Everything else is code.
- **Vercel** for hosting, cron and analytics.
- Node 22.6 or newer (the tests run TypeScript directly with `node --test`).

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
```

No environment variables are required. Without `WORDPRESS_API_URL` the site reads the production WordPress. If WordPress can't be reached, pages still render with built-in defaults (see below).

## Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Unit tests for the free tools (`lib/tools/__tests__`) |

`scripts/try-ai-tools.mjs` runs the AI tools on sample inputs and needs a gateway key; it spends a few cents. Instructions are at the top of the file.

## Environment variables

All are optional. Public IDs have their production values as defaults in code.

| Variable | Used in | Purpose |
| --- | --- | --- |
| `WORDPRESS_API_URL` | `lib/graphql.ts` | WPGraphQL endpoint. Default `https://wp.draftly.blog/graphql`. |
| `TOOLS_AI_GATEWAY_API_KEY` | `lib/tools/ai/gateway.ts` | Vercel AI Gateway key for the content brief and blog ideas tools. Without it those tools are off, except on Vercel previews, which use the deployment's OIDC token. |
| `TOOLS_AI_MODEL` | `lib/tools/ai/gateway.ts` | Gateway model ID for the AI tools. |
| `TOOLS_AI_GATEWAY_URL` | `lib/tools/ai/gateway.ts` | Points the AI tools at a mock gateway for local testing. Leave unset in production. |
| `CRON_SECRET` | `app/api/indexnow/route.ts` | Bearer token Vercel sends on the IndexNow cron. Without it the route refuses every call. |
| `VERCEL_ENV` | IndexNow route, AI gateway | Set by Vercel. IndexNow only submits in `production`. |
| `DRAFTLY_STATS_URL` | `lib/site-stats.ts` | Public stats endpoint (posts written) shown on the site. |
| `NEXT_PUBLIC_NEWSLETTER_ENDPOINT` | `lib/newsletter.ts` | Newsletter signup endpoint, for pointing a preview elsewhere. |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `components/GoogleAnalytics.tsx` | GA4 measurement ID override. |
| `NEXT_PUBLIC_ADS_ENABLED` | `components/GoogleAnalytics.tsx` | `true` turns on ad storage consent for Google Ads. Leave off until the privacy policy covers it. |
| `NEXT_PUBLIC_AHREFS_ANALYTICS_KEY` | `components/AhrefsAnalytics.tsx` | Ahrefs Web Analytics key override. |

## How content gets from WordPress to the site

All WordPress access goes through `lib/graphql.ts`:

- `getHomepageData()` reads the `marketingSettings` options (hero copy, CTA text, app URL and so on) plus the FAQ, step, integration and testimonial post types. The header, footer and most pages call it.
- `getPosts()` pages through every post with WPGraphQL cursors, 100 at a time, up to 1,000. The blog index, sitemap, RSS feed, related posts and `generateStaticParams` for `/blog/[slug]` use it.
- `getPost(slug)` and `getPage(slug)` read one post or page.

Requests are cached with `next: { revalidate: 60 }`, so an edit in WordPress shows up on the site within about a minute. There is no webhook or on-demand revalidation.

When WordPress is down, `getHomepageData()`, `getPosts()` and `getTestimonials()` log one line and return defaults (`DEFAULT_MARKETING_SETTINGS` and empty lists), so pages and the build keep working. Next only stores successful responses in its data cache, and the 60 second revalidate means a page rendered with defaults is rebuilt within a minute of WordPress coming back. `getPost()` and `getPage()` still throw, because a missing post (404) and an outage (5xx) need different answers: blog posts show the error page, legal pages show a short notice, and the root `[slug]` catch-all answers 404.

WordPress also links posts at the root (`wp.draftly.blog/<slug>/`), so `app/[slug]/page.tsx` sends any root URL that matches a post to `/blog/<slug>` with a permanent redirect.

## Where things live

- `app/` Routes. Most marketing pages are static files with their copy inline. `app/blog` is the blog, `app/tools` the free tool pages, `app/feed.xml`, `app/sitemap.ts` and `app/llms.txt` the feeds, and `app/og` generated share images. `not-found.tsx`, `error.tsx` and `global-error.tsx` handle 404s and errors.
- `app/api/tools/*` POST endpoints for the free tools. Each route sets `maxDuration`; the time limits in `lib/tools/api.ts` and `lib/tools/ai/api.ts` sit a few seconds under it.
- `app/api/indexnow` Daily Vercel cron (`vercel.json`) that submits recently changed sitemap URLs to IndexNow.
- `components/` Shared UI. `Header` and `Footer` are server components; `HeaderInteractions` adds the scroll, mobile menu and sticky CTA behavior on the client. `components/tools` holds the tool UIs.
- `lib/` Data and page content: `graphql.ts` (WordPress), `site.ts` and `schema.ts` (site constants and JSON-LD), `pricing.ts`, `features.ts`, `industries.ts`, comparison page data, and more.
- `lib/tools/` The free tools' server code: an SSRF-guarded fetcher (`ssrf.ts`, `fetcher.ts`), per-IP rate limits (`rate-limit.ts`), the checkers (`checks/`), the AI tools (`ai/`) and tests (`__tests__/`).
- `public/` Images, brand assets and the WordPress plugin download.

## Deploying

The site deploys on Vercel: pushes to `main` go to production and pull requests get preview deployments. Set the environment variables above in the Vercel project; `CRON_SECRET` and `TOOLS_AI_GATEWAY_API_KEY` are the ones that matter in production.

GitHub Actions (`.github/workflows/ci.yml`) runs lint, typecheck, tests and a production build on every pull request and push to `main`. Lint doesn't block yet; the workflow file says why.
