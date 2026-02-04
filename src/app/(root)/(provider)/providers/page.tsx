"use client";

import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

/* ---------------- API ---------------- */
const baseurl = process.env.NEXT_PUBLIC_AUTH_URL
;

const API_PROVIDERS = `${baseurl}/api/providers`;

/* ---------------- Types ---------------- */
type Provider = {
  id: string;
  name: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  createdAt: string;
  imageUrl?: string | null; // future-proof
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
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Providers</h1>
        <p className="text-sm text-muted-foreground">
          Browse trusted food providers near you
        </p>
      </div>

      {/* Providers Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {providers?.map((provider) => (
          <Link key={provider.id} href={`/providers/${provider.id}`}>
            <Card className="group h-full cursor-pointer transition hover:-translate-y-1 hover:shadow-lg">
              <CardContent className="flex h-full flex-col gap-4 p-5">
                {/* Header */}
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    {provider.imageUrl ? (
                      <Image
                        src={provider.imageUrl}
                        alt={provider.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <AvatarFallback className="text-lg font-semibold">
                        {provider.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold leading-tight">
                        {provider.name}
                      </h3>
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
                    <p className="text-xs text-muted-foreground">
                      Provider
                    </p>
                  </div>
                </div>

                {/* Description */}
                {provider.description && (
                  <p className="line-clamp-2 text-sm text-muted-foreground">
                    {provider.description}
                  </p>
                )}

                {/* Meta */}
                <div className="mt-auto space-y-1 text-xs text-muted-foreground">
                  {provider.address && <p>📍 {provider.address}</p>}
                  {provider.phone && <p>📞 {provider.phone}</p>}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
