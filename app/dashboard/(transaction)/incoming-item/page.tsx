import { columnTransaction } from "@/components/columns/column-transaction";
import SectionCard from "@/components/section/section-card";
import TableDateWrapper from "@/components/table/table-wrapper";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getTransactions } from "@/lib/server/data/data-transaction";
import { TTransaction } from "@/lib/type-data";
import { Clock, ShoppingCart, PackageCheck, CheckCircle } from "lucide-react";

export default async function StockInPage() {
  const [transactions] = await Promise.all([getTransactions("IN")]);

  if (!transactions.ok || !transactions.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  const {
    pendingTransaction,
    orderedTransaction,
    receiveTransaction,
    completedTransaction,
  } =
    transactions.data?.reduce(
      (acc, item) => {
        if (item.statusTransaction === "PENDING") {
          acc.pendingTransaction.push(item);
        } else if (item.statusTransaction === "ORDERED") {
          acc.orderedTransaction.push(item);
        } else if (item.statusTransaction === "RECEIVED") {
          acc.receiveTransaction.push(item);
        } else if (item.statusTransaction === "COMPLETED") {
          acc.completedTransaction.push(item);
        }
        return acc;
      },
      {
        pendingTransaction: [] as TTransaction[],
        orderedTransaction: [] as TTransaction[],
        receiveTransaction: [] as TTransaction[],
        completedTransaction: [] as TTransaction[],
      },
    ) || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <SectionCard
          title="Pengadaan Pending"
          value={pendingTransaction.length}
          Icon={Clock}
        />
        <SectionCard
          title="Pengadaan Diproses / Dipesan"
          value={orderedTransaction.length}
          Icon={ShoppingCart}
        />
        <SectionCard
          title="Pengadaan Diterima"
          value={receiveTransaction.length}
          Icon={PackageCheck}
        />
        <SectionCard
          title="Pengadaan Selesai"
          value={completedTransaction.length}
          Icon={CheckCircle}
        />
      </div>
      <TableDateWrapper
        header="Pengadaan Bahan Baku (Pending)"
        description="Pengajuan pengadaan bahan baku yang belum diproses atau menunggu persetujuan"
        searchBy="nameUser"
        labelSearch="Nama"
        isFilterDate
        filterDate="dateTransaction"
        data={pendingTransaction}
        columns={columnTransaction}
      />

      <TableDateWrapper
        header="Pengadaan Bahan Baku (Ordered)"
        description="Pengadaan bahan baku yang sudah dipesan ke supplier dan menunggu pengiriman"
        searchBy="nameUser"
        labelSearch="Nama"
        isFilterDate
        filterDate="dateTransaction"
        data={orderedTransaction}
        columns={columnTransaction}
      />

      <TableDateWrapper
        header="Pengadaan Bahan Baku (Receive)"
        description="Pengadaan bahan baku yang telah diterima dan sedang dalam proses pengecekan"
        searchBy="nameUser"
        labelSearch="Nama"
        isFilterDate
        filterDate="dateTransaction"
        data={receiveTransaction}
        columns={columnTransaction}
      />

      <TableDateWrapper
        header="Pengadaan Bahan Baku (Completed)"
        description="Riwayat pengadaan bahan baku yang telah selesai dan stok sudah diperbarui"
        searchBy="nameUser"
        labelSearch="Nama"
        isFilterDate
        filterDate="dateTransaction"
        data={completedTransaction}
        columns={columnTransaction}
      />
    </div>
  );
}
