"use client";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

export function ButtonSignOut() {
  return (
    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer">
      <LogOut className="text-red-600" />
      Log out
    </DropdownMenuItem>
  );
}
