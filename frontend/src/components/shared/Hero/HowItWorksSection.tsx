"use client";

import { ShoppingBag, Search, Truck, Star } from "lucide-react";

const steps = [
  {
    step: "01",
    icon: <Search className="h-8 w-8" />,
    title: "Browse Meals",
    description:
      "Explore hundreds of homemade dishes from local providers in your area. Filter by category, price, and rating.",
  },
  {
    step: "02",
    icon: <ShoppingBag className="h-8 w-8" />,
    title: "Place Order",
    description:
      "Add your favourite meals to cart, enter your delivery address, and confirm your order in seconds.",
  },
  {
    step: "03",
    icon: <Truck className="h-8 w-8" />,
    title: "Get Delivered",
    description:
      "Your order is prepared fresh and delivered right to your doorstep by the provider — hot and delicious.",
  },
  {
    step: "04",
    icon: <Star className="h-8 w-8" />,
    title: "Enjoy & Rate",
    description:
      "Savour every bite and share your experience. Your feedback helps the community grow.",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden bg-muted/20">
      {/* Decorative blobs */}
      <div className="absolute top-10 left-1/3 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1.2s" }} />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-primary/80 border border-primary/20 rounded-full px-4 py-1.5">
            Simple Steps
          </span>
          <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">
            How{" "}
            <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              FoodHub Works
            </span>
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
            Getting a home-cooked meal delivered is as easy as four simple steps.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <div key={i} className="group relative flex flex-col items-center text-center space-y-5 p-8 rounded-3xl border-2 border-border/40 bg-background/80 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2">
              {/* Step number */}
              <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                {s.step}
              </span>

              {/* Icon */}
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-2 border-primary/20 bg-primary/5 text-primary transition-all duration-500 group-hover:border-primary/60 group-hover:bg-primary group-hover:text-primary-foreground">
                {s.icon}
              </div>

              {/* Text */}
              <div className="space-y-2">
                <h3 className="text-xl font-bold transition-colors group-hover:text-primary">{s.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
              </div>

              {/* Connector line — desktop only */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-0.5 bg-gradient-to-r from-primary/40 to-transparent z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
