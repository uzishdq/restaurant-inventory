"use client";
import React, { useMemo } from "react";
import {
  columnDetailTransactionCheck,
  columnDetailTransactionIn,
  columnDetailTransactionOut,
} from "../columns/column-transaction";
import { TDetailTransaction, TItemTrx, TSupplierTrx } from "@/lib/type-data";
import TableDateWrapper from "../table/table-wrapper";
import FormDialog from "../ui/form-dialog";
import { AddDetailTransactionForm } from "./transaction-form";

interface ITransactionTableWrapper {
  data: TDetailTransaction[];
  items: TItemTrx[];
  suppliers: TSupplierTrx[];
}

function TransactionCheckTableWrapper({
  data,
  items,
  suppliers,
}: ITransactionTableWrapper) {
  const columns = useMemo(
    () => columnDetailTransactionCheck({ items: items, suppliers: suppliers }),
    [items, suppliers]
  );
  return (
    <TableDateWrapper
      header={`Stock Check Details ${data[0].idTransaction}`}
      description="Compare system quantity with physical counts and identify shortages or excess during the stock audit"
      searchBy="nameItem"
      labelSearch="item"
      isFilterDate={false}
      filterDate=""
      data={data}
      columns={columns}
    >
      {data[0].statusDetailTransaction === "PENDING" && (
        <FormDialog type="create" title="Add Product">
          <AddDetailTransactionForm
            data={data[0]}
            items={items}
            supplier={suppliers}
          />
        </FormDialog>
      )}
    </TableDateWrapper>
  );
}

function TransactionInTableWrapper({
  data,
  items,
  suppliers,
}: ITransactionTableWrapper) {
  const columns = useMemo(
    () => columnDetailTransactionIn({ items: items, suppliers: suppliers }),
    [items, suppliers]
  );
  return (
    <TableDateWrapper
      header={`Detail Transaction ${data[0].idTransaction}`}
      description="Records detailed information about each received item"
      searchBy="nameItem"
      labelSearch="item"
      isFilterDate={false}
      filterDate=""
      data={data}
      columns={columns}
    >
      {data[0].statusDetailTransaction === "PENDING" && (
        <FormDialog type="create" title="Add Product">
          <AddDetailTransactionForm
            data={data[0]}
            items={items}
            supplier={suppliers}
          />
        </FormDialog>
      )}
    </TableDateWrapper>
  );
}

function TransactionOutTableWrapper({
  data,
  items,
  suppliers,
}: ITransactionTableWrapper) {
  const columns = useMemo(
    () => columnDetailTransactionOut({ items: items, suppliers: suppliers }),
    [items, suppliers]
  );
  return (
    <TableDateWrapper
      header={`Detail Transaction ${data[0].idTransaction}`}
      description="Records detailed information about each received item"
      searchBy="nameItem"
      labelSearch="item"
      isFilterDate={false}
      filterDate=""
      data={data}
      columns={columns}
    >
      {data[0].statusDetailTransaction === "PENDING" && (
        <FormDialog type="create" title="Add Product">
          <AddDetailTransactionForm
            data={data[0]}
            items={items}
            supplier={suppliers}
          />
        </FormDialog>
      )}
    </TableDateWrapper>
  );
}

export {
  TransactionCheckTableWrapper,
  TransactionInTableWrapper,
  TransactionOutTableWrapper,
};
