"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import Image from "next/image";

const baseurl = process.env.AUTH_URL;

const API_BASE = `${baseurl}/api/orders`;

export type OrderDetails = {
  id: string;
  status: string;
  deliveryAddress: string;
  totalAmount: string;
  createdAt: string;
  updatedAt: string;
  provider: {
    id: string;
    name: string;
    address: string | null;
    phone: string | null;
  };
  customer: {
    id: string;
    name: string;
    email: string;
  };
  items: {
    id: string;
    quantity: number;
    price: string;
    meal: {
      id: string;
      name: string;
      price: string;
      imageUrl: string | null;
    };
  }[];
};

async function fetchOrder(id: string): Promise<OrderDetails> {
  const res = await fetch(`${API_BASE}/${id}`, { credentials: "include" });
  if (!res.ok) throw new Error("FETCH_ORDER_FAILED");
  const json = await res.json();
  return json.data;
}

export default function OrderDetailsPage() {
  const params = useParams();
  const orderId = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId,
  });

  if (isError) toast.error("Failed to load order details");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Order Details</h1>
        <p className="text-sm text-muted-foreground">Order ID: {orderId}</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : data ? (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Order Summary */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Status: <Badge>{data.status}</Badge></div>
              <div>Total Amount: <strong>৳{data.totalAmount}</strong></div>
              <div>Created At: {new Date(data.createdAt).toLocaleString()}</div>
              <div>Last Updated: {new Date(data.updatedAt).toLocaleString()}</div>
              <div>Delivery Address: {data.deliveryAddress}</div>
            </CardContent>
          </Card>

          {/* Customer */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Customer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Name: {data.customer.name}</div>
              <div>Email: {data.customer.email}</div>
            </CardContent>
          </Card>

          {/* Provider */}
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle>Provider</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div>Name: {data.provider.name}</div>
              <div>Phone: {data.provider.phone || "—"}</div>
              <div>Address: {data.provider.address || "—"}</div>
            </CardContent>
          </Card>

          {/* Items */}
          <Card className="rounded-2xl md:col-span-2">
            <CardHeader>
              <CardTitle>Items</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {data.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 border-b pb-3">
                  <div className="flex items-center gap-4">
                    {item.meal.imageUrl && (
                      <Image
                        src={item.meal.imageUrl}
                        alt={item.meal.name}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium">{item.meal.name}</div>
                      <div className="text-xs text-muted-foreground">
                        ৳{item.price} × {item.quantity}
                      </div>
                    </div>
                  </div>
                  <div className="font-medium">
                    ৳{Number(item.price) * item.quantity}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
