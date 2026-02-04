"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2, MapPin, Phone, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/lib/cart/cart-context";

/* ---------------- API ---------------- */
const baseurl = process.env.NEXT_PUBLIC_AUTH_URL
;

const API_PROVIDERS = `${baseurl}/api/providers`;

/* ---------------- Types ---------------- */
type ProviderDetails = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  user: {
    image: string | null;
  };
  meals: {
    id: string;
    name: string;
    description: string | null;
    price: string;
    imageUrl: string | null;
    category: {
      id: string;
      name: string;
    };
  }[];
};

/* ---------------- Fetcher ---------------- */
async function fetchProvider(id: string): Promise<ProviderDetails> {
  const res = await fetch(`${API_PROVIDERS}/${id}`);
  if (!res.ok) throw new Error("FETCH_PROVIDER_FAILED");
  return (await res.json()).data;
}

/* ---------------- Page ---------------- */
export default function ProviderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { items, add } = useCart();

  const { data: provider, isLoading, error } = useQuery({
    queryKey: ["provider", id],
    queryFn: () => fetchProvider(id),
    enabled: !!id,
  });

  /* ---------------- Guards ---------------- */
  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (error || !provider) {
    return (
      <div className="py-24 text-center text-muted-foreground">
        Provider not found
      </div>
    );
  }

  /* ---------------- Cart Handler ---------------- */
  function handleAddToCart(meal: ProviderDetails["meals"][0]) {
    // Enforce single-provider cart
    if (items.length > 0 && items[0].providerId !== provider.id) {
      toast.error("You can only order from one provider at a time");
      return;
    }

    add({
      mealId: meal.id,
      name: meal.name,
      price: Number(meal.price),
      quantity: 1,
      providerId: provider.id,
    });

    toast.success(`${meal.name} added to cart`);
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-6">
      {/* ================= Provider Header ================= */}
      <div className="rounded-xl border bg-background p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
          <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
            {provider.user?.image ? (
              <Image
                src={provider.user.image}
                alt={provider.name}
                fill
                className="object-cover"
              />
            ) : (
              <AvatarFallback className="text-xl font-semibold sm:text-2xl">
                {provider.name.charAt(0)}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="flex-1 space-y-2">
            <h1 className="text-2xl font-semibold sm:text-3xl">{provider.name}</h1>

            {provider.description && provider.description.trim() !== "" && (
              <p className="text-sm text-muted-foreground sm:text-base">
                {provider.description}
              </p>
            )}

            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {provider.address && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4" />
                  <span>{provider.address}</span>
                </div>
              )}
              {provider.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4" />
                  <span>{provider.phone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= Meals ================= */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold sm:text-2xl">Menu</h2>
          {provider.meals.length > 0 && (
            <Badge variant="secondary" className="text-sm">
              {provider.meals.length} {provider.meals.length === 1 ? 'item' : 'items'}
            </Badge>
          )}
        </div>

        {provider.meals.length === 0 ? (
          <div className="py-24 text-center text-muted-foreground">
            No meals available
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {provider.meals.map((meal) => (
              <Card
                key={meal.id}
                className="group overflow-hidden rounded-xl border transition hover:shadow-xl p-0"
              >
                {/* ================= Image ================= */}
                <div className="relative h-56 overflow-hidden bg-muted">
                  {meal.imageUrl ? (
                    <>
                      {/* Image */}
                      <Image
                        src={meal.imageUrl}
                        alt={meal.name}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-transparent" />

                      {/* Price badge */}
                      <span className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2.5 py-1 text-sm font-semibold shadow backdrop-blur-sm">
                        ৳{meal.price}
                      </span>
                    </>
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                      No image
                    </div>
                  )}

                  {/* Category badge */}
                  <span className="absolute left-2 top-2 rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow backdrop-blur-sm">
                    {meal.category.name}
                  </span>
                </div>

                {/* ================= Content ================= */}
                <div className="space-y-3 p-4">
                  <div className="space-y-1">
                    <h3 className="line-clamp-1 text-base font-semibold">
                      {meal.name}
                    </h3>

                    {meal.description && (
                      <p className="line-clamp-2 text-sm text-muted-foreground">
                        {meal.description}
                      </p>
                    )}
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    size="sm"
                    onClick={() => handleAddToCart(meal)}
                    className="w-full gap-2"
                  >
                    <ShoppingCart className="h-4 w-4" />
                    Add to Cart
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}