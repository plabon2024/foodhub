"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ---------------- API ---------------- */
const API_CATEGORIES = "http://localhost:5000/api/categories";
const API_FEATURED = "http://localhost:5000/api/meals?featured=true&available=true";

/* ---------------- Types ---------------- */
type Category = {
  id: string;
  name: string;
  description?: string;
};

type Meal = {
  id: string;
  name: string;
  price: string;
  imageUrl: string;
  category: {
    id: string;
    name: string;
  };
  provider: {
    id: string;
    name: string;
  };
};

/* ---------------- Fetchers ---------------- */
async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(API_CATEGORIES);
  if (!res.ok) throw new Error("FETCH_CATEGORIES_FAILED");
  return (await res.json()).data;
}

async function fetchFeaturedMeals(): Promise<Meal[]> {
  const res = await fetch(API_FEATURED);
  if (!res.ok) throw new Error("FETCH_FEATURED_FAILED");
  return (await res.json()).data.items;
}

/* ---------------- Page ---------------- */
export default function HomePage() {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: meals } = useQuery({
    queryKey: ["featured-meals"],
    queryFn: fetchFeaturedMeals,
  });

  return (
    <div className="space-y-16">
      {/* ---------- HERO ---------- */}
      <section className="bg-muted">
        <div className="max-w-6xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold leading-tight">
              Fresh meals from trusted home chefs
            </h1>
            <p className="text-muted-foreground">
              Browse local providers, choose your meals, and get food delivered
              to your doorstep.
            </p>
            <div className="flex gap-4">
              <Button asChild>
                <Link href="/meals">Browse Meals</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/orders">My Orders</Link>
              </Button>
            </div>
          </div>

          <Image
            src="https://cdn.mealbd.com/hero/hero-food.jpg"
            alt="Food delivery"
            width={500}
            height={350}
            className="rounded-xl"
          />
        </div>
      </section>

      {/* ---------- CATEGORIES ---------- */}
      <section className="max-w-6xl mx-auto px-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">Categories</h2>
          <Link href="/meals" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories?.map((c) => (
            <Link
              key={c.id}
              href={`/meals?categoryId=${c.id}`}
              className="border rounded-xl p-4 hover:bg-muted transition"
            >
              <h3 className="font-medium">{c.name}</h3>
              {c.description && (
                <p className="text-xs text-muted-foreground mt-1">
                  {c.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ---------- FEATURED MEALS ---------- */}
      <section className="max-w-6xl mx-auto px-6 space-y-6">
        <h2 className="text-2xl font-semibold">Featured Meals</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {meals?.map((meal) => (
            <Link key={meal.id} href={`/meals/${meal.id}`}>
              <Card className="hover:shadow-lg transition">
                <CardContent className="p-4 space-y-3">
                  <Image
                    src={meal.imageUrl}
                    alt={meal.name}
                    width={400}
                    height={250}
                    className="rounded-md"
                  />

                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{meal.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        by {meal.provider.name}
                      </p>
                    </div>
                    <Badge>{meal.category.name}</Badge>
                  </div>

                  <div className="font-bold">৳{meal.price}</div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
