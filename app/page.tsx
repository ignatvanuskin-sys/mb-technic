import { SiteChrome } from "@/components/SiteChrome";
import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Specialization } from "@/components/sections/Specialization";
import { Services } from "@/components/sections/Services";
import { Precision } from "@/components/sections/Precision";
import { WhyUs } from "@/components/sections/WhyUs";
import { Process } from "@/components/sections/Process";
import { Reviews } from "@/components/sections/Reviews";
import { Gallery } from "@/components/sections/Gallery";
import { InstagramSection } from "@/components/sections/InstagramSection";
import { Faq } from "@/components/sections/Faq";
import { Contacts } from "@/components/sections/Contacts";

export default function HomePage() {
  return (
    <SiteChrome>
      <Hero />
      <Marquee />
      <Specialization />
      <Services />
      <Precision />
      <WhyUs />
      <Process />
      <Reviews />
      <Gallery />
      <InstagramSection />
      <Faq />
      <Contacts />
    </SiteChrome>
  );
}
