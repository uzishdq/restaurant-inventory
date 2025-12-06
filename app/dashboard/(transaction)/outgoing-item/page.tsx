import { columnTransaction } from "@/components/columns/column-transaction";
import SectionCard from "@/components/section/section-card";
import TableDateWrapper from "@/components/table/table-wrapper";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getTransactions } from "@/lib/server/data/data-transaction";
import { TTransaction } from "@/lib/type-data";
import { Clock, CheckCircle } from "lucide-react";

export default async function StockOutPage() {
  const [transactions] = await Promise.all([getTransactions("OUT")]);

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
      }
    ) || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <SectionCard
          title="Bahan Baku Keluar Pending"
          value={pendingTransaction.length}
          Icon={Clock}
        />
        <SectionCard
          title="Bahan Baku Keluar Selesai"
          value={completedTransaction.length}
          Icon={CheckCircle}
        />
      </div>
      <TableDateWrapper
        header="Bahan Baku Keluar"
        description="Pencatatan bahan baku yang digunakan untuk keperluan dapur"
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
