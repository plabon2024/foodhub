"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";

const baseurl = process.env.AUTH_URL;

const API = `${baseurl}/api/meals`;
const LIMIT = 6;

/* ---------------- Fetcher ---------------- */
async function fetchMeals(params: URLSearchParams) {
  const res = await fetch(`${API}?${params.toString()}`);
  if (!res.ok) throw new Error("FETCH_MEALS_FAILED");
  return (await res.json()).data;
}

/* ---------------- Page ---------------- */
export default function MealsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  /* ---------------- State from URL ---------------- */
  const page = Number(searchParams.get("page") ?? 1);

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [featured, setFeatured] = useState(
    searchParams.get("featured") === "true",
  );
  const [available, setAvailable] = useState(
    searchParams.get("available") === "true",
  );

  /* ---------------- Build params ---------------- */
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("limit", String(LIMIT));

  if (q) params.set("q", q);
  if (minPrice) params.set("minPrice", minPrice);
  if (maxPrice) params.set("maxPrice", maxPrice);
  if (featured) params.set("featured", "true");
  if (available) params.set("available", "true");

  const { data, isLoading } = useQuery({
    queryKey: ["meals", params.toString()],
    queryFn: () => fetchMeals(params),
  });

  const items = data?.items ?? [];
  const pagination = data?.pagination;

  /* ---------------- Actions ---------------- */
  function applyFilters() {
    router.push(`/meals?${params.toString()}`);
  }

  function goToPage(p: number) {
    params.set("page", String(p));
    router.push(`/meals?${params.toString()}`);
  }

  /* ---------------- UI ---------------- */
  return (
    <div className="container mx-auto max-w-6xl space-y-8 p-6">
      {/* ================= Header ================= */}
      <div>
        <h1 className="text-2xl font-semibold">Browse Meals</h1>
        <p className="text-sm text-muted-foreground">
          Discover delicious meals from trusted providers
        </p>
      </div>

      {/* ================= Filters ================= */}
      <div className="rounded-xl border bg-background p-4 shadow-sm">
        <div className="grid gap-4 md:grid-cols-5">
          <Input
            placeholder="Search meals"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Min price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
          />

          <Input
            type="number"
            placeholder="Max price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={featured}
                onCheckedChange={(v) => setFeatured(Boolean(v))}
              />
              Featured
            </label>

            <label className="flex items-center gap-2 text-sm">
              <Checkbox
                checked={available}
                onCheckedChange={(v) => setAvailable(Boolean(v))}
              />
              Available
            </label>
          </div>

          <Button onClick={applyFilters}>Apply</Button>
        </div>
      </div>

      {/* ================= Meals Grid ================= */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : items.length === 0 ? (
        <div className="py-24 text-center text-muted-foreground">
          No meals found
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
         {items.map((m: any) => (
  <Link key={m.id} href={`/meals/${m.id}`} className="group">
    <Card className="overflow-hidden rounded-xl border transition hover:shadow-xl p-0">
      {/* ================= Image ================= */}
      <div className="relative h-56 overflow-hidden bg-muted">
        {m.imageUrl ? (
          <>
            {/* Image */}
            <Image
              src={m.imageUrl}
              alt={m.name}
              fill
              className="object-cover "
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-transparent" />

            {/* Price */}
            <span className="absolute bottom-2 right-2 rounded-md bg-background/90 px-2 py-1 text-sm font-semibold shadow">
              ৳{m.price}
            </span>

            {/* Availability */}
            {m.isAvailable === false && (
              <span className="absolute left-2 top-2 rounded-md bg-destructive px-2 py-1 text-xs font-medium text-white">
                Unavailable
              </span>
            )}
          </>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            No image
          </div>
        )}

        {/* Category badge */}
        <span className="absolute right-2 top-2 rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow">
          {m.category.name}
        </span>
      </div>

      {/* ================= Content ================= */}
      <div className="space-y-2 p-4">
        <h3 className="line-clamp-1 text-base font-semibold">
          {m.name}
        </h3>

        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>{m.category.name}</span>
          {m.provider?.name && (
            <span className="truncate">by {m.provider.name}</span>
          )}
        </div>

        <div className="flex justify-end text-xs text-primary">
          View details →
        </div>
      </div>
    </Card>
  </Link>
))}

        </div>
      )}

      {/* ================= Pagination ================= */}
      {pagination && (
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>

          <div className="text-sm text-muted-foreground">
            Page <span className="font-medium">{page}</span> of{" "}
            <span className="font-medium">{pagination.totalPages}</span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => goToPage(page + 1)}
            disabled={page >= pagination.totalPages}
          >
            Next
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}