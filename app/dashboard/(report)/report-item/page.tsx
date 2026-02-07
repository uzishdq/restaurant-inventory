import FormStatus from "@/components/auth/form-status";
import { columnItemReport } from "@/components/columns/column-item";
import ExportExcell from "@/components/export/export-excell";
import ReportItemForm from "@/components/report/report-item-form";
import TableDateWrapper from "@/components/table/table-wrapper";
import { columnsExcelStockReport } from "@/lib/colomns-excell";
import { LABEL } from "@/lib/constant";
import { ReportItemSchema } from "@/lib/schema-validation";
import { getStockReport } from "@/lib/server/data/data-item";
import { TStockReportItem } from "@/lib/type-data";
import { formatDateToIndo } from "@/lib/utils";
import React from "react";

export default async function ReportItemPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const value = await searchParams;

  const startDateParams = value.startDate ?? "";
  const endDateParams = value.endDate ?? "";

  const validate = ReportItemSchema.safeParse({
    startDate: startDateParams,
    endDate: endDateParams,
  });

  let reportItem: TStockReportItem[] | null = null;
  let messageReport: string | undefined;
  let statusReportItem = false;

  let header: string = "";

  if (validate.success) {
    const { startDate, endDate } = validate.data;

    header = `Laporan Bahan Baku \nPeriode: ${formatDateToIndo(startDate)} - ${formatDateToIndo(endDate)}`;

    const response = await getStockReport(validate.data);

    statusReportItem = response.ok;
    messageReport = response.message;
    reportItem = response.ok ? response.data : null;
  }

  return (
    <div className="space-y-4">
      {startDateParams === "" ||
        (!validate.success && (
          <FormStatus status={false} message={LABEL.ERROR.INVALID_FIELD} />
        ))}
      <ReportItemForm />
      {reportItem ? (
        <TableDateWrapper
          header={header}
          description="Ringkasan kondisi stok, pergerakan masuk–keluar, serta status ketersediaan bahan baku dalam periode tertentu"
          searchBy="nameItem"
          labelSearch="Name Item"
          isFilterDate={true}
          filterDate="dateTransaction"
          data={reportItem}
          columns={columnItemReport}
        >
          {" "}
          <ExportExcell
            data={reportItem}
            columns={columnsExcelStockReport}
            title={header}
            fileName={header}
            buttonLabel="Download"
          />
        </TableDateWrapper>
      ) : (
        <FormStatus status={statusReportItem} message={messageReport} />
      )}
    </div>
  );
}
