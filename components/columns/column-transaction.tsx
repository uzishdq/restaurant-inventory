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
import { List, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { TDetailTransaction, TTransaction } from "@/lib/type-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { BadgeCustom } from "./badge-custom";
import { formatDateToIndo } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/lib/constant";
import { DeleteTransactionForm } from "../transaction/transaction-form";

export const columnTransaction: ColumnDef<TTransaction>[] = [
  {
    accessorKey: "idTransaction",
    header: "No Transaction",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("idTransaction")}</div>
    ),
  },
  {
    accessorKey: "nameUser",
    header: "Created By",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameUser")}</div>
    ),
  },
  {
    accessorKey: "typeTransaction",
    header: "Type",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("typeTransaction")}
        category="typeTransaction"
      />
    ),
  },
  {
    accessorKey: "dateTransaction",
    header: "Date",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {formatDateToIndo(row.getValue("dateTransaction"))}
      </div>
    ),
  },
  {
    accessorKey: "totalItems",
    header: "Total Items",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("totalItems")}</div>
    ),
  },
  {
    accessorKey: "statusTransaction",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusTransaction")}
        category="statusTransaction"
      />
    ),
  },
  {
    id: "actions",
    header: "Actions",
    enableHiding: false,
    cell: ({ row }) => {
      const dataRows = row.original;
      const isPending = dataRows.statusTransaction === "PENDING";
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
              <Button asChild size="icon" variant="ghost" className="w-full">
                <Link
                  href={ROUTES.AUTH.TRANSACTION.STOCK_IN.EDIT_IN(
                    dataRows.idTransaction
                  )}
                >
                  <List className="mr-2 h-4 w-4" />
                  Detail Transaction
                </Link>
              </Button>
            </DropdownMenuItem>
            {isPending && (
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <DialogDelete value={dataRows} />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDialog = {
  value: TTransaction;
};

function DialogDelete({ value }: TDialog) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="destructive" className="w-full">
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Transaction</DialogTitle>
          <DialogDescription>
            Are you sure you want to <strong>Delete</strong> this transaction?
            This action cannot be undone
          </DialogDescription>
        </DialogHeader>
        <DeleteTransactionForm data={value} />
      </DialogContent>
    </Dialog>
  );
}

export const columnDetailTransaction: ColumnDef<TDetailTransaction>[] = [
  {
    accessorKey: "nameItem",
    header: "Item",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameItem")}</div>
    ),
  },
  {
    accessorKey: "quantityDetailTransaction",
    header: "Qyt",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("quantityDetailTransaction")}
      </div>
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
              <Button asChild size="icon" variant="ghost" className="w-full">
                <Link
                  href={ROUTES.AUTH.TRANSACTION.STOCK_IN.EDIT_IN(
                    dataRows.idTransaction
                  )}
                >
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
              haii
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
