"use client";
export const dynamic = "force-dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@/lib/user-context";
import { useQuery } from "@tanstack/react-query";
import { 
  DollarSign, 
  Loader2, 
  ShoppingCart, 
  Store, 
  Users, 
  Utensils, 
  TrendingUp, 
  ShieldAlert, 
  Activity,
  ArrowUpRight,
  UserCheck,
  PieChart as PieChartIcon,
  BarChart as BarChartIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from "recharts";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${baseurl}/stats`;

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
  activeSessions: number;
};

async function fetchStats(): Promise<AdminStats> {
  const res = await fetch(API_URL, { credentials: "include" });
  if (res.status === 401) throw new Error("UNAUTHORIZED");
  if (res.status === 403) throw new Error("FORBIDDEN");
  if (!res.ok) throw new Error("FETCH_STATS_FAILED");
  const json = await res.json();
  return json.data;
}

function StatCard({ title, value, icon: Icon, sub, trend, variant = "default" }: any) {
  const variants: any = {
    default: "bg-white/50 dark:bg-zinc-900/50",
    primary: "bg-primary/10 border-primary/20",
    success: "bg-emerald-500/10 border-emerald-500/20",
    warning: "bg-amber-500/10 border-amber-500/20",
    danger: "bg-rose-500/10 border-rose-500/20",
  };

  const iconColors: any = {
    default: "text-primary",
    primary: "text-primary",
    success: "text-emerald-500",
    warning: "text-amber-500",
    danger: "text-rose-500",
  };

  return (
    <Card className={cn(
      "relative overflow-hidden border backdrop-blur-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1",
      variants[variant] || variants.default
    )}>
      <div className="absolute top-0 right-0 p-3 opacity-10">
        <Icon size={80} />
      </div>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 text-muted-foreground">
        <CardTitle className="text-xs font-semibold uppercase tracking-wider">
          {title}
        </CardTitle>
        <div className={cn("rounded-full p-2 bg-background/50 backdrop-blur-sm shadow-sm", iconColors[variant])}>
          <Icon className="h-4 w-4" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        <div className="mt-2 flex items-center space-x-2">
          {trend && (
            <span className={cn(
              "flex items-center text-xs font-medium px-1.5 py-0.5 rounded-full bg-background/50",
              trend > 0 ? "text-emerald-500" : "text-rose-500"
            )}>
              <TrendingUp className={cn("h-3 w-3 mr-1", trend < 0 && "rotate-180")} />
              {Math.abs(trend)}%
            </span>
          )}
          {sub && <p className="text-xs text-muted-foreground font-medium">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

const COLORS = ["#ff7e5f", "#feb47b", "#ffcaa7", "#ffad8f", "#ce6a57", "#10b981", "#3b82f6", "#f59e0b"];

export default function AdminDashboardPage() {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: fetchStats,
    retry: false
  });

  const { user, isPending } = useUser();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isPending) return;
    if (!user || user.role !== "ADMIN") {
      router.push("/");
    }
  }, [user, isPending, router]);

  useEffect(() => {
    if (isError) {
      if ((error as any).message === "UNAUTHORIZED") {
        toast.error("Session expired. Please login again.");
        router.push("/auth/login");
      } else if ((error as any).message === "FORBIDDEN") {
        toast.error("You do not have permission to view this page.");
        router.push("/");
      } else {
        toast.error("Failed to load admin dashboard stats");
      }
    }
  }, [isError, error, router]);

  if (isPending) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") return null;

  // Prepare Chart Data
  const userData = data ? [
    { name: "Customers", value: data.users.customers },
    { name: "Providers", value: data.users.providers },
    { name: "Admin/Other", value: Math.max(0, data.users.total - data.users.customers - data.users.providers) }
  ].filter(d => d.value > 0) : [];

  const orderData = data ? Object.entries(data.orders.byStatus).map(([name, value]) => ({
    name,
    value
  })) : [];

  if (orderData.length === 0 && data) {
    orderData.push({ name: "No Orders", value: 0 });
  }

  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary mb-2 shadow-sm border border-primary/20">
            <Activity className="w-3 h-3 mr-1 animate-pulse" /> System Active
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1 text-lg">
            Monitor infrastructure and platform health in real-time.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs text-muted-foreground uppercase font-bold tracking-tighter">Current Session</p>
            <p className="text-sm font-semibold">{user.email}</p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white shadow-lg shadow-primary/20 ring-4 ring-background">
            <UserCheck size={24} />
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-32 rounded-2xl bg-muted animate-pulse border border-border/50" />
          ))}
        </div>
      ) : data ? (
        <div className="space-y-10">
          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center">
              <span className="h-px w-8 bg-primary/30 mr-3" /> User Ecosystem
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Active Users"
                value={data.users.total}
                icon={Users}
                sub={`${data.users.customers} customers · ${data.users.providers} providers`}
                variant="primary"
              />
              <StatCard
                title="Suspended"
                value={data.users.suspended}
                icon={ShieldAlert}
                variant="danger"
                sub="Requires manual review"
              />
              <StatCard
                title="Providers"
                value={`${data.providers.active}`}
                icon={Store}
                sub={`Out of ${data.providers.total} total profiles`}
                variant="success"
              />
              <StatCard
                title="Inventory"
                value={data.meals.total}
                icon={Utensils}
                sub={`${data.meals.available} currently available`}
              />
            </div>
          </section>

          <section className="grid gap-8 lg:grid-cols-2">
            <Card className="rounded-3xl border border-border/50 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl shadow-xl overflow-hidden">
               <CardHeader className="flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold">User Distribution</CardTitle>
                    <p className="text-xs text-muted-foreground">Market segment analysis</p>
                  </div>
                  <PieChartIcon className="text-primary w-5 h-5" />
               </CardHeader>
               <CardContent className="h-[300px]">
                  {isMounted && userData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={userData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {userData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', background: 'rgba(255,255,255,0.9)', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                        />
                        <Legend verticalAlign="bottom" height={36}/>
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground text-sm italic">
                       Insufficient data for visualization
                    </div>
                  )}
               </CardContent>
            </Card>

            <Card className="rounded-3xl border border-border/50 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl shadow-xl overflow-hidden">
               <CardHeader className="flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg font-bold">Orders Volume</CardTitle>
                    <p className="text-xs text-muted-foreground">Current status breakdown</p>
                  </div>
                  <BarChartIcon className="text-primary w-5 h-5" />
               </CardHeader>
               <CardContent className="h-[300px]">
                  {isMounted && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={orderData}>
                        <XAxis dataKey="name" fontSize={10} axisLine={false} tickLine={false} />
                        <YAxis fontSize={10} axisLine={false} tickLine={false} />
                        <Tooltip cursor={{fill: 'rgba(255,255,255,0.1)'}} contentStyle={{ borderRadius: '12px', border: 'none' }} />
                        <Bar dataKey="value" fill="#ff7e5f" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}
               </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6 flex items-center">
              <span className="h-px w-8 bg-primary/30 mr-3" /> Economic Overview
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Operational Revenue"
                value={`৳${Number(data.orders.revenue).toLocaleString()}`}
                icon={DollarSign}
                variant="success"
                sub="Net processed revenue"
              />
              <StatCard
                title="Platform Volume"
                value={data.orders.total}
                icon={ShoppingCart}
                sub={`Delivered: ${data.orders.byStatus.DELIVERED || 0}`}
              />
              <StatCard
                title="Pending Applications"
                value={data.providerApplications.PENDING}
                icon={Activity}
                variant="warning"
                sub="Provider onboarding"
              />
              <StatCard
                title="Active Sessions"
                value={data.activeSessions}
                icon={ArrowUpRight}
                sub="Real-time access"
              />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
