"use server";

import { db } from "@/lib/db";
import {
  detailTransactionTable,
  itemTable,
  supplierTable,
  transactionTable,
  userTable,
} from "@/lib/db/schema";
import { transactionIdSchema } from "@/lib/schema-validation";
import {
  TDetailTransaction,
  TTransaction,
  typeTransactionType,
} from "@/lib/type-data";
import { count, eq, like, sql } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export async function generateTransactionID(type: typeTransactionType) {
  const keyword = `TRX-${type}-%`;

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
  const nextID = `TRX-${type}-${formattedNumber}`;

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
            transactionTable.idTransaction
          )
        )
        .where(eq(transactionTable.typeTransaction, type))
        .groupBy(
          transactionTable.idTransaction,
          transactionTable.typeTransaction,
          transactionTable.userId,
          userTable.nameUser,
          transactionTable.statusTransaction
        );

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
  }
);

export const getDetailTransactions = unstable_cache(
  async (id: string) => {
    try {
      const validateValue = transactionIdSchema.safeParse(id);

      if (!validateValue.success) {
        return { ok: false, data: null };
      }

      const result = await db
        .select({
          idDetailTransaction: detailTransactionTable.idDetailTransaction,
          idTransaction: detailTransactionTable.transactionId,
          itemId: itemTable.idItem,
          nameItem: itemTable.nameItem,
          supplierId: supplierTable.idSupplier,
          store_name: supplierTable.store_name,
          quantityDetailTransaction:
            detailTransactionTable.quantityDetailTransaction,
          statusDetailTransaction:
            detailTransactionTable.statusDetailTransaction,
        })
        .from(detailTransactionTable)
        .leftJoin(
          itemTable,
          eq(itemTable.idItem, detailTransactionTable.itemId)
        )
        .leftJoin(
          supplierTable,
          eq(supplierTable.idSupplier, detailTransactionTable.supplierId)
        )
        .where(eq(detailTransactionTable.transactionId, id));

      if (result.length > 0) {
        return { ok: true, data: result as TDetailTransaction[] };
      } else {
        return { ok: true, data: [] as TDetailTransaction[] };
      }
    } catch (error) {
      console.error("error detail transaction data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-detail-transactions"],
  {
    tags: ["get-detail-transactions"],
  }
);
