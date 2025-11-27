import FormStatus from "@/components/auth/form-status";
import {
  columnTransactionReportCHECK,
  columnTransactionReportIN,
  columnTransactionReportOUT,
} from "@/components/columns/column-report";
import ExportExcell from "@/components/export/export-excell";
import ReportTransactionForm from "@/components/report/report-transaction-form";
import TableDateWrapper from "@/components/table/table-wrapper";
import {
  columnsExcelTransactionCHECK,
  columnsExcelTransactionIn,
  columnsExcelTransactionOUT,
} from "@/lib/colomns-excell";
import { ReportTransactionSchema } from "@/lib/schema-validation";
import { getReportTransactions } from "@/lib/server/data/data-transaction";
import { TReportTransaction } from "@/lib/type-data";
import React from "react";

const REPORT_CONFIG = {
  IN: {
    header: "Incoming Transactions Report",
    description:
      "A detailed report of all incoming items received from suppliers, including quantities, dates, and item details to ensure accurate inventory updates",
    columns: columnTransactionReportIN,
    excel: columnsExcelTransactionIn,
  },
  OUT: {
    header: "Outgoing Transactions Report",
    description:
      "A complete report of all outgoing items, including usage, transfers, or sales. This helps track stock reductions and maintain accurate inventory levels",
    columns: columnTransactionReportOUT,
    excel: columnsExcelTransactionOUT,
  },
  CHECK: {
    header: "Stock Check Report",
    description:
      "A comparative report between system quantities and physical counts. Useful for detecting discrepancies and validating inventory accuracy",
    columns: columnTransactionReportCHECK,
    excel: columnsExcelTransactionCHECK,
  },
} as const;

export default async function ReportTransactionPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const value = await searchParams;
  const typeParams = value.type ?? "";

  const validate = ReportTransactionSchema.safeParse({ type: typeParams });

  let reportTransaction: TReportTransaction[] | null = null;
  let messageReport: string | undefined;
  let statusReportTransaction = false;

  let config;

  if (validate.success) {
    const { type } = validate.data;

    config = REPORT_CONFIG[type];

    const response = await getReportTransactions(type);

    statusReportTransaction = response.ok;
    messageReport = response.message;
    reportTransaction = response.ok ? response.data : null;
  }

  return (
    <div className="space-y-4">
      <ReportTransactionForm />
      {config && reportTransaction ? (
        <TableDateWrapper
          header={config.header}
          description={config.description}
          searchBy="nameItem"
          labelSearch="Name Item"
          isFilterDate={true}
          filterDate="dateTransaction"
          data={reportTransaction}
          columns={config.columns}
        >
          <ExportExcell
            data={reportTransaction}
            columns={config.excel}
            title={config.header}
            fileName={config.header}
            buttonLabel="Download"
          />
        </TableDateWrapper>
      ) : (
        <FormStatus status={statusReportTransaction} message={messageReport} />
      )}
    </div>
  );
}
