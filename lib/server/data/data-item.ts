"use server";

import { db } from "@/lib/db";
import {
  categoryTable,
  itemMovementTable,
  itemTable,
  unitTable,
} from "@/lib/db/schema";
import { TItem, TItemMovement, TItemTrx } from "@/lib/type-data";
import { asc, count, eq, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export async function generateItemID() {
  const [result] = await db
    .select({ maxNo: sql<string>`max(${itemTable.idItem})` })
    .from(itemTable)
    .limit(1);

  const maxID = result.maxNo || "BB-0000";
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
        .orderBy(asc(itemTable.idItem));

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

export const getItemsMovement = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          idMovement: itemMovementTable.idMovement,
          transactionId: itemMovementTable.transactionId,
          typeMovement: itemMovementTable.typeMovement,
          itemId: itemMovementTable.itemId,
          nameItem: itemTable.nameItem,
          unitId: unitTable.idUnit,
          nameUnit: unitTable.nameUnit,
          categoryId: categoryTable.idCategory,
          nameCategory: categoryTable.nameCategory,
          quantityMovement: itemMovementTable.quantityMovement,
          dateExp: itemMovementTable.dateExp,
          createdAt: itemMovementTable.createdAt,
          updatedAt: itemMovementTable.updatedAt,
        })
        .from(itemMovementTable)
        .leftJoin(itemTable, eq(itemMovementTable.itemId, itemTable.idItem))
        .leftJoin(unitTable, eq(itemTable.unitId, unitTable.idUnit))
        .leftJoin(
          categoryTable,
          eq(itemTable.categoryId, categoryTable.idCategory)
        )
        .orderBy(asc(itemMovementTable.createdAt));

      if (result.length > 0) {
        return { ok: true, data: result as TItemMovement[] };
      } else {
        return { ok: true, data: [] as TItemMovement[] };
      }
    } catch (error) {
      console.error("error item data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-items-movement"],
  {
    tags: ["get-items-movement"],
  }
);

export const getItemsTrx = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          idItem: itemTable.idItem,
          nameItem: itemTable.nameItem,
          nameUnit: unitTable.nameUnit,
          qty: itemTable.stockQuantity,
        })
        .from(itemTable)
        .leftJoin(unitTable, eq(unitTable.idUnit, itemTable.unitId))
        .orderBy(asc(itemTable.idItem));

      if (result.length > 0) {
        return { ok: true, data: result as TItemTrx[] };
      } else {
        return { ok: true, data: [] as TItemTrx[] };
      }
    } catch (error) {
      console.error("error item data trx: ", error);
      return { ok: false, data: null };
    }
  },
  ["get-items-trx"],
  {
    tags: ["get-items-trx"],
  }
);

export const getCountItem = unstable_cache(
  async () => {
    try {
      const [result] = await db.select({ total: count() }).from(itemTable);

      return { ok: true, data: result.total ?? 0 };
    } catch (error) {
      console.error("error count item : ", error);
      return { ok: false, data: 0 };
    }
  },
  ["get-count-item"],
  {
    tags: ["get-count-item"],
  }
);
