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
import {
  columnProps,
  TCategory,
  TItem,
  TItemMovement,
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
    header: "No Item",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("idItem")}</div>
    ),
  },
  {
    accessorKey: "nameItem",
    header: "Name",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameItem")}</div>
    ),
  },
  {
    accessorKey: "nameCategory",
    header: "Category",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameCategory")}</div>
    ),
  },
  {
    accessorKey: "stockQuantity",
    header: "Stock",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.stockQuantity} / {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "minStock",
    header: "Min Stock",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("minStock")}</div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Last Update",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {formatDateWIB(row.getValue("updatedAt"))}
      </div>
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
    header: "No Transaction",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("transactionId")}</div>
    ),
  },
  {
    accessorKey: "typeMovement",
    header: "Status",
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
    header: "No Item",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("itemId")}</div>
    ),
  },
  {
    accessorKey: "nameItem",
    header: "Name",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameItem")}</div>
    ),
  },
  {
    accessorKey: "nameCategory",
    header: "Category",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameCategory")}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Date",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {formatDateWIB(row.getValue("createdAt"))}
      </div>
    ),
  },
  {
    accessorKey: "stockQuantity",
    header: "Stock",
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

function DialogEdit({ value, unit, category }: TDialog) {
  return (
    <FormDialog
      type="edit"
      title="Edit Item"
      description="Update the item name, then click Update to confirm."
    >
      <UpdateItemForm data={value} units={unit} categorys={category} />
    </FormDialog>
  );
}

function DialogDelete({ value }: { value: TItem }) {
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
