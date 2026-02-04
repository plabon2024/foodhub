"use client";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import AdminProviderApplicationsPage from "./Application";

const baseurl = process.env.AUTH_URL;

const API_BASE = `${baseurl}/api/admin/users`;


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
      toast.success(`User ${variables.status.toLowerCase()}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => {
      toast.error("Failed to update user status");
    },
  });

  return (
    <>
      <div className="p-6 space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Admin · Users</h1>
          <p className="text-sm text-muted-foreground">
            View and manage platform users
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Email</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {users?.map((user) => {
                const nextStatus =
                  user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";

                return (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{user.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "ACTIVE" ? "default" : "destructive"
                        }
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.emailVerified ? "Verified" : "Unverified"}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.role !== "ADMIN" && (
                        <Button
                          size="sm"
                          variant={
                            user.status === "ACTIVE" ? "destructive" : "outline"
                          }
                          disabled={mutation.isPending}
                          onClick={() =>
                            mutation.mutate({
                              id: user.id,
                              status: nextStatus,
                            })
                          }
                        >
                          {mutation.isPending && (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          )}
                          {user.status === "ACTIVE" ? "Suspend" : "Activate"}
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
      <AdminProviderApplicationsPage></AdminProviderApplicationsPage>
    </>
  );
}
