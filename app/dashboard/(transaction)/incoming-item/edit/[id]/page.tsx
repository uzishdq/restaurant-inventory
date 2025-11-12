import { columnDetailTransaction } from "@/components/columns/column-transaction";
import TableDateWrapper from "@/components/table/table-wrapper";
import RenderError from "@/components/ui/render-error";
import { auth } from "@/lib/auth";
import { LABEL } from "@/lib/constant";
import { isTransactionId } from "@/lib/helper";
import { getDetailTransactions } from "@/lib/server/data/data-transaction";
import React from "react";

export default async function EditStockInpage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!isTransactionId(id)) {
    return RenderError(LABEL.ERROR[404]);
  }

  const session = await auth();
  const idUser = session?.user.id;
  const role = session?.user.role;

  if (!idUser || !role) {
    return RenderError(LABEL.ERROR.NOT_LOGIN);
  }

  const [details] = await Promise.all([getDetailTransactions(id)]);

  if (!details.ok || !details.data) {
    return RenderError(LABEL.ERROR.DESCRIPTION);
  }

  return (
    <div className=" space-y-4">
      <TableDateWrapper
        header={`Detail Transaction ${id}`}
        description="A collection of item categories used to organize products by type, such as vegetables, meat, or spices"
        searchBy="nameItem"
        labelSearch="name"
        isFilterDate={false}
        filterDate=""
        data={details.data}
        columns={columnDetailTransaction}
      ></TableDateWrapper>
    </div>
  );
}
