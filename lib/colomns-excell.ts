import { TColumnExcell } from "./type-data";

export const columnsExcelTransactionIn: TColumnExcell[] = [
  { header: "No Transaction", value: "idTransaction" },
  { header: "Created By", value: "nameUser" },
  { header: "Date", value: "dateTransaction" },
  { header: "Supplier", value: "store_name" },
  { header: "Item", value: "nameItem" },
  { header: "Unit", value: "nameUnit" },
  { header: "Ordered Qyt", value: "quantityDetailTransaction" },
  { header: "Good Qyt", value: "quantityCheck" },
  { header: "Damaged Qyt", value: "quantityDifference" },
  { header: "Note", value: "note" },
];

export const columnsExcelTransactionOUT: TColumnExcell[] = [
  { header: "No Transaction", value: "idTransaction" },
  { header: "Created By", value: "nameUser" },
  { header: "Date", value: "dateTransaction" },
  { header: "Item", value: "nameItem" },
  { header: "Unit", value: "nameUnit" },
  { header: "Qyt", value: "quantityDetailTransaction" },
  { header: "Note", value: "note" },
];

export const columnsExcelTransactionCHECK: TColumnExcell[] = [
  { header: "No Transaction", value: "idTransaction" },
  { header: "Created By", value: "nameUser" },
  { header: "Date", value: "dateTransaction" },
  { header: "Item", value: "nameItem" },
  { header: "Unit", value: "nameUnit" },
  { header: "Qyt System", value: "quantityDetailTransaction" },
  { header: "Qyt Check", value: "quantityCheck" },
  { header: "Difference", value: "quantityDifference" },
  { header: "Note", value: "note" },
];
