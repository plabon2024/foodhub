"use client";

import React, { createContext, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

const API = "http://localhost:5000/api";

async function fetchMe() {
  const res = await fetch(`${API}/auth/me`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("UNAUTHORIZED");
  return res.json();
}

/* ---------------- Types ---------------- */
export type User = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "CUSTOMER" | "PROVIDER";
  status: string;
  emailVerified: boolean;
  createdAt: string;
  providerProfile?: {
    description?: string;
    address?: string;
    phone?: string;
  };
};

type UserContextType = {
  user: User | null;
  isLoading: boolean;
  refetch: () => void;
};

/* ---------------- Context ---------------- */
const UserContext = createContext<UserContextType | null>(null);

/* ---------------- Provider ---------------- */
export function UserProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ["me"],
    queryFn: fetchMe,
  });

  return (
    <UserContext.Provider
      value={{
        user: data?.data ?? null,
        isLoading,
        refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/* ---------------- Hook ---------------- */
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
