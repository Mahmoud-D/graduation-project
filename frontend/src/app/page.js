import HeroSection from "@/components/sections/hero-section";
import HowItWorks from "@/components/sections/how-it-works";
import FeaturedRestaurants from "@/components/sections/featured-restaurants";
import SpecialOffers from "@/components/sections/special-offers";
import AppFeatures from "@/components/sections/app-features";
import Testimonials from "@/components/sections/testimonials";
import Footer from "@/components/sections/footer";

export default function Home() {
  return (
    <main dir="rtl" className="min-h-screen bg-light-shade">
      <HeroSection />
      <HowItWorks />
      <FeaturedRestaurants />
      <SpecialOffers />
      <AppFeatures />
      <Testimonials />
      <Footer />
    </main>
  );
}
