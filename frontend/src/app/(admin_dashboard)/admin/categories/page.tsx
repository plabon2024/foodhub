"use client";


import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const baseurl = process.env.NEXT_PUBLIC_AUTH_URL
;

const API_BASE = `${baseurl}/api/admin/categories`;
const CATEGORY_API = `${baseurl}/api/categories`;

export type Category = {
  id: string;
  name: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
};

async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(CATEGORY_API, { credentials: "include" });
  if (!res.ok) throw new Error("FETCH_FAILED");
  const json = await res.json();
  return json.data;
}

async function createCategory(data: {
  name: string;
  description?: string;
}) {
  const res = await fetch(API_BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("CREATE_FAILED");
  return res.json();
}

async function updateCategory({
  id,
  name,
  description,
}: {
  id: string;
  name?: string;
  description?: string;
}) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, description }),
  });

  if (!res.ok) throw new Error("UPDATE_FAILED");
  return res.json();
}

async function deleteCategory(id: string) {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("DELETE_FAILED");
}

export default function AdminCategoriesPage() {
  const queryClient = useQueryClient();

  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const { data: categories, isLoading } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: fetchCategories,
  });

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success("Category created");
      setName("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Category updated");
      setEditing(null);
      setName("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: () => toast.error("Failed to update category"),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success("Category deleted");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: () => toast.error("Failed to delete category"),
  });

  function submitForm() {
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (editing) {
      updateMutation.mutate({
        id: editing.id,
        name,
        description,
      });
    } else {
      createMutation.mutate({ name, description });
    }
  }

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-semibold">Admin · Categories</h1>
        <p className="text-sm text-muted-foreground">
          Manage meal categories
        </p>
      </div>

      {/* Form */}
      <div className="max-w-xl space-y-4 rounded-lg border p-4">
        <h2 className="font-medium">
          {editing ? "Edit Category" : "Create Category"}
        </h2>
        <Input
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="Description (optional)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex gap-2">
          <Button onClick={submitForm} disabled={createMutation.isPending || updateMutation.isPending}>
            {(createMutation.isPending || updateMutation.isPending) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {editing ? "Update" : "Create"}
          </Button>
          {editing && (
            <Button
              variant="outline"
              onClick={() => {
                setEditing(null);
                setName("");
                setDescription("");
              }}
            >
              Cancel
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories?.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>{cat.name}</TableCell>
                <TableCell className="max-w-md truncate">
                  {cat.description || "—"}
                </TableCell>
                <TableCell>
                  {new Date(cat.createdAt).toLocaleDateString()}
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => {
                      setEditing(cat);
                      setName(cat.name);
                      setDescription(cat.description || "");
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="destructive"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(cat.id)}
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
