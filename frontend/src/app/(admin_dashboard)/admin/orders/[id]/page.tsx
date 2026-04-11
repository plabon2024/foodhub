"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { 
  Loader2, 
  ArrowLeft, 
  User, 
  Store, 
  MapPin, 
  Calendar, 
  CreditCard, 
  ShoppingBag,
  Info,
  Phone,
  Mail,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  Timer,
  PackageCheck,
  XCircle
} from "lucide-react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = `${baseurl}/orders`;

export type OrderDetails = {
  id: string;
  status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
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
  const router = useRouter();
  const orderId = params.id as string;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: !!orderId,
  });

  if (isError) toast.error("Failed to retrieve order specification");

  const getStatusConfig = (status: OrderDetails["status"]) => {
    switch (status) {
      case "PLACED":
        return { 
          icon: Clock, 
          label: "Awaiting Confirmation", 
          class: "bg-amber-500/10 text-amber-600 border-amber-500/20" 
        };
      case "PREPARING":
        return { 
          icon: Timer, 
          label: "Fulfillment in Progress", 
          class: "bg-blue-500/10 text-blue-600 border-blue-500/20" 
        };
      case "READY":
        return { 
          icon: PackageCheck, 
          label: "Staged for Pickup", 
          class: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" 
        };
      case "DELIVERED":
        return { 
          icon: CheckCircle2, 
          label: "Closed / Delivered", 
          class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
        };
      case "CANCELLED":
        return { 
          icon: XCircle, 
          label: "Voided Transaction", 
          class: "bg-rose-500/10 text-rose-600 border-rose-500/20" 
        };
      default:
        return { 
          icon: Activity, 
          label: status, 
          class: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20" 
        };
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={() => router.back()}
          className="rounded-xl border-border/50 bg-background/50 backdrop-blur-sm shadow-sm"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <div className="flex items-center gap-2 mb-1">
             <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
             <p className="text-[10px] font-black uppercase tracking-widest text-primary italic">Platform Ledger Entry</p>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight flex items-center gap-3">
             Order Specifications
             <span className="text-xl font-medium text-muted-foreground font-mono bg-muted px-2 py-0.5 rounded-lg border border-border/50">
                #{orderId.slice(0, 8).toUpperCase()}
             </span>
          </h1>
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground italic tracking-tighter">Decoding Transaction Data...</p>
        </div>
      ) : data ? (
        <div className="grid gap-8 lg:grid-cols-12">
          
          <div className="lg:col-span-8 space-y-8">
            {/* Fulfillment Status */}
            <Card className="rounded-3xl border border-border/50 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-4 opacity-5">
                 <Zap size={100} />
              </div>
              <CardHeader className="flex flex-row items-center justify-between border-b border-border/30 pb-4">
                 <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-xl text-primary border border-primary/20">
                       <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-bold">Life-cycle Tracking</CardTitle>
                      <p className="text-xs text-muted-foreground">Operational workflow status</p>
                    </div>
                 </div>
                 {(() => {
                    const statusCfg = getStatusConfig(data.status);
                    const StatusIcon = statusCfg.icon;
                    return (
                      <Badge className={cn(
                        "rounded-full px-4 py-1.5 text-[11px] font-black uppercase tracking-widest border shadow-md flex items-center gap-2",
                        statusCfg.class
                      )}>
                        <StatusIcon className="h-4 w-4" />
                        {statusCfg.label}
                      </Badge>
                    );
                 })()}
              </CardHeader>
              <CardContent className="pt-8">
                 <div className="max-w-xs space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Active Destination</p>
                    <div className="flex items-start gap-3 bg-background/50 p-4 rounded-2xl border border-border/30 group hover:shadow-lg transition-all">
                       <MapPin className="w-5 h-5 text-primary mt-0.5" />
                       <p className="text-sm font-bold leading-relaxed">{data.deliveryAddress}</p>
                    </div>
                 </div>
              </CardContent>
            </Card>

            {/* Inventory Items */}
            <Card className="rounded-3xl border border-border/50 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl shadow-xl overflow-hidden">
              <CardHeader className="border-b border-border/30 pb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-xl text-primary border border-primary/20">
                     <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <CardTitle className="text-lg font-bold">Transaction Items</CardTitle>
                    <p className="text-xs text-muted-foreground">Detailed list of requested inventory</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-border/30">
                  {data.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between p-6 group transition-colors hover:bg-muted/30">
                      <div className="flex items-center gap-5">
                        <div className="relative h-16 w-16 overflow-hidden rounded-2xl shadow-md ring-1 ring-border/50 transition-transform group-hover:scale-105">
                          {item.meal.imageUrl ? (
                            <Image
                              src={item.meal.imageUrl}
                              alt={item.meal.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center font-black text-xs uppercase text-zinc-400">
                               IMG
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-base tracking-tight">{item.meal.name}</p>
                          <p className="text-xs text-muted-foreground font-medium mt-1 flex items-center gap-2">
                             ৳{Number(item.meal.price).toLocaleString()} <span className="text-[10px] uppercase font-black opacity-30">×</span> {item.quantity} UNITS
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-base text-primary">
                          ৳{(Number(item.price) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-8 bg-primary/5 border-t border-primary/10 flex justify-between items-center">
                   <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5 text-primary" />
                      <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">Total Transaction Value</span>
                   </div>
                   <div className="text-3xl font-black text-primary drop-shadow-sm">
                      ৳{Number(data.totalAmount).toLocaleString()}
                   </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-4 space-y-8">
             {/* Entities Involved */}
             <Card className="rounded-3xl border border-border/50 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl shadow-xl overflow-hidden">
                <CardHeader className="border-b border-border/30">
                   <CardTitle className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                      <Info className="w-4 h-4 text-primary" /> Entity Credentials
                   </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-8">
                   {/* Customer Unit */}
                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Customer Specification</p>
                      <div className="p-4 rounded-2xl bg-background/50 border border-border/30 space-y-3 relative overflow-hidden group">
                         <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 transition-transform group-hover:scale-[2] duration-700">
                            <User size={60} />
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                               {data.customer.name[0]}
                            </div>
                            <p className="font-bold text-sm truncate pr-8">{data.customer.name}</p>
                         </div>
                         <div className="flex items-center text-[11px] text-muted-foreground font-medium gap-2">
                            <Mail size={12} className="text-primary/60" /> {data.customer.email}
                         </div>
                      </div>
                   </div>

                   {/* Provider Hub */}
                   <div className="space-y-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Production Hub Entry</p>
                      <div className="p-4 rounded-2xl bg-background/50 border border-border/30 space-y-3 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-2 opacity-5 scale-150 transition-transform group-hover:scale-[2] duration-700">
                            <Store size={60} />
                         </div>
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                               {data.provider.name[0]}
                            </div>
                            <p className="font-bold text-sm truncate pr-8">{data.provider.name}</p>
                         </div>
                         <div className="space-y-2">
                            <div className="flex items-center text-[11px] text-muted-foreground font-medium gap-2">
                               <Phone size={12} className="text-primary/60" /> {data.provider.phone || "No direct link"}
                            </div>
                            <div className="flex items-start text-[11px] text-muted-foreground font-medium gap-2">
                               <MapPin size={12} className="text-primary/60 mt-0.5" /> 
                               <span className="leading-relaxed line-clamp-2">{data.provider.address || "Warehouse Pickup"}</span>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Audit Timeline */}
                   <div className="space-y-4 pt-4">
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Audit Timeline</p>
                      <div className="space-y-4 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-primary/20">
                         <div className="flex items-center gap-4 relative z-10">
                            <div className="h-4 w-4 rounded-full bg-primary flex items-center justify-center ring-4 ring-background shadow-sm">
                               <div className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
                            </div>
                            <div>
                               <p className="text-[11px] font-bold">Initialized</p>
                               <div className="flex items-center text-[10px] text-muted-foreground gap-1">
                                  <Calendar size={10} /> {format(new Date(data.createdAt), "MMM d, yyyy · h:mm a")}
                               </div>
                            </div>
                         </div>
                         <div className="flex items-center gap-4 relative z-10">
                            <div className="h-4 w-4 rounded-full bg-muted flex items-center justify-center ring-4 ring-background shadow-sm border border-border/50">
                               <div className="h-1 w-1 rounded-full bg-zinc-400" />
                            </div>
                            <div>
                               <p className="text-[11px] font-bold text-muted-foreground">State Synced</p>
                               <div className="flex items-center text-[10px] text-muted-foreground/60 gap-1">
                                  <Calendar size={10} /> {format(new Date(data.updatedAt), "MMM d, yyyy · h:mm a")}
                               </div>
                            </div>
                         </div>
                      </div>
                   </div>
                </CardContent>
             </Card>
          </div>
        </div>
      ) : null}
    </div>
  );
}
