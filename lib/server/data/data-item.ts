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
  TStockReportItem,
} from "@/lib/type-data";
import { and, asc, count, eq, gte, inArray, lte, sql } from "drizzle-orm";
import * as z from "zod";
import { unstable_cache } from "next/cache";
import { ReportItemSchema } from "@/lib/schema-validation";
import { LABEL } from "@/lib/constant";

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
          eq(itemTable.categoryId, categoryTable.idCategory),
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
  },
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
          eq(itemTable.categoryId, categoryTable.idCategory),
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
  },
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
  },
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
  },
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
  },
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
            lte(itemMovementTable.createdAt, now),
          ),
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
  },
);

export const getStockReport = unstable_cache(
  async (values: z.infer<typeof ReportItemSchema>) => {
    try {
      const validateValue = ReportItemSchema.safeParse(values);

      if (!validateValue.success) {
        return { ok: false, data: null, message: LABEL.ERROR.INVALID_FIELD };
      }

      const { startDate, endDate } = validateValue.data;

      const report = await db
        .select({
          idItem: itemTable.idItem,
          nameItem: itemTable.nameItem,
          currentStock: itemTable.stockQuantity,
          minStock: itemTable.minStock,
          nameCategory: categoryTable.nameCategory,
          nameUnit: unitTable.nameUnit,

          // ✅ Return as string (karena numeric di PostgreSQL)
          totalIn: sql<string>`
            COALESCE(
              SUM(
                CASE 
                  WHEN ${itemMovementTable.typeMovement} = 'IN' 
                  THEN ${itemMovementTable.quantityMovement} 
                  ELSE 0 
                END
              ), 
              0
            )
          `.as("total_in"),

          totalOut: sql<string>`
            COALESCE(
              SUM(
                CASE 
                  WHEN ${itemMovementTable.typeMovement} = 'OUT' 
                  THEN ${itemMovementTable.quantityMovement} 
                  ELSE 0 
                END
              ), 
              0
            )
          `.as("total_out"),

          totalCheck: sql<string>`
            COALESCE(
              SUM(
                CASE 
                  WHEN ${itemMovementTable.typeMovement} = 'CHECK' 
                  THEN ${itemMovementTable.quantityMovement} 
                  ELSE 0 
                END
              ), 
              0
            )
          `.as("total_check"),

          totalTransactions: sql<number>`
            COUNT(${itemMovementTable.idMovement})
          `.as("total_transactions"),
        })
        .from(itemTable)
        .leftJoin(
          itemMovementTable,
          and(
            eq(itemTable.idItem, itemMovementTable.itemId),
            gte(itemMovementTable.createdAt, new Date(startDate)),
            lte(itemMovementTable.createdAt, new Date(endDate)),
          ),
        )
        .leftJoin(
          categoryTable,
          eq(categoryTable.idCategory, itemTable.categoryId),
        )
        .leftJoin(unitTable, eq(unitTable.idUnit, itemTable.unitId))
        .groupBy(
          itemTable.idItem,
          itemTable.nameItem,
          itemTable.stockQuantity,
          itemTable.minStock,
          categoryTable.nameCategory,
          unitTable.nameUnit,
        )
        .orderBy(asc(itemTable.idItem));

      const result = report.map((item) => {
        // ✅ Convert string ke number, lalu sanitasi
        const totalIn = Math.max(0, Number(item.totalIn) || 0);
        const totalOut = Math.abs(Number(item.totalOut) || 0); // ✅ ABS untuk OUT yang negatif
        const currentStock = Math.max(0, Number(item.currentStock) || 0);
        const minStock = Math.max(0, Number(item.minStock) || 0);
        const totalCheck = Math.abs(Number(item.totalCheck) || 0);

        const netMovement = totalIn - totalOut;
        const stockAtPeriodStart = Math.max(0, currentStock - netMovement);
        const totalAvailable = stockAtPeriodStart + totalIn;

        const utilizationRate =
          totalAvailable > 0
            ? ((totalOut / totalAvailable) * 100).toFixed(2)
            : "0.00";

        const stockStatus = currentStock <= minStock ? "LOW_STOCK" : "NORMAL";

        return {
          idItem: item.idItem,
          nameItem: item.nameItem,
          nameCategory: item.nameCategory,
          nameUnit: item.nameUnit,
          currentStock,
          minStock,
          totalIn,
          totalOut,
          totalCheck,
          totalTransactions: item.totalTransactions,
          netMovement,
          stockAtPeriodStart,
          stockAtPeriodEnd: currentStock,
          stockStatus,
          utilizationRate,
        };
      });

      if (result.length > 0) {
        return {
          ok: true,
          data: result as TStockReportItem[],
          message: LABEL.SUCCESS.DATA_FOUND,
        };
      } else {
        return { ok: true, data: [], message: LABEL.ERROR.DATA_NOT_FOUND };
      }
    } catch (error) {
      console.error("error stock report : ", error);
      return { ok: false, data: null, message: LABEL.ERROR.SERVER };
    }
  },
  ["get-report-items"],
  {
    tags: ["get-report-items"],
  },
);
