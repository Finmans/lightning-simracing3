import ScrollProgress from "@/components/shared/ScrollProgress";
import FloatingCTA from "@/components/shared/FloatingCTA";
import Navbar from "@/components/shared/Navbar";
import Marquee from "@/components/shared/Marquee";
import Hero from "@/components/sections/Hero";
import Stats from "@/components/sections/Stats";
import FeaturedProducts from "@/components/sections/FeaturedProducts";
import Equipment3D from "@/components/sections/Equipment3D";
import HowItWorks from "@/components/sections/HowItWorks";
import FAQ from "@/components/sections/FAQ";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/shared/Footer";
import { readSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default function Home() {
  const settings = readSettings();
  return (
    <main className="min-h-screen bg-black">
      <ScrollProgress />
      <FloatingCTA />
      <Navbar />
      <Hero
        heroImage={settings.heroImage}
        heroCardTitle={settings.heroCardTitle}
        heroCardPrice={settings.heroCardPrice}
      />
      <Marquee />
      <Stats />
      <FeaturedProducts />
      <Equipment3D />
      <HowItWorks />
      <FAQ />
      <Contact />
      <Footer />
    </main>
  );
}
