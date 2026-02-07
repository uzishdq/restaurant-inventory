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
import { LABEL } from "@/lib/constant";
import { formatReportTransactionDates } from "@/lib/helper";
import { ReportTransactionSchema } from "@/lib/schema-validation";
import { getReportTransactions } from "@/lib/server/data/data-transaction";
import { TReportTransaction } from "@/lib/type-data";
import { formatDateToIndo } from "@/lib/utils";

interface IConfigDate {
  start: Date | string;
  end: Date | string;
}

const REPORT_CONFIG = {
  IN: {
    header: ({ start, end }: IConfigDate) =>
      `Laporan Pembelian Bahan Baku \nPeriode: ${formatDateToIndo(start)} - ${formatDateToIndo(end)}`,
    description:
      "Laporan rinci tentang semua barang yang diterima dari pemasok, termasuk kuantitas, tanggal, dan rincian barang untuk memastikan pembaruan inventaris yang akurat",
    columns: columnTransactionReportIN,
    excel: columnsExcelTransactionIn,
  },
  OUT: {
    header: ({ start, end }: IConfigDate) =>
      `Laporan Bahan Baku Keluar \nPeriode: ${formatDateToIndo(start)} - ${formatDateToIndo(end)}`,
    description:
      "Laporan lengkap tentang semua barang keluar, termasuk penggunaan, pemindahan, atau penjualan. Ini membantu melacak pengurangan stok dan menjaga tingkat inventaris yang akurat",
    columns: columnTransactionReportOUT,
    excel: columnsExcelTransactionOUT,
  },
  CHECK: {
    header: ({ start, end }: IConfigDate) =>
      `Laporan Pengecekan Bahan Baku \nPeriode: ${formatDateToIndo(start)} - ${formatDateToIndo(end)}`,
    description:
      "Laporan perbandingan antara jumlah sistem dan hitungan fisik. Berguna untuk mendeteksi ketidaksesuaian dan memvalidasi keakuratan inventaris",
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
  const startDateParams = value.startDate ?? "";
  const endDateParams = value.endDate ?? "";

  const validate = ReportTransactionSchema.safeParse({
    type: typeParams,
    startDate: startDateParams,
    endDate: endDateParams,
  });

  let reportTransaction: TReportTransaction[] | null = null;
  let reportTransactionExcell: TReportTransaction[] | null = null;
  let messageReport: string | undefined;
  let statusReportTransaction = false;

  let config;
  let header: string = "";

  if (validate.success) {
    const { type, startDate, endDate } = validate.data;

    config = REPORT_CONFIG[type];

    header = config.header({ start: startDate, end: endDate });

    const response = await getReportTransactions(validate.data);

    statusReportTransaction = response.ok;
    messageReport = response.message;
    reportTransaction = response.ok ? response.data : null;
    reportTransactionExcell = response.ok
      ? formatReportTransactionDates(response.data)
      : null;
  }

  return (
    <div className="space-y-4">
      {typeParams === "" ||
        (!validate.success && (
          <FormStatus status={false} message={LABEL.ERROR.INVALID_FIELD} />
        ))}
      <ReportTransactionForm />
      {config && reportTransaction && reportTransactionExcell ? (
        <TableDateWrapper
          header={header}
          description={config.description}
          searchBy="nameItem"
          labelSearch="Name Item"
          isFilterDate={true}
          filterDate="dateTransaction"
          data={reportTransaction}
          columns={config.columns}
        >
          <ExportExcell
            data={reportTransactionExcell}
            columns={config.excel}
            title={header}
            fileName={header}
            buttonLabel="Download"
          />
        </TableDateWrapper>
      ) : (
        <FormStatus status={statusReportTransaction} message={messageReport} />
      )}
    </div>
  );
}
