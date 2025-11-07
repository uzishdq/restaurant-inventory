"use client";

import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";
import { ROUTES } from "@/lib/constant";
import {
  ArrowRightLeft,
  BookOpen,
  Database,
  Files,
  ShoppingBasket,
} from "lucide-react";
import { Session } from "next-auth";

export function AppSidebar({
  session,
  ...props
}: React.ComponentProps<typeof Sidebar> & { session: Session | null }) {
  const data = {
    user: {
      name: session?.user.name ?? "Guest",
      email: session?.user.email ?? "notLogin",
      avatar: "/avatars/shadcn.jpg",
    },
    navMain: [
      {
        title: "Master",
        url: "#",
        icon: Database,
        items: [
          {
            title: "Category",
            url: "#",
          },
          {
            title: "Unit",
            url: "#",
          },
          {
            title: "Items",
            url: "#",
          },
          {
            title: "User",
            url: ROUTES.AUTH.MASTER.USERS,
          },
          {
            title: "Supplier",
            url: "#",
          },
        ],
      },
      {
        title: "Transaction",
        url: "#",
        icon: ArrowRightLeft,
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: BookOpen,
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Reports",
        url: "#",
        icon: Files,
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <ShoppingBasket className="size-4" />
                <span className="text-base font-semibold">
                  Gang Nikmat Inventory
                </span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
