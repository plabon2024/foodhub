"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-60">
      <div className="container mx-auto px-6 ">
        <div className="grid items-center gap-16 lg:grid-cols-2">
          {/* ================= LEFT CONTENT ================= */}
          <div className="space-y-8">
            {/* Tag */}
            <span className="inline-flex items-center rounded-full border px-4 py-1 text-xs font-medium tracking-wide text-muted-foreground">
              Fresh • Homemade • Trusted
            </span>

            {/* Heading */}
            <h1 className="max-w-xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Discover homemade meals
              <br />
              <span className="text-primary">from local providers</span>
            </h1>

            {/* Description */}
            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Order fresh, home-cooked meals prepared by trusted local cooks.
              Healthy, affordable, and delivered straight to your door.
            </p>

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-2">
              <Button size="lg" asChild>
                <Link href="/meals">Browse Meals</Link>
              </Button>

              <Button size="lg" variant="outline" asChild>
                <Link href="/providers">Explore Providers</Link>
              </Button>
            </div>
          </div>

          {/* ================= RIGHT IMAGE ================= */}
          <div className="relative">
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-2xl border bg-muted shadow-sm">
              <Image
                src="/food.png"
                alt="Homemade food prepared by local providers"
                fill
                priority
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
