"use client";

import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { useUser } from "@/lib/user-context";
import { SignOutButton } from "@/components/auth/sign-out-button";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

import {
  User,
  Mail,
  MapPin,
  Phone,
  Briefcase,
  CheckCircle2,
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

/* ---------------- Page ---------------- */
export default function ProviderProfilePage() {
  const router = useRouter();
  const { user, isLoading, refetch } = useUser();
  const [form, setForm] = useState<any>({});

  /* -------- PROVIDER GUARD -------- */
  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role !== "PROVIDER") {
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

  /* -------- Loading / Block -------- */
  if (isLoading || !user || user.role !== "PROVIDER") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-40 w-full max-w-xl" />
      </div>
    );
  }

  const provider = user.providerProfile;

  /* ---------------- UI ---------------- */
  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Header */}
      <Card>
        <CardContent className="p-6 flex gap-6 items-center">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="text-2xl font-bold">
              {user.name?.[0]?.toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground flex items-center gap-1">
              <Mail className="w-4 h-4" />
              {user.email}
            </p>

            <div className="flex gap-2 mt-2">
              <Badge>PROVIDER</Badge>
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

      {/* Provider Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="w-5 h-5" />
            Provider Profile
          </CardTitle>
          <CardDescription>
            Manage your business information visible to customers
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              defaultValue={provider?.description ?? ""}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              placeholder="Tell customers about your food and service"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Address
              </Label>
              <Input
                defaultValue={provider?.address ?? ""}
                onChange={(e) =>
                  setForm({ ...form, address: e.target.value })
                }
                placeholder="Business address"
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <Phone className="w-4 h-4" />
                Phone
              </Label>
              <Input
                defaultValue={provider?.phone ?? ""}
                onChange={(e) =>
                  setForm({ ...form, phone: e.target.value })
                }
                placeholder="+8801XXXXXXXXX"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button
          onClick={() => updateMutation.mutate(form)}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>

        <SignOutButton />
      </div>
    </div>
  );
}
