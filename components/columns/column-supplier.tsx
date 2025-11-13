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
import { TSupplier } from "@/lib/type-data";
import {
  DeleteSupplierForm,
  UpdateSupplierForm,
} from "../supplier/supplier-form";
import FormDialog from "../ui/form-dialog";

export const columnSupplier: ColumnDef<TSupplier>[] = [
  {
    accessorKey: "nameSupplier",
    header: "Name",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameSupplier")}</div>
    ),
  },
  {
    accessorKey: "store_name",
    header: "Store",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("store_name")}</div>
    ),
  },
  {
    accessorKey: "addressSupplier",
    header: "Address",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("addressSupplier")}</div>
    ),
  },
  {
    accessorKey: "phoneSupplier",
    header: "Phone",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("phoneSupplier")}</div>
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
  value: TSupplier;
};

function DialogEdit({ value }: TDialog) {
  return (
    <FormDialog
      type="edit"
      title="Edit Supplier"
      description="Update the supplier data, then click Update to confirm."
    >
      <UpdateSupplierForm data={value} />
    </FormDialog>
  );
}

function DialogDelete({ value }: TDialog) {
  return (
    <FormDialog
      type="delete"
      title="Delete Supplier"
      description="Are you sure you want to Delete this supplier? This action cannot be undone."
    >
      <DeleteSupplierForm data={value} />
    </FormDialog>
  );
}
