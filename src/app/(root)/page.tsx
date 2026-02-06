"use client";

import AboutUsSection from "@/components/shared/Hero/AboutSection";
import CategoriesSection from "@/components/shared/Hero/CategoriesSection";
import FeaturedMealsSection from "@/components/shared/Hero/featured";
import HeroSection from "@/components/shared/Hero/HeroSection";
import CheckoutOurMenuSection from "@/components/shared/Hero/menu";

export default function HomePage() {
  return (
    <div>
      <HeroSection></HeroSection>
      <FeaturedMealsSection></FeaturedMealsSection>
      <CategoriesSection></CategoriesSection>
      <CheckoutOurMenuSection></CheckoutOurMenuSection>
      <AboutUsSection></AboutUsSection>
    </div>
  );
}
