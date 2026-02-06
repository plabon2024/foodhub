import Footer from "@/components/shared/Footer/footer";
import CheckoutOurMenuSection from "@/components/shared/Hero/menu";
import Navbar from "@/components/shared/Navbar1/Navbar";
import React from "react";

export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
      <Navbar></Navbar>

      <div className="pt-16">{children}
         <Footer></Footer>
      </div>

     
    </div>
  );
}
