"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/lib/cart/cart-context";

/* ---------------- API ---------------- */
const API_PROVIDERS = "http://localhost:5000/api/providers";

/* ---------------- Types ---------------- */
type ProviderDetails = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  meals: {
    id: string;
    name: string;
    description: string;
    price: string;
    imageUrl: string;
    category: {
      id: string;
      name: string;
    };
  }[];
};

/* ---------------- API function ---------------- */
async function fetchProvider(id: string): Promise<ProviderDetails> {
  const res = await fetch(`${API_PROVIDERS}/${id}`);
  if (!res.ok) throw new Error("FETCH_PROVIDER_FAILED");
  return (await res.json()).data;
}

/* ---------------- Page ---------------- */
export default function ProviderDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();

  const { data: provider, isLoading } = useQuery({
    queryKey: ["provider", id],
    queryFn: () => fetchProvider(id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!provider) {
    return <div className="p-6">Provider not found</div>;
  }

  return (
    <div className="p-6 space-y-8 mx-auto  container">
      {/* Provider Info */}
      <Card>
        <CardContent className="p-6 space-y-2">
          <h1 className="text-2xl font-semibold">{provider.name}</h1>

          {provider.description && (
            <p className="text-muted-foreground">{provider.description}</p>
          )}

          <div className="text-sm text-muted-foreground space-y-1">
            {provider.address && <div>📍 {provider.address}</div>}
            {provider.phone && <div>📞 {provider.phone}</div>}
          </div>
        </CardContent>
      </Card>

      {/* Meals */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Menu</h2>

        {provider.meals.length === 0 ? (
          <p className="text-muted-foreground">No meals available</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {provider.meals.map((meal) => (
              <Card key={meal.id} className="h-full">
                <CardContent className="p-4 space-y-3">
                  <img
                    src={meal.imageUrl}
                    alt={meal.name}
                    className="h-40 w-full object-cover rounded-md"
                  />

                  <div className="space-y-1">
                    <h3 className="font-semibold">{meal.name}</h3>
                    <Badge variant="secondary">{meal.category.name}</Badge>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {meal.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="font-semibold">৳{meal.price}</span>

                    <Button
                      size="sm"
                      onClick={() => {
                        addItem({
                          mealId: meal.id,
                          name: meal.name,
                          price: Number(meal.price),
                          providerId: provider.id,
                          quantity: 1,
                        });
                        toast.success("Added to cart");
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
