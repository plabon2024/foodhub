"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

/* ---------------- API ---------------- */
const API_PROVIDERS = "http://localhost:5000/api/providers";

/* ---------------- Types ---------------- */
type Provider = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  createdAt: string;
  user: {
    email: string;
    role: "PROVIDER";
    status: "ACTIVE" | "SUSPENDED";
  };
};

/* ---------------- API function ---------------- */
async function fetchProviders(): Promise<Provider[]> {
  const res = await fetch(API_PROVIDERS);
  if (!res.ok) throw new Error("FETCH_PROVIDERS_FAILED");
  return (await res.json()).data;
}

/* ---------------- Page ---------------- */
export default function ProvidersPage() {
  const { data: providers, isLoading } = useQuery({
    queryKey: ["providers"],
    queryFn: fetchProviders,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 container mx-auto my-20">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Providers</h1>
        <p className="text-sm text-muted-foreground">
          Browse available food providers
        </p>
      </div>

      {/* Providers Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {providers?.map((provider) => (
          <Link key={provider.id} href={`/providers/${provider.id}`}>
            <Card className="hover:shadow-md transition cursor-pointer h-full">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">{provider.name}</h3>
                  <Badge
                    variant={
                      provider.user.status === "ACTIVE"
                        ? "default"
                        : "destructive"
                    }
                  >
                    {provider.user.status}
                  </Badge>
                </div>

                {provider.description && (
                  <p className="text-sm text-muted-foreground">
                    {provider.description}
                  </p>
                )}

                {provider.address && (
                  <p className="text-xs text-muted-foreground">
                    📍 {provider.address}
                  </p>
                )}

                {provider.phone && (
                  <p className="text-xs text-muted-foreground">
                    📞 {provider.phone}
                  </p>
                )}
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
