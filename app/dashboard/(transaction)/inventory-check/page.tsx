import { columnTransaction } from "@/components/columns/column-transaction";
import SectionCard from "@/components/section/section-card";
import TableDateWrapper from "@/components/table/table-wrapper";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getTransactions } from "@/lib/server/data/data-transaction";
import { TTransaction } from "@/lib/type-data";
import { CheckCircle, Clock } from "lucide-react";

export default async function InventoryCheckPage() {
  const [transactions] = await Promise.all([getTransactions("CHECK")]);

  if (!transactions.ok || !transactions.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  const { pendingTransaction, completedTransaction } =
    transactions.data?.reduce(
      (acc, item) => {
        if (item.statusTransaction === "PENDING") {
          acc.pendingTransaction.push(item);
        } else if (item.statusTransaction === "COMPLETED") {
          acc.completedTransaction.push(item);
        }
        return acc;
      },
      {
        pendingTransaction: [] as TTransaction[],
        completedTransaction: [] as TTransaction[],
      },
    ) || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <SectionCard
          title="Pemeriksaan Bahan Baku Pending"
          value={pendingTransaction.length}
          Icon={Clock}
        />
        <SectionCard
          title="Pemeriksaan Bahan Baku Selesai"
          value={completedTransaction.length}
          Icon={CheckCircle}
        />
      </div>
      <TableDateWrapper
        header="Pemeriksaan Bahan Baku (Pending)"
        description="Daftar pemeriksaan bahan baku yang belum selesai dan masih menunggu proses verifikasi"
        searchBy="nameUser"
        labelSearch="Nama"
        isFilterDate={true}
        filterDate="dateTransaction"
        data={pendingTransaction}
        columns={columnTransaction}
      />

      <TableDateWrapper
        header="Pemeriksaan Bahan Baku (Selesai)"
        description="Riwayat pemeriksaan bahan baku yang telah selesai dan diverifikasi"
        searchBy="nameUser"
        labelSearch="Nama"
        isFilterDate={true}
        filterDate="dateTransaction"
        data={completedTransaction}
        columns={columnTransaction}
      />
    </div>
  );
}
