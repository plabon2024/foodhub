"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type Meal = {
  id: string;
  name: string;
  description: string | null;
  price: string;
  isAvailable: boolean;
  isFeatured: boolean;
  category: { name: string };
};
const baseUrl = process.env.NEXT_PUBLIC_AUTH_URL;

if (!baseUrl) {
  throw new Error("NEXT_PUBLIC_AUTH_URL is not defined");
}

const API = `${baseUrl}/api/meals`;

async function fetchMeals(): Promise<Meal[]> {
  const res = await fetch(API);

  if (!res.ok) {
    throw new Error(`Failed to fetch meals: ${res.status}`);
  }

  const json = await res.json();
  return json.data.items as Meal[];
}

export default function CheckoutOurMenuSection() {
  const { data: meals, isLoading } = useQuery({
    queryKey: ["meals-home"],
    queryFn: fetchMeals,
  });

  if (isLoading) return null;

  const availableMeals = meals
    ?.filter((m) => m.isAvailable)
    .slice(0, 8);

  const left = availableMeals?.slice(0, 4);
  const right = availableMeals?.slice(4, 8);

  function MenuColumn({ items }: { items?: Meal[] }) {
    return (
      <div className="space-y-6">
        {items?.map((meal) => (
          <div key={meal.id} className="space-y-2">
            <div className="flex items-start justify-between gap-4">
              <h4 className="text-base font-medium leading-snug">
                {meal.name}
              </h4>
              <span className="shrink-0 font-medium">
                ৳{meal.price}
              </span>
            </div>

            {meal.description && (
              <p className="text-sm text-muted-foreground">
                {meal.description}
              </p>
            )}

            <Separator />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center space-y-3">
          <span className="text-xs uppercase tracking-widest text-muted-foreground">
            Our Menu List
          </span>
          <h2 className="text-4xl font-semibold tracking-tight">
            Checkout Our Menu
          </h2>
        </div>

        {/* Menu Grid */}
        <div className="grid gap-12 md:grid-cols-2">
          <MenuColumn items={left} />
          <MenuColumn items={right} />
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <Button asChild size="lg">
            <Link href="/meals">Discover More Menu</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
