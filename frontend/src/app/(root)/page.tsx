"use client";

import HeroSection from "@/components/shared/Hero/HeroSection";
import FeaturedMealsSection from "@/components/shared/Hero/featured";
import CategoriesSection from "@/components/shared/Hero/CategoriesSection";
import CheckoutOurMenuSection from "@/components/shared/Hero/menu";
import HowItWorksSection from "@/components/shared/Hero/HowItWorksSection";
import WhyChooseUsSection from "@/components/shared/Hero/WhyChooseUsSection";
import TestimonialsSection from "@/components/shared/Hero/TestimonialsSection";
import ProviderCTASection from "@/components/shared/Hero/ProviderCTASection";
import AboutUsSection from "@/components/shared/Hero/AboutSection";

export default function HomePage() {
  return (
    <div>

      <HeroSection />

      <HowItWorksSection />
      <FeaturedMealsSection />

      <CategoriesSection />

      <CheckoutOurMenuSection />


      <WhyChooseUsSection />

      <TestimonialsSection />

      <ProviderCTASection />

      <AboutUsSection />
    </div>
  );
}
