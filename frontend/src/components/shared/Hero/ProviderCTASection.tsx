"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChefHat, ArrowRight, TrendingUp, Users, DollarSign } from "lucide-react";

const perks = [
  { icon: <TrendingUp className="h-5 w-5" />, text: "Grow your business online" },
  { icon: <Users className="h-5 w-5" />, text: "Reach thousands of new customers" },
  { icon: <DollarSign className="h-5 w-5" />, text: "Earn money doing what you love" },
];

export default function ProviderCTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-primary/10 to-background pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,hsl(var(--primary)/0.15),transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center gap-3">
              <div className="h-px w-12 bg-gradient-to-r from-primary to-primary/50" />
              <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/80">
                For Home Chefs
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl xl:text-6xl">
                Turn Your{" "}
                <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                  Passion for Cooking
                </span>{" "}
                into Income
              </h2>
              <p className="text-muted-foreground text-base lg:text-lg leading-relaxed max-w-xl">
                Join hundreds of home chefs already earning on FoodHub. List your meals, set your own prices, and build a loyal customer base — all from your own kitchen.
              </p>
            </div>

            {/* Perks */}
            <ul className="space-y-4">
              {perks.map((p, i) => (
                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-primary/30 bg-primary/10 text-primary">
                    {p.icon}
                  </div>
                  {p.text}
                </li>
              ))}
            </ul>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4">
              <Button size="lg" asChild>
                <Link href="/register" className="gap-2">
                  Become a Provider
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/meals">See Existing Meals</Link>
              </Button>
            </div>
          </div>

          {/* Right: Decorative card */}
          <div className="relative flex items-center justify-center">
            <div className="absolute -inset-8 bg-gradient-to-r from-primary/20 via-primary/10 to-primary/5 rounded-5xl blur-3xl opacity-60" />
            <div className="relative flex flex-col items-center justify-center gap-6 rounded-4xl border-2 border-primary/20 bg-background/80 backdrop-blur-sm p-12 text-center shadow-2xl">
              <div className="flex h-24 w-24 items-center justify-center rounded-3xl border-2 border-primary/30 bg-primary/10 text-primary shadow-lg">
                <ChefHat className="h-12 w-12" />
              </div>
              <div className="space-y-2">
                <p className="text-5xl font-extrabold text-primary">500+</p>
                <p className="text-muted-foreground font-medium">Active Home Chefs</p>
              </div>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              <p className="text-sm text-muted-foreground max-w-xs">
                Join our growing community of passionate home cooks sharing delicious food every day.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
