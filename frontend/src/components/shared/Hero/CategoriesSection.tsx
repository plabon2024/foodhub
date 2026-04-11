"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

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

/* ---------------- Component ---------------- */
export default function CategoriesSection() {
  const { data: categories, isLoading } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  return (
    <>
      <style jsx global>{`
        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        @keyframes float-gentle {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes scale-in {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-shimmer {
          background: linear-gradient(
            90deg,
            transparent,
            hsl(var(--primary) / 0.1),
            transparent
          );
          background-size: 200% 100%;
          animation: shimmer 3s infinite;
        }

        .animate-float-gentle {
          animation: float-gentle 3s ease-in-out infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.5s ease-out forwards;
        }

        .category-card-gradient {
          background: linear-gradient(
            135deg,
            hsl(var(--card)) 0%,
            hsl(var(--muted) / 0.3) 100%
          );
        }
      `}</style>

      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-linear-to-b from-background via-transparent to-background pointer-events-none" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* ================= Header ================= */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4 max-w-2xl">
              {/* Section Tag */}
              <div className="inline-flex items-center gap-3 group">
                <div className="h-px w-12 bg-linear-to-r from-primary to-primary/50" />
                <Badge 
                  variant="outline" 
                  className="border-primary/20 text-primary px-3 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase hover:border-primary/40 transition-colors"
                >
                  <Sparkles className="h-3 w-3 mr-1.5 inline" />
                  Categories
                </Badge>
              </div>

              {/* Heading */}
              <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl">
                Explore by{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-linear-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    Category
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 z-0 transform -skew-y-1" />
                </span>
              </h2>

              {/* Description */}
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                Discover delicious meals by taste, tradition, and time of day. 
                Each category brings you closer to your perfect dish.
              </p>
            </div>

            {/* CTA Link */}
            <Link
              href="/meals"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary hover:text-primary/80 transition-all duration-300"
            >
              <span className="relative">
                Browse all meals
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* ================= Grid ================= */}
          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-scale-in"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  <Skeleton className="h-40 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4 sm:gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {categories?.map((c, index) => (
                <div
                  key={c.id}
                  className="animate-scale-in"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Link href={`/meals?categoryId=${c.id}`}>
                    <Card
                      className="
                        group relative h-full overflow-hidden rounded-2xl
                        border-2 border-border/40 
                        category-card-gradient
                        transition-all duration-500
                        hover:border-primary/40 
                        hover:shadow-2xl 
                        hover:shadow-primary/10
                        hover:-translate-y-2
                        hover:scale-[1.02]
                      "
                    >
                      {/* Shimmer Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shimmer" />
                      
                      {/* Gradient Glow */}
                      <div className="absolute -inset-1 bg-linear-to-r from-primary/0 via-primary/20 to-primary/0 opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-500" />

                      {/* Content */}
                      <div className="relative p-6 sm:p-7 flex h-full flex-col justify-between gap-4">
                        {/* Top Section */}
                        <div className="space-y-3">
                          {/* Icon/Number Badge */}
                          <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary font-bold text-sm border border-primary/20 group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                            {String(index + 1).padStart(2, '0')}
                          </div>

                          {/* Category Name */}
                          <h3 className="text-lg sm:text-xl font-bold leading-tight transition-colors group-hover:text-primary">
                            {c.name}
                          </h3>

                          {/* Description */}
                          {c.description && (
                            <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                              {c.description}
                            </p>
                          )}
                        </div>

                        {/* Bottom CTA */}
                        <div className="flex items-center gap-1.5 text-xs font-semibold text-primary">
                          <span className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                            Explore
                          </span>
                          <ArrowRight className="h-4 w-4 transition-all duration-300 opacity-0 group-hover:opacity-100 transform -translate-x-2 group-hover:translate-x-0" />
                        </div>
                      </div>

                      {/* Decorative Corner */}
                      <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-primary/5 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          )}

          {/* Bottom Decorative Line */}
          <div className="flex items-center justify-center pt-8">
            <div className="flex items-center gap-3">
              <div className="h-px w-24 bg-linear-to-r from-transparent to-primary/50" />
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <div className="h-px w-24 bg-linear-to-l from-transparent to-primary/50" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}