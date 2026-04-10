"use client";

import { createContext, useContext, useEffect, useState } from "react";

/* ---------------- Types ---------------- */
export type CartItem = {
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  providerId: string;
  imageUrl?: string | null;
};

type CartContextType = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (mealId: string) => void;
  clear: () => void;
  increase: (mealId: string) => void;
  decrease: (mealId: string) => void;
};

/* ---------------- Context ---------------- */
const CartContext = createContext<CartContextType | null>(null);
const STORAGE_KEY = "mealbd_cart";

/* ---------------- Provider ---------------- */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  /* Load from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        localStorage.removeItem(STORAGE_KEY);
      }
    }
  }, []);

  /* Persist to localStorage */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  /* ---------------- Actions ---------------- */

  function add(item: CartItem) {
    setItems((prev) => {
      // Enforce single provider
      if (prev.length > 0 && prev[0].providerId !== item.providerId) {
        return prev;
      }

      const existing = prev.find((i) => i.mealId === item.mealId);

      if (existing) {
        return prev.map((i) =>
          i.mealId === item.mealId
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }

      return [...prev, { ...item, quantity: item.quantity ?? 1 }];
    });
  }

  function increase(mealId: string) {
    setItems((prev) =>
      prev.map((i) =>
        i.mealId === mealId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      )
    );
  }

  function decrease(mealId: string) {
    setItems((prev) =>
      prev
        .map((i) =>
          i.mealId === mealId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0)
    );
  }

  function remove(mealId: string) {
    setItems((prev) => prev.filter((i) => i.mealId !== mealId));
  }

  function clear() {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <CartContext.Provider
      value={{ items, add, remove, clear, increase, decrease }}
    >
      {children}
    </CartContext.Provider>
  );
}

/* ---------------- Hook ---------------- */
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used inside CartProvider");
  }
  return ctx;
}
