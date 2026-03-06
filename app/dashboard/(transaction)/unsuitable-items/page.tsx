import { columnTransaction } from "@/components/columns/column-transaction";
import SectionCard from "@/components/section/section-card";
import TableDateWrapper from "@/components/table/table-wrapper";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getTransactions } from "@/lib/server/data/data-transaction";
import { TTransaction } from "@/lib/type-data";
import { ArrowDownCircle, ArrowUpCircle, ClipboardCheck } from "lucide-react";
import React from "react";

export default async function UnsuitableItemsPage() {
  const [transactions] = await Promise.all([
    getTransactions(undefined, "Tidak sesuai"),
  ]);

  if (!transactions.ok || !transactions.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  const { transactionIN, transactionCheck, transactionOut } =
    transactions.data?.reduce(
      (acc, item) => {
        if (item.typeTransaction === "IN") {
          acc.transactionIN.push(item);
        } else if (item.typeTransaction === "CHECK") {
          acc.transactionCheck.push(item);
        } else if (item.typeTransaction === "OUT") {
          acc.transactionOut.push(item);
        }
        return acc;
      },
      {
        transactionIN: [] as TTransaction[],
        transactionCheck: [] as TTransaction[],
        transactionOut: [] as TTransaction[],
      },
    ) || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
        <SectionCard
          title="Transaksi Masuk Tidak Sesuai"
          value={transactionIN.length}
          Icon={ArrowDownCircle}
        />

        <SectionCard
          title="Transaksi Keluar Tidak Sesuai"
          value={transactionOut.length}
          Icon={ArrowUpCircle}
        />

        <SectionCard
          title="Hasil Pengecekan Tidak Sesuai"
          value={transactionCheck.length}
          Icon={ClipboardCheck}
        />
      </div>
      {/* TABLE IN */}
      <TableDateWrapper
        header="Bahan Baku Masuk (Tidak Sesuai)"
        description="Daftar bahan baku masuk yang tercatat tidak sesuai dengan kondisi atau jumlah yang seharusnya"
        searchBy="nameUser"
        labelSearch="Nama"
        isFilterDate
        filterDate="dateTransaction"
        data={transactionIN}
        columns={columnTransaction}
      />

      {/* TABLE OUT */}
      <TableDateWrapper
        header="Bahan Baku Keluar (Tidak Sesuai)"
        description="Riwayat bahan baku yang keluar namun memiliki ketidaksesuaian pada pencatatan atau proses"
        searchBy="nameUser"
        labelSearch="Nama"
        isFilterDate
        filterDate="dateTransaction"
        data={transactionOut}
        columns={columnTransaction}
      />

      {/* TABLE CHECK */}
      <TableDateWrapper
        header="Stok Opname (Tidak Sesuai)"
        description="Hasil pemeriksaan stok yang menunjukkan perbedaan antara data sistem dan kondisi fisik"
        searchBy="nameUser"
        labelSearch="Nama"
        isFilterDate
        filterDate="dateTransaction"
        data={transactionCheck}
        columns={columnTransaction}
      />
    </div>
  );
}
