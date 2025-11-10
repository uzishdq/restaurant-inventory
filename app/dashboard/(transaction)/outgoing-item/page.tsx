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

  const { pendingTransaction, orderedTransaction, receiveTransaction } =
    transactions.data?.reduce(
      (acc, item) => {
        if (item.statusTransaction === "PENDING") {
          acc.pendingTransaction.push(item);
        } else if (item.statusTransaction === "ORDERED") {
          acc.orderedTransaction.push(item);
        } else if (item.statusTransaction === "RECEIVED") {
          acc.receiveTransaction.push(item);
        }
        return acc;
      },
      {
        pendingTransaction: [] as TTransaction[],
        orderedTransaction: [] as TTransaction[],
        receiveTransaction: [] as TTransaction[],
      }
    ) || {};

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
        <SectionCard
          title="Total Pending Outgoing Item"
          value={pendingTransaction.length}
          Icon={Clock}
        />
        <SectionCard
          title="Total Approved Outgoing Item"
          value={0}
          Icon={CheckCircle}
        />
      </div>
      <TableDateWrapper
        header="Outgoing Item"
        description="Record ingredients used during meal preparation to keep inventory levels updated"
        searchBy="nameUser"
        labelSearch="name"
        isFilterDate={true}
        filterDate="dateTransaction"
        data={transactions.data}
        columns={columnTransaction}
      ></TableDateWrapper>
    </div>
  );
}
