"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isPending } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && user) {
      router.replace("/");
    }
  }, [user, isPending, router]);

  if (isPending || user) return null;

  return <>{children}</>;
}
