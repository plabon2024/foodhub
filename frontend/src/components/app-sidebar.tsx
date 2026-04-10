"use client"

import * as React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

import {
  IconDashboard,
  IconListDetails,
  IconUsers,
  IconChartBar,
  IconFolder,
  IconUser
} from "@tabler/icons-react"

import { useUser } from "@/lib/user-context"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem
} from "@/components/ui/sidebar"

import { Loader2 } from "lucide-react"
import { FoodHubLogo } from "./shared/Navbar1/foodhub-logo"

/* -----------------------------
   MENU CONFIG (ROLE BASED)
--------------------------------*/

const PROVIDER_MENU = [
  {
    title: "Dashboard",
    url: "/provider/dashboard",
    icon: IconDashboard,
  },
  {
    title: "Menu",
    url: "/provider/menu",
    icon: IconFolder,
  },
  {
    title: "Orders",
    url: "/provider/orders",
    icon: IconListDetails,
  },
  {
    title: "Profile",
    url: "/provider/profile",
    icon: IconUser,
  },
]

const ADMIN_MENU = [
  {
    title: "Dashboard",
    url: "/admin",
    icon: IconDashboard,
  },
  {
    title: "Users",
    url: "/admin/users",
    icon: IconUsers,
  },
  {
    title: "Orders",
    url: "/admin/orders",
    icon: IconListDetails,
  },
  {
    title: "Categories",
    url: "/admin/categories",
    icon: IconFolder,
  },
]

/* -----------------------------
   SIDEBAR
--------------------------------*/

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const { user, isPending } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isPending) return

    if (!user) {
      router.push("/")
      return
    }

    if (user.role !== "PROVIDER" && user.role !== "ADMIN") {
      router.push("/")
    }
  }, [user, isPending, router])

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!user) return null

  const navItems =
    user.role === "ADMIN" ? ADMIN_MENU : PROVIDER_MENU

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
         <FoodHubLogo></FoodHubLogo>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={navItems} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: user.name,
            email: user.email,
            avatar: user.image ?? "",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  )
}
