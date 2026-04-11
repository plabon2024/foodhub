"use client";

import { useQuery } from "@tanstack/react-query";
import {
  Loader2,
  ChefHat,
  MapPin,
  Star,
  Award,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

/* ---------------- API ---------------- */
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_PROVIDERS = `${baseurl}/providers`;

/* ---------------- Fetch ---------------- */
async function fetchProviders(): Promise<any[]> {
  const res = await fetch(API_PROVIDERS);
  if (!res.ok) throw new Error("FETCH_PROVIDERS_FAILED");
  return (await res.json()).data;
}

/* ---------------- Page ---------------- */
export default function ProvidersPage() {
  const { data: providers, isLoading } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });

  return (
    <>
      <style jsx global>{`
        @keyframes provider-slide-in {
          0% {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes badge-pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.8;
            transform: scale(1.05);
          }
        }

        @keyframes shine-slide {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        .animate-provider-slide-in {
          animation: provider-slide-in 0.6s ease-out forwards;
        }

        .animate-badge-pulse {
          animation: badge-pulse 2s ease-in-out infinite;
        }

        .provider-card-shine {
          background: linear-gradient(
            90deg,
            transparent 0%,
            hsl(var(--primary) / 0.15) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: shine-slide 3s infinite;
        }
      `}</style>

      <div className="min-h-screen bg-linear-to-b from-background via-muted/20 to-background">
        {/* Hero Header */}
        <div className="relative overflow-hidden  ">
          <div className="container relative mx-auto max-w-7xl px-4 sm:px-6 py-12 lg:py-16">
            <div className="space-y-4">
              {/* Breadcrumb */}
              <div className="inline-flex items-center gap-3 group">
                <div className="h-px w-12 bg-linear-to-r from-primary to-primary/50" />
                <Badge
                  variant="outline"
                  className="border-primary/20 text-primary px-3 py-1.5 text-xs font-semibold tracking-[0.2em] uppercase"
                >
                  <ChefHat className="h-3 w-3 mr-1.5 inline" />
                  Providers
                </Badge>
              </div>

              {/* Title */}
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight tracking-tight">
                Our{" "}
                <span className="relative inline-block">
                  <span className="relative z-10 bg-linear-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                    Food Providers
                  </span>
                  <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-0 transform -skew-y-1" />
                  <Sparkles className="absolute -top-2 -right-8 h-6 w-6 text-primary animate-pulse" />
                </span>
              </h1>

              {/* Description */}
              <p className="text-base lg:text-lg text-muted-foreground max-w-2xl leading-relaxed">
                Meet the passionate home chefs and food experts behind every
                meal. Each provider brings unique flavors and authentic recipes
                to your table.
              </p>

              {/* Stats */}
              {providers && (
                <div className="flex items-center gap-6 pt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium">
                      {providers.length} talented providers
                    </span>
                  </div>
                  <div className="h-4 w-px bg-border" />
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Award className="h-4 w-4 text-primary" />
                    <span>Verified & Trusted</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <section className="container relative mx-auto max-w-7xl px-4 sm:px-6 py-8 lg:py-16 space-y-10">
          {isLoading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="animate-provider-slide-in"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <Card className="overflow-hidden rounded-2xl border-2">
                    <div className="relative h-105 space-y-4">
                      <Skeleton className="absolute inset-0" />
                      <div className="absolute bottom-0 w-full p-5 space-y-3 bg-linear-to-t from-background via-background/80 to-transparent">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-12 w-full" />
                        <Skeleton className="h-6 w-20" />
                      </div>
                    </div>
                  </Card>
                </div>
              ))}
            </div>
          ) : providers && providers.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {providers.map((provider, index) => (
                <div
                  key={provider.id}
                  className="animate-provider-slide-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Link
                    href={`/providers/${provider.id}`}
                    className="group block"
                  >
                    <Card className="relative h-105 overflow-hidden rounded-2xl border-2 border-border/40 bg-card/50 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
                      {/* Shine Effect */}
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 provider-card-shine pointer-events-none z-10" />

                      {/* Image/Avatar */}
                      <div className="absolute inset-0">
                        {provider.user.image ? (
                          <Image
                            src={provider.user.image}
                            alt={provider.name}
                            fill
                            className="object-cover "
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 via-primary/10 to-muted">
                            <div className="flex h-32 w-32 items-center justify-center rounded-full bg-primary/20 border-4 border-primary/30 backdrop-blur-sm ">
                              <span className="text-6xl font-bold text-primary">
                                {provider.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Gradient Overlay */}
                      <div className="absolute inset-0 bg-linear-to-b from-transparent  to-black" />

                      {/* Content */}
                      <CardContent className="absolute bottom-0 w-full p-5 space-y-3 z-20">
                        {/* Chef Icon Badge */}
                        <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl   border-2 border-primary/30 text-primary duration-300 group-hover:scale-110 group-hover:rotate-6">
                          <ChefHat className="h-6 w-6" />
                        </div>

                        {/* Provider Name */}
                        <h3 className="text-xl font-bold leading-tight transition-colors group-hover:text-primary">
                          {provider.name}
                        </h3>

                        {/* Role */}
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                          <span>Home Food Provider</span>
                        </div>

                        {/* Description */}
                        {provider.description && (
                          <p className="line-clamp-2 text-sm  leading-relaxed">
                            {provider.description}
                          </p>
                        )}

                        {/* Divider */}
                        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />

                        {/* Bottom Info */}
                        <div className="flex items-center justify-between pt-1">
                          {/* Status Badge */}
                          <Badge
                            variant={
                              provider.user.status === "ACTIVE"
                                ? "default"
                                : "destructive"
                            }
                            className={`${
                              provider.user.status === "ACTIVE"
                                ? "bg-green-500/20 text-green-700 dark:text-green-400 border-green-500/30"
                                : ""
                            } font-semibold`}
                          >
                            <div
                              className={`h-1.5 w-1.5 rounded-full mr-1.5 ${
                                provider.user.status === "ACTIVE"
                                  ? "bg-green-500 animate-pulse"
                                  : "bg-red-500"
                              }`}
                            />
                            {provider.user.status}
                          </Badge>

                          {/* View Profile CTA */}
                          <div className="flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                            <span>View Profile</span>
                            <span>→</span>
                          </div>
                        </div>
                      </CardContent>

                      {/* Decorative Corner Accent */}
                      <div className="absolute top-0 right-0 w-24 h-24 bg-linear-to-bl from-primary/10 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </Card>
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 space-y-6">
              <div className="relative">
                <div className="absolute inset-0 bg-muted rounded-full blur-2xl opacity-50" />
                <div className="relative h-24 w-24 rounded-full bg-muted/50 flex items-center justify-center">
                  <ChefHat className="h-12 w-12 text-muted-foreground/50" />
                </div>
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold">No providers found</h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  We're currently onboarding talented chefs. Check back soon!
                </p>
              </div>
            </div>
          )}

          {/* Bottom Decorative Line */}
          {providers && providers.length > 0 && (
            <div className="flex items-center justify-center pt-8">
              <div className="flex items-center gap-3">
                <div className="h-px w-24 bg-linear-to-r from-transparent to-primary/50" />
                <ChefHat className="h-4 w-4 text-primary animate-pulse" />
                <div className="h-px w-24 bg-linear-to-l from-transparent to-primary/50" />
              </div>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
