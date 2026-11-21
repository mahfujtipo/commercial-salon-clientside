import HeroSection from "@/components/HeroSection";
import FeaturedServices from "@/components/home/FeaturedServices";
import ServiceCategories from "@/components/home/ServiceCategories";
import HowItWorks from "@/components/HowItWorks";
import WhyChooseUs from "@/components/WhyChooseUs";
import Testimonials from "@/components/home/Testimonials";

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturedServices />
      <ServiceCategories />
      <HowItWorks />
      <WhyChooseUs />
      <Testimonials />
    </>
  );
}
