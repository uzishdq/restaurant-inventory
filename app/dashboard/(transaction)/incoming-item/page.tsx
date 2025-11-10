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
          title="Total Pending Incoming Item"
          value={pendingTransaction.length}
          Icon={Clock}
        />
        <SectionCard
          title="Total Ordered Incoming Item"
          value={orderedTransaction.length}
          Icon={ShoppingCart}
        />
        <SectionCard
          title="Total Received Incoming Item"
          value={receiveTransaction.length}
          Icon={PackageCheck}
        />
        <SectionCard
          title="Total Approved Incoming Item"
          value={0}
          Icon={CheckCircle}
        />
      </div>
      <TableDateWrapper
        header="Incoming Item"
        description="Incoming ingredients or supplies received from vendors to keep your inventory accurate and up to date"
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
