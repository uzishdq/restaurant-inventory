"use server";

import { db } from "@/lib/db";
import { categoryTable, itemTable, unitTable } from "@/lib/db/schema";
import { TItem } from "@/lib/type-data";
import { asc, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export async function generateItemID() {
  const [result] = await db
    .select({ maxNo: sql<string>`max(${itemTable.idItem})` })
    .from(itemTable);

  const maxID = result.maxNo || "BB-0001";
  const currentNumber = parseInt(maxID.split("-")[1], 10);
  const nextNumber = currentNumber + 1;
  const nextID = `BB-${nextNumber.toString().padStart(4, "0")}`;

  return nextID;
}

export const getItems = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          idItem: itemTable.idItem,
          nameItem: itemTable.nameItem,
          unitId: unitTable.idUnit,
          nameUnit: unitTable.nameUnit,
          categoryId: categoryTable.idCategory,
          nameCategory: categoryTable.nameCategory,
          stockQuantity: itemTable.stockQuantity,
          minStock: itemTable.minStock,
          createdAt: itemTable.createdAt,
          updatedAt: itemTable.updatedAt,
        })
        .from(itemTable)
        .leftJoin(unitTable, eq(itemTable.unitId, unitTable.idUnit))
        .leftJoin(
          categoryTable,
          eq(itemTable.categoryId, categoryTable.idCategory)
        )
        .orderBy(asc(itemTable.createdAt));

      if (result.length > 0) {
        return { ok: true, data: result as TItem[] };
      } else {
        return { ok: true, data: [] as TItem[] };
      }
    } catch (error) {
      console.error("error item data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-items"],
  {
    tags: ["get-items"],
  }
);
