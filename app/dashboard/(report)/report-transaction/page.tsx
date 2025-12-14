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
import { ReportTransactionSchema } from "@/lib/schema-validation";
import { getReportTransactions } from "@/lib/server/data/data-transaction";
import { TReportTransaction } from "@/lib/type-data";

const REPORT_CONFIG = {
  IN: {
    header: "Laporan Pembelian Bahan Baku",
    description:
      "Laporan rinci tentang semua barang yang diterima dari pemasok, termasuk kuantitas, tanggal, dan rincian barang untuk memastikan pembaruan inventaris yang akurat",
    columns: columnTransactionReportIN,
    excel: columnsExcelTransactionIn,
  },
  OUT: {
    header: "Laporan Bahan Baku Keluar",
    description:
      "Laporan lengkap tentang semua barang keluar, termasuk penggunaan, pemindahan, atau penjualan. Ini membantu melacak pengurangan stok dan menjaga tingkat inventaris yang akurat",
    columns: columnTransactionReportOUT,
    excel: columnsExcelTransactionOUT,
  },
  CHECK: {
    header: "Laporan Pengecekan Bahan Baku",
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
  let messageReport: string | undefined;
  let statusReportTransaction = false;

  let config;

  if (validate.success) {
    const { type } = validate.data;

    config = REPORT_CONFIG[type];

    const response = await getReportTransactions(validate.data);

    statusReportTransaction = response.ok;
    messageReport = response.message;
    reportTransaction = response.ok ? response.data : null;
  }

  return (
    <div className="space-y-4">
      {typeParams === "" ||
        (!validate.success && (
          <FormStatus status={false} message={LABEL.ERROR.INVALID_FIELD} />
        ))}
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
