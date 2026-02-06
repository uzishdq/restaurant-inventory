"use server";

import { LABEL } from "@/lib/constant";
import { db } from "@/lib/db";
import {
  detailTransactionTable,
  itemTable,
  supplierTable,
  transactionTable,
  unitTable,
  userTable,
} from "@/lib/db/schema";
import {
  IdSchema,
  ReportTransactionSchema,
  transactionIdSchema,
} from "@/lib/schema-validation";
import {
  TDetailTransaction,
  TLastTransaction,
  TNotifSideBar,
  TOldDetailTransaction,
  TReportTransaction,
  TTransaction,
  typeTransactionType,
} from "@/lib/type-data";
import { and, asc, count, desc, eq, gte, like, lte, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";
import * as z from "zod";

export async function generateTransactionID(type: typeTransactionType) {
  const typeMap: Record<string, string> = {
    IN: "IN",
    OUT: "OUT",
    CHECK: "CHK",
  };

  const prefix = typeMap[type] ?? type;
  const keyword = `TRX-${prefix}-%`;

  const [result] = await db
    .select({ maxNo: sql<string>`max(${transactionTable.idTransaction})` })
    .from(transactionTable)
    .where(like(transactionTable.idTransaction, keyword))
    .limit(1);

  const lastNumber = result?.maxNo
    ? Number(result.maxNo.split("-").pop()) || 0
    : 0;

  // Buat nomor berikutnya
  const nextNumber = lastNumber + 1;
  const formattedNumber = nextNumber.toString().padStart(4, "0");
  const nextID = `TRX-${prefix}-${formattedNumber}`;

  return nextID;
}

export const getTransactions = unstable_cache(
  async (type: typeTransactionType) => {
    try {
      const result = await db
        .select({
          idTransaction: transactionTable.idTransaction,
          typeTransaction: transactionTable.typeTransaction,
          dateTransaction: transactionTable.dateTransaction,
          userId: transactionTable.userId,
          nameUser: userTable.nameUser,
          statusTransaction: transactionTable.statusTransaction,
          totalItems: count(detailTransactionTable.itemId),
        })
        .from(transactionTable)
        .leftJoin(userTable, eq(userTable.idUser, transactionTable.userId))
        .leftJoin(
          detailTransactionTable,
          eq(
            detailTransactionTable.transactionId,
            transactionTable.idTransaction,
          ),
        )
        .where(eq(transactionTable.typeTransaction, type))
        .groupBy(
          transactionTable.idTransaction,
          transactionTable.typeTransaction,
          transactionTable.dateTransaction,
          transactionTable.userId,
          userTable.nameUser,
          transactionTable.statusTransaction,
        )
        .orderBy(desc(transactionTable.dateTransaction));

      if (result.length > 0) {
        return { ok: true, data: result as TTransaction[] };
      } else {
        return { ok: true, data: [] as TTransaction[] };
      }
    } catch (error) {
      console.error("error transaction data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-transactions"],
  {
    tags: ["get-transactions"],
  },
);

export const getDetailTransactions = unstable_cache(
  async (id: string) => {
    try {
      const validateValue = transactionIdSchema.safeParse(id);

      if (!validateValue.success) {
        return { ok: false, data: null, message: LABEL.ERROR.INVALID_FIELD };
      }

      const result = await db
        .select({
          idDetailTransaction: detailTransactionTable.idDetailTransaction,
          idTransaction: detailTransactionTable.transactionId,
          typeTransaction: transactionTable.typeTransaction,
          itemId: itemTable.idItem,
          nameItem: itemTable.nameItem,
          nameUnit: unitTable.nameUnit,
          supplierId: supplierTable.idSupplier,
          store_name: supplierTable.store_name,
          quantityDetailTransaction:
            detailTransactionTable.quantityDetailTransaction,
          quantityCheck: detailTransactionTable.quantityCheck,
          quantityDifference: detailTransactionTable.quantityDifference,
          note: detailTransactionTable.note,
          statusDetailTransaction:
            detailTransactionTable.statusDetailTransaction,
        })
        .from(detailTransactionTable)
        .leftJoin(
          transactionTable,
          eq(
            transactionTable.idTransaction,
            detailTransactionTable.transactionId,
          ),
        )
        .leftJoin(
          itemTable,
          eq(itemTable.idItem, detailTransactionTable.itemId),
        )
        .leftJoin(unitTable, eq(unitTable.idUnit, itemTable.unitId))
        .leftJoin(
          supplierTable,
          eq(supplierTable.idSupplier, detailTransactionTable.supplierId),
        )
        .where(eq(detailTransactionTable.transactionId, id))
        .orderBy(asc(itemTable.idItem));

      if (result.length > 0) {
        return {
          ok: true,
          data: result as TDetailTransaction[],
          message: LABEL.ERROR.INVALID_FIELD,
        };
      } else {
        return {
          ok: true,
          data: [] as TDetailTransaction[],
          message: LABEL.ERROR.DATA_NOT_FOUND,
        };
      }
    } catch (error) {
      console.error("error detail transaction data : ", error);
      return { ok: false, data: null, message: LABEL.ERROR.SERVER };
    }
  },
  ["get-detail-transactions"],
  {
    tags: ["get-detail-transactions"],
  },
);

export const getOldDetailTransaction = unstable_cache(
  async (id: string) => {
    try {
      const validateValue = IdSchema.safeParse({ id });

      if (!validateValue.success) {
        return { ok: false, data: null };
      }

      const [result] = await db
        .select()
        .from(detailTransactionTable)
        .where(eq(detailTransactionTable.idDetailTransaction, id))
        .limit(1);

      if (result) {
        return { ok: true, data: result as TOldDetailTransaction };
      } else {
        return { ok: true, data: null };
      }
    } catch (error) {
      console.error("error detail transaction data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-old-detail-transaction"],
  {
    tags: ["get-old-detail-transaction"],
  },
);

export const getReportTransactions = unstable_cache(
  async (values: z.infer<typeof ReportTransactionSchema>) => {
    try {
      const validateValue = ReportTransactionSchema.safeParse(values);

      if (!validateValue.success) {
        return { ok: false, data: null, message: LABEL.ERROR.INVALID_FIELD };
      }

      const result = await db
        .select({
          idTransaction: detailTransactionTable.transactionId,
          typeTransaction: transactionTable.typeTransaction,
          dateTransaction: transactionTable.dateTransaction,
          nameUser: userTable.nameUser,
          nameItem: itemTable.nameItem,
          nameUnit: unitTable.nameUnit,
          store_name: supplierTable.store_name,
          quantityDetailTransaction:
            detailTransactionTable.quantityDetailTransaction,
          quantityCheck: detailTransactionTable.quantityCheck,
          quantityDifference: detailTransactionTable.quantityDifference,
          note: detailTransactionTable.note,
          statusDetailTransaction:
            detailTransactionTable.statusDetailTransaction,
        })
        .from(detailTransactionTable)
        .leftJoin(
          transactionTable,
          eq(
            transactionTable.idTransaction,
            detailTransactionTable.transactionId,
          ),
        )
        .leftJoin(userTable, eq(userTable.idUser, transactionTable.userId))
        .leftJoin(
          itemTable,
          eq(itemTable.idItem, detailTransactionTable.itemId),
        )
        .leftJoin(unitTable, eq(unitTable.idUnit, itemTable.unitId))
        .leftJoin(
          supplierTable,
          eq(supplierTable.idSupplier, detailTransactionTable.supplierId),
        )
        .where(
          and(
            gte(transactionTable.dateTransaction, validateValue.data.startDate),
            lte(transactionTable.dateTransaction, validateValue.data.endDate),
            eq(transactionTable.typeTransaction, validateValue.data.type),
          ),
        )
        .orderBy(desc(transactionTable.dateTransaction));

      if (result.length > 0) {
        return {
          ok: true,
          data: result as TReportTransaction[],
          message: LABEL.SUCCESS.DATA_FOUND,
        };
      } else {
        return {
          ok: true,
          data: [] as TReportTransaction[],
          message: LABEL.ERROR.DATA_NOT_FOUND,
        };
      }
    } catch (error) {
      console.error("error report transaction data : ", error);
      return { ok: false, data: null, message: LABEL.ERROR.SERVER };
    }
  },
  ["get-report-transactions"],
  {
    tags: ["get-report-transactions"],
  },
);

export const getLastTransactions = unstable_cache(
  async (type: typeTransactionType) => {
    try {
      const [transaction] = await db
        .select({
          idTransaction: transactionTable.idTransaction,
          dateTransaction: transactionTable.dateTransaction,
          nameUser: userTable.nameUser,
        })
        .from(transactionTable)
        .leftJoin(userTable, eq(transactionTable.userId, userTable.idUser))
        .where(
          and(
            eq(transactionTable.typeTransaction, type),
            eq(transactionTable.statusTransaction, "COMPLETED"),
          ),
        )
        .orderBy(desc(transactionTable.dateTransaction))
        .limit(1);

      if (!transaction) return { ok: true, data: null };

      const detail = await db
        .select({
          itemId: detailTransactionTable.itemId,
          nameItem: itemTable.nameItem,
          nameUnit: unitTable.nameUnit,
          quantityDetailTransaction:
            detailTransactionTable.quantityDetailTransaction,
          quantityCheck: detailTransactionTable.quantityCheck,
          quantityDifference: detailTransactionTable.quantityDifference,
          note: detailTransactionTable.note,
        })
        .from(detailTransactionTable)
        .leftJoin(
          itemTable,
          eq(detailTransactionTable.itemId, itemTable.idItem),
        )
        .leftJoin(unitTable, eq(itemTable.unitId, unitTable.idUnit))
        .where(
          eq(detailTransactionTable.transactionId, transaction.idTransaction),
        );

      const result = { ...transaction, details: detail };

      return { ok: true, data: result as TLastTransaction };
    } catch (error) {
      console.error("error transaction data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-last-transactions"],
  {
    tags: ["get-last-transactions"],
  },
);

export const getNotifSideBar = unstable_cache(
  async () => {
    try {
      const transaction = await db
        .select({
          type: transactionTable.typeTransaction,
          count: count().as("count"),
        })
        .from(transactionTable)
        .where(eq(transactionTable.statusTransaction, "PENDING"))
        .groupBy(transactionTable.typeTransaction);

      const summary: Record<typeTransactionType, number> = {
        IN: 0,
        OUT: 0,
        CHECK: 0,
      };

      transaction.forEach(({ type, count }) => {
        summary[type] = count;
      });

      return {
        ok: true,
        data: {
          in: summary.IN,
          out: summary.OUT,
          check: summary.CHECK,
        } as TNotifSideBar,
      };
    } catch (error) {
      console.error("error notif sidebar data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-notif-sidebar"],
  {
    tags: ["get-notif-sidebar"],
  },
);
