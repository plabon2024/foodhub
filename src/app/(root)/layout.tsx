
import Navbar from "@/components/shared/navbar/Navbar";
import React from "react";



export default function layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div>
     
        <Navbar></Navbar>
        {children}
      
    
    </div>
  );
}
