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
import Link from "next/link";

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
            title: "Kategori",
            url: ROUTES.AUTH.MASTER.CATEGORY,
          },
          {
            title: "Unit",
            url: ROUTES.AUTH.MASTER.UNIT,
          },
          {
            title: "Bahan Baku",
            url: ROUTES.AUTH.MASTER.ITEMS,
          },
          {
            title: "Pengguna",
            url: ROUTES.AUTH.MASTER.USERS,
          },
          {
            title: "Supplier",
            url: ROUTES.AUTH.MASTER.SUPPLIER,
          },
        ],
      },
      {
        title: "Transaksi",
        url: "#",
        icon: ArrowRightLeft,
        items: [
          {
            title: "Cek Bahan Baku",
            url: ROUTES.AUTH.TRANSACTION.INVENTORY_CHECK.INDEX,
          },
          {
            title: "Pengadaan Bahan Baku",
            url: ROUTES.AUTH.TRANSACTION.STOCK_IN.INDEX,
          },
          {
            title: "Bahan Baku Keluar",
            url: ROUTES.AUTH.TRANSACTION.STOCK_OUT.INDEX,
          },
          {
            title: "Pergerakan Bahan Baku",
            url: ROUTES.AUTH.TRANSACTION.MOVEMENT,
          },
        ],
      },
      {
        title: "Laporan",
        url: "#",
        icon: Files,
        items: [
          {
            title: "Transaksi",
            url: ROUTES.AUTH.REPORT.TRANSACTION,
          },
          {
            title: "Bahan Baku",
            url: ROUTES.AUTH.REPORT.ITEM,
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
              <Link href="#">
                <ShoppingBasket className="size-4" />
                <span className="text-base font-semibold">
                  Gang Nikmat Inventory
                </span>
              </Link>
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
