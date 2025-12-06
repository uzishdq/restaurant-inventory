"use client";

import { TCategory, TItem, TUnit } from "@/lib/type-data";
import React, { useMemo } from "react";
import { columnItem } from "../columns/column-item";
import TableDateWrapper from "../table/table-wrapper";
import { CreateItemForm } from "./item-form";
import FormDialog from "../ui/form-dialog";

interface ItemTableWrapperProps {
  data: TItem[];
  units: TUnit[];
  categorys: TCategory[];
}

export default function ItemTableWrapper({
  data,
  units,
  categorys,
}: ItemTableWrapperProps) {
  const columns = useMemo(
    () => columnItem({ unit: units, category: categorys }),
    [units, categorys]
  );

  return (
    <TableDateWrapper
      header="Bahan Baku"
      description="Mewakili bahan baku atau bahan yang digunakan dalam operasi restoran dan pelacakan inventaris"
      searchBy="nameItem"
      labelSearch="Nama"
      isFilterDate={true}
      filterDate="updatedAt"
      data={data}
      columns={columns}
    >
      <FormDialog type="create" title="Tambah Bahan Baku">
        <CreateItemForm unit={units} category={categorys} />
      </FormDialog>
    </TableDateWrapper>
  );
}
