"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Search, DollarSign, Filter, X, Sparkles, Star, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

type Props = {
  categories?: { id: string; name: string }[];
};

export default function MealsFilters({ categories }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [q, setQ] = useState(searchParams.get("q") ?? "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") ?? "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") ?? "");
  const [categoryId, setCategoryId] = useState(
    searchParams.get("categoryId") ?? "",
  );
  const [featured, setFeatured] = useState(
    searchParams.get("featured") === "true",
  );
  const [available, setAvailable] = useState(
    searchParams.get("available") === "true",
  );

  // Count active filters
  const activeFiltersCount = [q, minPrice, maxPrice, categoryId, featured, available]
    .filter(Boolean).length;

  function applyFilters() {
    const params = new URLSearchParams();
    params.set("page", "1");

    if (q) params.set("q", q);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (categoryId) params.set("categoryId", categoryId);
    if (featured) params.set("featured", "true");
    if (available) params.set("available", "true");

    router.push(`/meals?${params.toString()}`);
  }

  function resetFilters() {
    setQ("");
    setMinPrice("");
    setMaxPrice("");
    setCategoryId("");
    setFeatured(false);
    setAvailable(false);
    router.push("/meals");
  }

  return (
    <>
      <style jsx global>{`
        @keyframes filter-glow {
          0%, 100% {
            box-shadow: 0 0 0 0 hsl(var(--primary) / 0.3);
          }
          50% {
            box-shadow: 0 0 0 4px hsl(var(--primary) / 0);
          }
        }

        .filter-card:focus-within {
          animation: filter-glow 2s ease-in-out infinite;
        }
      `}</style>

      <aside className="filter-card space-y-6 rounded-2xl border-2 border-border/40 bg-linear-to-br from-card/80 to-muted/30 backdrop-blur-sm p-6 shadow-xl transition-all duration-300 hover:border-primary/30 hover:shadow-2xl">
        {/* Header */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Filter className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Filters</h3>
                {activeFiltersCount > 0 && (
                  <Badge variant="secondary" className="text-xs mt-0.5">
                    {activeFiltersCount} active
                  </Badge>
                )}
              </div>
            </div>
            
            {activeFiltersCount > 0 && (
              <Button
                size="sm"
                variant="ghost"
                onClick={resetFilters}
                className="h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
        </div>

        {/* Search */}
        <div className="space-y-3 group">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Search
          </Label>
          <div className="relative">
            <Input
              className="pl-10 border-2 focus:border-primary/40 transition-all duration-300"
              placeholder="Find your favorite meal..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </div>

        <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />

        {/* Price Range */}
        <div className="space-y-3 group">
          <Label className="text-sm font-semibold flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            Price Range
          </Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <Input
                type="number"
                placeholder="Min"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                className="border-2 focus:border-primary/40 transition-all duration-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">৳</span>
            </div>
            <div className="relative">
              <Input
                type="number"
                placeholder="Max"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="border-2 focus:border-primary/40 transition-all duration-300"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">৳</span>
            </div>
          </div>
        </div>

        <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />

        {/* Category */}
        {categories && categories.length > 0 && (
          <>
            <div className="space-y-3 group">
              <Label className="text-sm font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Category
              </Label>
              <select
                className="w-full rounded-xl border-2 border-border bg-background px-4 py-2.5 text-sm font-medium transition-all duration-300 focus:border-primary/40 focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-primary/30"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">All categories</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />
          </>
        )}

        {/* Quick Filters */}
        <div className="space-y-3">
          <Label className="text-sm font-semibold">Quick Filters</Label>
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-border/50 bg-background/50 cursor-pointer transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 group">
              <Checkbox
                checked={featured}
                onCheckedChange={(v) => setFeatured(Boolean(v))}
                className="border-2"
              />
              <div className="flex items-center gap-2 flex-1">
                <Star className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Featured only</span>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-xl border-2 border-border/50 bg-background/50 cursor-pointer transition-all duration-300 hover:border-primary/30 hover:bg-primary/5 group">
              <Checkbox
                checked={available}
                onCheckedChange={(v) => setAvailable(Boolean(v))}
                className="border-2"
              />
              <div className="flex items-center gap-2 flex-1">
                <Clock className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium">Available only</span>
              </div>
            </label>
          </div>
        </div>

        <Separator className="bg-linear-to-r from-transparent via-border to-transparent" />

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button 
            className="group relative overflow-hidden shadow-lg hover:shadow-xl hover:shadow-primary/30 transition-all duration-300" 
            onClick={applyFilters}
          >
            <span className="relative z-10 flex items-center gap-2">
              <Filter className="h-4 w-4 transition-transform group-hover:rotate-12" />
              Apply
            </span>
            <div className="absolute inset-0 bg-linear-to-r from-primary/0 via-white/20 to-primary/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
          </Button>
          
          <Button
            variant="outline"
            onClick={resetFilters}
            className="group border-2 hover:border-destructive/40 hover:bg-destructive/5 hover:text-destructive transition-all duration-300"
          >
            <X className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
            Reset
          </Button>
        </div>

        {/* Info Tip */}
        <div className="rounded-xl bg-primary/5 border border-primary/20 p-4 space-y-2">
          <div className="flex items-start gap-2">
            <Sparkles className="h-4 w-4 text-primary mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Pro tip: Use filters to quickly find exactly what you're craving!
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}