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
}: Readonly<ITransactionTableWrapper>) {
  const columns = useMemo(
    () => columnDetailTransactionCheck({ items: items, suppliers: suppliers }),
    [items, suppliers],
  );
  return (
    <TableDateWrapper
      header={`Detail Pemeriksaan ${data[0].idTransaction}`}
      description="Bandingkan jumlah dalam sistem dengan jumlah fisik dan identifikasi kekurangan atau kelebihan selama audit stok"
      searchBy="nameItem"
      labelSearch="Bahan Baku"
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
}: Readonly<ITransactionTableWrapper>) {
  const columns = useMemo(
    () => columnDetailTransactionIn({ items: items, suppliers: suppliers }),
    [items, suppliers],
  );
  return (
    <TableDateWrapper
      header={`Detail Pengadaan ${data[0].idTransaction}`}
      description="Mencatat informasi rinci setiap pengadaan barang"
      searchBy="nameItem"
      labelSearch="Bahan Baku"
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
}: Readonly<ITransactionTableWrapper>) {
  const columns = useMemo(
    () => columnDetailTransactionOut({ items: items, suppliers: suppliers }),
    [items, suppliers],
  );
  return (
    <TableDateWrapper
      header={`Detail Bahan Keluar ${data[0].idTransaction}`}
      description="Rincian bahan baku yang keluar"
      searchBy="nameItem"
      labelSearch="Bahan Baku"
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
