"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useUser } from "@/lib/user-context";

/* ---------------- API ---------------- */
const baseurl = process.env.NEXT_PUBLIC_AUTH_URL
;

const API_ORDERS = `${baseurl}/api/orders`;


/* ---------------- Types ---------------- */
type OrderDetails = {
  id: string;
  status: string;
  deliveryAddress: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  provider: {
    name: string;
    address: string | null;
    phone: string | null;
  };
  customer: {
    name: string;
    email: string;
  };
  items: {
    id: string;
    quantity: number;
    price: string;
    meal: {
      name: string;
      imageUrl: string;
    };
  }[];
};

/* ---------------- Fetcher ---------------- */
async function fetchOrder(id: string): Promise<OrderDetails> {
  const res = await fetch(`${API_ORDERS}/${id}`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("FETCH_ORDER_FAILED");
  return (await res.json()).data;
}

/* ---------------- Page ---------------- */
export default function OrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user, isPending } = useUser();

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

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id),
    enabled: !!id && user?.role === "CUSTOMER",
  });


  if (!order) {
    return <div className="p-6">Order not found</div>;
  }

  /* -------- UI -------- */
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <p className="text-sm text-muted-foreground">
          Order #{order.id.slice(0, 8)}
        </p>
      </div>

      {/* Status */}
      <Card>
        <CardContent className="p-6 flex justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge className="mt-1">{order.status}</Badge>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-semibold">৳{order.totalAmount}</p>
          </div>
        </CardContent>
      </Card>

      {/* Customer / Provider */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Customer</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{order.customer.name}</p>
            <p className="text-sm text-muted-foreground">
              {order.customer.email}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="font-medium">{order.provider.name}</p>
            {order.provider.address && (
              <p className="text-sm text-muted-foreground">
                📍 {order.provider.address}
              </p>
            )}
            {order.provider.phone && (
              <p className="text-sm text-muted-foreground">
                📞 {order.provider.phone}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Delivery Address */}
      <Card>
        <CardHeader>
          <CardTitle>Delivery Address</CardTitle>
        </CardHeader>
        <CardContent>{order.deliveryAddress}</CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meal</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Qty</TableHead>
                <TableHead className="text-right">Subtotal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="flex gap-3 items-center">
                    <img
                      src={item.meal.imageUrl}
                      alt={item.meal.name}
                      className="h-10 w-10 rounded object-cover"
                    />
                    {item.meal.name}
                  </TableCell>
                  <TableCell>৳{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right">
                    ৳{Number(item.price) * item.quantity}
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={3} className="font-semibold">
                  Total
                </TableCell>
                <TableCell className="text-right font-semibold">
                  ৳{order.totalAmount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground">
        Created: {new Date(order.createdAt).toLocaleString()} <br />
        Updated: {new Date(order.updatedAt).toLocaleString()}
      </div>
    </div>
  );
}
