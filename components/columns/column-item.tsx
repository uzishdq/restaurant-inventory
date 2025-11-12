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
import { columnProps, TItem } from "@/lib/type-data";
import { DeleteItemForm, UpdateItemForm } from "../item/item-form";
import { formatDateWIB } from "@/lib/utils";

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
              <UpdateItemForm
                data={dataRows}
                units={unit}
                categorys={category}
              />
            </DropdownMenuItem>
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              <DeleteItemForm data={dataRows} />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
