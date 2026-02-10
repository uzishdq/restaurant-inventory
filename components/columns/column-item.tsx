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
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  columnProps,
  TCategory,
  TItem,
  TItemMovement,
  TStockReportItem,
  TUnit,
} from "@/lib/type-data";
import { DeleteItemForm, UpdateItemForm } from "../item/item-form";
import { formatDateWIB } from "@/lib/utils";
import FormDialog from "../ui/form-dialog";
import { BadgeCustom } from "./badge-custom";

export const columnItem = ({
  unit,
  category,
}: columnProps): ColumnDef<TItem>[] => [
  {
    accessorKey: "idItem",
    header: "No Bahan Baku",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("idItem")}</div>
    ),
  },
  {
    accessorKey: "nameItem",
    header: "Nama",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameItem")}</div>
    ),
  },
  {
    accessorKey: "nameCategory",
    header: "Kategori",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameCategory")}</div>
    ),
  },
  {
    accessorKey: "stockQuantity",
    header: "Tersedia",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.stockQuantity} / {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "minStock",
    header: "Minimal Persediaan",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("minStock")}</div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Pembaruan Terakhir",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {formatDateWIB(row.getValue("updatedAt"))}
      </div>
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
              <DialogEdit value={dataRows} unit={unit} category={category} />
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

export const columnItemMovement: ColumnDef<TItemMovement>[] = [
  {
    accessorKey: "transactionId",
    header: "No Transaksi",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("transactionId")}</div>
    ),
  },
  {
    accessorKey: "typeMovement",
    header: "Jenis",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("typeMovement")}
        category="typeTransaction"
      />
    ),
  },
  {
    accessorKey: "itemId",
    header: "No Bahan Baku",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("itemId")}</div>
    ),
  },
  {
    accessorKey: "nameItem",
    header: "Nama",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameItem")}</div>
    ),
  },
  {
    accessorKey: "nameCategory",
    header: "Kategori",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameCategory")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    enableHiding: false,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Tanggal
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const formattedDate = formatDateWIB(row.getValue("createdAt"));
      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "stockQuantity",
    header: "Jumlah",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.quantityMovement} / {row.original.nameUnit}
      </div>
    ),
  },
];

type TDialog = {
  value: TItem;
  unit: TUnit[];
  category: TCategory[];
};

function DialogEdit({ value, unit, category }: Readonly<TDialog>) {
  return (
    <FormDialog
      type="edit"
      title="Edit Bahan Baku"
      description="Update bahan baku, lalu klik Update untuk mengonfirmasi."
    >
      <UpdateItemForm data={value} units={unit} categorys={category} />
    </FormDialog>
  );
}

function DialogDelete({ value }: Readonly<{ value: TItem }>) {
  return (
    <FormDialog
      type="delete"
      title="Delete Item"
      description="Are you sure you want to Delete this item? This action cannot be undone."
    >
      <DeleteItemForm data={value} />
    </FormDialog>
  );
}

export const columnItemReport: ColumnDef<TStockReportItem>[] = [
  {
    accessorKey: "idItem",
    header: "No Bahan Baku",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("idItem")}</div>
    ),
  },
  {
    accessorKey: "nameItem",
    header: "Nama",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameItem")}</div>
    ),
  },
  {
    accessorKey: "nameCategory",
    header: "Kategori",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameCategory")}</div>
    ),
  },
  {
    accessorKey: "currentStock",
    header: "Stok Saat Ini",
    enableHiding: false,
    cell: ({ row }) => (
      <div>
        {row.getValue("currentStock")} {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "minStock",
    header: "Stok Minimum",
    cell: ({ row }) => (
      <div>
        {row.getValue("minStock")} {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "totalIn",
    header: "Total Masuk",
    cell: ({ row }) => (
      <div>
        {row.getValue("totalIn")} {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "totalOut",
    header: "Total Keluar",
    cell: ({ row }) => (
      <div>
        {row.getValue("totalOut")} {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "netMovement",
    header: "Pergerakan Bersih",
    cell: ({ row }) => <div>{row.getValue("netMovement")}</div>,
  },
  {
    accessorKey: "stockAtPeriodStart",
    header: "Stok Awal",
    cell: ({ row }) => (
      <div>
        {row.getValue("stockAtPeriodStart")} {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "stockAtPeriodEnd",
    header: "Stok Akhir",
    cell: ({ row }) => (
      <div>
        {row.getValue("stockAtPeriodEnd")} {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "stockStatus",
    header: "Status Stok",
    cell: ({ row }) => (
      <BadgeCustom value={row.getValue("stockStatus")} category="stockStatus" />
    ),
  },
  {
    accessorKey: "utilizationRate",
    header: "Utilisasi (%)",
    cell: ({ row }) => <div>{row.getValue("utilizationRate")}</div>,
  },
  {
    accessorKey: "totalTransactions",
    header: "Total Transaksi",
    cell: ({ row }) => <div>{row.getValue("totalTransactions")}</div>,
  },
];
