import * as React from "react";
import { cn } from "@/lib/utils";
import { Utensils } from "lucide-react";
import Link from "next/link";

type FoodHubLogoProps = {
  className?: string;
  showText?: boolean;
};

export function FoodHubLogo({ className, showText = true }: FoodHubLogoProps) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <div className={cn("flex items-center gap-2", className)}>
        {/* Icon */}
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Utensils className="h-5 w-5" />
        </div>

        {/* Text */}
        {showText && (
          <div className="flex flex-col leading-none">
            <span className="text-2xl font-semibold tracking-tight">
              Food<span className="text-primary">Hub</span>
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
