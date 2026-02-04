"use client";

import React, { createContext, useContext, useState, useTransition } from "react";
import { getUser } from "@/actions/user.action";

/* ---------------- Types ---------------- */
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
  setUser: (user: User | null) => void;
  refetch: () => Promise<void>;
  isPending: boolean;
};

/* ---------------- Context ---------------- */
const UserContext = createContext<UserContextType | null>(null);

/* ---------------- Provider ---------------- */
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
      setUser(res.data);
    });
  }

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        refetch,
        isPending,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

/* ---------------- Hook ---------------- */
export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used inside UserProvider");
  }
  return ctx;
}
