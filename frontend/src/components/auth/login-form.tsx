"use client";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useUser } from "@/lib/user-context";
import { cn } from "@/lib/utils";
import * as React from "react";
import { useState } from "react";
import { toast } from "sonner";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const QUICK_LOGINS = [
  {
    label: "Admin",
    email: "admin@gmail.com",
    password: "@123ADMINadmin",
    color: "bg-red-500/10 hover:bg-red-500/20 text-red-600 border-red-200",
    dot: "bg-red-500",
  },
  {
    label: "Provider",
    email: "provider@gmail.com",
    password: "@123providerPROVIDER",
    color: "bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 border-blue-200",
    dot: "bg-blue-500",
  },
  {
    label: "Customer",
    email: "customer@gmail.com",
    password: "@123customerCUSTOMER",
    color: "bg-green-500/10 hover:bg-green-500/20 text-green-600 border-green-200",
    dot: "bg-green-500",
  },
];

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [emailVal, setEmailVal] = useState("");
  const [passwordVal, setPasswordVal] = useState("");
  const { refetch } = useUser();

  /* ─── helpers ─── */
  const performLogin = async (email: string, password: string) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        const msg = data?.message || "Login failed";
        setError(msg);
        toast.error(msg);
        return;
      }

      toast.success("Login successful. Good to have you back.");
      await refetch();
      window.location.href = "/";
    } catch (err) {
      const msg = err instanceof Error ? err.message : "An error occurred";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await performLogin(emailVal, passwordVal);
  };

  const handleQuickLogin = (email: string, password: string) => {
    setEmailVal(email);
    setPasswordVal(password);
    toast.info(`Logging in as ${email}…`);
    performLogin(email, password);
  };

  return (
    <form
      className={cn("flex flex-col gap-6 w-full", className)}
      onSubmit={handleSubmit}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm">
            Enter your email below to login to your account
          </p>
        </div>

        {/* ─── Quick Login Buttons ─── */}
        <div className="space-y-2">
          <p className="text-xs text-center text-muted-foreground font-medium tracking-wide uppercase">
            Quick Login
          </p>
          <div className="grid grid-cols-3 gap-2">
            {QUICK_LOGINS.map(({ label, email, password, color, dot }) => (
              <button
                key={label}
                type="button"
                disabled={isLoading}
                onClick={() => handleQuickLogin(email, password)}
                className={cn(
                  "flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition-all duration-200 disabled:opacity-50 cursor-pointer",
                  color
                )}
              >
                <span className={cn("h-2 w-2 rounded-full shrink-0", dot)} />
                {label}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-1">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-muted-foreground">or fill manually</span>
            <div className="h-px flex-1 bg-border" />
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="m@example.com"
            required
            disabled={isLoading}
            value={emailVal}
            onChange={(e) => setEmailVal(e.target.value)}
          />
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <a
              href="/forgot-password"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input
            id="password"
            name="password"
            type="password"
            required
            disabled={isLoading}
            value={passwordVal}
            onChange={(e) => setPasswordVal(e.target.value)}
          />
        </Field>

        <Field>
          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Logging in..." : "Login"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/register" className="underline underline-offset-4">
              Sign up
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}
