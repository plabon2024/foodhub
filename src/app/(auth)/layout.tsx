import React from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import Image from "next/image";
import Link from "next/link";
export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <main className="min-h-screen">
      <ResizablePanelGroup
        direction="horizontal"
        className="min-h-screen w-full"
      >
        {/* FORM PANEL */}
        <ResizablePanel defaultSize={50}>
          <section className="flex min-h-screen items-center bg-pattern bg-cover bg-top bg-dark-100 px-5 py-10">
            <div className="gradient-vertical mx-auto flex w-full max-w-xl flex-col gap-6 rounded-lg p-10">
              <Link href="/">
                <h1 className="text-2xl font-semibold ">Food Hub</h1>
              </Link>
              {children}
            </div>
          </section>
        </ResizablePanel>

        <ResizableHandle />

        {/* IMAGE PANEL */}
        <ResizablePanel defaultSize={50} className="hidden lg:block">
          <section className=" top-0 h-full relative">
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
