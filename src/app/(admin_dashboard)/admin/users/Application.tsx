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
import { CheckCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const baseurl = process.env.NEXT_PUBLIC_AUTH_URL
;

const API_BASE = `${baseurl}/api/admin/provider-applications`;

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
      toast.success("Provider application approved");
      queryClient.invalidateQueries({
        queryKey: ["admin-provider-applications"],
      });
    },
    onError: () => toast.error("Failed to approve application"),
  });

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold"> Provider Applications</h1>
        <p className="text-sm text-muted-foreground">
          Review and approve provider requests
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
              <TableHead>User</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Applied At</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {data?.map((app) => (
              <TableRow key={app.id}>
                <TableCell>{app.user.name}</TableCell>
                <TableCell>{app.user.email}</TableCell>
                <TableCell>
                  <Badge variant="secondary">{app.user.role}</Badge>
                </TableCell>
                <TableCell>
                  <Badge>{app.status}</Badge>
                </TableCell>
                <TableCell>
                  {new Date(app.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  {app.status === "PENDING" && (
                    <Button
                      size="sm"
                      onClick={() => approveMutation.mutate(app.id)}
                      disabled={approveMutation.isPending}
                    >
                      {approveMutation.isPending ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CheckCircle className="mr-2 h-4 w-4" />
                      )}
                      Approve
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
