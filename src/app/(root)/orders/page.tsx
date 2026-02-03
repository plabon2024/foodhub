"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

/* ---------------- API ---------------- */
const API_ORDERS = "http://localhost:5000/api/orders";

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
  const { data: orders, isLoading, isError } = useQuery({
    queryKey: ["my-orders"],
    queryFn: fetchOrders,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center text-destructive">
        Failed to load orders
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 mx-auto max-w-5xl container">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">My Orders</h1>
        <p className="text-sm text-muted-foreground">
          View your order history
        </p>
      </div>

      {/* Empty State */}
      {!orders?.length ? (
        <div className="text-center text-muted-foreground py-20">
          You haven’t placed any orders yet.
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Provider</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Items</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">
                  {order.id.slice(0, 8)}…
                </TableCell>

                <TableCell>
                  <Badge>{order.status}</Badge>
                </TableCell>

                <TableCell>
                  {order.provider?.name ?? "Unknown Provider"}
                </TableCell>

                <TableCell>৳{order.totalAmount}</TableCell>

                <TableCell>{order.items?.length ?? 0}</TableCell>

                <TableCell>
                  {new Date(order.createdAt).toLocaleString()}
                </TableCell>

                <TableCell className="text-right">
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
