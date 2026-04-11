"use client";
export const dynamic = "force-dynamic";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { 
  Loader2, 
  ShoppingBag, 
  ExternalLink, 
  Clock, 
  User, 
  Store,
  CreditCard,
  ChevronRight,
  PackageCheck,
  Truck,
  Timer,
  CheckCircle2,
  XCircle,
  Activity
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_URL = `${baseurl}/orders`;

export type Order = {
  id: string;
  status: "PLACED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED";
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

  if (isError) toast.error("Failed to load global order registry");

  const getStatusConfig = (status: Order["status"]) => {
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
          label: "In Kitchen", 
          class: "bg-blue-500/10 text-blue-600 border-blue-500/20" 
        };
      case "READY":
        return { 
          icon: PackageCheck, 
          label: "Ready for Pickup", 
          class: "bg-indigo-500/10 text-indigo-600 border-indigo-500/20" 
        };
      case "DELIVERED":
        return { 
          icon: CheckCircle2, 
          label: "Successfully Delivered", 
          class: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
        };
      case "CANCELLED":
        return { 
          icon: XCircle, 
          label: "Voided", 
          class: "bg-rose-500/10 text-rose-600 border-rose-500/20" 
        };
      default:
        return { 
          icon: Activity, 
          label: status, 
          class: "bg-zinc-500/10 text-zinc-600 border-zinc-500/20 rotate" 
        };
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary/10 text-primary mb-3 border border-primary/20 shadow-sm">
            <ShoppingBag className="w-3 h-3 mr-1" /> Global Ledger
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Orders Registry</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">
            Monitor transaction flow and fulfillment across the platform.
          </p>
        </div>
        <div className="bg-primary/10 p-4 rounded-2xl text-primary border border-primary/20 shadow-lg shadow-primary/5">
          <Truck className="w-8 h-8" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-32 gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground italic">Fetching Transaction History...</p>
        </div>
      ) : (
        <Card className="rounded-3xl border border-border/50 bg-white/30 dark:bg-zinc-900/30 backdrop-blur-xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
          
          <CardContent className="p-0 relative z-10">
            <Table>
              <TableHeader className="bg-muted/50 border-b border-border/50 text-muted-foreground">
                <TableRow className="hover:bg-transparent">
                  <TableHead className="py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em] w-[140px]">Hash ID</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-[0.2em]">Fulfillment Phase</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-[0.2em]">Customer Profile</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-[0.2em]">Provider Hub</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-[0.2em]">Value</TableHead>
                  <TableHead className="font-black text-[10px] uppercase tracking-[0.2em]">Timestamp</TableHead>
                  <TableHead className="text-right px-8 font-black text-[10px] uppercase tracking-[0.2em]">Resolution</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {!data?.length ? (
                   <TableRow>
                     <TableCell colSpan={7} className="py-32 text-center text-muted-foreground italic font-medium">
                        No transactions recorded in the platform ledger.
                     </TableCell>
                   </TableRow>
                ) : (
                  data?.map((order) => {
                    const statusCfg = getStatusConfig(order.status);
                    const StatusIcon = statusCfg.icon;

                    return (
                      <TableRow key={order.id} className="group hover:bg-muted/30 transition-all border-b border-border/30">
                        <TableCell className="py-6 px-8">
                          <code className="text-[11px] font-bold tracking-widest text-muted-foreground bg-muted px-2 py-1 rounded-lg">
                            {order.id.slice(0, 8).toUpperCase()}
                          </code>
                        </TableCell>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "rounded-lg px-3 py-1 text-[10px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-1.5 w-fit",
                              statusCfg.class
                            )}
                          >
                            <StatusIcon className="h-3 w-3" />
                            {statusCfg.label}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                             <div className="h-9 w-9 rounded-xl bg-primary/5 flex items-center justify-center text-primary shadow-sm ring-1 ring-primary/10">
                                <User size={18} />
                             </div>
                             <div>
                               <p className="font-bold text-sm tracking-tight">{order.customer.name}</p>
                               <p className="text-[10px] text-muted-foreground font-medium">{order.customer.email}</p>
                             </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 font-bold text-sm text-foreground/90">
                            <Store size={14} className="text-primary" />
                            {order.provider.name}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5 font-black text-sm text-emerald-600 dark:text-emerald-400">
                             <CreditCard size={14} />
                             ৳{Number(order.totalAmount).toLocaleString()}
                             <span className="text-[10px] font-medium text-muted-foreground ml-1">
                               ({order.items.length} {order.items.length === 1 ? 'item' : 'items'})
                             </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-[10px] font-bold text-muted-foreground/70">
                            <Clock className="w-3 h-3 mr-1.5" />
                            {format(new Date(order.createdAt), "MMM d, h:mm a")}
                          </div>
                        </TableCell>
                        <TableCell className="text-right px-8">
                          <Link
                            href={`/admin/orders/${order.id}`}
                            className="inline-flex items-center justify-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-primary hover:text-primary/70 transition-colors"
                          >
                            Detail <ChevronRight size={14} />
                          </Link>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
