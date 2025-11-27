"use server";

import { db } from "@/lib/db";
import {
  categoryTable,
  itemMovementTable,
  itemTable,
  unitTable,
} from "@/lib/db/schema";
import {
  TItem,
  TItemMovement,
  TItemMovementChart,
  TItemTrx,
  TLowItem,
} from "@/lib/type-data";
import { and, asc, count, eq, gte, inArray, lte, sql } from "drizzle-orm";
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

export const getLowItem = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          idItem: itemTable.idItem,
          nameItem: itemTable.nameItem,
          nameUnit: unitTable.nameUnit,
          stockQuantity: itemTable.stockQuantity,
          minStock: itemTable.minStock,
          updatedAt: itemTable.updatedAt,
        })
        .from(itemTable)
        .leftJoin(unitTable, eq(itemTable.unitId, unitTable.idUnit))
        .where(lte(itemTable.stockQuantity, itemTable.minStock))
        .orderBy(asc(itemTable.stockQuantity));

      if (result.length > 0) {
        return { ok: true, data: result as TLowItem[] };
      } else {
        return { ok: true, data: null };
      }
    } catch (error) {
      console.error("error low item : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-low-item"],
  {
    tags: ["get-low-item"],
  }
);

export const getItemMovementGrouped = unstable_cache(
  async () => {
    try {
      const now = new Date();
      const lastMonth = new Date();
      lastMonth.setDate(now.getDate() - 90);

      const result = await db
        .select({
          date: sql<string>`DATE(${itemMovementTable.createdAt})`,
          incoming: sql<number>`SUM(CASE WHEN ${itemMovementTable.typeMovement} = 'IN' THEN ${itemMovementTable.quantityMovement} ELSE 0 END)`,
          outgoing: sql<number>`SUM(CASE WHEN ${itemMovementTable.typeMovement} = 'OUT' THEN ${itemMovementTable.quantityMovement} ELSE 0 END)`,
        })
        .from(itemMovementTable)
        .where(
          and(
            inArray(itemMovementTable.typeMovement, ["IN", "OUT"]),
            gte(itemMovementTable.createdAt, lastMonth),
            lte(itemMovementTable.createdAt, now)
          )
        )
        .groupBy(sql`DATE(${itemMovementTable.createdAt})`)
        .orderBy(sql`DATE(${itemMovementTable.createdAt})`);

      return { ok: true, data: result as TItemMovementChart[] };
    } catch (error) {
      console.error("error count item : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-item-movement-grouped"],
  {
    tags: ["get-item-movement-grouped"],
  }
);
