"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { getUser } from "@/actions/user.action";

export type UserRole = "ADMIN" | "CUSTOMER" | "PROVIDER";

export type ProviderProfile = {
  description?: string | null;
  address?: string | null;
  phone?: string | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string | null;
  role: UserRole;
  status: "ACTIVE" | "SUSPENDED";
  createdAt: string;
  updatedAt: string;
  providerProfile?: ProviderProfile;
};

type UserContextType = {
  user: User | null;
  refetch: () => Promise<void>;
  isPending: boolean;
};

const UserContext = createContext<UserContextType | null>(null);

export function UserProvider({
  children,
  initialUser,
}: {
  children: React.ReactNode;
  initialUser: User | null;
}) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [isPending, startTransition] = useTransition();

  async function refetch() {
    startTransition(async () => {
      const res = await getUser();
      setUser(res.data ?? null);
    });
  }

  return (
    <UserContext.Provider value={{ user, refetch, isPending }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used inside UserProvider");
  return ctx;
}
