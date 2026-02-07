"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";

import { useUser } from "@/lib/user-context";
import { SignOutButton } from "@/components/auth/sign-out-button";
import UploadImage from "@/components/imageupload/UploadImage";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";

import {
  Briefcase,
  CheckCircle2,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

/* ---------------- API ---------------- */
const baseurl = process.env.NEXT_PUBLIC_AUTH_URL;
const API = `${baseurl}/api`;

async function updateProfile(payload: Record<string, any>) {
  const res = await fetch(`${API}/auth/profile`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("UPDATE_FAILED");
  return res.json();
}

export default function ProviderProfilePage() {
  const router = useRouter();
  const { user, isPending, refetch } = useUser();

  const [form, setForm] = useState({
    imageUrl: "",
    description: "",
    address: "",
    phone: "",
  });

  /* ---------------- Init form from user ---------------- */
  useEffect(() => {
    if (!user) return;

    setForm({
      imageUrl: user.image ?? "",
      description: user.providerProfile?.description ?? "",
      address: user.providerProfile?.address ?? "",
      phone: user.providerProfile?.phone ?? "",
    });
  }, [user]);

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => {
      toast.success("Profile updated");
      refetch();
    },
    onError: () => toast.error("Failed to update profile"),
  });

  /* ---------------- Guard ---------------- */
  if (isPending || !user || user.role !== "PROVIDER") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Skeleton className="h-40 w-full max-w-xl" />
      </div>
    );
  }

  const avatarUrl = form.imageUrl || null;

  /* ---------------- Submit ---------------- */
  function submit() {
    // ✅ Re-guard to satisfy TypeScript closure analysis
    if (!user) return;

    const payload: Record<string, any> = {};

    if (form.imageUrl !== user.image) {
      payload.image = form.imageUrl;
    }

    if (form.description !== user.providerProfile?.description) {
      payload.description = form.description;
    }

    if (form.address !== user.providerProfile?.address) {
      payload.address = form.address;
    }

    if (form.phone !== user.providerProfile?.phone) {
      payload.phone = form.phone;
    }

    if (Object.keys(payload).length === 0) {
      toast.message("No changes to save");
      return;
    }

    updateMutation.mutate(payload);
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8 p-6">
      {/* Header */}
      <Card>
        <CardContent className="flex gap-6 items-center p-6">
          <Avatar className="h-24 w-24 relative">
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt={user.name ?? "User"}
                fill
                className="object-cover rounded-full"
              />
            ) : (
              <AvatarFallback className="text-3xl font-bold">
                {user.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold">{user.name}</h1>
            <p className="flex items-center gap-1 text-muted-foreground">
              <Mail className="h-4 w-4" />
              {user.email}
            </p>

            <div className="flex gap-2">
              <Badge>PROVIDER</Badge>
              {user.emailVerified && (
                <Badge variant="outline">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
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
            <Briefcase className="h-5 w-5" />
            Provider Profile
          </CardTitle>
          <CardDescription>Visible to customers</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Image */}
          <div className="space-y-2">
            <Label>Profile Photo</Label>
            <UploadImage
              onUpload={(url) =>
                setForm((prev) => ({ ...prev, imageUrl: url }))
              }
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />
          </div>

          {/* Address & Phone */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="flex gap-1 items-center">
                <MapPin className="h-4 w-4" />
                Address
              </Label>
              <Input
                value={form.address}
                onChange={(e) =>
                  setForm((p) => ({ ...p, address: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label className="flex gap-1 items-center">
                <Phone className="h-4 w-4" />
                Phone
              </Label>
              <Input
                value={form.phone}
                onChange={(e) =>
                  setForm((p) => ({ ...p, phone: e.target.value }))
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button onClick={submit} disabled={updateMutation.isPending}>
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>
        <SignOutButton />
      </div>
    </div>
  );
}
