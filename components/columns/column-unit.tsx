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
import { TUnit } from "@/lib/type-data";
import { DeleteUnitForm, UpdateUnitForm } from "../unit/unit-form";
import FormDialog from "../ui/form-dialog";

export const columnUnit: ColumnDef<TUnit>[] = [
  {
    accessorKey: "nameUnit",
    header: "Name",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameUnit")}</div>
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
          <DropdownMenuContent align="end" className="space-y-1">
            <DropdownMenuLabel className="text-center">
              Actions
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <DialogEdit value={dataRows} />
            </DropdownMenuItem>
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <DialogDelete value={dataRows} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: TUnit;
};

function DialogEdit({ value }: TDialog) {
  return (
    <FormDialog
      type="edit"
      title="Edit Unit"
      description="Update the unit name, then click Uppdate to confirm."
    >
      <UpdateUnitForm data={value} />
    </FormDialog>
  );
}

function DialogDelete({ value }: TDialog) {
  return (
    <FormDialog
      type="delete"
      title="Delete Unit"
      description="Are you sure you want to Delete this unit? This action cannot be undone."
    >
      <DeleteUnitForm data={value} />
    </FormDialog>
  );
}
