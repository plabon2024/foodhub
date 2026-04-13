"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Star, Sparkles, Clock, TrendingUp } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/* ---------------- API ---------------- */
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_FEATURED = `${baseurl}/meals?featured=true`;
const API_ALL = `${baseurl}/meals?available=true`;

/* ---------------- Types ---------------- */
type Meal = {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  category: { name: string };
  provider: { name: string };
  isAvailable?: boolean;
};

/* ---------------- Fetcher (featured → fallback all) ---------------- */
async function fetchFeaturedMeals(): Promise<Meal[]> {
  // Try featured first
  try {
    const resFeatured = await fetch(API_FEATURED);
    if (resFeatured.ok) {
      const json = await resFeatured.json();
      const featured: Meal[] = json.data?.items ?? [];
      if (featured.length > 0) return featured.slice(0, 6);
    }
  } catch {
    // ignore, fall through to fallback
  }

  // Fallback: latest available meals (up to 6)
  const resAll = await fetch(API_ALL);
  if (!resAll.ok) throw new Error("FETCH_MEALS_FAILED");
  const json = await resAll.json();
  const all: Meal[] = json.data?.items ?? [];
  return all.slice(0, 6);
}

/* ---------------- Section ---------------- */
export default function FeaturedMealsSection() {
  const { data: meals, isLoading } = useQuery({
    queryKey: ["featured-meals"],
    queryFn: fetchFeaturedMeals,
  });

  // Only hide if loading is done AND we genuinely have no meals at all
  if (!isLoading && (!meals || meals.length === 0)) return null;

  return (
    <>
      <style jsx global>{`
        @keyframes shine {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes float-card {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.5;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes slide-up {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-shine {
          background: linear-gradient(
            90deg,
            transparent 0%,
            hsl(var(--primary) / 0.3) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shine 3s infinite;
        }

        .animate-float-card {
          animation: float-card 6s ease-in-out infinite;
        }

        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }

        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }

       

        .price-badge-gradient {
          background: linear-gradient(
            135deg,
            hsl(var(--primary)) 0%,
            hsl(var(--primary) / 0.8) 100%
          );
        }
      `}</style>

      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-150 h-150 bg-primary/5 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] opacity-30" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* ================= Header ================= */}
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="space-y-4 max-w-2xl">
              {/* Section Tag */}
              <div className="inline-flex items-center gap-3 group">
                <div className="h-px w-12 bg-linear-to-r from-primary to-primary/50" />
                <Badge 
                  variant="outline" 
                  className="border-primary/20 text-primary px-3 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase hover:border-primary/40 transition-colors group"
                >
                  <TrendingUp className="h-3 w-3 mr-1.5 inline animate-pulse-glow" />
                  Featured
                </Badge>
              </div>

              {/* Heading */}
              <h2 className="text-4xl font-bold leading-tight tracking-tight lg:text-5xl xl:text-6xl">
                <span className="relative inline-block">
                  <span className="relative z-10">Featured </span>
                </span>
                <span className="relative inline-block">
                  <span className="relative z-10 bg-linear-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    Meals
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-0 transform -skew-y-1" />
                  <Sparkles className="absolute -top-2 -right-8 h-6 w-6 text-primary animate-pulse-glow" />
                </span>
              </h2>

              {/* Description */}
              <p className="max-w-xl text-base leading-relaxed text-muted-foreground lg:text-lg">
                Popular picks loved by customers. Handcrafted with care and bursting with flavor.
              </p>
            </div>

            {/* CTA Link */}
            <Link
              href="/meals"
              className="group inline-flex items-center gap-2 rounded-full bg-primary/10 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300 hover:shadow-lg hover:shadow-primary/30"
            >
              <span>Browse all meals</span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {/* ================= Grid ================= */}
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-slide-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Skeleton className="h-105 rounded-2xl" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {meals?.map((m, index) => (
                <div
                  key={m.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link href={`/meals/${m.id}`} className="group block">
                    <Card className="relative overflow-hidden rounded-2xl border-2 border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 p-0 h-full">
                      {/* Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-shine pointer-events-none z-10" />

                      {/* ================= Image Section ================= */}
                      <div className="relative h-64 overflow-hidden bg-muted">
                        {m.imageUrl ? (
                          <>
                            {/* Main Image */}
                            <Image
                              src={m.imageUrl}
                              alt={m.name}
                              fill
                              className="object-cover "
                            />

                            {/* Gradient Overlay */}
                            <div className="absolute inset-0 image-overlay-gradient" />

                            {/* Top Badges */}
                            <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20">
                              {/* Category Badge */}
                              <Badge className="rounded-full  backdrop-blur-sm px-3 py-1.5 text-xs font-semibold shadow-lg border border-border/50 ">
                                {m.category.name}
                              </Badge>

                              {/* Availability Badge */}
                              {m.isAvailable === false && (
                                <Badge className="rounded-full bg-destructive/95 backdrop-blur-sm px-3 py-1.5 text-xs font-semibold text-destructive-foreground shadow-lg ">
                                  <Clock className="h-3 w-3 mr-1 inline" />
                                  Unavailable
                                </Badge>
                              )}
                            </div>

                           

                            {/* Price Badge */}
                            <div className="absolute bottom-3 right-3 z-20">
                              <div className="relative group/price">
                                <div className="absolute -inset-1 price-badge-gradient rounded-xl blur opacity-70 group-hover/price:opacity-100 transition-opacity" />
                                <div className="relative  bg-primary rounded-full px-2 backdrop-blur-3xl shadow-xl">
                                  <span className="text-sm font-bold text-primary-foreground">
                                    ৳{m.price}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                            <div className="text-center space-y-2">
                              <div className="h-12 w-12 mx-auto rounded-full bg-muted-foreground/10 flex items-center justify-center">
                                <Image src="/placeholder.svg" alt="No image" width={24} height={24} className="opacity-50" />
                              </div>
                              <p>No image available</p>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* ================= Content Section ================= */}
                      <div className="relative space-y-4 p-5">
                        {/* Meal Name */}
                        <h3 className="line-clamp-2 text-xl font-bold leading-tight transition-colors group-hover:text-primary min-h-[3.5rem]">
                          {m.name}
                        </h3>

                        {/* Provider Info */}
                        {m.provider?.name && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-glow" />
                            <span className="truncate">by {m.provider.name}</span>
                          </div>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

                        {/* View Details CTA */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-2 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                            <span>View details</span>
                            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                          </div>

                          {/* Decorative Element */}
                          <div className="flex gap-1">
                            {[...Array(5)].map((_, i) => (
                              <div
                                key={i}
                                className="h-1 w-1 rounded-full bg-primary/20 group-hover:bg-primary transition-all duration-300"
                                style={{ transitionDelay: `${i * 50}ms` }}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Decorative Corner Accent */}
                      <div className="absolute bottom-0 left-0 w-24 h-24 bg-linear-to-tr from-primary/5 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
              <Sparkles className="h-4 w-4 text-primary animate-pulse-glow" />
              <div className="h-px w-24 bg-linear-to-l from-transparent to-primary/50" />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}