"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart/cart-context";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, remove } = useCart();

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  if (items.length === 0) {
    return <div className="p-6">Your cart is empty</div>;
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-xl font-semibold">Your Cart</h1>

      {items.map((i) => (
        <div key={i.mealId} className="flex justify-between border-b pb-2">
          <div>
            <div>{i.name}</div>
            <div className="text-sm text-muted-foreground">
              Qty: {i.quantity}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div>৳{i.price * i.quantity}</div>
            <button onClick={() => remove(i.mealId)}>❌</button>
          </div>
        </div>
      ))}

      <div className="font-bold">Total: ৳{total}</div>

      <Button asChild>
        <Link href="/checkout">Checkout</Link>
      </Button>
    </div>
  );
}
