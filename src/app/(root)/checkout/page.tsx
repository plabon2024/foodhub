"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useCart } from "@/lib/cart/cart-context";
import { useUser } from "@/lib/user-context";

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2 } from "lucide-react";

/* ---------------- API ---------------- */
async function createOrder(payload: any) {
  const baseurl = process.env.AUTH_URL;

  const res = await fetch(`${baseurl}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("ORDER_FAILED");
  return res.json();
}

/* ---------------- Page ---------------- */
export default function CheckoutPage() {
  const { user, isPending } = useUser();
  const router = useRouter();
  useEffect(() => {
    if (isPending) return;

    if (!user || user.role !== "CUSTOMER") {
      router.push("/");
    }
  }, [user, isPending, router]);

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || user.role !== "CUSTOMER") {
    return null;
  }

  const { items, clear } = useCart();
  const [address, setAddress] = useState("");

  const providerId = items[0]?.providerId;

  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const mutation = useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      toast.success("Order placed (Cash on Delivery)");
      clear();
      router.push("/orders");
    },
    onError: () => toast.error("Failed to place order"),
  });

  /* -------- Loading -------- */
  if (userLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  /* -------- Block -------- */
  if (!user || user.role !== "CUSTOMER") {
    return null;
  }

  if (!items.length) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        Your cart is empty
      </div>
    );
  }

  /* -------- UI -------- */
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-semibold">Checkout</h1>

      {/* Products */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Item</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead className="text-right">Subtotal</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {items.map((item) => (
              <TableRow key={item.mealId}>
                <TableCell>{item.name}</TableCell>
                <TableCell>৳{item.price}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell className="text-right">
                  ৳{item.price * item.quantity}
                </TableCell>
              </TableRow>
            ))}

            <TableRow>
              <TableCell colSpan={3} className="font-semibold">
                Total
              </TableCell>
              <TableCell className="text-right font-semibold">
                ৳{totalAmount}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>

      {/* Address */}
      <Textarea
        placeholder="Delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />

      {/* Payment */}
      <div className="text-sm text-muted-foreground">
        Payment Method: <b>Cash on Delivery</b>
      </div>

      {/* Place Order */}
      <Button
        className="w-full"
        disabled={!address || mutation.isPending}
        onClick={() =>
          mutation.mutate({
            providerId,
            deliveryAddress: address,
            items: items.map((i) => ({
              mealId: i.mealId,
              quantity: i.quantity,
            })),
          })
        }
      >
        {mutation.isPending ? "Placing Order..." : "Place Order"}
      </Button>
    </div>
  );
}
