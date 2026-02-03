"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  mealId: string;
  name: string;
  price: number;
  quantity: number;
  providerId: string;
};

type CartContextType = {
  items: CartItem[];
  add: (item: CartItem) => void;
  remove: (mealId: string) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

const STORAGE_KEY = "mealbd_cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  /* Load from localStorage */
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setItems(JSON.parse(stored));
  }, []);

  /* Persist to localStorage */
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  function add(item: CartItem) {
    setItems((prev) => {
      // enforce single provider
      if (prev.length && prev[0].providerId !== item.providerId) {
        alert("You can order from only one provider at a time");
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
      return [...prev, item];
    });
  }

  function remove(mealId: string) {
    setItems((prev) => prev.filter((i) => i.mealId !== mealId));
  }

  function clear() {
    setItems([]);
    localStorage.removeItem(STORAGE_KEY);
  }

  return (
    <CartContext.Provider value={{ items, add, remove, clear }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
