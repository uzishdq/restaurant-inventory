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
      }
    ) || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <SectionCard
          title="Pemesanan Pending"
          value={pendingTransaction.length}
          Icon={Clock}
        />
        <SectionCard
          title="Pemesanan Diproses / Dipesan"
          value={orderedTransaction.length}
          Icon={ShoppingCart}
        />
        <SectionCard
          title="Pemesanan Diterima"
          value={receiveTransaction.length}
          Icon={PackageCheck}
        />
        <SectionCard
          title="Pemesanan Selesai"
          value={completedTransaction.length}
          Icon={CheckCircle}
        />
      </div>
      <TableDateWrapper
        header="Pemesanan Bahan Baku"
        description="Informasi pesanan bahan baku yang digunakan untuk memperbarui persediaan"
        searchBy="nameUser"
        labelSearch="Nama"
        isFilterDate={true}
        filterDate="dateTransaction"
        data={transactions.data}
        columns={columnTransaction}
      ></TableDateWrapper>
    </div>
  );
}
