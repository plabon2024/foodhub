"use client";
export const dynamic = "force-dynamic";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

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

/* ---------------- API ---------------- */
const baseurl = process.env.NEXT_PUBLIC_AUTH_URL
;

const API_STATS = `${baseurl}/api/stats`;
const API_ORDERS = `${baseurl}/api/orders`;


/* ---------------- Types ---------------- */
type StatsResponse = {
  role: "PROVIDER";
  meals: {
    total: number;
    available: number;
  };
  orders: {
    total: number;
    byStatus: Record<string, number>;
    revenue: string;
  };
};

type Order = {
  id: string;
  status: string;
  deliveryAddress: string;
  totalAmount: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
  };
  items: {
    quantity: number;
    meal: {
      name: string;
    };
  }[];
};

/* ---------------- API functions ---------------- */
async function fetchStats(): Promise<StatsResponse> {
  const res = await fetch(API_STATS, { credentials: "include" });
  if (!res.ok) throw new Error("FETCH_STATS_FAILED");
  return (await res.json()).data;
}

async function fetchOrders(): Promise<Order[]> {
  const res = await fetch(API_ORDERS, { credentials: "include" });
  if (!res.ok) throw new Error("FETCH_ORDERS_FAILED");
  return (await res.json()).data;
}

/* ---------------- Page ---------------- */
export default function ProviderDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["provider-stats"],
    queryFn: fetchStats,
  });

  const { data: orders, isLoading: ordersLoading } = useQuery({
    queryKey: ["provider-orders"],
    queryFn: fetchOrders,
  });

  if (statsLoading || ordersLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Provider Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Orders overview & performance
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Total Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.meals.total}</div>
            <p className="text-sm text-muted-foreground">
              Available: {stats?.meals.available}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.orders.total}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {Object.entries(stats?.orders.byStatus ?? {}).map(
                ([status, count]) => (
                  <Badge key={status} variant="secondary">
                    {status}: {count}
                  </Badge>
                )
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ৳{stats?.orders.revenue}
            </div>
            <p className="text-sm text-muted-foreground">
              Delivered orders only
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {!orders?.length ? (
            <p className="text-sm text-muted-foreground">
              No orders yet
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Created</TableHead>
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
                      <div className="font-medium">
                        {order.customer.name}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {order.customer.email}
                      </div>
                    </TableCell>
                    <TableCell>{order.items.length}</TableCell>
                    <TableCell>৳{order.totalAmount}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
