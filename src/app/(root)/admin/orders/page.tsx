"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const baseurl = process.env.AUTH_URL;

const API_URL = `${baseurl}/api/orders`;


export type Order = {
  id: string;
  status: "PLACED" | "DELIVERED" | string;
  totalAmount: string;
  deliveryAddress: string;
  createdAt: string;
  customer: {
    id: string;
    name: string;
    email: string;
  };
  provider: {
    id: string;
    name: string;
  };
  items: {
    quantity: number;
    price: string;
    meal: {
      id: string;
      name: string;
    };
  }[];
};

async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(API_URL, { credentials: "include" });
  if (!res.ok) throw new Error("FETCH_ORDERS_FAILED");
  const json = await res.json();
  return json.data;
}

export default function AdminOrdersPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: fetchOrders,
  });

  if (isError) toast.error("Failed to load orders");

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin · Orders</h1>
        <p className="text-sm text-muted-foreground">
          View all platform orders
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <Card className="rounded-2xl">
          <CardContent className="p-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Provider</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">View</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {data?.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}…</TableCell>
                    <TableCell>
                      <Badge variant={order.status === "DELIVERED" ? "default" : "secondary"}>
                        {order.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">{order.customer.name}</div>
                      <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                    </TableCell>
                    <TableCell>{order.provider.name}</TableCell>
                    <TableCell>৳{order.totalAmount}</TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
