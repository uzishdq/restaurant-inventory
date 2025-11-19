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
import { ArrowRightLeft, Database, Files, ShoppingBasket } from "lucide-react";
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
            url: ROUTES.AUTH.MASTER.CATEGORY,
          },
          {
            title: "Unit",
            url: ROUTES.AUTH.MASTER.UNIT,
          },
          {
            title: "Items",
            url: ROUTES.AUTH.MASTER.ITEMS,
          },
          {
            title: "User",
            url: ROUTES.AUTH.MASTER.USERS,
          },
          {
            title: "Supplier",
            url: ROUTES.AUTH.MASTER.SUPPLIER,
          },
        ],
      },
      {
        title: "Transaction",
        url: "#",
        icon: ArrowRightLeft,
        items: [
          {
            title: "Inventory Check",
            url: ROUTES.AUTH.TRANSACTION.INVENTORY_CHECK.INDEX,
          },
          {
            title: "Incoming Item",
            url: ROUTES.AUTH.TRANSACTION.STOCK_IN.INDEX,
          },
          {
            title: "Outgoing Item",
            url: ROUTES.AUTH.TRANSACTION.STOCK_OUT.INDEX,
          },
          {
            title: "Item Movement",
            url: ROUTES.AUTH.TRANSACTION.MOVEMENT,
          },
        ],
      },
      {
        title: "Reports",
        url: "#",
        icon: Files,
        items: [
          {
            title: "Transaction",
            url: ROUTES.AUTH.REPORT.TRANSACTION,
          },
          {
            title: "Item",
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
