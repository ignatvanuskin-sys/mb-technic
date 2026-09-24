import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileCtaBar } from "./MobileCtaBar";

/** Shared page frame: sticky header, content area with room for the mobile CTA bar, footer. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Keyboard users can jump straight past the navigation */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[200] focus:border focus:border-accent focus:bg-ink focus:px-4 focus:py-3 focus:text-sm focus:text-white"
      >
        Перейти к содержимому
      </a>
      <Header />
      <main id="main" className="pb-[calc(74px+var(--safe-bottom))] md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
