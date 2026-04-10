"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { Badge } from "@/components/ui/badge";
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
type Order = {
  id: string;
  status: string;
  totalAmount: string;
  createdAt: string;
  provider?: {
    id: string;
    name: string;
  };
  items: {
    quantity: number;
  }[];
};

/* ---------------- Fetcher ---------------- */
async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(API_ORDERS, { credentials: "include" });
  if (!res.ok) throw new Error("FETCH_ORDERS_FAILED");
  const json = await res.json();
  return json.data;
}

/* ---------------- Page ---------------- */
export default function OrdersPage() {
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

  const {
    data: orders,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchOrders,
    enabled: user?.role === "CUSTOMER",
  });





  if (isError) {
    return (
      <div className="p-6 text-center text-destructive">
        Failed to load orders
      </div>
    );
  }

  /* -------- UI -------- */
  return (
    <div className="p-6 space-y-6 mx-auto max-w-8xl container">
      <div>
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          View your order history
        </p>
      </div>

      {!orders?.length ? (
        <div className="text-center text-muted-foreground py-20">
          You haven’t placed any orders yet.
        </div>
      ) : (
       <Table>
  <TableHeader>
    <TableRow>
      <TableHead className="p-6">Order</TableHead>
      <TableHead className="p-6">Status</TableHead>
      <TableHead className="p-6">Provider</TableHead>
      <TableHead className="p-6">Total</TableHead>
      <TableHead className="p-6">Items</TableHead>
      <TableHead className="p-6">Created</TableHead>
      <TableHead className="p-6 text-right">View</TableHead>
    </TableRow>
  </TableHeader>

  <TableBody>
    {orders.map((order) => (
      <TableRow key={order.id}>
        <TableCell className="p-6 font-mono text-xs">
          {order.id.slice(0, 8)}…
        </TableCell>

        <TableCell className="p-6">
          <Badge>{order.status}</Badge>
        </TableCell>

        <TableCell className="p-6">
          {order.provider?.name ?? "Unknown Provider"}
        </TableCell>

        <TableCell className="p-6">
          ৳{order.totalAmount}
        </TableCell>

        <TableCell className="p-6">
          {order.items?.length ?? 0}
        </TableCell>

        <TableCell className="p-6">
          {new Date(order.createdAt).toLocaleString()}
        </TableCell>

        <TableCell className="p-6 text-right">
          <Link
            href={`/orders/${order.id}`}
            className="text-primary hover:underline text-sm"
          >
            View
          </Link>
        </TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>

      )}
    </div>
  );
}
