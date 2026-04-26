"use client";
export const dynamic = "force-dynamic";
import * as React from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useMutation } from "@tanstack/react-query";
import { persistAuthTokens } from "@/actions/auth.action";

/* ----------------------------- API CALL ----------------------------- */

type SignupPayload = {
  email: string;
  password: string;
  name: string;
  role: "CUSTOMER" | "PROVIDER";
};

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

async function signup(payload: SignupPayload) {
  const res = await fetch(`${BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Signup failed");
  }

  return data;
}

/* ----------------------------- COMPONENT ----------------------------- */

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [role, setRole] = React.useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");
  const [showPassword, setShowPassword] = React.useState(false);

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: async (data) => {
      // Persist tokens on the frontend domain so Next.js server-side can read them.
      const { accessToken, refreshToken } = data?.data ?? {};
      const sessionToken = data?.data?.token;
      await persistAuthTokens({ accessToken, refreshToken, sessionToken });

      toast.success("Registration successful! Welcome to FoodHub.");
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    },
    onError: (error: Error) => {
      toast.error("Registration failed", {
        description: error.message || "Something went wrong. Please try again.",
      });
    },
  });

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    mutation.mutate({
      email: String(formData.get("email")),
      password: String(formData.get("password")),
      name: String(formData.get("name")),
      role,
    });
  }

  return (
    <form
      onSubmit={onSubmit}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Create your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Fill in the form below to create your account
          </p>
        </div>

        {/* ACCOUNT TYPE */}
        <Field>
          <FieldLabel htmlFor="account-type">Account Type</FieldLabel>
          <Select
            value={role}
            onValueChange={(value) => setRole(value as "CUSTOMER" | "PROVIDER")}
          >
            <SelectTrigger id="account-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CUSTOMER">Customer</SelectItem>
              <SelectItem value="PROVIDER">Provider</SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            Choose how you want to use the platform.
          </FieldDescription>
        </Field>

        {/* NAME */}
        <Field>
          <FieldLabel htmlFor="name">Full Name</FieldLabel>
          <Input id="name" name="name" placeholder="John Doe" required />
        </Field>

        {/* EMAIL */}
        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
          />
          <FieldDescription>
            We&apos;ll only use this to contact you.
          </FieldDescription>
        </Field>

        {/* PASSWORD */}
        <Field>
          <FieldLabel htmlFor="password">Password</FieldLabel>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                  <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
          <FieldDescription>Minimum 8 characters.</FieldDescription>
        </Field>

        {/* SUBMIT */}
        <Field>
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? "Creating..." : "Create Account"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="px-6 text-center">
            Already have an account? <a href="/login">Sign in</a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
