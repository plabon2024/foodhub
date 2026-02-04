"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";

import { useUser } from "@/lib/user-context";
import { useCart } from "@/lib/cart/cart-context";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function CartPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { items, remove, clear, increase, decrease } = useCart();

  /* ---------------- Guard ---------------- */
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "CUSTOMER") {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  /* ---------------- Loading ---------------- */
  if (isLoading || !user || user.role !== "CUSTOMER") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  /* ---------------- Cart Logic ---------------- */
  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-4xl p-6 text-center text-muted-foreground">
        Your cart is empty
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your Cart</h1>

        <Button
          variant="destructive"
          size="sm"
          onClick={clear}
          className="gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Clear Cart
        </Button>
      </div>

      {/* Cart Items */}
      <div className="space-y-4">
        {items.map((i) => (
          <Card key={i.mealId}>
            <CardContent className="flex gap-4 p-4">
              {/* Image */}
              <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                {i.imageUrl ? (
                  <Image
                    src={i.imageUrl}
                    alt={i.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                    No Image
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex flex-1 items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{i.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ৳{i.price} each
                  </p>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => decrease(i.mealId)}
                    disabled={i.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>

                  <span className="w-6 text-center font-medium">
                    {i.quantity}
                  </span>

                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => increase(i.mealId)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {/* Price & Remove */}
                <div className="flex flex-col items-end gap-2">
                  <p className="font-semibold">
                    ৳{i.price * i.quantity}
                  </p>

                  <button
                    onClick={() => remove(i.mealId)}
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between border-t pt-4">
        <span className="text-lg font-semibold">Total</span>
        <span className="text-lg font-bold">৳{total}</span>
      </div>

      <Button asChild size="lg" className="w-full">
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>
    </div>
  );
}
