"use client";
export const dynamic = "force-dynamic";
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
  Loader2, 
  UserX, 
  UserCheck, 
  Mail, 
  Shield, 
  UserCircle,
  MoreVertical,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import AdminProviderApplicationsPage from "./Application";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = `${baseurl}/admin/users`;

export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "PROVIDER";
  status: "ACTIVE" | "SUSPENDED";
  emailVerified: boolean;
  createdAt: string;
};

async function fetchUsers(): Promise<User[]> {
  const res = await fetch(API_BASE, { credentials: "include" });
  if (!res.ok) throw new Error("FETCH_FAILED");
  const json = await res.json();
  return json.data;
}

async function updateUserStatus({
  id,
  status,
}: {
  id: string;
  status: "ACTIVE" | "SUSPENDED";
}) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });

  if (!res.ok) throw new Error("UPDATE_FAILED");
  return res.json();
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient();

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });

  const mutation = useMutation({
    mutationFn: updateUserStatus,
    onSuccess: (_, variables) => {
      toast.success(`User ${variables.status.toLowerCase()} successfully`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
  });

  return (
    <div className="space-y-12 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="p-6 md:p-8 space-y-8 bg-card/30 backdrop-blur-md rounded-3xl border border-border/50 shadow-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -mr-32 -mt-32" />
        
        <div className="flex items-center justify-between relative z-10">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">Access Control</h1>
            <p className="text-muted-foreground mt-1 text-sm font-medium">
              Manage permissions, monitor status, and safeguard the platform ecosystem.
            </p>
          </div>
          <div className="bg-primary/10 p-3 rounded-2xl text-primary border border-primary/20 shadow-sm">
            <Shield className="w-6 h-6" />
          </div>
        </div>

        <div className="rounded-2xl border border-border/50 bg-background/50 overflow-hidden relative z-10">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p className="text-sm font-medium text-muted-foreground">Synchronizing directory...</p>
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="py-4 px-6 font-bold text-xs uppercase tracking-widest">User Profile</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Security Role</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Live Status</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Verification</TableHead>
                  <TableHead className="font-bold text-xs uppercase tracking-widest">Joined</TableHead>
                  <TableHead className="text-right font-bold text-xs uppercase tracking-widest px-6">Management</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {users?.map((user) => {
                  const nextStatus =
                    user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

                  return (
                    <TableRow key={user.id} className="group hover:bg-muted/30 transition-colors">
                      <TableCell className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10 shadow-sm">
                            <span className="font-bold">{user.name[0]}</span>
                          </div>
                          <div>
                            <p className="font-bold text-sm tracking-tight">{user.name}</p>
                            <div className="flex items-center text-xs text-muted-foreground mt-0.5">
                              <Mail className="w-3 h-3 mr-1" /> {user.email}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={cn(
                          "rounded-lg font-bold text-[10px] tracking-widest border shadow-sm px-2.5 py-1",
                          user.role === "ADMIN" ? "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" :
                          user.role === "PROVIDER" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                          "bg-zinc-500/10 text-muted-foreground border-zinc-500/10"
                        )}>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "h-2 w-2 rounded-full",
                            user.status === "ACTIVE" ? "bg-emerald-500 animate-pulse" : "bg-rose-500"
                          )} />
                          <span className={cn(
                            "text-xs font-bold",
                            user.status === "ACTIVE" ? "text-emerald-500" : "text-rose-500"
                          )}>
                            {user.status}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={cn(
                          "rounded-full px-2.5 py-0.5 text-[10px] font-bold",
                          user.emailVerified ? "bg-emerald-100/50 text-emerald-600 dark:bg-emerald-500/10" : "bg-rose-100/50 text-rose-600 dark:bg-rose-500/10"
                        )}>
                          {user.emailVerified ? "VALIDATED" : "PENDING"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                         <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="w-3 h-3 mr-1" />
                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                         </div>
                      </TableCell>
                      <TableCell className="text-right px-6">
                        {user.role !== "ADMIN" && (
                          <Button
                            size="sm"
                            variant={user.status === "ACTIVE" ? "destructive" : "outline"}
                            className={cn(
                              "h-8 px-4 rounded-xl text-xs font-bold transition-all shadow-sm",
                              user.status === "ACTIVE" 
                                ? "bg-rose-500 hover:bg-rose-600 border-none" 
                                : "border-emerald-500 text-emerald-500 hover:bg-emerald-500/10"
                            )}
                            disabled={mutation.isPending}
                            onClick={() =>
                              mutation.mutate({
                                id: user.id,
                                status: nextStatus,
                              })
                            }
                          >
                            {mutation.isPending ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : user.status === "ACTIVE" ? (
                              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                <UserX className="h-3 w-3" /> Suspend
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5 font-bold uppercase tracking-wider">
                                <UserCheck className="h-3 w-3" /> Activate
                              </div>
                            )}
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
        <AdminProviderApplicationsPage />
      </div>
    </div>
  );
}
