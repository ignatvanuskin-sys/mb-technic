import { Header } from "./Header";
import { Footer } from "./Footer";
import { MobileCtaBar } from "./MobileCtaBar";

/** Shared page frame: sticky header, content area with room for the mobile CTA bar, footer. */
export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main id="main" className="pb-[74px] md:pb-0">
        {children}
      </main>
      <Footer />
      <MobileCtaBar />
    </>
  );
}
