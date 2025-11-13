"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { MoreHorizontal } from "lucide-react";
import { TUser } from "@/lib/type-data";
import { BadgeCustom } from "./badge-custom";
import { AccountRoleUpdate } from "../account/account-form";
import { formatDateToIndo } from "@/lib/utils";
import FormDialog from "../ui/form-dialog";

export const columnUsers: ColumnDef<TUser>[] = [
  {
    accessorKey: "username",
    header: "Username",
    enableHiding: false,
    cell: ({ row }) => <div>{row.getValue("username")}</div>,
  },
  {
    accessorKey: "nameUser",
    header: "Name",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameUser")}</div>
    ),
  },
  {
    accessorKey: "phoneNumber",
    header: "Phone Number",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("phoneNumber")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Added On",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {formatDateToIndo(row.getValue("createdAt"))}
      </div>
    ),
  },
  {
    accessorKey: "role",
    header: "Role",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom value={row.getValue("role")} category="role" />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const dataRows = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel className="text-center">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <DialogEdit value={dataRows} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: TUser;
};

function DialogEdit({ value }: TDialog) {
  return (
    <FormDialog
      type="edit"
      title="Edit Role User"
      description="Update the user’s role, then click Update to confirm."
    >
      <AccountRoleUpdate data={value} />
    </FormDialog>
  );
}
