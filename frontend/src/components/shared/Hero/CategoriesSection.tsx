"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import {
  ArrowRight,
  Sparkles,
  Flame,
  Salad,
  Box,
  Soup,
  Beef,
  Fish,
  Pizza,
  Sandwich,
  Coffee,
  IceCream,
  ChefHat,
  Leaf,
  type LucideIcon,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

/* ---------------- API ---------------- */
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_CATEGORIES = `${baseurl}/categories`;

/* ---------------- Types ---------------- */
type Category = {
  id: string;
  name: string;
  description?: string;
};

/* ---------------- Fetcher ---------------- */
async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(API_CATEGORIES);
  if (!res.ok) throw new Error("FETCH_CATEGORIES_FAILED");
  return (await res.json()).data;
}

/* ---------------- Palette (icon + colors, cycles per card) ---------- */
interface Palette {
  icon: LucideIcon;
  gradient: string;
  shadow: string;
  ring: string;
  lightBg: string;
}

const PALETTES: Palette[] = [
  {
    icon: Flame,
    gradient: "from-orange-500 via-red-500 to-pink-500",
    shadow: "shadow-orange-500/30",
    ring: "ring-orange-400/40",
    lightBg: "from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30",
  },
  {
    icon: Salad,
    gradient: "from-green-500 via-emerald-500 to-teal-500",
    shadow: "shadow-green-500/30",
    ring: "ring-green-400/40",
    lightBg: "from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30",
  },
  {
    icon: Box,
    gradient: "from-violet-500 via-purple-500 to-fuchsia-500",
    shadow: "shadow-violet-500/30",
    ring: "ring-violet-400/40",
    lightBg: "from-violet-50 to-purple-50 dark:from-violet-950/30 dark:to-purple-950/30",
  },
  {
    icon: Soup,
    gradient: "from-blue-500 via-cyan-500 to-sky-500",
    shadow: "shadow-blue-500/30",
    ring: "ring-blue-400/40",
    lightBg: "from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30",
  },
  {
    icon: Beef,
    gradient: "from-yellow-500 via-amber-500 to-orange-400",
    shadow: "shadow-yellow-500/30",
    ring: "ring-yellow-400/40",
    lightBg: "from-yellow-50 to-amber-50 dark:from-yellow-950/30 dark:to-amber-950/30",
  },
  {
    icon: Fish,
    gradient: "from-rose-500 via-pink-500 to-fuchsia-400",
    shadow: "shadow-rose-500/30",
    ring: "ring-rose-400/40",
    lightBg: "from-rose-50 to-pink-50 dark:from-rose-950/30 dark:to-pink-950/30",
  },
  {
    icon: Pizza,
    gradient: "from-indigo-500 via-blue-500 to-violet-500",
    shadow: "shadow-indigo-500/30",
    ring: "ring-indigo-400/40",
    lightBg: "from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30",
  },
  {
    icon: Sandwich,
    gradient: "from-teal-500 via-cyan-500 to-green-400",
    shadow: "shadow-teal-500/30",
    ring: "ring-teal-400/40",
    lightBg: "from-teal-50 to-cyan-50 dark:from-teal-950/30 dark:to-cyan-950/30",
  },
  {
    icon: Coffee,
    gradient: "from-amber-600 via-yellow-600 to-orange-500",
    shadow: "shadow-amber-500/30",
    ring: "ring-amber-400/40",
    lightBg: "from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30",
  },
  {
    icon: IceCream,
    gradient: "from-pink-500 via-rose-400 to-fuchsia-300",
    shadow: "shadow-pink-500/30",
    ring: "ring-pink-400/40",
    lightBg: "from-pink-50 to-rose-50 dark:from-pink-950/30 dark:to-rose-950/30",
  },
  {
    icon: ChefHat,
    gradient: "from-slate-600 via-gray-500 to-zinc-400",
    shadow: "shadow-slate-400/30",
    ring: "ring-slate-400/40",
    lightBg: "from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30",
  },
  {
    icon: Leaf,
    gradient: "from-lime-500 via-green-400 to-emerald-400",
    shadow: "shadow-lime-500/30",
    ring: "ring-lime-400/40",
    lightBg: "from-lime-50 to-green-50 dark:from-lime-950/30 dark:to-green-950/30",
  },
];

/* ---------------- Component ---------------- */
export default function CategoriesSection() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <>
      <style jsx global>{`
        @keyframes slide-in-up {
          0%   { opacity: 0; transform: translateY(28px) scale(0.95); }
          100% { opacity: 1; transform: translateY(0)    scale(1);    }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.35; transform: scale(1);    }
          50%       { opacity: 0.65; transform: scale(1.08); }
        }
        .cat-card-in  { animation: slide-in-up 0.5s ease-out both; }
        .glow-blob    { animation: glow-pulse  2.5s ease-in-out infinite; }
      `}</style>

      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Ambient background blobs */}
        <div className="pointer-events-none absolute top-0 left-1/4 w-96 h-96 bg-primary/6 rounded-full blur-3xl glow-blob" />
        <div className="pointer-events-none absolute bottom-0 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl glow-blob" style={{ animationDelay: "1.2s" }} />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 space-y-14">

          {/* ===== Header ===== */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-3">
                <div className="h-px w-12 bg-gradient-to-r from-primary to-primary/40" />
                <Badge
                  variant="outline"
                  className="border-primary/25 text-primary px-3 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase"
                >
                  <Sparkles className="h-3 w-3 mr-1.5 inline" />
                  Categories
                </Badge>
              </div>

              <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                Explore by{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    Category
                  </span>
                  <span className="absolute bottom-1 left-0 w-full h-3 bg-primary/15 z-0 transform -skew-y-1 rounded" />
                </span>
              </h2>

              <p className="max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                Discover delicious meals by taste, tradition, and time of day.
                Each category brings you closer to your perfect dish.
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

          {/* ===== Grid ===== */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-5 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <Skeleton key={i} className="h-52 rounded-3xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-5 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {categories?.map((c, index) => {
                const p = PALETTES[index % PALETTES.length];
                const Icon = p.icon;

                return (
                  <div
                    key={c.id}
                    className="cat-card-in"
                    style={{ animationDelay: `${index * 65}ms` }}
                  >
                    <Link href={`/meals?categoryId=${c.id}`} className="group block">
                      <div
                        className={`
                          relative overflow-hidden rounded-3xl h-full
                          bg-gradient-to-br ${p.lightBg}
                          border-2 border-white/60 dark:border-white/10
                          shadow-md ${p.shadow}
                          transition-all duration-500
                          hover:shadow-2xl hover:border-white/80 dark:hover:border-white/20
                          hover:-translate-y-2 hover:scale-[1.02]
                          cursor-pointer
                        `}
                      >
                        {/* Coloured top-edge strip */}
                        <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${p.gradient}`} />

                        {/* Background glow orb */}
                        <div
                          className={`
                            pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full
                            bg-gradient-to-br ${p.gradient}
                            opacity-10 blur-2xl
                            group-hover:opacity-20 transition-opacity duration-500
                          `}
                        />

                        {/* Hover ring */}
                        <div
                          className={`
                            absolute inset-0 rounded-3xl ring-2 ${p.ring} ring-inset
                            opacity-0 group-hover:opacity-100 transition-opacity duration-300
                          `}
                        />

                        {/* Card body */}
                        <div className="relative p-6 flex flex-col gap-4 h-full">

                          {/* Icon bubble */}
                          <div
                            className={`
                              self-start flex h-14 w-14 items-center justify-center
                              rounded-2xl
                              bg-gradient-to-br ${p.gradient}
                              shadow-lg ${p.shadow}
                              ring-4 ring-white/30 dark:ring-black/20
                              transition-all duration-500
                              group-hover:scale-110 group-hover:rotate-6
                            `}
                          >
                            <Icon className="h-7 w-7 text-white drop-shadow" strokeWidth={1.75} />
                          </div>

                          {/* Text */}
                          <div className="space-y-1.5 flex-1">
                            <h3 className="text-base sm:text-lg font-bold leading-tight text-foreground group-hover:text-primary transition-colors duration-300">
                              {c.name}
                            </h3>
                            {c.description && (
                              <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                                {c.description}
                              </p>
                            )}
                          </div>

                          {/* Bottom row */}
                          <div className="flex items-center justify-between mt-auto pt-1">
                            <div
                              className={`
                                flex items-center gap-1 text-xs font-semibold
                                opacity-0 group-hover:opacity-100
                                -translate-x-2 group-hover:translate-x-0
                                transition-all duration-300
                                bg-gradient-to-r ${p.gradient} bg-clip-text text-transparent
                              `}
                            >
                              <span>Explore</span>
                              <ArrowRight className="h-3 w-3" />
                            </div>

                            {/* Decorative dots */}
                            <div className="flex gap-1 opacity-30 group-hover:opacity-70 transition-opacity duration-300">
                              {[0, 1, 2].map((i) => (
                                <div
                                  key={i}
                                  className={`h-1.5 w-1.5 rounded-full bg-gradient-to-r ${p.gradient}`}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Bottom-left accent circle */}
                        <div
                          className={`
                            pointer-events-none absolute -bottom-5 -left-5 h-20 w-20 rounded-full
                            bg-gradient-to-br ${p.gradient}
                            opacity-5 group-hover:opacity-10 transition-opacity duration-500
                          `}
                        />
                      </div>
                    </Link>
                  </div>
                );
              })}
            </div>
          )}

          {/* Bottom decorator */}
          <div className="flex items-center justify-center pt-4">
            <div className="flex items-center gap-3">
              <div className="h-px w-24 bg-gradient-to-r from-transparent to-primary/50" />
              <Sparkles className="h-4 w-4 text-primary animate-pulse" />
              <div className="h-px w-24 bg-gradient-to-l from-transparent to-primary/50" />
            </div>
          </div>

        </div>
      </section>
    </>
  );
}