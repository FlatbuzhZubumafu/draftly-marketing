import { getHomepageData } from "@/lib/graphql";
import { LOGO_SRC } from "@/lib/site";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { CopyEmail } from "@/components/CopyEmail";
import { BILLING_TERMS_HREF } from "@/lib/pricing";
import { ReviewProfiles } from "@/components/ReviewProfiles";
import { COMPANY } from "@/lib/schema";

const MUTED = "#8a8a8a";
const FAINT = "#666";

const PRODUCT: [string, string][] = [
  ["/features", "Features"],
  ["/#how-it-works", "How it works"],
  ["/pricing", "Pricing"],
  ["/for-teams", "For teams"],
  ["/wordpress-ai-plugin", "WordPress plugin"],
  ["/mcp", "MCP connector"],
];

// /blog is the hub: every guide and every post is one click from it.
const RESOURCES: [string, string][] = [
  ["/blog", "Blog"],
  ["/blog#guides", "Guides"],
  ["/tools", "Free SEO tools"],
  ["/best-ai-for-writing", "Best AI for writing"],
  ["/jasper-vs-draftly", "Jasper vs Draftly"],
  ["/blog-writing-service", "Blog writing service vs AI"],
  ["/#faq", "FAQ"],
];

const COMPANY_PAGES: [string, string][] = [
  ["/about", "About"],
  ["/contact", "Contact"],
];

export async function Footer() {
  const { marketingSettings: s } = await getHomepageData();
  const year = new Date().getFullYear();

  return (
    <footer style={{ background: "#000" }} className="px-4">
      {/* Extra bottom padding below md keeps the sticky mobile CTA off the copyright line */}
      <div className="container-draftly pt-16 pb-28 md:pb-10">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-10">
          <div className="col-span-2 md:col-span-5">
            <a href="/" className="inline-flex items-center gap-2.5">
              <img src={LOGO_SRC} alt="" width={64} height={64} className="h-7 w-auto" />
              <span className="text-[22px] font-bold lowercase text-white" style={{ letterSpacing: "var(--tracking-logo)" }}>
                {s.companyName.toLowerCase()}
              </span>
            </a>
            <p className="mt-3 text-sm leading-relaxed max-w-sm" style={{ color: MUTED }}>
              The AI blog writer for small businesses. SEO-ready posts in your brand&apos;s voice, published to your site.
            </p>
            <NewsletterSignup location="footer" tone="dark" compact className="mt-8 max-w-md" />
          </div>

          <FooterColumn title="Product" links={PRODUCT} className="md:col-start-7" />
          <FooterColumn title="Resources" links={RESOURCES} />
          <div className="col-span-2 sm:col-span-1 md:col-span-2">
            <h2 className="text-white font-semibold mb-4 text-sm">Company</h2>
            <ul className="space-y-3 text-sm">
              {COMPANY_PAGES.map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="transition-colors hover:text-white" style={{ color: MUTED }}>
                    {label}
                  </a>
                </li>
              ))}
              <li>
                <CopyEmail email={COMPANY.email} color={MUTED} />
              </li>
              <li>
                <a href="/privacy-policy" className="transition-colors hover:text-white" style={{ color: MUTED }}>
                  Privacy policy
                </a>
              </li>
              <li>
                <a href="/terms-and-conditions" className="transition-colors hover:text-white" style={{ color: MUTED }}>
                  Terms
                </a>
              </li>
              <li>
                <a href={BILLING_TERMS_HREF} className="transition-colors hover:text-white" style={{ color: MUTED }}>
                  Cancellation and refunds
                </a>
              </li>
              <li>
                <a
                  href={COMPANY.textHref}
                  className="text-xs transition-colors hover:text-white"
                  style={{ color: FAINT }}
                >
                  Text {COMPANY.textNumber}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="mt-14 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs"
          style={{ borderTop: "1px solid rgba(255,255,255,0.08)", color: FAINT }}
        >
          <p>
            &copy; {year} Meta-Marketing LLC. A{" "}
            <a href="https://prestonvawdrey.com" className="underline underline-offset-2 transition-colors hover:text-white" style={{ color: MUTED }}>
              Preston Vawdrey
            </a>{" "}
            SEO product.
          </p>
          <ReviewProfiles tone="dark" />
          <p className="inline-flex flex-wrap items-center gap-x-3 gap-y-2">
            <span className="inline-flex items-center gap-1.5">
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <rect x="4" y="10" width="16" height="11" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              Secure checkout by Stripe. Hosted on Supabase, Vercel and Stripe, which hold SOC 2 Type II reports.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links, className = "" }: { title: string; links: [string, string][]; className?: string }) {
  return (
    <div className={`md:col-span-2 ${className}`}>
      <h2 className="text-white font-semibold mb-4 text-sm">{title}</h2>
      <ul className="space-y-3">
        {links.map(([href, label]) => (
          <li key={href}>
            <a href={href} className="text-sm transition-colors hover:text-white" style={{ color: MUTED }}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
