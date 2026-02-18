import {
  ChevronRight,
  Home,
  Loader2,
  PlusCircle,
  type LucideIcon,
} from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { ROUTES } from "@/lib/constant";
import { useNotiSideStore } from "@/store/notif-side-store";
import React from "react";
import { Badge } from "../ui/badge";

export function NavMain({
  items,
}: Readonly<{
  items: {
    title: string;
    url: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}>) {
  const { counts, fetchNotifications, isLoading } = useNotiSideStore();

  // Initial fetch on mount
  React.useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getNotificationCount = React.useCallback(
    (url: string): number => {
      if (url.includes(ROUTES.AUTH.TRANSACTION.INVENTORY_CHECK.INDEX))
        return counts.check;
      if (url.includes(ROUTES.AUTH.TRANSACTION.STOCK_IN.INDEX))
        return counts.in;
      if (url.includes(ROUTES.AUTH.TRANSACTION.STOCK_OUT.INDEX))
        return counts.out;
      return 0;
    },
    [counts],
  );

  const getTotalTransactionNotifications = React.useCallback(
    (menuTitle: string): number => {
      if (menuTitle === "Transaksi") {
        return counts.check + counts.in + counts.out;
      }
      return 0;
    },
    [counts],
  );

  return (
    <SidebarGroup className="space-y-2">
      <SidebarMenu>
        <SidebarMenuItem className="flex items-center gap-2">
          <SidebarMenuButton
            asChild
            tooltip="Create Transaction"
            className="bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear"
          >
            <Link href={ROUTES.AUTH.TRANSACTION.CREATE}>
              <PlusCircle />
              <span>Buat Transaksi</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton asChild>
            <Link href={ROUTES.AUTH.DASHBOARD}>
              <Home />
              <span>Beranda</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>

      {isLoading ? (
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <div className="text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                <span>Loading...</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      ) : (
        <SidebarMenu>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          {items.map((item) => {
            const totalNotifications = getTotalTransactionNotifications(
              item.title,
            );

            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title}>
                      {item.icon && <item.icon />}
                      <span>{item.title}</span>
                      {totalNotifications > 0 && (
                        <Badge
                          variant="destructive"
                          className="ml-2 h-5 min-w-5 px-1 text-xs"
                        >
                          {totalNotifications}
                        </Badge>
                      )}
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => {
                        const notifCount = getNotificationCount(subItem.url);

                        return (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <Link
                                href={subItem.url}
                                className="flex items-center justify-between w-full"
                              >
                                <span>{subItem.title}</span>
                                {notifCount > 0 && (
                                  <Badge
                                    variant="destructive"
                                    className="ml-auto h-5 min-w-5 px-1 text-xs"
                                    aria-label={`${notifCount} pending transactions`}
                                  >
                                    {notifCount}
                                  </Badge>
                                )}
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        );
                      })}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          })}
        </SidebarMenu>
      )}
    </SidebarGroup>
  );
}
