"use client";

import React, { useCallback, useEffect, useReducer, useState } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Category = {
  id: string;
  name: string;
};

type State = {
  categories: Category[];
  loading: boolean;
  error: string | null;
};

type Action =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: Category[] }
  | { type: "FETCH_ERROR"; payload: string };

// ─── Reducer ─────────────────────────────────────────────────────────────────

const initialState: State = {
  categories: [],
  loading: true,
  error: null,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { categories: action.payload, loading: false, error: null };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
}

// ─── API helpers ─────────────────────────────────────────────────────────────

const API_URL = "http://localhost:5000/api/admin/categories";

const base: RequestInit = { credentials: "include" };

/**
 * Normalises the response: handles a bare array, { data: [] }, or { categories: [] }.
 * Logs a warning + returns [] if the shape is unrecognised.
 */
function extractArray(json: unknown): Category[] {
  if (Array.isArray(json)) return json;
  if (json && typeof json === "object") {
    const obj = json as Record<string, unknown>;
    if (Array.isArray(obj.data)) return obj.data;
    if (Array.isArray(obj.categories)) return obj.categories;
  }
  console.warn("Unexpected API response shape — expected an array:", json);
  return [];
}

async function getCategories(): Promise<Category[]> {
  const res = await fetch(API_URL, base);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return extractArray(await res.json());
}

async function postCategory(name: string): Promise<void> {
  const res = await fetch(API_URL, {
    ...base,
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to create category");
}

async function putCategory(id: string, name: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    ...base,
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });
  if (!res.ok) throw new Error("Failed to update category");
}

async function removeCategory(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, {
    ...base,
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete category");
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    dispatch({ type: "FETCH_START" });
    try {
      const data = await getCategories();
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err: unknown) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleSubmit = async () => {
    const trimmed = name.trim();
    if (!trimmed || pending) return;

    setPending(true);
    try {
      if (editingId) {
        await putCategory(editingId, trimmed);
        setEditingId(null);
      } else {
        await postCategory(trimmed);
      }
      setName("");
      await load(); // refetch after mutation
    } catch (err: unknown) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setPending(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    setPending(true);
    try {
      await removeCategory(id);
      await load();
    } catch (err: unknown) {
      dispatch({
        type: "FETCH_ERROR",
        payload: err instanceof Error ? err.message : "Unknown error",
      });
    } finally {
      setPending(false);
    }
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setName(cat.name);
  };

  const handleCancel = () => {
    setEditingId(null);
    setName("");
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-semibold mb-4">Manage Categories</h1>

      {/* Error banner */}
      {state.error && (
        <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
          {state.error}
        </div>
      )}

      {/* Create / Update form */}
      <div className="flex gap-2 mb-6">
        <input
          className="border px-3 py-2 rounded w-full"
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          disabled={pending}
        />
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || pending}
          className="bg-blue-600 text-white px-4 rounded disabled:opacity-40"
        >
          {editingId ? "Update" : "Add"}
        </button>
        {editingId && (
          <button
            onClick={handleCancel}
            className="bg-gray-200 text-gray-700 px-4 rounded"
          >
            Cancel
          </button>
        )}
      </div>

      {/* List */}
      {state.loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : state.categories.length === 0 ? (
        <p className="text-gray-400 text-sm">No categories yet.</p>
      ) : (
        <ul className="space-y-2">
          {state.categories.map((cat) => (
            <li
              key={cat.id}
              className="flex justify-between items-center border p-3 rounded"
            >
              <span>{cat.name}</span>
              <div className="flex gap-3">
                <button
                  onClick={() => handleEdit(cat)}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cat.id)}
                  disabled={pending}
                  className="text-red-600 hover:underline text-sm disabled:opacity-40"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}