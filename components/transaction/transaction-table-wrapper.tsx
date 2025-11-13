"use client";
import React, { useMemo } from "react";
import { columnDetailTransaction } from "../columns/column-transaction";
import { TDetailTransaction, TItemTrx, TSupplierTrx } from "@/lib/type-data";
import TableDateWrapper from "../table/table-wrapper";

interface ITransactionTableWrapper {
  data: TDetailTransaction[];
  items: TItemTrx[];
  suppliers: TSupplierTrx[];
}

export default function TransactionTableWrapper({
  data,
  items,
  suppliers,
}: ITransactionTableWrapper) {
  const columns = useMemo(
    () => columnDetailTransaction({ items: items, suppliers: suppliers }),
    [items, suppliers]
  );
  return (
    <TableDateWrapper
      header={`Detail Transaction ${data[0].idTransaction}`}
      description="Records detailed information about each received item"
      searchBy="nameItem"
      labelSearch="name"
      isFilterDate={false}
      filterDate=""
      data={data}
      columns={columns}
    />
  );
}
