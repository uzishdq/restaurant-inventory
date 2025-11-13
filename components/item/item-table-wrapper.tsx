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
      header="Items"
      description="Represents raw materials or ingredients used in the restaurant’s operations and inventory tracking."
      searchBy="nameItem"
      labelSearch="name"
      isFilterDate={true}
      filterDate="updatedAt"
      data={data}
      columns={columns}
    >
      <FormDialog type="create" title="Create Item">
        <CreateItemForm unit={units} category={categorys} />
      </FormDialog>
    </TableDateWrapper>
  );
}
