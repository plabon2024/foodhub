"use client";

import { Shield, Clock, Leaf, Wallet, HeartHandshake, Zap } from "lucide-react";

const reasons = [
  {
    icon: <Shield className="h-7 w-7" />,
    title: "Verified Providers",
    description: "Every home chef goes through a thorough verification process so you always know who's cooking your food.",
  },
  {
    icon: <Clock className="h-7 w-7" />,
    title: "Fresh & Fast",
    description: "Meals are prepared fresh upon order, ensuring you get hot, delicious food delivered quickly to your door.",
  },
  {
    icon: <Leaf className="h-7 w-7" />,
    title: "Healthy Options",
    description: "Browse a wide variety of nutritious, home-cooked options — no hidden additives or preservatives.",
  },
  {
    icon: <Wallet className="h-7 w-7" />,
    title: "Affordable Prices",
    description: "Home cooking means lower prices without sacrificing quality. Eat well without breaking the bank.",
  },
  {
    icon: <HeartHandshake className="h-7 w-7" />,
    title: "Support Locals",
    description: "Every order supports a local home chef in your community — great food with a feel-good factor.",
  },
  {
    icon: <Zap className="h-7 w-7" />,
    title: "Easy Ordering",
    description: "Our intuitive platform makes it effortless to discover, order, and track your meals in real time.",
  },
];

export default function WhyChooseUsSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-muted/20">
      {/* Decorative */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "0.8s" }} />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-primary/80 border border-primary/20 rounded-full px-4 py-1.5">
            Our Promise
          </span>
          <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">
            Why Choose{" "}
            <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              FoodHub
            </span>
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
            We&apos;re not just an app — we&apos;re a community built around the love of home-cooked food.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {reasons.map((r, i) => (
            <div
              key={i}
              className="group relative flex flex-col gap-5 rounded-3xl border-2 border-border/40 bg-background/80 backdrop-blur-sm p-8 transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1"
            >
              {/* Glow on hover */}
              <div className="absolute -inset-px rounded-3xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              {/* Icon */}
              <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary transition-all duration-500 group-hover:border-primary/60 group-hover:bg-primary group-hover:text-primary-foreground">
                {r.icon}
              </div>

              {/* Content */}
              <div className="relative space-y-2">
                <h3 className="text-xl font-bold transition-colors group-hover:text-primary">{r.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{r.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
