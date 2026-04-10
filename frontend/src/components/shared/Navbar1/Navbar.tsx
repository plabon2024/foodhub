"use client";

import { MenuIcon } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { SignOutButton } from "@/components/auth/sign-out-button";
import { useUser } from "@/lib/user-context";
import { ModeToggle } from "./ModeToggle";
import { FoodHubLogo } from "./foodhub-logo";

/* ---------------- Component ---------------- */
export default function Navbar() {
  const { theme } = useTheme();
  const { user, isPending,  } = useUser();
console.log(user)
  const [mounted, setMounted] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  /* ---------------- Mount ---------------- */
  useEffect(() => setMounted(true), []);

  /* ---------------- Hide on Scroll ---------------- */
  useEffect(() => {
    const onScroll = () => {
      if (window.scrollY > lastScrollY && window.scrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastScrollY]);

  if (!mounted || isPending) return null; // ✅ prevent flicker

  /* ---------------- Links ---------------- */
  const commonLinks = [
    { href: "/", label: "Home" },
    { href: "/meals", label: "Meals" },
    { href: "/providers", label: "Providers" },
  ];

  const customerLinks = [
    { href: "/cart", label: "Cart" },
    { href: "/orders", label: "My Orders" },
    { href: "/profile", label: "Profile" },
  ];

  const providerLinks = [
    { href: "/provider/dashboard", label: "Dashboard" },
    { href: "/provider/orders", label: "Orders" },
    { href: "/provider/menu", label: "Menu" },
    { href: "/provider/profile", label: "Profile" },
  ];

  const adminLinks = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/orders", label: "Orders" },
    { href: "/admin/categories", label: "Categories" },
  ];

  function roleLinks() {
    if (!user) return [];
    if (user.role === "CUSTOMER") return customerLinks;
    if (user.role === "PROVIDER") return providerLinks;
    if (user.role === "ADMIN") return adminLinks;
    return [];
  }

  function renderLinks(mobile = false) {
    const links = [...commonLinks, ...roleLinks()];

    return links.map((l) =>
      mobile ? (
        <Link
          key={l.href}
          href={l.href}
          className="font-medium text-base hover:text-primary"
        >
          {l.label}
        </Link>
      ) : (
        <NavigationMenuItem key={l.href}>
          <NavigationMenuLink
            href={l.href}
            className="px-4 py-2 rounded-lg hover:bg-muted font-semibold text-sm"
          >
            {l.label}
          </NavigationMenuLink>
        </NavigationMenuItem>
      ),
    );
  }

  /* ---------------- UI ---------------- */
  return (
    <section
      className={`fixed top-0 z-50 w-full backdrop-blur-xl transition-transform duration-300
        ${theme === "light" ? "bg-white/70" : "bg-black/70"}
        ${hidden ? "-translate-y-full" : "translate-y-0"}`}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4 gap-4">
          {/* Logo */}
          <FoodHubLogo></FoodHubLogo>

          {/* Desktop Nav */}
          <NavigationMenu className="hidden lg:block">
            <NavigationMenuList>{renderLinks()}</NavigationMenuList>
          </NavigationMenu>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <ModeToggle />

            {!user ? (
              <>
                <Link href="/login">Login</Link>
                <Button asChild>
                  <Link href="/register">Register</Link>
                </Button>
              </>
            ) : (
              <SignOutButton></SignOutButton>
            )}
          </div>

          {/* Mobile */}
          <div className="lg:hidden flex items-center gap-2">
            <ModeToggle />

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <MenuIcon className="h-4 w-4" />
                </Button>
              </SheetTrigger>

              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <FoodHubLogo></FoodHubLogo>
                </SheetHeader>

                <div className="flex flex-col gap-4 p-4">
                  {renderLinks(true)}

                  <div className="pt-4 border-t">
                    {!user ? (
                      <>
                        <Link href="/login">Login</Link>
                        <Link href="/register">Register</Link>
                      </>
                    ) : (
                      <SignOutButton></SignOutButton>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      </div>
    </section>
  );
}
