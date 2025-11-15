import { columnTransaction } from "@/components/columns/column-transaction";
import TableDateWrapper from "@/components/table/table-wrapper";
import RenderError from "@/components/ui/render-error";
import { LABEL } from "@/lib/constant";
import { getTransactions } from "@/lib/server/data/data-transaction";
import React from "react";

export default async function InventoryCheckPage() {
  const [transactions] = await Promise.all([getTransactions("CHECK")]);

  if (!transactions.ok || !transactions.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }
  return (
    <div className="space-y-4">
      {/* <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
      </div> */}
      <TableDateWrapper
        header="Inventory Check"
        description="Review and verify actual ingredient quantities against system records"
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
