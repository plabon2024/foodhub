"use client";

import React, { useEffect } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useUser } from "@/lib/user-context";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      
      router.push("/");
    }
  }, [user, router]);

  if (user) return null;
  return (
    <main className="min-h-screen">
      <ResizablePanelGroup direction="horizontal" className="min-h-screen">
        {/* FORM PANEL */}
        <ResizablePanel defaultSize={50}>
          <section className="flex min-h-screen items-center bg-dark-100 px-5 py-10">
            <div className="mx-auto w-full max-w-xl rounded-lg p-10">
              <Link href="/">
                <h1 className="mb-6 text-2xl font-semibold">Food Hub</h1>
              </Link>
              {children}
            </div>
          </section>
        </ResizablePanel>

        <ResizableHandle />

        {/* IMAGE PANEL */}
        <ResizablePanel defaultSize={50} className="hidden lg:block">
          <section className="relative min-h-screen w-full ">
            <Image
              src="/food.png"
              alt="auth illustration"
              fill
              priority
              className="object-cover"
            />
          </section>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}
