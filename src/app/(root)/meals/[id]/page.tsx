"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart/cart-context";

/* ---------------- Fetcher ---------------- */
async function fetchMeal(id) {
  const res = await fetch(`http://localhost:5000/api/meals/${id}`);
  if (!res.ok) throw new Error("FETCH_MEAL_FAILED");
  const json = await res.json();
  return json.data;
}

export default function MealDetailsPage() {
  const params = useParams();
  const id = params.id;

  const { add } = useCart();

  const { data, isLoading, isError,error } = useQuery({
    queryKey: ["meal", id],
    queryFn: () => fetchMeal(id),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="p-6 text-center text-destructive">Something Went Wrong</div>
    );
  }
  console.log(data);
  function handleAddToCart() {
    if (!data.isAvailable) {
      toast.error("This meal is currently unavailable");
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
    <div className="max-w-5xl my-20 mx-auto p-6 grid md:grid-cols-2 gap-10">
      {/* Image */}
      <Image
        src={data.imageUrl}
        alt={data.name}
        width={600}
        height={400}
        className="rounded-xl object-cover"
      />

      {/* Info */}
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold">{data.name}</h1>

        <div className="text-sm text-muted-foreground">
          by {data.provider.name}
        </div>

        <Badge variant="secondary">{data.category.name}</Badge>

        <p className="text-muted-foreground">{data.description}</p>

        <div className="text-2xl font-bold">৳{data.price}</div>

        <Button
          onClick={handleAddToCart}
          disabled={!data.isAvailable}
          className="w-full"
        >
          {data.isAvailable ? "Add to Cart" : "Unavailable"}
        </Button>
      </div>
    </div>
  );
}
