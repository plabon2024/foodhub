"use client";

import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Trash2, Pencil } from "lucide-react";

import UploadImage from "@/components/imageupload/UploadImage";
import { Label } from "@/components/ui/label";

/* ---------------- API ---------------- */

const baseurl = process.env.AUTH_URL;
const API_PROVIDER_MEALS = `${baseurl}/api/provider/meals`;
const API_MEALS = `${baseurl}/api/meals`;
const API_CATEGORIES = `${baseurl}/api/categories`;
/* ---------------- Types ---------------- */
type Category = {
  id: string;
  name: string;
};

type Meal = {
  id: string;
  categoryId: string;
  name: string;
  description: string | null;
  price: string;
  imageUrl: string | null;
  isAvailable: boolean;
  isFeatured: boolean;
  category: Category;
};

type MealForm = {
  name?: string;
  description?: string | null;
  price?: number;
  imageUrl?: string | null;
  categoryId?: string;
  isAvailable?: boolean;
  isFeatured?: boolean;
};

/* ---------------- API functions ---------------- */
async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(API_CATEGORIES);
  if (!res.ok) throw new Error("FETCH_CATEGORIES_FAILED");
  return (await res.json()).data;
}

async function fetchMeals(): Promise<Meal[]> {
  const res = await fetch(API_MEALS, { credentials: "include" });
  if (!res.ok) throw new Error("FETCH_MEALS_FAILED");
  return (await res.json()).data.items;
}

async function createMeal(data: MealForm) {
  const res = await fetch(API_PROVIDER_MEALS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("CREATE_FAILED");
  return res.json();
}

async function updateMeal({ id, ...data }: { id: string } & MealForm) {
  const res = await fetch(`${API_PROVIDER_MEALS}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("UPDATE_FAILED");
  return res.json();
}

async function deleteMeal(id: string) {
  const res = await fetch(`${API_PROVIDER_MEALS}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error("DELETE_FAILED");
}

/* ---------------- Page ---------------- */
export default function ProviderMenuPage() {
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState<Meal | null>(null);
  const [form, setForm] = useState<MealForm>({
    isAvailable: true,
    isFeatured: false,
  });

  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  const { data: meals, isLoading } = useQuery({
    queryKey: ["provider-meals"],
    queryFn: fetchMeals,
  });

  const createMutation = useMutation({
    mutationFn: createMeal,
    onSuccess: () => {
      toast.success("Meal created");
      setForm({ isAvailable: true, isFeatured: false });
      queryClient.invalidateQueries({ queryKey: ["provider-meals"] });
    },
    onError: () => toast.error("Failed to create meal"),
  });

  const updateMutation = useMutation({
    mutationFn: updateMeal,
    onSuccess: () => {
      toast.success("Meal updated");
      setEditing(null);
      setForm({ isAvailable: true, isFeatured: false });
      queryClient.invalidateQueries({ queryKey: ["provider-meals"] });
    },
    onError: () => toast.error("Failed to update meal"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMeal,
    onSuccess: () => {
      toast.success("Meal deleted");
      queryClient.invalidateQueries({ queryKey: ["provider-meals"] });
    },
    onError: () => toast.error("Failed to delete meal"),
  });

  function submit() {
    if (!form.name || !form.categoryId || form.price === undefined) {
      toast.error("Name, category and price are required");
      return;
    }

    const payload: MealForm = {
      name: form.name,
      description: form.description ?? null,
      price: form.price,
      imageUrl: form.imageUrl ?? null,
      categoryId: form.categoryId,
      isAvailable: form.isAvailable ?? true,
      isFeatured: form.isFeatured ?? false,
    };

    if (editing) {
      updateMutation.mutate({ id: editing.id, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Provider · Menu</h1>
        <p className="text-sm text-muted-foreground">Manage your meals</p>
      </div>

      {/* -------- Form -------- */}
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>{editing ? "Edit Meal" : "Add Meal"}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            placeholder="Meal name"
            value={form.name || ""}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          <Textarea
            placeholder="Description"
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />

          <Input
            type="number"
            placeholder="Price"
            value={form.price ?? ""}
            onChange={(e) =>
              setForm({ ...form, price: Number(e.target.value) })
            }
          />

          <Label>Product Image</Label>

          <UploadImage
            onUpload={(url: string) =>
              setForm((prev) => ({ ...prev, imageUrl: url }))
            }
          />

          {form.imageUrl && (
            <img
              src={form.imageUrl}
              alt="Preview"
              className="mt-2 w-32 h-32 object-cover rounded-md border"
            />
          )}

          <Select
            value={form.categoryId}
            onValueChange={(v) => setForm({ ...form, categoryId: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories?.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {editing && (
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <Switch
                  checked={!!form.isAvailable}
                  onCheckedChange={(v) =>
                    setForm((prev) => ({ ...prev, isAvailable: v }))
                  }
                />
                <span className="text-sm">Available</span>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={!!form.isFeatured}
                  onCheckedChange={(v) =>
                    setForm((prev) => ({ ...prev, isFeatured: v }))
                  }
                />
                <span className="text-sm">Featured</span>
              </div>
            </div>
          )}

          <Button
            onClick={submit}
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {(createMutation.isPending || updateMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {editing ? "Update Meal" : "Create Meal"}
          </Button>
        </CardContent>
      </Card>

      {/* -------- Meals Table -------- */}
      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Meal</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Featured</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {meals?.map((meal) => (
              <TableRow key={meal.id}>
                <TableCell className="flex items-center gap-3">
                  {meal.imageUrl && (
                    <Image
                      src={meal.imageUrl}
                      alt={meal.name}
                      width={48}
                      height={48}
                      className="rounded"
                    />
                  )}
                  {meal.name}
                </TableCell>

                <TableCell>{meal.category.name}</TableCell>
                <TableCell>৳{meal.price}</TableCell>
                <TableCell>{meal.isAvailable ? "Yes" : "No"}</TableCell>
                <TableCell>{meal.isFeatured ? "Yes" : "No"}</TableCell>

                <TableCell className="text-right space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setEditing(meal);
                      setForm({
                        name: meal.name,
                        description: meal.description,
                        price: Number(meal.price),
                        imageUrl: meal.imageUrl,
                        categoryId: meal.categoryId,
                        isAvailable: meal.isAvailable,
                        isFeatured: meal.isFeatured,
                      });
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button
                    size="icon"
                    variant="destructive"
                    onClick={() => deleteMutation.mutate(meal.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
