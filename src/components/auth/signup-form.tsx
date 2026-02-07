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

/* ----------------------------- API CALL ----------------------------- */

type SignupPayload = {
  email: string;
  password: string;
  name: string;
  role: "CUSTOMER" | "PROVIDER";
  callbackURL: string;
};

const baseurl = process.env.NEXT_PUBLIC_AUTH_URL;
const API = `${baseurl}/api/auth/sign-up/email`;

async function signup(payload: SignupPayload) {
  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error?.message || "Signup failed");
  }

  return res.json();
}

/* ----------------------------- COMPONENT ----------------------------- */

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  const [role, setRole] = React.useState<"CUSTOMER" | "PROVIDER">("CUSTOMER");

  const mutation = useMutation({
    mutationFn: signup,
    onSuccess: () => {
      toast.success("Registration successful!", {
        description: "Please check your email to verify your account.",
      });
      // Optional: redirect after a delay
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
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
      callbackURL: process.env.NEXT_PUBLIC_AUTH_URL as string,
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
          <Input id="password" name="password" type="password" required />
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
