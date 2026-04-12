"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/user-context";

/* ---------------- API ---------------- */
const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;

const API_ORDERS = `${baseurl}/orders`;
const API_UPDATE = `${baseurl}/provider/orders`;

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

async function updateOrderStatus({ id, status }: { id: string; status: string }) {
  const res = await fetch(`${API_UPDATE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("UPDATE_FAILED");
  return res.json();
}

const STATUS_FLOW = ["PLACED", "PREPARING", "READY", "DELIVERED", "CANCELLED"];

/* ---------------- Page ---------------- */
export default function ProviderOrderDetailsPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { user, isPending } = useUser();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isPending) return;

    if (!user || user.role !== "PROVIDER") {
      router.push("/");
    }
  }, [user, isPending, router]);

  const { data: order, isLoading } = useQuery({
    queryKey: ["order", id],
    queryFn: () => fetchOrder(id),
    enabled: !!id && user?.role === "PROVIDER",
  });

  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["order", id] });
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
    },
    onError: () => toast.error("Failed to update order status"),
  });

  if (isPending || isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user || user.role !== "PROVIDER") {
    return null;
  }

  if (!order) {
    return (
      <div className="p-6 text-center">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/provider/orders">
          <Button variant="link" className="mt-2">
            Back to Orders
          </Button>
        </Link>
      </div>
    );
  }

  /* -------- UI -------- */
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/provider/orders">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Order Details</h1>
          <p className="text-sm text-muted-foreground">
            Order #{order.id.slice(0, 8)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Status Card */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Order Management</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Current Status</p>
              <Badge variant="outline" className="text-base px-3 py-1">
                {order.status}
              </Badge>
            </div>
            <div className="flex flex-col gap-1">
              <p className="text-sm text-muted-foreground">Update Status</p>
              <Select
                defaultValue={order.status}
                onValueChange={(status) => mutation.mutate({ id: order.id, status })}
                disabled={mutation.isPending}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_FLOW.map((s) => (
                    <SelectItem key={s} value={s}>
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Total Card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Financials</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Total Revenue</p>
            <p className="text-3xl font-bold text-primary">৳{order.totalAmount}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Customer Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1">
            <p className="font-medium text-lg">{order.customer.name}</p>
            <p className="text-sm text-muted-foreground">{order.customer.email}</p>
          </CardContent>
        </Card>

        {/* Delivery Address */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Delivery Address</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm leading-relaxed">{order.deliveryAddress}</p>
          </CardContent>
        </Card>
      </div>

      {/* Items Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Order Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Meal</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Quantity</TableHead>
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
                      className="h-12 w-12 rounded-md object-cover border"
                    />
                    <span className="font-medium">{item.meal.name}</span>
                  </TableCell>
                  <TableCell>৳{item.price}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell className="text-right font-medium">
                    ৳{Number(item.price) * item.quantity}
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-muted/50 font-bold">
                <TableCell colSpan={3} className="text-right text-lg">
                  Total
                </TableCell>
                <TableCell className="text-right text-lg text-primary">
                  ৳{order.totalAmount}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center text-xs text-muted-foreground pt-4 border-t">
        <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
        <p>Last Update: {new Date(order.updatedAt).toLocaleString()}</p>
      </div>
    </div>
  );
}
