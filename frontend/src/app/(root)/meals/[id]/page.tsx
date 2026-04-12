"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Loader2, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useCart } from "@/lib/cart/cart-context";
import { useUser } from "@/lib/user-context";

/* ---------------- Fetcher ---------------- */
async function fetchMeal(id: string) {
  const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const res = await fetch(`${baseurl}/meals/${id}`);

  if (!res.ok) throw new Error("FETCH_MEAL_FAILED");
  const json = await res.json();
  return json.data;
}

export default function MealDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  const { add } = useCart();
  const { user } = useUser();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["meal", id],
    queryFn: () => fetchMeal(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="container mx-auto max-w-5xl p-6">
        <Card className="p-12 text-center">
          <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
          <h2 className="mb-2 text-xl font-semibold">Something Went Wrong</h2>
          <p className="mb-6 text-muted-foreground">
            We couldn't load this meal. It may not exist or there was an error.
          </p>
          <Button onClick={() => router.push("/meals")} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Meals
          </Button>
        </Card>
      </div>
    );
  }

  function handleAddToCart() {
    if (!data.isAvailable) {
      toast.error("This meal is currently unavailable");
      return;
    }

    if (user && user.role !== "CUSTOMER") {
      toast.error("Only customers can add items to cart");
      return;
    }

    add({
      mealId: data.id,
      name: data.name,
      price: Number(data.price),
      quantity: 1,
      providerId: data.provider.id,
    });

    toast.success("Added to cart");
  }

  return (
    <div className="container mx-auto max-w-6xl p-6">
      {/* Back Button */}
      <Button
        variant="ghost"
        onClick={() => router.push("/meals")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Meals
      </Button>

      {/* Main Content */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Image Section */}
        <div className="space-y-4">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-muted">
            {data.imageUrl ? (
              <>
                <Image
                  src={data.imageUrl}
                  alt={data.name}
                  fill
                  className="object-cover"
                  priority
                />
                {!data.isAvailable && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60">
                    <Badge
                      variant="destructive"
                      className="text-base px-4 py-2"
                    >
                      Currently Unavailable
                    </Badge>
                  </div>
                )}
              </>
            ) : (
              <div className="flex h-full items-center justify-center text-muted-foreground">
                No image available
              </div>
            )}
          </div>
        </div>

        {/* Details Section */}
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold tracking-tight">{data.name}</h1>
              {data.isFeatured && (
                <Badge variant="default" className="shrink-0">
                  Featured
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>by</span>
              <span className="font-medium text-foreground">
                {data.provider.name}
              </span>
            </div>

            <Badge variant="secondary" className="w-fit">
              {data.category.name}
            </Badge>
          </div>

          {/* Description */}
          {data.description && (
            <div className="space-y-2">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Description
              </h2>
              <p className="text-base leading-relaxed">{data.description}</p>
            </div>
          )}

          {/* Price & Action */}
          <div className="mt-auto space-y-4 pt-6">
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold">৳{data.price}</span>
              <span className="text-muted-foreground">per serving</span>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={!data.isAvailable || (!!user && user.role !== "CUSTOMER")}
              size="lg"
              className="w-full"
            >
              {!data.isAvailable ? (
                "Currently Unavailable"
              ) : user && user.role !== "CUSTOMER" ? (
                "Only Customers Can Order"
              ) : (
                <>
                  <ShoppingCart className="mr-2 h-5 w-5" />
                  Add to Cart
                </>
              )}
            </Button>

            {!data.isAvailable && (
              <p className="text-center text-sm text-muted-foreground">
                This meal is temporarily out of stock. Please check back later.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Additional Info Section (Optional) */}
      {data.provider.description && (
        <Card className="mt-12 p-6">
          <h2 className="mb-3 text-lg font-semibold">
            About {data.provider.name}
          </h2>
          <p className="text-muted-foreground">{data.provider.description}</p>
        </Card>
      )}
    </div>
  );
}
