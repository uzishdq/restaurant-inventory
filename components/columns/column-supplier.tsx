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
    header: "Nama",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameSupplier")}</div>
    ),
  },
  {
    accessorKey: "store_name",
    header: "Toko",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("store_name")}</div>
    ),
  },
  {
    accessorKey: "addressSupplier",
    header: "Alamat",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("addressSupplier")}</div>
    ),
  },
  {
    accessorKey: "phoneSupplier",
    header: "No.Telp",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("phoneSupplier")}</div>
    ),
  },
  {
    id: "actions",
    header: "Opsi",
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
            <DropdownMenuLabel className="text-center">Opsi</DropdownMenuLabel>
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
      description="Update data supplier, lalu klik Update untuk mengonfirmasi."
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
      description="Apakah Anda yakin ingin menghapus pemasok ini? Tindakan ini tidak bisa dibatalkan."
    >
      <DeleteSupplierForm data={value} />
    </FormDialog>
  );
}
