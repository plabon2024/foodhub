"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { useUser } from "@/lib/user-context";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import {
  Briefcase,
  CheckCircle2
} from "lucide-react";

/* ---------------- API ---------------- */
const API = "http://localhost:5000/api";

async function updateProfile(payload: any) {
  const res = await fetch(`${API}/auth/profile`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("UPDATE_FAILED");
  return res.json();
}

async function applyForProvider() {
  const res = await fetch(`${API}/provider/apply`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("APPLY_FAILED");
  return res.json();
}

/* ---------------- Page ---------------- */
export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, refetch } = useUser();
  const [form, setForm] = useState<any>({});

  /* -------- CUSTOMER GUARD -------- */
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "CUSTOMER") {
      router.replace("/");
    }
  }, [user, isLoading, router]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated");
      refetch();
    },
    onError: () => toast.error("Failed to update profile"),
  });

  const applyMutation = useMutation({
    mutationFn: applyForProvider,
    onSuccess: () => {
      toast.success("Provider application submitted");
      refetch();
    },
    onError: () => toast.error("Failed to apply"),
  });

  /* -------- Loading / Block -------- */
  if (isLoading || !user || user.role !== "CUSTOMER") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-40 w-full max-w-xl" />
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Header */}
      <Card className="shadow-lg">
        <CardContent className="p-8 flex gap-6 items-center">
          <Avatar className="h-24 w-24">
            <AvatarFallback className="text-3xl font-bold">
              {user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>

            <div className="flex gap-2 mt-2">
              <Badge>{user.role}</Badge>
              {user.emailVerified && (
                <Badge variant="outline" className="text-green-600">
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>Update your personal details</CardDescription>
        </CardHeader>

        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input
              defaultValue={user.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Email</Label>
            <Input
              defaultValue={user.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label>Account Created</Label>
            <Input disabled value={new Date(user.createdAt).toLocaleString()} />
          </div>

          <div className="space-y-2">
            <Label>Email Verified</Label>
            <Input disabled value={user.emailVerified ? "Yes" : "No"} />
          </div>
        </CardContent>
      </Card>

      <Separator />

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={() => updateMutation.mutate(form)}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>

        <SignOutButton />

        <Button
          variant="outline"
          onClick={() => applyMutation.mutate()}
          disabled={applyMutation.isPending}
        >
          <Briefcase className="w-4 h-4 mr-2" />
          {applyMutation.isPending ? "Applying..." : "Apply for Provider"}
        </Button>
      </div>
    </div>
  );
}
