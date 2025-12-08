"use client";

import { TReportTransaction } from "@/lib/type-data";
import { ColumnDef } from "@tanstack/react-table";
import { BadgeCustom } from "./badge-custom";
import { formatDateToIndo } from "@/lib/utils";

export const columnTransactionReportIN: ColumnDef<TReportTransaction>[] = [
  {
    accessorKey: "idTransaction",
    header: "No Transaksi",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("idTransaction")}</div>
    ),
  },
  {
    accessorKey: "nameUser",
    header: "Dibuat Oleh",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameUser")}</div>
    ),
  },
  {
    accessorKey: "dateTransaction",
    header: "Tanggal",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {formatDateToIndo(row.getValue("dateTransaction"))}
      </div>
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
    accessorKey: "nameItem",
    header: "Bahan Baku",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameItem")}</div>
    ),
  },
  {
    accessorKey: "nameUnit",
    header: "Unit",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameUnit")}</div>
    ),
  },
  {
    accessorKey: "quantityDetailTransaction",
    header: "Jumlah Dipesan",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("quantityDetailTransaction")}
      </div>
    ),
  },
  {
    accessorKey: "quantityCheck",
    header: "Jumlah Baik",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("quantityCheck")}</div>
    ),
  },
  {
    accessorKey: "quantityDifference",
    header: "Jumlah Rusak",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("quantityDifference")}</div>
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
    accessorKey: "note",
    header: "Note",
    enableHiding: false,
    cell: ({ row }) => <div className="capitalize">{row.getValue("note")}</div>,
  },
];

export const columnTransactionReportOUT: ColumnDef<TReportTransaction>[] = [
  {
    accessorKey: "idTransaction",
    header: "No Transaksi",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("idTransaction")}</div>
    ),
  },
  {
    accessorKey: "nameUser",
    header: "Dibuat Oleh",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameUser")}</div>
    ),
  },
  {
    accessorKey: "dateTransaction",
    header: "Tanggal",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {formatDateToIndo(row.getValue("dateTransaction"))}
      </div>
    ),
  },
  {
    accessorKey: "nameItem",
    header: "Bahan Baku",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameItem")}</div>
    ),
  },
  {
    accessorKey: "nameUnit",
    header: "Unit",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameUnit")}</div>
    ),
  },
  {
    accessorKey: "quantityDetailTransaction",
    header: "Qyt Keluar",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("quantityDetailTransaction")}
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
    accessorKey: "note",
    header: "Note",
    enableHiding: false,
    cell: ({ row }) => <div className="capitalize">{row.getValue("note")}</div>,
  },
];

export const columnTransactionReportCHECK: ColumnDef<TReportTransaction>[] = [
  {
    accessorKey: "idTransaction",
    header: "No Transaksi",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("idTransaction")}</div>
    ),
  },
  {
    accessorKey: "nameUser",
    header: "Dibuat Oleh",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameUser")}</div>
    ),
  },
  {
    accessorKey: "dateTransaction",
    header: "Tanggal",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {formatDateToIndo(row.getValue("dateTransaction"))}
      </div>
    ),
  },
  {
    accessorKey: "nameItem",
    header: "Bahan Baku",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameItem")}</div>
    ),
  },
  {
    accessorKey: "nameUnit",
    header: "Unit",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("nameUnit")}</div>
    ),
  },
  {
    accessorKey: "quantityDetailTransaction",
    header: "Qyt Sistem",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("quantityDetailTransaction")}
      </div>
    ),
  },
  {
    accessorKey: "quantityCheck",
    header: "Qyt Fisik",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("quantityCheck")}</div>
    ),
  },
  {
    accessorKey: "quantityDifference",
    header: "Selisih",
    enableHiding: false,
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("quantityDifference")}</div>
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
    accessorKey: "note",
    header: "Note",
    enableHiding: false,
    cell: ({ row }) => <div className="capitalize">{row.getValue("note")}</div>,
  },
];
