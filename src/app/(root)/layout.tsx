import Navbar2 from "@/components/shared/navbar/Navbar";
import Navbar from "@/components/shared/Navbar1/Navbar";
import React from "react";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar></Navbar>

      <div className="py-16">{children}</div>
    </div>
  );
}
