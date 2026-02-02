"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href ? "text-blue-600 font-semibold" : "text-gray-700";

  return (
    <nav className="w-full border-b ">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          {/* Public */}
          <Link href="/" className={isActive("/")}>
            Home
          </Link>
          <Link href="/meals" className={isActive("/meals")}>
            Meals
          </Link>
          <Link href="/login" className={isActive("/login")}>
            Login
          </Link>
          <Link href="/register" className={isActive("/register")}>
            Register
          </Link>

          {/* Customer */}
          <Link href="/cart" className={isActive("/cart")}>
            Cart
          </Link>
          <Link href="/checkout" className={isActive("/checkout")}>
            Checkout
          </Link>
          <Link href="/orders" className={isActive("/orders")}>
            My Orders
          </Link>
          <Link href="/profile" className={isActive("/profile")}>
            Profile
          </Link>

          {/* Provider */}
          <Link
            href="/provider/dashboard"
            className={isActive("/provider/dashboard")}
          >
            Provider Dashboard
          </Link>
          <Link href="/provider/menu" className={isActive("/provider/menu")}>
            Provider Menu
          </Link>
          <Link
            href="/provider/orders"
            className={isActive("/provider/orders")}
          >
            Provider Orders
          </Link>

          {/* Admin */}
          <Link href="/admin" className={isActive("/admin")}>
            Admin Dashboard
          </Link>
          <Link href="/admin/users" className={isActive("/admin/users")}>
            Admin Users
          </Link>
          <Link href="/admin/orders" className={isActive("/admin/orders")}>
            Admin Orders
          </Link>
          <Link
            href="/admin/categories"
            className={isActive("/admin/categories")}
          >
            Admin Categories
          </Link>
          <ModeToggle></ModeToggle>
        </div>
      </div>
    </nav>
  );
}
