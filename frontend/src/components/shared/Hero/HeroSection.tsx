"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  ChefHat,
  Clock,
  ShieldCheck,
  Star,
  UtensilsCrossed,
} from "lucide-react";

/* ---------- tiny floating stat card ---------- */
function StatBadge({
  icon,
  value,
  label,
  className = "",
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  className?: string;
}) {
  return (
    <div
      className={`
        flex items-center gap-3 rounded-2xl
        bg-background/90 backdrop-blur-md
        border border-border/60
        shadow-xl px-4 py-3 w-max
        ${className}
      `}
    >
      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-sm font-bold leading-none">{value}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <>
      <style jsx global>{`
        @keyframes hero-float {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-14px); }
        }
        @keyframes hero-spin-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes hero-fade-up {
          0%   { opacity: 0; transform: translateY(24px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes hero-scale-in {
          0%   { opacity: 0; transform: scale(0.92); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes blob-pulse {
          0%, 100% { transform: scale(1);    opacity: 0.5; }
          50%       { transform: scale(1.12); opacity: 0.7; }
        }

        .hero-float       { animation: hero-float 6s ease-in-out infinite; }
        .hero-spin-slow   { animation: hero-spin-slow 18s linear infinite; }
        .hero-fade-up-1   { animation: hero-fade-up 0.7s ease-out 0.1s both; }
        .hero-fade-up-2   { animation: hero-fade-up 0.7s ease-out 0.3s both; }
        .hero-fade-up-3   { animation: hero-fade-up 0.7s ease-out 0.5s both; }
        .hero-fade-up-4   { animation: hero-fade-up 0.7s ease-out 0.7s both; }
        .hero-scale-in    { animation: hero-scale-in 0.9s ease-out 0.2s both; }
        .blob-pulse       { animation: blob-pulse 4s ease-in-out infinite; }
      `}</style>

      <section className="relative min-h-screen flex items-center overflow-hidden pt-24 pb-16">

        {/* ====== Decorative Background ====== */}
        {/* Large gradient blobs */}
        <div className="pointer-events-none absolute -top-32 -left-32 h-[600px] w-[600px] rounded-full bg-primary/10 blur-3xl blob-pulse" />
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-primary/8 blur-3xl blob-pulse" style={{ animationDelay: "2s" }} />
        <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[800px] w-[800px] rounded-full bg-primary/3 blur-3xl" />

        {/* Dot grid pattern */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "radial-gradient(circle, currentColor 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Spinning ring accent — top right */}
        <div className="pointer-events-none absolute top-24 right-8 lg:right-24 h-64 w-64 opacity-10 hero-spin-slow hidden lg:block">
          <svg viewBox="0 0 200 200" fill="none" className="w-full h-full text-primary">
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1.5" strokeDasharray="8 6" />
            <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
          </svg>
        </div>

        <div className="container relative mx-auto px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">

            {/* ====== LEFT CONTENT ====== */}
            <div className="space-y-8">

              {/* Pill badge */}
              <div className="hero-fade-up-1">
                <Badge
                  variant="outline"
                  className="inline-flex items-center gap-2 rounded-full border-primary/30 bg-primary/5 px-4 py-2 text-xs font-semibold text-primary tracking-wide"
                >
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  Fresh • Homemade • Trusted
                </Badge>
              </div>

              {/* Heading */}
              <div className="hero-fade-up-2 space-y-4">
                <h1 className="text-5xl font-extrabold leading-[1.1] tracking-tight sm:text-6xl lg:text-7xl">
                  Discover
                  <span className="block relative">
                    <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/60 bg-clip-text text-transparent">
                      Homemade
                    </span>
                    {/* underline squiggle */}
                    <svg
                      className="absolute -bottom-2 left-0 w-full text-primary/30"
                      viewBox="0 0 300 12"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 8 Q37.5 0 75 8 Q112.5 16 150 8 Q187.5 0 225 8 Q262.5 16 300 8"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                  <span className="block">Meals Near You</span>
                </h1>

                <p className="max-w-lg text-lg leading-relaxed text-muted-foreground">
                  Order fresh, home-cooked dishes prepared by <strong className="text-foreground font-semibold">trusted local chefs</strong>. 
                  Healthy, affordable, and delivered straight to your door.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="hero-fade-up-3 flex flex-wrap gap-4">
                <Button size="lg" className="h-13 rounded-2xl px-8 text-base font-semibold shadow-xl shadow-primary/30 hover:shadow-primary/50 transition-shadow" asChild>
                  <Link href="/meals" className="gap-2">
                    Browse Meals
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="h-13 rounded-2xl px-8 text-base font-semibold border border-primary/30 text-muted-foreground hover:text-foreground hover:border-primary/60 hover:bg-primary/5 transition-all" asChild>
                  <Link href="/login">Start Ordering</Link>
                </Button>
              </div>

              {/* Trust strip */}
              <div className="hero-fade-up-4 flex flex-wrap items-center gap-6 pt-2 border-t border-border/30">
                {[
                  { icon: <ShieldCheck className="h-4 w-4" />, text: "Verified Chefs" },
                  { icon: <Clock className="h-4 w-4" />,       text: "Fast Delivery" },
                  { icon: <Star className="h-4 w-4" />,        text: "4.9★ Rated" },
                ].map(({ icon, text }) => (
                  <div key={text} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="text-primary">{icon}</span>
                    {text}
                  </div>
                ))}
              </div>
            </div>

            {/* ====== RIGHT IMAGE ====== */}
            <div className="relative hero-scale-in">

              {/* Outer glow ring */}
              <div className="absolute -inset-6 rounded-[40px] bg-gradient-to-br from-primary/25 via-primary/10 to-transparent blur-2xl opacity-70" />

              {/* Main image card */}
              <div className="relative hero-float">
                <div className="relative overflow-hidden rounded-[36px] border-4 border-white/20 dark:border-white/10 shadow-2xl shadow-primary/20">
                  {/* gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent z-10" />

                  <Image
                    src="/food.png"
                    alt="Homemade food prepared by local providers"
                    width={640}
                    height={640}
                    priority
                    className="w-full h-auto object-cover"
                  />

                  {/* Bottom label inside image */}
                  <div className="absolute bottom-5 left-5 right-5 z-20 flex items-center justify-between">
                    <div className="rounded-2xl bg-background/80 backdrop-blur-md border border-border/50 px-4 py-2">
                      <div className="flex items-center gap-1.5">
                        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/15 text-primary">
                          <UtensilsCrossed className="h-3 w-3" />
                        </div>
                        <p className="text-xs font-semibold text-foreground">Today&apos;s Special</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 pl-6">Freshly Prepared</p>
                    </div>
                    <div className="flex items-center gap-1 rounded-2xl bg-yellow-500/90 backdrop-blur-md px-3 py-2">
                      <Star className="h-3.5 w-3.5 text-white fill-white" />
                      <span className="text-xs font-bold text-white">4.9</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating stat cards */}
              <div className="absolute -left-6 top-10 hero-fade-up-2" style={{ animationDelay: "0.9s" }}>
                <StatBadge
                  icon={<ChefHat className="h-4 w-4" />}
                  value="500+"
                  label="Home Chefs"
                />
              </div>

              <div className="absolute -right-4 bottom-20 hero-fade-up-3" style={{ animationDelay: "1.1s" }}>
                <StatBadge
                  icon={<Star className="h-4 w-4" />}
                  value="10k+"
                  label="Happy Customers"
                />
              </div>

              {/* Decorative corner elements */}
              <div className="absolute -top-3 -right-3 h-12 w-12 rounded-full bg-primary/20 blur-md" />
              <div className="absolute -bottom-3 -left-3 h-8 w-8 rounded-full bg-primary/15 blur-sm" />
            </div>

          </div>
        </div>
      </section>
    </>
  );
}
