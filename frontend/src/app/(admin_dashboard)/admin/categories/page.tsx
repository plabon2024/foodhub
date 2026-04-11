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
import { 
  Loader2, 
  Pencil, 
  Trash2, 
  Plus, 
  UtensilsCrossed, 
  Search,
  LayoutGrid,
  Calendar,
  Zap
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const baseurl = process.env.NEXT_PUBLIC_API_BASE_URL;
const API_BASE = `${baseurl}/admin/categories`;
const CATEGORY_API = `${baseurl}/categories`;

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
      toast.success("New category added to the library");
      setName("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: () => toast.error("Failed to create category"),
  });

  const updateMutation = useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      toast.success("Category details updated");
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
      toast.success("Category removed from platform");
      queryClient.invalidateQueries({ queryKey: ["admin-categories"] });
    },
    onError: () => toast.error("Failed to delete category"),
  });

  function submitForm() {
    if (!name.trim()) {
      toast.error("Taxonomy name is required");
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
    <div className="p-4 md:p-8 space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-500/10 text-emerald-500 mb-3 border border-emerald-500/20 shadow-sm">
            <LayoutGrid className="w-3 h-3 mr-1" /> Taxonomy Manager
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight">Cuisine Library</h1>
          <p className="text-muted-foreground mt-2 text-lg font-medium">
            Define and organize global meal categories for better discovery.
          </p>
        </div>
        <div className="bg-primary/10 p-4 rounded-2xl text-primary border border-primary/20 shadow-lg shadow-primary/5">
          <UtensilsCrossed className="w-8 h-8" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Form Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-3xl p-6 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
            
            <h2 className="text-xl font-bold flex items-center gap-2 mb-6 tracking-tight">
              {editing ? (
                <><Pencil className="w-5 h-5 text-primary" /> Edit Node</>
              ) : (
                <><Plus className="w-5 h-5 text-primary" /> New Category</>
              )}
            </h2>

            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Identity Name</label>
                <Input
                  placeholder="e.g. Italian, Desserts..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-background/50 border-border/50 rounded-xl focus:ring-primary h-11 font-medium"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground ml-1">Discovery Notes</label>
                <Textarea
                  placeholder="Describe this cuisine or food group..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="bg-background/50 border-border/50 rounded-xl focus:ring-primary min-h-[120px] font-medium leading-relaxed"
                />
              </div>
              
              <div className="flex flex-col gap-3 pt-4">
                <Button 
                  onClick={submitForm} 
                  disabled={createMutation.isPending || updateMutation.isPending}
                  className="w-full h-12 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 border-none font-bold uppercase tracking-widest text-xs"
                >
                  {(createMutation.isPending || updateMutation.isPending) ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-4 w-4 fill-current" />
                  )}
                  {editing ? "Commit Updates" : "Initialize Category"}
                </Button>
                
                {editing && (
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-xl border-border/50 font-bold uppercase tracking-widest text-xs"
                    onClick={() => {
                      setEditing(null);
                      setName("");
                      setDescription("");
                    }}
                  >
                    Discard Draft
                  </Button>
                )}
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-muted/20 border border-border/50 rounded-3xl prose prose-sm dark:prose-invert">
             <h4 className="text-xs font-black uppercase tracking-[0.2em] text-primary mb-2 italic">Hierarchy Guideline</h4>
             <p className="text-[11px] text-muted-foreground font-medium leading-relaxed">
               Ensure category names are unique and globally recognized to optimize search engine indexing and user navigational flow.
             </p>
          </div>
        </div>

        {/* Table Main Area */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-card/30 backdrop-blur-md rounded-3xl border border-border/50 shadow-xl overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-32 gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground italic">Syncing Cuisine Data...</p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-muted/50 border-b border-border/50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="py-6 px-8 font-black text-[10px] uppercase tracking-[0.2em]">Node Identity</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-[0.2em]">Metadata Hash</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-[0.2em]">Timestamp</TableHead>
                    <TableHead className="text-right px-8 font-black text-[10px] uppercase tracking-[0.2em]">Operations</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories?.map((cat) => (
                    <TableRow key={cat.id} className="group hover:bg-muted/30 transition-all border-b border-border/30">
                      <TableCell className="py-6 px-8">
                        <div className="flex items-center gap-4">
                           <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/5 text-primary border border-primary/10 shadow-sm transition-transform group-hover:scale-110">
                              <span className="font-black text-xs uppercase">{cat.name.slice(0, 2)}</span>
                           </div>
                           <p className="font-bold text-sm tracking-tight">{cat.name}</p>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs">
                        <p className="text-[11px] font-medium text-muted-foreground line-clamp-2 leading-relaxed italic">
                          {cat.description || "No supplemental data available."}
                        </p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center text-[10px] font-black text-muted-foreground/60">
                          <Calendar className="w-3 h-3 mr-1.5" />
                          {format(new Date(cat.createdAt), "MMM d, yyyy")}
                        </div>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-4 group-hover:translate-x-0">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-lg bg-background/80 backdrop-blur shadow-sm hover:shadow-md"
                            onClick={() => {
                              setEditing(cat);
                              setName(cat.name);
                              setDescription(cat.description || "");
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8 rounded-lg shadow-sm hover:shadow-rose-500/20"
                            disabled={deleteMutation.isPending}
                            onClick={() => {
                               if(confirm("Confirm deletion? This node cannot be recovered.")) {
                                  deleteMutation.mutate(cat.id);
                               }
                            }}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  {!categories?.length && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-24 text-center">
                        <div className="flex flex-col items-center justify-center gap-3 text-muted-foreground">
                          <Search className="h-16 w-16 stroke-[0.5] text-muted-foreground/20" />
                          <p className="font-black uppercase tracking-widest text-[10px] italic">No cuisine definitions found in the registry.</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
