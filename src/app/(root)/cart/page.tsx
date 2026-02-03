"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useUser } from "@/lib/user-context";
import { useCart } from "@/lib/cart/cart-context";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const { user, isLoading } = useUser();
  const { items, remove } = useCart();

  /* ---------------- Guard ---------------- */
  useEffect(() => {
    if (isLoading) return;

    // Not logged in
    if (!user) {
      router.replace("/login");
      return;
    }

    // Logged in but not customer
    if (user.role !== "CUSTOMER") {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  /* ---------------- Loading / Block ---------------- */
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
    return <div className="p-6 text-center">Your cart is empty</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Your Cart</h1>

      {items.map((i) => (
        <div
          key={i.mealId}
          className="flex justify-between items-center border-b pb-2"
        >
          <div>
            <div className="font-medium">{i.name}</div>
            <div className="text-sm text-muted-foreground">
              Qty: {i.quantity}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="font-medium">
              ৳{i.price * i.quantity}
            </div>
            <button
              onClick={() => remove(i.mealId)}
              className="text-sm text-red-500 hover:underline"
            >
              Remove
            </button>
          </div>
        </div>
      ))}

      <div className="font-bold text-right">Total: ৳{total}</div>

      <Button asChild className="w-full">
        <Link href="/checkout">Proceed to Checkout</Link>
      </Button>
    </div>
  );
}
