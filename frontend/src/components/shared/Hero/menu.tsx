"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, Sparkles, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Meal = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  isAvailable: boolean;
  isFeatured: boolean;
  category: { name: string };
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
if (!baseUrl) throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
const API = `${baseUrl}/meals`;

async function fetchMeals(): Promise<Meal[]> {
  const res = await fetch(API);
  if (!res.ok) throw new Error(`Failed to fetch meals: ${res.status}`);
  const json = await res.json();
  return json.data.items as Meal[];
}

function MealRow({ meal, index }: { meal: Meal; index: number }) {
  return (
    <div
      className="menu-row-in group/row"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <Link
        href={`/meals/${meal.id}`}
        className="relative flex items-center justify-between gap-4 py-6 px-2 transition-all duration-300 rounded-xl hover:bg-primary/5"
      >
        {/* Left: icon + name + description */}
        <div className="flex-1 min-w-0 flex items-start gap-4">
          <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover/row:scale-110 group-hover/row:rotate-3">
            <UtensilsCrossed className="h-4 w-4" />
          </div>
          <div className="space-y-1">
            <p className="text-base font-bold text-foreground group-hover/row:text-primary transition-colors duration-300 leading-none">
              {meal.name}
            </p>
            {meal.description && (
              <p className="text-sm text-muted-foreground line-clamp-1 opacity-80 group-hover/row:opacity-100">
                {meal.description}
              </p>
            )}
          </div>
        </div>

        {/* Right: dots + price */}
        <div className="shrink-0 flex items-center gap-3">
          <span className="hidden sm:block text-muted-foreground/20 text-xs tracking-[0.3em] font-light">
            ······
          </span>
          <div className="relative">
             <span className="text-lg font-black text-foreground tabular-nums tracking-tight">
              ৳{meal.price}
            </span>
            <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary/30 group-hover/row:w-full transition-all duration-300" />
          </div>
          <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 transition-all duration-300 group-hover/row:opacity-100 group-hover/row:translate-x-0" />
        </div>
      </Link>
      <Separator className="opacity-30 mx-2" />
    </div>
  );
}

function SkeletonColumn({ count }: { count: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="space-y-1.5 py-2">
          <Skeleton className="h-4 w-3/4 rounded" />
          <Skeleton className="h-3 w-1/2 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function CheckoutOurMenuSection() {
  const { data: meals, isLoading } = useQuery({
    queryKey: ["meals-home"],
    queryFn: fetchMeals,
  });

  const availableMeals = meals?.filter((m) => m.isAvailable).slice(0, 8);
  const left  = availableMeals?.slice(0, 4);
  const right = availableMeals?.slice(4, 8);

  return (
    <>
      <style jsx global>{`
        @keyframes menu-row-in {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes menu-glow-pulse {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50%       { opacity: 0.5; transform: scale(1.1); }
        }
        .menu-row-in { animation: menu-row-in 0.5s ease-out both; }
        .menu-glow-blob { animation: menu-glow-pulse 4s ease-in-out infinite; }
      `}</style>

      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Ambient background blobs */}
        <div className="pointer-events-none absolute top-1/4 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl menu-glow-blob" />
        <div className="pointer-events-none absolute bottom-1/4 -right-24 w-80 h-80 bg-primary/4 rounded-full blur-3xl menu-glow-blob" style={{ animationDelay: "1.5s" }} />

        {/* Dot grid pattern overlay */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* ===== Header ===== */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-primary to-primary/40" />
                <Badge
                  variant="outline"
                  className="border-primary/25 text-primary px-3 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase"
                >
                  <UtensilsCrossed className="h-3 w-3 mr-1.5 inline" />
                  Our Menu
                </Badge>
              </div>

              <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                Checkout Our{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    Menu
                  </span>
                  <span className="absolute bottom-1.5 left-0 w-full h-3 bg-primary/15 z-0 transform -skew-y-1 rounded" />
                </span>
              </h2>

              <p className="max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                Fresh picks crafted daily — discover a selection of our most loved home-cooked meals.
              </p>
            </div>

            <Link
              href="/meals"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-300 shrink-0"
            >
              <span className="relative">
                Browse all meals
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300 rounded" />
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* ===== Menu columns ===== */}
          {isLoading ? (
            <div className="grid gap-10 md:grid-cols-2">
              <SkeletonColumn count={4} />
              <SkeletonColumn count={4} />
            </div>
          ) : (
            <div className="grid gap-10 md:grid-cols-2 md:divide-x md:divide-border/50">
              <div className="space-y-0">
                {left?.map((meal, i) => (
                  <MealRow key={meal.id} meal={meal} index={i} />
                ))}
              </div>
              <div className="space-y-0 md:pl-10">
                {right?.map((meal, i) => (
                  <MealRow key={meal.id} meal={meal} index={i + 4} />
                ))}
              </div>
            </div>
          )}

          {/* ===== CTA ===== */}
          <div className="flex flex-col items-center gap-8 pt-4">
            <Button
              asChild
              variant="outline"
              size="lg"
              className="group relative h-14 rounded-2xl px-10 border-primary/20 bg-background/50 backdrop-blur-sm hover:border-primary/50 text-foreground transition-all duration-300 overflow-hidden"
            >
              <Link href="/meals" className="inline-flex items-center gap-3">
                <span className="relative z-10 font-bold tracking-wide">Discover Entire Menu</span>
                <ArrowRight className="relative z-10 h-5 w-5 transition-transform group-hover:translate-x-1" />
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            </Button>

            <div className="flex items-center gap-4">
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
              <Sparkles className="h-4 w-4 text-primary/40 animate-pulse" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent via-primary/30 to-transparent" />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
