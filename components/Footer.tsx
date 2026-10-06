import { getHomepageData } from "@/lib/graphql";

export async function Footer() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;
  const year = new Date().getFullYear();

  return (
    <>
      <section style={{ background: "#000" }} className="px-4">
        {/* Extra bottom padding below md keeps the sticky mobile CTA off the copyright line */}
        <div className="container-draftly py-20 pb-32 md:pb-20">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {/* Heading */}
            <div className="md:col-span-8">
              <h2
                className="font-medium text-white"
                style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)", lineHeight: "1.1", letterSpacing: "-0.03em" }}
              >
                Write Better Drafts,<br />
                <em className="italic" style={{ color: "#ffce59" }}>
                  Stay Top of Mind
                </em>
              </h2>
              <div className="mt-8">
                <a
                  href={registerUrl}
                  className="inline-flex items-center gap-2 font-semibold text-white px-8 py-3 rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
                  style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-accent)" }}
                >
                  {s.heroCtaText}
                </a>
              </div>
            </div>

            {/* Connect column */}
            <div className="md:col-span-2">
              <h5 className="text-white font-semibold mb-4 text-base">Draftly</h5>
              <ul className="space-y-3">
                <li>
                  <a href="/#testimonials" className="text-sm transition-colors hover:text-white" style={{ color: "#888" }}>
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="/#features" className="text-sm transition-colors hover:text-white" style={{ color: "#888" }}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="/pricing" className="text-sm transition-colors hover:text-white" style={{ color: "#888" }}>
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="/mcp" className="text-sm transition-colors hover:text-white" style={{ color: "#888" }}>
                    MCP Connector
                  </a>
                </li>
                <li>
                  <a href="/best-ai-for-writing" className="text-sm transition-colors hover:text-white" style={{ color: "#888" }}>
                    AI Model Benchmark
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" className="text-sm transition-colors hover:text-white" style={{ color: "#888" }}>
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="/terms-and-conditions" className="text-sm transition-colors hover:text-white" style={{ color: "#888" }}>
                    Terms
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact Us column */}
            <div className="md:col-span-2">
              <h5 className="text-white font-semibold mb-4 text-base">Contact Us</h5>
              <ul className="space-y-3">
                <li>
                  <a
                    href="sms:+13857224497?&body=Hi%2C%20I%20am%20interested%20in%20learning%20more%20about%20Draftly."
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#888" }}
                  >
                    385-722-4497
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:preston@draftly.blog"
                    className="text-sm transition-colors hover:text-white"
                    style={{ color: "#888" }}
                  >
                    preston@draftly.blog
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Row 2: payment and infrastructure trust marks */}
          <div
            className="mt-12 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-5"
            style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
          >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
              <span className="inline-flex items-center gap-2 text-sm" style={{ color: "#888" }}>
                <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <rect x="4" y="10" width="16" height="11" rx="2" />
                  <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
                Secure checkout by <span className="font-semibold" style={{ color: "#bbb" }}>Stripe</span>
              </span>
              <span className="flex items-center gap-3" aria-label="Accepted payment methods">
                {[
                  ["visa", "Visa"],
                  ["mastercard", "Mastercard"],
                  ["applepay", "Apple Pay"],
                ].map(([file, name]) => (
                  <img key={file} src={`/brand/${file}.svg`} alt={name} title={name} className="h-6 w-auto" style={{ filter: "invert(1)", opacity: 0.6 }} />
                ))}
              </span>
            </div>
            <p className="text-sm max-w-sm" style={{ color: "#666" }}>
              Runs on SOC 2 Type II certified infrastructure from Supabase, Vercel and Stripe.
            </p>
          </div>

          {/* Row 3: copyright */}
          <div className="mt-8 md:text-right">
            <div>
              <p className="text-sm" style={{ color: "#666" }}>
                © {s.footerText} {year}.
              </p>
              <p className="text-sm mt-1" style={{ color: "#666" }}>
                A{" "}
                <a
                  href="https://prestonvawdrey.com"
                  className="underline underline-offset-2 transition-colors hover:text-white"
                  style={{ color: "#888" }}
                >
                  Preston Vawdrey
                </a>{" "}
                SEO product
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
