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
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { TUnit } from "@/lib/type-data";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DeleteUnitForm, UpdateUnitForm } from "../unit/unit-form";

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
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost" className="w-full">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Unit</DialogTitle>
          <DialogDescription>
            Update the unit name, then click <strong>Update</strong> to confirm.
          </DialogDescription>
        </DialogHeader>
        <UpdateUnitForm data={value} />
      </DialogContent>
    </Dialog>
  );
}

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
          <DialogTitle>Delete Unit</DialogTitle>
          <DialogDescription>
            Are you sure you want to <strong>Delete</strong> this unit? This
            action cannot be undone
          </DialogDescription>
        </DialogHeader>
        <DeleteUnitForm data={value} />
      </DialogContent>
    </Dialog>
  );
}
