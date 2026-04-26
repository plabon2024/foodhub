"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@/lib/user-context";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

import { logout } from "@/actions/auth.action";

export const SignOutButton = () => {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  const { refetch } = useUser();

  async function handleClick() {
    setIsPending(true);
    try {
      try {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: "POST",
          credentials: "include",
        });
      } catch (err) {
        console.error("Backend logout fetch failed:", err);
      }
      await logout();

      toast.success("You've logged out. See you soon!");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed. Please try again.");
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