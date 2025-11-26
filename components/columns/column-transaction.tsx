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
import { List, MoreHorizontal } from "lucide-react";
import {
  columnTrxProps,
  TDetailTransaction,
  TItemTrx,
  TSupplierTrx,
  TTransaction,
} from "@/lib/type-data";
import { BadgeCustom } from "./badge-custom";
import { formatDateToIndo } from "@/lib/utils";
import Link from "next/link";
import { ROUTES } from "@/lib/constant";
import {
  DeleteDetailTransactionForm,
  DeleteTransactionForm,
  UpdateDetailTransactionForm,
  UpdateStatusDetailTransactionForm,
  UpdateTransactionForm,
} from "../transaction/transaction-form";
import FormDialog from "../ui/form-dialog";

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
            {dataRows.statusTransaction !== "COMPLETED" && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                  <DialogEdit value={dataRows} />
                </DropdownMenuItem>
              </>
            )}
            {isPending && (
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <DialogDelete value={dataRows} />
              </DropdownMenuItem>
            )}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button asChild size="icon" variant="ghost" className="w-full">
                <Link
                  href={
                    dataRows.typeTransaction === "IN"
                      ? ROUTES.AUTH.TRANSACTION.STOCK_IN.DETAIL(
                          dataRows.idTransaction
                        )
                      : dataRows.typeTransaction === "OUT"
                      ? ROUTES.AUTH.TRANSACTION.STOCK_OUT.DETAIL(
                          dataRows.idTransaction
                        )
                      : ROUTES.AUTH.TRANSACTION.INVENTORY_CHECK.DETAIL(
                          dataRows.idTransaction
                        )
                  }
                >
                  <List className="mr-2 h-4 w-4" />
                  Detail Items
                </Link>
              </Button>
            </DropdownMenuItem>
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
    <FormDialog
      type="delete"
      title="Delete Transaction"
      description="Are you sure you want to Delete this transaction? This action cannot be undone"
    >
      <DeleteTransactionForm data={value} />
    </FormDialog>
  );
}

function DialogEdit({ value }: TDialog) {
  const description =
    value.typeTransaction === "IN"
      ? "Before updating the status of this incoming transaction, please ensure all item details—including quantities and received items—have been fully reviewed and verified."
      : value.typeTransaction === "OUT"
      ? "Before updating the status of this outgoing transaction, make sure all requested items and quantities have been thoroughly checked and confirmed."
      : "Before applying a status update, verify that all physical counts and item details have been carefully reviewed to ensure accurate audit results.";

  return (
    <FormDialog
      type="edit_status"
      title="Update Status Transaction"
      description={description}
    >
      <UpdateTransactionForm data={value} />
    </FormDialog>
  );
}

export const columnDetailTransactionIn = ({
  items,
  suppliers,
}: columnTrxProps): ColumnDef<TDetailTransaction>[] => [
  {
    accessorKey: "nameItem",
    header: "Item",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameItem")}</div>
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
    accessorKey: "quantityDetailTransaction",
    header: "Qyt",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.quantityDetailTransaction} / {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "quantityCheck",
    header: "Good Qyt",
    enableHiding: true,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.quantityCheck} / {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "quantityDifference",
    header: "Damaged Qyt",
    enableHiding: true,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.quantityDifference} / {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "statusDetailTransaction",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusDetailTransaction")}
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
              <DetailDialogEdit
                value={dataRows}
                items={items}
                suppliers={suppliers}
              />
            </DropdownMenuItem>
            {dataRows.statusDetailTransaction === "ORDERED" && (
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <DetailDialogStatus value={dataRows} />
              </DropdownMenuItem>
            )}
            {dataRows.statusDetailTransaction === "PENDING" && (
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <DetailDialogDelete value={dataRows} />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const columnDetailTransactionOut = ({
  items,
  suppliers,
}: columnTrxProps): ColumnDef<TDetailTransaction>[] => [
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
        {row.original.quantityDetailTransaction} / {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "note",
    header: "Note",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("note") ?? "No additional info"}
      </div>
    ),
  },
  {
    accessorKey: "statusDetailTransaction",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusDetailTransaction")}
        category="statusDetailTransaction"
      />
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
              <DetailDialogEdit
                value={dataRows}
                items={items}
                suppliers={suppliers}
              />
            </DropdownMenuItem>
            {dataRows.statusDetailTransaction === "PENDING" && (
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <DetailDialogDelete value={dataRows} />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const columnDetailTransactionCheck = ({
  items,
  suppliers,
}: columnTrxProps): ColumnDef<TDetailTransaction>[] => [
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
    header: "System Qty",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.quantityDetailTransaction} / {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "quantityCheck",
    header: "Physical Qty",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.quantityCheck} / {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "quantityDifference",
    header: "Difference",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original.quantityDifference} / {row.original.nameUnit}
      </div>
    ),
  },
  {
    accessorKey: "statusDetailTransaction",
    header: "Status",
    enableHiding: false,
    cell: ({ row }) => (
      <BadgeCustom
        value={row.getValue("statusDetailTransaction")}
        category="statusDetailTransaction"
      />
    ),
  },
  {
    accessorKey: "note",
    header: "Note",
    enableHiding: true,
    cell: ({ row }) => <div className="capitalize">{row.getValue("note")}</div>,
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
              <DetailDialogEdit
                value={dataRows}
                items={items}
                suppliers={suppliers}
              />
            </DropdownMenuItem>
            {dataRows.statusDetailTransaction === "PENDING" && (
              <DropdownMenuItem asChild onSelect={(e) => e.preventDefault()}>
                <DetailDialogDelete value={dataRows} />
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

type TDetailDialog = {
  value: TDetailTransaction;
  items: TItemTrx[];
  suppliers: TSupplierTrx[];
};

function DetailDialogEdit({ value, items, suppliers }: TDetailDialog) {
  return (
    <FormDialog
      type="edit"
      title="Edit Detail Transaction"
      description="Update detail transaction, then click Update to confirm."
    >
      <UpdateDetailTransactionForm
        data={value}
        items={items}
        suppliers={suppliers}
      />
    </FormDialog>
  );
}

function DetailDialogDelete({ value }: { value: TDetailTransaction }) {
  return (
    <FormDialog
      type="delete"
      title="Delete Detail Transaction"
      description="Are you sure you want to Delete this item? This action cannot be undone"
    >
      <DeleteDetailTransactionForm data={value} />
    </FormDialog>
  );
}

function DetailDialogStatus({ value }: { value: TDetailTransaction }) {
  const description =
    value.typeTransaction === "IN"
      ? "Before updating the status of this incoming transaction, please ensure all item details—including quantities and received items—have been fully reviewed and verified."
      : value.typeTransaction === "OUT"
      ? "Before updating the status of this outgoing transaction, make sure all requested items and quantities have been thoroughly checked and confirmed."
      : "Before applying a status update, verify that all physical counts and item details have been carefully reviewed to ensure accurate audit results.";

  return (
    <FormDialog
      type="edit_status"
      title="Update Status Detail Transaction"
      description={description}
    >
      <UpdateStatusDetailTransactionForm data={value} />
    </FormDialog>
  );
}
