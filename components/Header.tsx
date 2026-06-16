import { getHomepageData } from "@/lib/graphql";
import { HeaderInteractions } from "./HeaderInteractions";
import { Menu } from "lucide-react";

export async function Header() {
  const { marketingSettings: s } = await getHomepageData();
  const registerUrl = `${s.appName}/register`;
  const loginUrl = s.appName;

  return (
    <>
      <HeaderInteractions />
      <header
        id="site-header"
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: "transparent",
          borderBottom: "1px solid transparent",
        }}
      >
        <div className="container-draftly flex items-center justify-between py-4">
          <a href="/" className="flex items-center gap-2.5">
            {s.logoUrl && (
              <img src={s.logoUrl} alt={s.companyName} className="h-8 w-auto" />
            )}
            <span
              className="text-[26px] font-bold lowercase"
              style={{ letterSpacing: "var(--tracking-logo)", color: "var(--color-text-primary)" }}
            >
              {s.companyName.toLowerCase()}
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            <a href="/#how-it-works" className="text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors">How it works</a>
            <a href="/#features" className="text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors">Features</a>
            <a href="/#testimonials" className="text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors">Reviews</a>
            <a href="/blog" className="text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors">Blog</a>
            <a href="/#faq" className="text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-4">
            <a href={loginUrl} className="hidden sm:inline text-[15px] font-medium text-text-secondary hover:text-text-primary transition-colors">
              Log in
            </a>
            <a href={registerUrl} className="btn btn-primary text-sm">
              {s.heroCtaText}
            </a>
            <button id="mobile-toggle" className="md:hidden p-2" aria-label="Menu">
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>

        <nav
          id="mobile-menu"
          className="md:hidden px-6 py-4 space-y-3"
          style={{ display: "none", background: "var(--color-bg-primary)", borderBottom: "1px solid var(--color-border)" }}
        >
          <a href="/#how-it-works" className="block text-[15px] font-medium text-text-secondary">How it works</a>
          <a href="/#features" className="block text-[15px] font-medium text-text-secondary">Features</a>
          <a href="/#testimonials" className="block text-[15px] font-medium text-text-secondary">Reviews</a>
          <a href="/blog" className="block text-[15px] font-medium text-text-secondary">Blog</a>
          <a href="/#faq" className="block text-[15px] font-medium text-text-secondary">FAQ</a>
          <a href={loginUrl} className="block text-[15px] font-medium text-text-secondary">Log in</a>
        </nav>
      </header>
    </>
  );
}
