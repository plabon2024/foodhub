"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChefHat, Play, Utensils } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard = ({ icon, title, description }: FeatureCardProps) => {
  return (
    <Card className="group relative border-2 border-border/40 bg-background/80 backdrop-blur-sm transition-all duration-500 hover:border-primary/30 hover:shadow-2xl hover:-translate-y-1">
      <CardContent className="flex flex-col items-center text-center gap-4 ">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border-2 border-primary/30 bg-primary/5 text-primary transition-all duration-500 group-hover:border-primary/60 group-hover:bg-primary/10 ">
          {icon}
        </div>
        <div className="space-y-2">
          <h4 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function AboutUsSection() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  const features: FeatureCardProps[] = [
    {
      icon: <Utensils className="h-7 w-7" />,
      title: "luxurious food",
      description: "Premium quality dishes crafted with precision and passion",
    },
    {
      icon: <ChefHat className="h-7 w-7" />,
      title: "Best Cuisine",
      description: "Award-winning culinary excellence and authentic flavors",
    },
  ];

  return (
    <>
      <style jsx global>{`
        @keyframes heartbeat {
          0% {
            box-shadow: 0 0 0 0 hsl(var(--primary) / 0.7);
            transform: scale(1);
          }
          50% {
            box-shadow: 0 0 0 15px transparent;
            transform: scale(1.05);
          }
          100% {
            box-shadow: 0 0 0 0 transparent;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-heartbeat {
          animation: heartbeat 2s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>

      <section className="relative py-20 lg:py-32 overflow-hidden bg-linear-to-b from-background via-muted/20 to-background">
        {/* Decorative Background Elements */}
        <div className="absolute top-20 right-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000" />

        <div className="container relative mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-20 items-center">
            {/* ================= Media Section ================= */}
            <div className="relative order-2 lg:order-1 flex items-center justify-center">
              <div className="relative group w-full max-w-2xl mx-auto">
                {/* Glow Effect */}
                <div className="absolute -inset-6 bg-linear-to-r from-primary/30 via-primary/20 to-primary/10 rounded-4xl blur-3xl opacity-60 group-hover:opacity-100 transition-all duration-700" />

                {/* Image Container */}
                <div className="relative overflow-hidden rounded-3xl shadow-2xl ring-1 ring-primary/20 group-hover:ring-primary/40 transition-all duration-500">
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent z-10" />

                  <Image
                    src="/food.png"
                    alt="Discover our restaurant's culinary excellence"
                    width={700}
                    height={600}
                    className="h-auto w-full object-cover "
                    priority
                  />

                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setIsVideoOpen(true)}
                    className="absolute inset-0 z-20 flex items-center justify-center  transition-all duration-300"
                    aria-label="Play restaurant video"
                  >
                    <div className="relative">
                      {/* Pulsing Ring */}
                      <div className="absolute inset-0 rounded-full bg-primary/30 animate-ping" />
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-pulse" />

                      {/* Play Button with Heartbeat */}
                      <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary shadow-2xl shadow-primary/50 transition-all duration-300 hover:scale-110 hover:bg-primary/90 animate-heartbeat cursor-pointer">
                        <Play className="ml-1.5 h-10 w-10 text-primary-foreground fill-current drop-shadow-lg" />
                      </div>
                    </div>
                  </button>
                </div>

                {/* Decorative Corner Elements */}
                <div className="absolute -top-4 -right-4 w-24 h-24 border-t-4 border-r-4 border-primary/30 rounded-tr-3xl" />
                <div className="absolute -bottom-4 -left-4 w-24 h-24 border-b-4 border-l-4 border-primary/30 rounded-bl-3xl" />
              </div>
            </div>

            {/* ================= Content Section ================= */}
            <div className="space-y-8 order-1 lg:order-2">
              {/* Section Tag */}
              <div className="inline-flex items-center gap-3 group">
                <div className="h-px w-12 bg-linear-to-r from-primary to-primary/50" />
                <span className="text-xs font-semibold tracking-[0.2em] uppercase text-primary/80 group-hover:text-primary transition-colors">
                  OUR WORDS
                </span>
              </div>

              {/* Heading */}
              <div className="space-y-6">
                <h2 className="text-4xl font-bold leading-[1.1] tracking-tight lg:text-5xl xl:text-6xl">
                  We invite you to{" "}
                  <span className="relative inline-block">
                    <span className="relative z-10 bg-linear-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent">
                      visit our restaurant
                    </span>
                    <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 -z-0 transform -skew-y-1" />
                  </span>
                </h2>

                {/* Decorative Divider */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  <div className="h-px w-20 bg-linear-to-r from-primary/50 to-transparent" />
                </div>

                <p className="max-w-xl text-base text-muted-foreground leading-relaxed lg:text-lg">
                  Experience the perfect blend of traditional culinary artistry and modern innovation. Our chefs carefully select the finest ingredients to create unforgettable dishes that celebrate authentic flavors while embracing contemporary techniques. Every meal is a journey of taste, crafted with passion and served with warmth.
                </p>
              </div>

              {/* Feature Grid */}
              <div className="grid gap-6 sm:grid-cols-2 pt-6">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    style={{ animationDelay: `${index * 150}ms` }}
                    className="animate-in fade-in slide-in-from-bottom-4 duration-700"
                  >
                    <FeatureCard {...feature} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= Video Dialog ================= */}
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="p-0 overflow-hidden border-0 bg-transparent shadow-2xl">
          <div className="relative bg-black/95 rounded-2xl overflow-hidden backdrop-blur-xl">
           

            {/* Video Embed */}
            <div className="relative aspect-video w-full">
              <iframe
                className="absolute inset-0 h-full w-full"
                src="https://www.youtube.com/embed/1MTkZPys7mU?autoplay=1&controls=1&modestbranding=1&rel=0"
                title="About our restaurant - Culinary excellence"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}