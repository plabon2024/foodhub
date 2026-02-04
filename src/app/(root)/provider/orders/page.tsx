"use client";

import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
  const baseurl = process.env.AUTH_URL;


const API_LIST = `${baseurl}/api/orders`;
const API_UPDATE = `${baseurl}/api/provider/orders`;

export type ProviderOrder = {
  id: string;
  status: string;
  totalAmount: string;
  deliveryAddress: string;
  createdAt: string;
  customer: {
    name: string;
    email: string;
  };
  items: {
    quantity: number;
    meal: { name: string };
  }[];
};

async function fetchOrders(): Promise<ProviderOrder[]> {
  const res = await fetch(API_LIST, { credentials: "include" });
  if (!res.ok) throw new Error("FETCH_FAILED");
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

export default function ProviderOrdersPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["provider-orders"],
    queryFn: fetchOrders,
  });

  const mutation = useMutation({
    mutationFn: updateOrderStatus,
    onSuccess: () => {
      toast.success("Order status updated");
      queryClient.invalidateQueries({ queryKey: ["provider-orders"] });
    },
    onError: () => toast.error("Failed to update order status"),
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Provider · Orders</h1>
        <p className="text-sm text-muted-foreground">Manage incoming orders</p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
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
              <TableHead>Update Status</TableHead>
              <TableHead className="text-right">View</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}…</TableCell>
                <TableCell>
                  <Badge>{order.status}</Badge>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{order.customer.name}</div>
                  <div className="text-xs text-muted-foreground">{order.customer.email}</div>
                </TableCell>
                <TableCell>{order.items.length}</TableCell>
                <TableCell>৳{order.totalAmount}</TableCell>
                <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  <Select
                    defaultValue={order.status}
                    onValueChange={(status) => mutation.mutate({ id: order.id, status })}
                    disabled={mutation.isPending}
                  >
                    <SelectTrigger className="w-[140px]">
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
                </TableCell>
                <TableCell className="text-right">
                  <Link href={`/provider/orders/${order.id}`} className="text-primary hover:underline text-sm">
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
