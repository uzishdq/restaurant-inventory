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
import { MoreHorizontal, Pencil } from "lucide-react";
import { TSupplier } from "@/lib/type-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { UpdateSupplierForm } from "../supplier/supplier-form";

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
  value: TSupplier;
};

function DialogEdit({ value }: TDialog) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="w-full">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Supplier</DialogTitle>
          <DialogDescription>
            Update supplier data, then click <strong>Update</strong> to confirm.
          </DialogDescription>
        </DialogHeader>
        <UpdateSupplierForm data={value} />
      </DialogContent>
    </Dialog>
  );
}
