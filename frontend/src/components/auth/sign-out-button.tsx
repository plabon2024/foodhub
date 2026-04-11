"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/user-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:5000";

export const SignOutButton = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { refetch } = useUser();

  async function handleClick() {
    setIsPending(true);
    try {
      await fetch(`${BASE_URL}/api/v1/auth/logout`, {
        method: "POST",
        credentials: "include",
      });

      await refetch();
      toast.success("You've logged out. See you soon!");
      router.push("/login");
    } catch {
      toast.error("Logout failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Button
      onClick={handleClick}
      size="sm"
      variant="destructive"
      disabled={isPending}
    >
      {isPending ? "Signing out..." : "Sign out"}
    </Button>
  );
};