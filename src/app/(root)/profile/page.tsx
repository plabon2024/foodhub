"use client";

import { SignOutButton } from "@/components/auth/sign-out-button";
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
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Briefcase,
  Calendar,
  CheckCircle2,
  FileText,
  Mail,
  MapPin,
  Phone,
  User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const baseurl = process.env.AUTH_URL;

const API = `${baseurl}/api`;

async function fetchMe() {
  const res = await fetch(`${API}/auth/me`, {
    credentials: "include",
  });
  if (!res.ok) throw new Error("Unauthorized");
  return res.json();
}

async function updateProfile(payload: any) {
  const res = await fetch(`${API}/auth/profile`, {
    method: "PATCH",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Update failed");
  return res.json();
}

async function applyForProvider() {
  const res = await fetch(`${API}/provider/apply`, {
    method: "POST",
    credentials: "include",
  });
  if (!res.ok) throw new Error("Apply failed");
  return res.json();
}

export default function ProfilePage() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  const user = data?.data;

  const [form, setForm] = useState<any>({});

  const updateMutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });

  const applyMutation = useMutation({
    mutationFn: applyForProvider,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["me"] }),
  });

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl space-y-6 p-6">
        <Skeleton className="h-32 w-full rounded-xl" />
        <Skeleton className="h-64 w-full rounded-xl" />
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }
  const router = useRouter();
  if (!user || user.role !== "CUSTOMER") {
    router.push("/");
  }
  return (
    <div className="mx-auto max-w-5xl container space-y-8 p-6">
      {/* Header Card */}
      <Card className="border-none shadow-lg ">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-xl ring-2 ring-blue-500/20">
              <AvatarFallback className="text-3xl font-bold ">
                {user.name?.[0]?.toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2 ">{user.name}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                {user.email}
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <Badge className="px-3 py-1">
                  <User className="w-3 h-3 mr-1" />
                  {user.role}
                </Badge>
                <Badge variant="outline" className="px-3 py-1 ">
                  {user.status}
                </Badge>
                {user.emailVerified && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1 border-green-300 text-green-700 dark:border-green-700 dark:text-green-400"
                  >
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Account Information */}
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl flex items-center gap-2">
            <User className="w-6 h-6 text-blue-500" />
            Account Information
          </CardTitle>
          <CardDescription>
            Update your personal details and account settings
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Label
              htmlFor="name"
              className="text-sm font-medium flex items-center gap-2"
            >
              <User className="w-4 h-4 text-gray-500" />
              Full Name
            </Label>
            <Input
              id="name"
              defaultValue={user.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="transition-all focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-medium flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-gray-500" />
              Email Address
            </Label>
            <Input
              id="email"
              defaultValue={user.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="transition-all focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              Account Created
            </Label>
            <Input
              disabled
              value={new Date(user.createdAt).toLocaleString()}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-gray-500" />
              Email Verification
            </Label>
            <Input
              disabled
              value={user.emailVerified ? "Yes" : "No"}
              className="bg-gray-50 dark:bg-gray-800"
            />
          </div>
        </CardContent>
      </Card>

      {/* Provider Profile */}
      {user.role === "PROVIDER" && user.providerProfile && (
        <Card className="shadow-md  ">
          <CardHeader className="pb-4  rounded-t-lg">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Briefcase className="w-6 h-6 text-blue-500" />
              Provider Profile
            </CardTitle>
            <CardDescription>
              Manage your service provider information
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 pt-6">
            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="text-sm font-medium flex items-center gap-2"
              >
                <FileText className="w-4 h-4 text-gray-500" />
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Tell customers about your services..."
                defaultValue={user.providerProfile.description ?? ""}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="min-h-[120px] transition-all focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <MapPin className="w-4 h-4 text-gray-500" />
                  Address
                </Label>
                <Input
                  id="address"
                  placeholder="Enter your business address"
                  defaultValue={user.providerProfile.address ?? ""}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <Phone className="w-4 h-4 text-gray-500" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  placeholder="Enter your contact number"
                  defaultValue={user.providerProfile.phone ?? ""}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="transition-all focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Separator className="my-8" />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pb-8">
        <Button
          onClick={() => updateMutation.mutate(form)}
          disabled={updateMutation.isPending}
          size="sm"
          className="px-6 py-2  shadow-lg hover:shadow-xl transition-all"
        >
          {updateMutation.isPending ? "Saving..." : "Save Changes"}
        </Button>

        <SignOutButton />

        {user.role === "CUSTOMER" && (
          <Button
            variant="outline"
            onClick={() => applyMutation.mutate()}
            disabled={applyMutation.isPending}
            className="px-6 py-2 border-2 border-blue-500 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 shadow-md hover:shadow-lg transition-all"
            size="sm"
          >
            <Briefcase className="w-4 h-4 mr-2" />
            {applyMutation.isPending ? "Applying..." : "Apply for Provider"}
          </Button>
        )}
      </div>
    </div>
  );
}
