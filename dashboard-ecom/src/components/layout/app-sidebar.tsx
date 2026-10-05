"use client";

import * as React from "react";
import { LayoutDashboard, Package, ShoppingBag } from "lucide-react";
import { useState } from "react";

import { NavMain } from "@/components/layout/nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";
import { Loader2, LogOut } from "lucide-react";
import { logout } from "../../../mutations/auth/auth-mutations";
import ThemeToggle from "../theme/theme-toggle";

const data = {
  navMain: [
    {
      title: "Overview",
      url: "/dashboard/overview",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      url: "/dashboard/products",
      icon: Package,
    },
  ],
};

const shopName = process.env.NEXT_PUBLIC_SHOP_NAME || "Ecommerce";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);
    await logout();
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="px-4 py-1">
        <div className="flex items-center justify-center py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShoppingBag className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">
              {shopName}
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-center items-center mb-2">
          <ThemeToggle />
        </div>
        <Button onClick={handleLogout} disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Logging out...
            </>
          ) : (
            <>
              <LogOut className="mr-2" />
              Logout
            </>
          )}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}