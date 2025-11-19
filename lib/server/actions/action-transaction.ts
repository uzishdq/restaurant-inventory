"use server";
import * as z from "zod";
import {
  LABEL,
  tagsItemRevalidate,
  tagsTransactionRevalidate,
} from "@/lib/constant";
import {
  AddTransactionDetailSchema,
  CreateTransactionTestSchema,
  DeleteTransactionDetailSchema,
  DeleteTransactionSchema,
  UpdateTransactionDetailSchema,
  UpdateTransactionSchema,
  UpdateTrxDetailStatusSchema,
} from "@/lib/schema-validation";
import { auth } from "@/lib/auth";
import {
  generateTransactionID,
  getOldDetailTransaction,
} from "../data/data-transaction";
import { db } from "@/lib/db";
import {
  detailTransactionTable,
  itemMovementTable,
  itemTable,
  transactionTable,
} from "@/lib/db/schema";
import { chunkArray } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { eq, sql } from "drizzle-orm";
import { getItemsTrx } from "../data/data-item";
import {
  purchaseMismatchNotification,
  supplierNotification,
  updateSupplierNotification,
} from "./action-notifikasi";
import { hasChanges } from "@/lib/helper";
import { TInputItemMovement } from "@/lib/type-data";

export const createTransaction = async (values: unknown) => {
  try {
    const [items] = await Promise.all([getItemsTrx()]);

    if (!items.ok || !items.data) {
      return { ok: false, message: LABEL.ERROR.SERVER };
    }

    const schema = CreateTransactionTestSchema(items.data);
    const validateValues = schema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const { typeTransaction, detail } = validateValues.data;

    const customId = await generateTransactionID(typeTransaction);

    const payload = detail.map((item) => ({
      ...item,
      supplierId: item.supplierId || null,
      transactionId: customId,
      note: item.note || null,
    }));

    if (payload.length < 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const result = await db.transaction(async (tx) => {
      const [createTransaction] = await tx
        .insert(transactionTable)
        .values({
          idTransaction: customId,
          typeTransaction: typeTransaction,
          userId: session.user.id,
        })
        .returning();

      for (const chunk of chunkArray(payload, 50)) {
        await tx
          .insert(detailTransactionTable)
          .values(chunk)
          .onConflictDoNothing();
      }

      return createTransaction;
    });

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsTransactionRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.SAVED,
    };
  } catch (error) {
    console.error("error create transaction : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

//ubah qyt di table item dan movement jika completed
export const updateTransaction = async (
  values: z.infer<typeof UpdateTransactionSchema>
) => {
  try {
    const validateValues = UpdateTransactionSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    if (session?.user.role !== "ADMIN") {
      return {
        ok: false,
        message: LABEL.ERROR.UNAUTHORIZED,
      };
    }

    const result = await db.transaction(async (tx) => {
      await tx
        .update(transactionTable)
        .set({
          statusTransaction: validateValues.data.statusTransaction,
        })
        .where(
          eq(transactionTable.idTransaction, validateValues.data.idTransaction)
        );

      // update db nanti ambil status dari validateValues
      const updateDetailTransaction = await tx
        .update(detailTransactionTable)
        .set({
          statusDetailTransaction: validateValues.data.statusTransaction,
        })
        .where(
          eq(
            detailTransactionTable.transactionId,
            validateValues.data.idTransaction
          )
        )
        .returning();

      if (validateValues.data.statusTransaction !== "COMPLETED") {
        return updateDetailTransaction;
      }

      const type = validateValues.data.typeTransaction;

      const movementPayload: TInputItemMovement[] = updateDetailTransaction.map(
        (d) => {
          let qtyMovement = 0;

          if (type === "IN") {
            qtyMovement = Math.abs(d.quantityCheck ?? 0);
          }

          if (type === "OUT") {
            qtyMovement = -Math.abs(d.quantityDetailTransaction);
          }

          if (type === "CHECK") {
            qtyMovement = d.quantityDifference ?? 0;
          }

          return {
            transactionId: validateValues.data.idTransaction,
            itemId: d.itemId,
            typeMovement: type,
            quantityMovement: qtyMovement,
          };
        }
      );

      for (const chunk of chunkArray(movementPayload, 50)) {
        await tx.insert(itemMovementTable).values(chunk).onConflictDoNothing();
      }

      const totalMovementByItem: Record<string, number> = {};

      for (const mv of movementPayload) {
        totalMovementByItem[mv.itemId] =
          (totalMovementByItem[mv.itemId] || 0) + mv.quantityMovement;
      }

      // Update semua item berdasarkan movement final
      for (const [itemId, qtyMove] of Object.entries(totalMovementByItem)) {
        await tx
          .update(itemTable)
          .set({
            stockQuantity: sql`${itemTable.stockQuantity} + ${qtyMove}`,
          })
          .where(eq(itemTable.idItem, itemId));
      }

      return updateDetailTransaction;
    });

    if (result.length < 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    if (
      validateValues.data.typeTransaction === "IN" &&
      validateValues.data.statusTransaction === "ORDERED"
    ) {
      // kirim notif ke supplier jika type In dan status Ordered
      const data = result.map((r) => ({
        itemId: r.itemId,
        supplierId: r.supplierId!,
        quantityDetailTransaction: r.quantityDetailTransaction,
      }));

      await supplierNotification(data);
    }

    const tagsToRevalidate = Array.from(
      new Set(...tagsTransactionRevalidate, ...tagsItemRevalidate)
    );
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update transaction request : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const deleteTransaction = async (
  values: z.infer<typeof DeleteTransactionSchema>
) => {
  try {
    const validateValues = DeleteTransactionSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    if (session?.user.role !== "ADMIN") {
      return {
        ok: false,
        message: LABEL.ERROR.UNAUTHORIZED,
      };
    }

    // otomatis delete detail transaction juga
    const [result] = await db
      .delete(transactionTable)
      .where(
        eq(transactionTable.idTransaction, validateValues.data.idTransaction)
      )
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.DELETE,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsTransactionRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.DELETE,
    };
  } catch (error) {
    console.error("error delete transaction : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const addDetailTransaction = async (values: unknown) => {
  try {
    const [items] = await Promise.all([getItemsTrx()]);

    if (!items.ok || !items.data) {
      return { ok: false, message: LABEL.ERROR.SERVER };
    }

    const schema = AddTransactionDetailSchema(items.data);
    const validateValues = schema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    if (session?.user.role !== "ADMIN") {
      return {
        ok: false,
        message: LABEL.ERROR.UNAUTHORIZED,
      };
    }

    const { idTransaction, detail } = validateValues.data;

    const payload = detail.map((item) => ({
      ...item,
      transactionId: idTransaction,
      supplierId: item.supplierId || null,
    }));

    if (payload.length < 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const [result] = await db
      .insert(detailTransactionTable)
      .values(payload)
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsTransactionRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.SAVED,
    };
  } catch (error) {
    console.error("error add detail transaction : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateDetailTrxStatus = async (
  values: z.infer<typeof UpdateTrxDetailStatusSchema>
) => {
  try {
    const validateValues = UpdateTrxDetailStatusSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    if (session?.user.role === "MANAGER") {
      return {
        ok: false,
        message: LABEL.ERROR.UNAUTHORIZED,
      };
    }

    const [result] = await db
      .update(detailTransactionTable)
      .set({
        statusDetailTransaction: validateValues.data.statusDetailTransaction,
      })
      .where(
        eq(
          detailTransactionTable.idDetailTransaction,
          validateValues.data.idDetailTransaction
        )
      )
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsTransactionRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update detail transaction status : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

// ubah flow sesuai type transaction
export const updateDetailTransaction = async (values: unknown) => {
  try {
    const [items] = await Promise.all([getItemsTrx()]);

    if (!items.ok || !items.data) {
      return { ok: false, message: LABEL.ERROR.SERVER };
    }

    const schema = UpdateTransactionDetailSchema(items.data);
    const validateValues = schema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    if (session?.user.role === "MANAGER") {
      return {
        ok: false,
        message: LABEL.ERROR.UNAUTHORIZED,
      };
    }

    const oldData = await getOldDetailTransaction(
      validateValues.data.idDetailTransaction
    );

    if (!oldData.ok || !oldData.data) {
      return {
        ok: false,
        message: LABEL.ERROR.DATA_NOT_FOUND,
      };
    }

    if (validateValues.data.typeTransaction === "IN") {
      //update hanya jika ganti item, supplier atau qyt

      if (
        validateValues.data.statusTransaction === "ORDERED" ||
        validateValues.data.statusTransaction === "PENDING"
      ) {
        const newData = {
          itemId: validateValues.data.itemId,
          supplierId: validateValues.data.supplierId,
          quantityDetailTransaction:
            validateValues.data.quantityDetailTransaction,
        };

        const isSame = hasChanges(oldData.data, newData, [
          "itemId",
          "supplierId",
          "quantityDetailTransaction",
        ]);

        if (!isSame) {
          return { ok: false, message: LABEL.ERROR.CHECK_DATA };
        }

        const [result] = await db
          .update(detailTransactionTable)
          .set(newData)
          .where(
            eq(
              detailTransactionTable.idDetailTransaction,
              validateValues.data.idDetailTransaction
            )
          )
          .returning();

        if (!result) {
          return {
            ok: false,
            message: LABEL.INPUT.FAILED.UPDATE,
          };
        }

        //kirim notif karena sudah update barang baku di status received
        if (validateValues.data.statusTransaction === "ORDERED") {
          await updateSupplierNotification({
            itemId: result.itemId,
            supplierId: result.supplierId!,
            quantityDetailTransaction: result.quantityDetailTransaction,
          });
        }
      }

      if (validateValues.data.statusTransaction === "RECEIVED") {
        const newData = {
          quantityDetailTransaction:
            validateValues.data.quantityDetailTransaction,
          quantityCheck: validateValues.data.quantityCheck,
          quantityDifference: validateValues.data.quantityDifference,
          note: validateValues.data.note,
        };

        const isSame = hasChanges(oldData.data, newData, [
          "quantityDetailTransaction",
          "quantityCheck",
          "quantityDifference",
          "note",
        ]);

        if (!isSame) {
          return { ok: false, message: LABEL.ERROR.CHECK_DATA };
        }

        const [result] = await db
          .update(detailTransactionTable)
          .set(newData)
          .where(
            eq(
              detailTransactionTable.idDetailTransaction,
              validateValues.data.idDetailTransaction
            )
          )
          .returning();

        if (!result) {
          return {
            ok: false,
            message: LABEL.INPUT.FAILED.UPDATE,
          };
        }

        if (result.quantityDifference! > 0) {
          await purchaseMismatchNotification({
            itemId: result.itemId,
            supplierId: result.supplierId!,
            quantityDetailTransaction: result.quantityDetailTransaction,
            quantityCheck: result.quantityCheck,
            quantityDifference: result.quantityDifference,
            note: result.note,
          });
        }
      }
    }

    if (validateValues.data.typeTransaction === "OUT") {
      const newData = {
        itemId: validateValues.data.itemId,
        quantityDetailTransaction:
          validateValues.data.quantityDetailTransaction,
        note: validateValues.data.note,
      };

      const isSame = hasChanges(oldData.data, newData, [
        "itemId",
        "quantityDetailTransaction",
        "note",
      ]);

      if (!isSame) {
        return { ok: false, message: LABEL.ERROR.CHECK_DATA };
      }

      const [result] = await db
        .update(detailTransactionTable)
        .set(newData)
        .where(
          eq(
            detailTransactionTable.idDetailTransaction,
            validateValues.data.idDetailTransaction
          )
        )
        .returning();

      if (!result) {
        return {
          ok: false,
          message: LABEL.INPUT.FAILED.UPDATE,
        };
      }
    }

    const tagsToRevalidate = Array.from(new Set(tagsTransactionRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update detail transaction : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const deleteDetailTransaction = async (
  values: z.infer<typeof DeleteTransactionDetailSchema>
) => {
  try {
    const validateValues = DeleteTransactionDetailSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const session = await auth();

    if (!session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    if (session?.user.role !== "ADMIN") {
      return {
        ok: false,
        message: LABEL.ERROR.UNAUTHORIZED,
      };
    }

    const [result] = await db
      .delete(detailTransactionTable)
      .where(
        eq(
          detailTransactionTable.idDetailTransaction,
          validateValues.data.idDetailTransaction
        )
      )
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.DELETE,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsTransactionRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.DELETE,
    };
  } catch (error) {
    console.error("error delete detail transaction : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
