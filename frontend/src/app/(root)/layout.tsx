export const dynamic = "force-dynamic";

import Footer from "@/components/shared/Footer/footer";
import Navbar from "@/components/shared/Navbar1/Navbar";
import React from "react";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar></Navbar>

      <div className="pt-16">
        <div className="min-h-screen">

        {children}
        </div>
        <Footer></Footer>
      </div>
    </div>
  );
}
