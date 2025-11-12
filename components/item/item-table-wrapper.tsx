"use client";

import { TCategory, TItem, TUnit } from "@/lib/type-data";
import React, { useMemo } from "react";
import { columnItem } from "../columns/column-item";
import TableDateWrapper from "../table/table-wrapper";
import { CreateItemForm } from "./item-form";

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
      <CreateItemForm unit={units} category={categorys} />
    </TableDateWrapper>
  );
}
