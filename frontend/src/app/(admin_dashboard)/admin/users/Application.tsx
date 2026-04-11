"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  CheckCircle, 
  Loader2, 
  UserPlus, 
  History, 
  ChevronRight,
  Mail,
  User,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = `${baseurl}/admin/provider-applications`;

export type ProviderApplication = {
  id: string;
  userId: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    status: string;
    createdAt: string;
  };
};

async function fetchApplications(): Promise<ProviderApplication[]> {
  const res = await fetch(API_BASE, { credentials: "include" });
  if (!res.ok) throw new Error("FETCH_FAILED");
  const json = await res.json();
  return json.data;
}

async function approveApplication(applicationId: string) {
  const res = await fetch(`${API_BASE}/${applicationId}/approve`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("APPROVE_FAILED");
  return res.json();
}

export default function AdminProviderApplicationsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-provider-applications"],
    queryFn: fetchApplications,
  });

  const approveMutation = useMutation({
    mutationFn: approveApplication,
    onSuccess: () => {
      toast.success("Provider application approved. Profile initialized.");
      queryClient.invalidateQueries({
        queryKey: ["admin-provider-applications"],
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => toast.error("Failed to approve application"),
  });

  return (
    <div className="p-6 md:p-8 space-y-8 bg-card/30 backdrop-blur-md rounded-3xl border border-border/50 shadow-xl overflow-hidden relative">
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl -ml-32 -mb-32" />
      
      <div className="flex items-center justify-between relative z-10">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Onboarding Requests</h1>
          <p className="text-muted-foreground mt-1 text-sm font-medium">
            Review and provision new provider accounts into the platform.
          </p>
        </div>
        <div className="bg-emerald-500/10 p-3 rounded-2xl text-emerald-500 border border-emerald-500/20 shadow-sm">
          <UserPlus className="w-6 h-6" />
        </div>
      </div>

      <div className="rounded-2xl border border-border/50 bg-background/50 overflow-hidden relative z-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-sm font-medium text-muted-foreground">Gathering requests...</p>
          </div>
        ) : (
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="py-4 px-6 font-bold text-xs uppercase tracking-widest">Applicant</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest">Submission Info</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest text-center">Current Phase</TableHead>
                <TableHead className="font-bold text-xs uppercase tracking-widest">Queue Date</TableHead>
                <TableHead className="text-right font-bold text-xs uppercase tracking-widest px-6">Resolution</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {!data?.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-20 text-center">
                    <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                      <History className="h-12 w-12 stroke-[1] text-muted-foreground/50" />
                      <p className="font-medium">No pending applications in the queue.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                data?.map((app) => (
                  <TableRow key={app.id} className="group hover:bg-muted/30 transition-colors">
                    <TableCell className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent border border-accent/10 shadow-sm overflow-hidden ring-2 ring-background">
                            <User className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="font-bold text-sm tracking-tight">{app.user.name}</p>
                          <div className="flex items-center text-[11px] text-muted-foreground">
                            <Mail className="w-3 h-3 mr-1" /> {app.user.email}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge variant="outline" className="text-[10px] font-bold px-2 py-0 h-4 border-zinc-500/10 text-muted-foreground">
                          ROLE: {app.user.role}
                        </Badge>
                        <p className="text-[10px] text-muted-foreground flex items-center">
                           <ChevronRight className="w-3 h-3 mr-0.5 text-primary" /> Account Status: {app.user.status}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={cn(
                        "rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest border shadow-sm",
                        app.status === "PENDING" ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                        app.status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                        "bg-rose-500/10 text-rose-600 border-rose-500/20"
                      )}>
                        {app.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-xs font-medium text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        {format(new Date(app.createdAt), "MMM d, h:mm a")}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-6">
                      {app.status === "PENDING" && (
                        <Button
                          size="sm"
                          onClick={() => approveMutation.mutate(app.id)}
                          disabled={approveMutation.isPending}
                          className="h-8 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg shadow-emerald-500/20 transition-all font-bold text-xs uppercase tracking-wider"
                        >
                          {approveMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle className="h-4 w-4" /> Provision
                            </div>
                          )}
                        </Button>
                      )}
                      {app.status === "APPROVED" && (
                        <div className="flex items-center justify-end text-emerald-500 font-bold text-xs">
                           <CheckCircle className="w-4 h-4 mr-1.5" /> PROVISIONED
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}
