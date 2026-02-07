"use client";

import { toast } from "sonner";
import { useTransition } from "react";
import { revalidateData } from "@/lib/server/actions/action-helper";
import { DropdownMenuItem } from "../ui/dropdown-menu";
import { RefreshCw } from "lucide-react";
import { useNotiSideStore } from "@/store/notif-side-store";

export const RevalidateButton = () => {
  const [isPending, startTransition] = useTransition();
  const { fetchNotifications } = useNotiSideStore();

  const handleClick = () => {
    startTransition(async () => {
      fetchNotifications();
      const result = await revalidateData();

      if (result.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
    });
  };

  return (
    <DropdownMenuItem
      onClick={handleClick}
      className="cursor-pointer"
      disabled={isPending}
    >
      <RefreshCw />
      {isPending ? "Revalidate..." : "Revalidate Data"}
    </DropdownMenuItem>
  );
};
