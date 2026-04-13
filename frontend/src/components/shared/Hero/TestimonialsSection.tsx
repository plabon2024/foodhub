"use client";

import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const testimonials = [
  {
    name: "Arif Rahman",
    role: "Regular Customer",
    rating: 5,
    text: "FoodHub completely changed how I eat. The home-cooked biriyani I order every Friday feels like mom made it. Absolutely love the quality!",
    avatar: "AR",
    color: "from-orange-500 to-red-500",
  },
  {
    name: "Nusrat Jahan",
    role: "Working Professional",
    rating: 5,
    text: "As someone who works late hours, having access to fresh, healthy home-cooked food delivered is a game changer. 10/10 recommend!",
    avatar: "NJ",
    color: "from-purple-500 to-pink-500",
  },
  {
    name: "Sohel Rana",
    role: "Food Enthusiast",
    rating: 5,
    text: "The variety of cuisines available is incredible. Every meal I've tried has been authentic and delicious. My go-to food delivery app!",
    avatar: "SR",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Mitu Begum",
    role: "Busy Parent",
    rating: 5,
    text: "Love that I know exactly who's cooking my family's food. The providers' profiles give me confidence in what we're eating.",
    avatar: "MB",
    color: "from-green-500 to-teal-500",
  },
  {
    name: "Karim Hossain",
    role: "University Student",
    rating: 4,
    text: "Affordable, filling, and delicious! The student-friendly prices here beat any restaurant near campus. Ordering daily now.",
    avatar: "KH",
    color: "from-yellow-500 to-orange-500",
  },
  {
    name: "Shireen Akter",
    role: "Home Chef Turned Customer",
    rating: 5,
    text: "I became a provider first, and then I started ordering from other providers too! The community here is amazing and the food is top-notch.",
    avatar: "SA",
    color: "from-rose-500 to-pink-500",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* BG */}
      <div className="absolute top-10 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        {/* Header */}
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="inline-block text-xs font-semibold tracking-[0.25em] uppercase text-primary/80 border border-primary/20 rounded-full px-4 py-1.5">
            Testimonials
          </span>
          <h2 className="text-4xl font-bold tracking-tight lg:text-5xl">
            What Our{" "}
            <span className="bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
              Customers Say
            </span>
          </h2>
          <p className="text-muted-foreground text-base lg:text-lg leading-relaxed">
            Real stories from real people who love eating with FoodHub.
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <Card
              key={i}
              className="group relative border-2 border-border/40 bg-background/80 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1 overflow-hidden"
            >
              {/* Quote icon */}
              <div className="absolute top-4 right-4 text-primary/10 group-hover:text-primary/20 transition-colors duration-300">
                <Quote className="h-12 w-12" />
              </div>

              <CardContent className="flex flex-col gap-4 p-6">
                {/* Stars */}
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, si) => (
                    <Star
                      key={si}
                      className={`h-4 w-4 ${si < t.rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground"}`}
                    />
                  ))}
                </div>

                {/* Text */}
                <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">&ldquo;{t.text}&rdquo;</p>

                {/* Author */}
                <div className="flex items-center gap-3 pt-2 border-t border-border/40">
                  <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${t.color} text-white text-sm font-bold shadow-md`}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
