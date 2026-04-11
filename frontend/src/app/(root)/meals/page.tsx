"use client";

import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Loader2, Sparkles, LayoutGrid } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MealsFilters from "./MealsFilters";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API = `${baseurl}/meals`;
const API_CATEGORIES = `${baseurl}/categories`;
const LIMIT = 6;

/* ---------------- Fetchers ---------------- */
async function fetchMeals(params: URLSearchParams) {
  const res = await fetch(`${API}?${params.toString()}`);
  if (!res.ok) throw new Error("FETCH_MEALS_FAILED");
  return (await res.json()).data;
}

async function fetchCategories() {
  const res = await fetch(API_CATEGORIES);
  if (!res.ok) throw new Error("FETCH_CATEGORIES_FAILED");
  return (await res.json()).data;
}

/* ---------------- Page ---------------- */
export default function MealsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page") ?? 1);

  const params = new URLSearchParams(searchParams.toString());
  params.set("page", String(page));
  params.set("limit", String(LIMIT));

  const { data, isLoading } = useQuery({
    queryKey: ["meals", params.toString()],
    queryFn: () => fetchMeals(params),
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  function goToPage(p: number) {
    params.set("page", String(p));
    router.push(`/meals?${params.toString()}`);
  }

  return (
    <>
      <style jsx global>{`
        @keyframes slide-in-left {
          0% {
            opacity: 0;
            transform: translateX(-30px);
          }
          100% {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes slide-in-up {
          0% {
            opacity: 0;
            transform: translateY(30px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse-border {
          0%, 100% {
            border-color: hsl(var(--border));
          }
          50% {
            border-color: hsl(var(--primary) / 0.3);
          }
        }

        .animate-slide-in-left {
          animation: slide-in-left 0.6s ease-out forwards;
        }

        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }

        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>

      <div className="min-h-screen bg-linear-to-b from-background via-muted/20 to-background pt-20">
        {/* Hero Header */}
        <div className="relative overflow-hidden  ">
       
          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 ">
            <div className="space-y-4">
              {/* Breadcrumb */}
              <div className="inline-flex items-center gap-3 group">
                <div className="h-px w-12 bg-linear-to-r from-primary to-primary/50" />
                <Badge 
                  variant="outline" 
                  className="border-primary/20 text-primary px-3 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase"
                >
                  <LayoutGrid className="h-3 w-3 mr-1.5 inline" />
                  Menu
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                Browse{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-linear-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    Meals
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-0 transform -skew-y-1" />
                  <Sparkles className="absolute -top-2 -right-8 h-6 w-6 text-primary animate-pulse" />
                </span>
              </h1>

              {/* Description */}
              <p className="text-base lg:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Discover delicious meals from trusted providers. Filter by category, price, and more to find your perfect dish.
              </p>

              {/* Stats */}
              {pagination && (
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium">
                      {pagination.totalItems} meals available
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="text-sm text-muted-foreground">
                    Page {page} of {pagination.totalPages}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-12">
          {/* ================= Layout ================= */}
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Filters Sidebar */}
            <aside className="animate-slide-in-left">
              <div className="lg:sticky lg:top-6">
                <MealsFilters categories={categories} />
              </div>
            </aside>

            {/* Results Section */}
            <main className="space-y-8">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse" />
                    <Loader2 className="relative h-12 w-12 animate-spin text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground animate-pulse">Loading delicious meals...</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-muted rounded-full blur-2xl opacity-50" />
                    <div className="relative h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center">
                      <LayoutGrid className="h-12 w-12 text-muted-foreground/50" />
                    </div>
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold">No meals found</h3>
                    <p className="text-sm text-muted-foreground max-w-sm">
                      Try adjusting your filters or search terms to find what you're looking for.
                    </p>
                  </div>
                  <Button onClick={() => router.push("/meals")} variant="outline">
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <>
                  {/* Results Grid */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((m: any, index: number) => (
                      <div
                        key={m.id}
                        className="animate-slide-in-up"
                        style={{ animationDelay: `${index * 80}ms` }}
                      >
                        <Link href={`/meals/${m.id}`} className="group block">
                          <Card className="relative overflow-hidden rounded-2xl border-2 border-border/40 bg-card/50 backdrop-blur-sm   p-0 h-full">
                            {/* Shine Effect */}
                            <div className="absolute inset-0 opacity-0    " />

                            {/* Image */}
                            <div className="relative h-56 overflow-hidden">
                              <Image
                                src={m.imageUrl}
                                alt={m.name}
                                fill
                                className="object-cover "
                              />

                

                              {/* Price Badge */}
                              <div className="absolute bottom-3 right-3 z-20">
                                <div className="relative group/price">
                                  <div className="absolute -inset-1 bg-linear-to-br from-primary to-primary/80 rounded-xl " />
                                  <div className="relative rounded-full bg-primary px-2 ">
                                    <span className="text-sm  text-primary-foreground">
                                      ৳{m.price}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Category Badge */}
                              <Badge className="absolute top-3 left-3 z-20 rounded-full  backdrop-blur-sm px-3 py-1.5 text-xs font-semibold shadow-lg border border-border/50">
                                {m.category.name}
                              </Badge>
                            </div>

                            {/* Content */}
                            <div className="relative space-y-3 p-5">
                              <h3 className="line-clamp-2 text-lg font-bold leading-tight transition-colors group-hover:text-primary min-h-[3.5rem]">
                                {m.name}
                              </h3>

                              {m.provider?.name && (
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                  <span className="truncate">by {m.provider.name}</span>
                                </div>
                              )}

                              <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

                              <div className="flex items-center justify-between pt-1">
                                <div className="flex items-center gap-2 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-2 group-hover:translate-x-0">
                                  <span>View details</span>
                                  <span>→</span>
                                </div>

                                <div className="flex gap-1">
                                  {[...Array(3)].map((_, i) => (
                                    <div
                                      key={i}
                                      className="h-1 w-1 rounded-full bg-primary/20 group-hover:bg-primary transition-all duration-300"
                                      style={{ transitionDelay: `${i * 50}ms` }}
                                    />
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Corner Accent */}
                            <div className="absolute bottom-0 left-0 w-20 h-20 bg-linear-to-tr from-primary/5 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          </Card>
                        </Link>
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {pagination && pagination.totalPages > 1 && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => goToPage(page - 1)}
                        disabled={page <= 1}
                        className="w-full sm:w-auto group border-2 hover:border-primary/40 transition-all duration-300"
                      >
                        <ChevronLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        Previous
                      </Button>

                      <div className="flex items-center gap-2">
                        {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                          const pageNum = i + 1;
                          const isActive = pageNum === page;
                          
                          return (
                            <Button
                              key={i}
                              size="icon"
                              variant={isActive ? "default" : "outline"}
                              onClick={() => goToPage(pageNum)}
                              className={`h-10 w-10 transition-all duration-300 ${
                                isActive 
                                  ? "shadow-lg shadow-primary/30 scale-110" 
                                  : "hover:border-primary/40"
                              }`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        
                        {pagination.totalPages > 5 && (
                          <>
                            <span className="text-muted-foreground">...</span>
                            <Button
                              size="icon"
                              variant={page === pagination.totalPages ? "default" : "outline"}
                              onClick={() => goToPage(pagination.totalPages)}
                              className="h-10 w-10"
                            >
                              {pagination.totalPages}
                            </Button>
                          </>
                        )}
                      </div>

                      <Button
                        size="lg"
                        variant="outline"
                        onClick={() => goToPage(page + 1)}
                        disabled={page >= pagination.totalPages}
                        className="w-full sm:w-auto group border-2 hover:border-primary/40 transition-all duration-300"
                      >
                        Next
                        <ChevronRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </main>
          </div>
        </div>
      </div>
    </>
  );
}