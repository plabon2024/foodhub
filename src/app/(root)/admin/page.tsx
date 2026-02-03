"use client";

import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Users, Store, Utensils, ShoppingCart, DollarSign } from "lucide-react";

const API_URL = "http://localhost:5000/api/stats";

export type AdminStats = {
  role: "ADMIN";
  users: {
    total: number;
    customers: number;
    providers: number;
    suspended: number;
  };
  providerApplications: {
    PENDING: number;
    APPROVED: number;
    REJECTED: number;
  };
  providers: {
    total: number;
    active: number;
  };
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

async function fetchStats(): Promise<AdminStats> {
  const res = await fetch(API_URL, { credentials: "include" });
  if (!res.ok) throw new Error("FETCH_STATS_FAILED");
  const json = await res.json();
  return json.data;
}

function StatCard({ title, value, icon: Icon, sub }: any) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
      </CardContent>
    </Card>
  );
}

export default function AdminDashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
  });

  if (isError) {
    toast.error("Failed to load admin dashboard stats");
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Admin · Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Platform overview and system health
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : data ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Users"
            value={data.users.total}
            icon={Users}
            sub={`${data.users.customers} customers · ${data.users.providers} providers`}
          />
          <StatCard
            title="Suspended Users"
            value={data.users.suspended}
            icon={Users}
          />
          <StatCard
            title="Providers"
            value={`${data.providers.active}/${data.providers.total}`}
            icon={Store}
            sub="Active / Total"
          />
          <StatCard
            title="Meals"
            value={`${data.meals.available}/${data.meals.total}`}
            icon={Utensils}
            sub="Available / Total"
          />
          <StatCard
            title="Orders"
            value={data.orders.total}
            icon={ShoppingCart}
            sub={`Delivered ${data.orders.byStatus.DELIVERED || 0}`}
          />
          <StatCard
            title="Revenue"
            value={`৳${data.orders.revenue}`}
            icon={DollarSign}
          />
          <StatCard
            title="Provider Applications"
            value={data.providerApplications.PENDING}
            icon={Store}
            sub="Pending"
          />
          <StatCard
            title="Approved Applications"
            value={data.providerApplications.APPROVED}
            icon={Store}
          />
        </div>
      ) : null}
    </div>
  );
}
