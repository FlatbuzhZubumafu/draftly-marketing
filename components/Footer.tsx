import { getHomepageData } from "@/lib/graphql";

export async function Footer() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;
  const year = new Date().getFullYear();

  return (
    <>
      <section style={{ background: "#000" }} className="px-4">
        <div className="container-draftly py-20">
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
            </div>

            {/* Connect column */}
            <div className="md:col-span-2">
              <h5 className="text-white font-semibold mb-4 text-base">Connect</h5>
              <ul className="space-y-3">
                <li>
                  <a href="/#testimonials" className="text-sm transition-colors hover:text-white" style={{ color: "#888" }}>
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="/#video" className="text-sm transition-colors hover:text-white" style={{ color: "#888" }}>
                    Features
                  </a>
                </li>
                <li>
                  <a href="/privacy-policy" className="text-sm transition-colors hover:text-white" style={{ color: "#888" }}>
                    Privacy Policy
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

          {/* Row 2: Waitlist button + copyright */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-16 pt-8" style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="md:col-span-8">
              <a
                href={registerUrl}
                className="inline-flex items-center gap-2 font-semibold text-white px-8 py-3 rounded-lg transition-all hover:opacity-90 hover:-translate-y-0.5"
                style={{ background: "var(--color-accent)", boxShadow: "var(--shadow-accent)" }}
              >
                Join the Beta
              </a>
            </div>
            <div className="md:col-span-4 md:text-right">
              <p className="text-sm" style={{ color: "#666" }}>
                © {s.footerText} {year}.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
