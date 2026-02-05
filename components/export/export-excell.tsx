"use client";

import { saveAs } from "file-saver";
import ExcelJS from "exceljs";
import { Button } from "../ui/button";
import { FileDown } from "lucide-react";
import { toast } from "sonner";
import { formatDateToIndo } from "@/lib/utils";
import { TColumnExcell } from "@/lib/type-data";

type IExportExcell<T> = {
  data: T[];
  columns: TColumnExcell[];
  fileName: string;
  title: string;
  buttonLabel?: string;
};

export default function ExportExcell<T>({
  data,
  columns,
  fileName,
  title,
  buttonLabel = "Download",
}: Readonly<IExportExcell<T>>) {
  const exportToExcel = async () => {
    if (data.length === 0) {
      toast.error(
        `The file ${fileName} could not be downloaded because the data was not available.`,
      );

      return;
    }

    const dateNow = formatDateToIndo(new Date());
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Sheet 1");

    // Merge & Title
    worksheet.mergeCells(1, 1, 1, columns.length);
    const titleCell = worksheet.getCell(1, 1);
    titleCell.value = `${title} - ${dateNow}`;
    titleCell.font = { bold: true };
    titleCell.alignment = { horizontal: "center" };

    // Header
    const headerRow = worksheet.addRow(columns.map((col) => col.header));
    headerRow.font = { bold: true };
    headerRow.alignment = { horizontal: "center" };

    // Data
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    data.forEach((item) => {
      const rowValues = columns.map((col) => {
        // Akses properti nested dengan `eval`
        return eval(`item.${col.value}`);
      });
      worksheet.addRow(rowValues);
    });

    // Column width
    worksheet.columns = columns.map(() => ({
      width: 20,
    }));

    // Border & styling untuk seluruh data
    worksheet.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          bottom: { style: "thin" },
          left: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });
    saveAs(blob, `${fileName}-${dateNow}.xlsx`);
    toast.success(`File ${fileName} was downloaded successfully.`);
  };
  return (
    <Button size="sm" className="ml-auto gap-1" onClick={exportToExcel}>
      <span className="hidden sm:inline md:inline">{buttonLabel}</span>
      <FileDown className="h-5 w-5" />
    </Button>
  );
}
