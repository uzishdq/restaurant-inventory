"use server";
import * as z from "zod";
import { LABEL, tagsTransactionRevalidate } from "@/lib/constant";
import {
  AddTransactionDetailSchema,
  CreateTransactionTestSchema,
  DeleteTransactionDetailSchema,
  DeleteTransactionSchema,
  PurchaseRequestSchema,
  UpdateTransactionDetailSchema,
} from "@/lib/schema-validation";
import { auth } from "@/lib/auth";
import { generateTransactionID } from "../data/data-transaction";
import { db } from "@/lib/db";
import { detailTransactionTable, transactionTable } from "@/lib/db/schema";
import { chunkArray } from "@/lib/utils";
import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";
import { getItemsTrx } from "../data/data-item";
import {
  supplierNotification,
  updateSupplierNotification,
} from "./action-notifikasi";

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

export const addDetailTransaction = async (
  values: z.infer<typeof AddTransactionDetailSchema>
) => {
  try {
    const validateValues = AddTransactionDetailSchema.safeParse(values);

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

    //     const payload = detail.map((item) => ({
    //   ...item,
    //   transactionId: idTransaction,
    // }));

    const payload = detail.map(({ supplierId, ...rest }) => ({
      ...rest,
      transactionId: idTransaction,
      supplierId: supplierId as string,
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

export const updateDetailTransaction = async (
  values: z.infer<typeof UpdateTransactionDetailSchema>
) => {
  try {
    const validateValues = UpdateTransactionDetailSchema.safeParse(values);

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
      .update(detailTransactionTable)
      .set({
        itemId: validateValues.data.itemId,
        supplierId: validateValues.data.supplierId,
        quantityDetailTransaction:
          validateValues.data.quantityDetailTransaction,
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

    //update hanya jika ganti qyt atau supplier
    // if (result.statusDetailTransaction === "ACCEPTED") {
    //   await updateSupplierNotification(result);
    // }

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

export const updatePurchaseRequest = async (
  values: z.infer<typeof PurchaseRequestSchema>
) => {
  try {
    const validateValues = PurchaseRequestSchema.safeParse(values);

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

      return updateDetailTransaction;
    });

    if (result.length < 0) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    // if (validateValues.data.statusTransaction === "ORDERED") {
    //   // get supplier base on updated detail transaction -> input notifikasi table
    //   const data = result.map((r) => ({
    //     itemId: r.itemId,
    //     supplierId: r.supplierId,
    //     quantityDetailTransaction: r.quantityDetailTransaction,
    //   }));

    //   await supplierNotification(data);
    // }

    const tagsToRevalidate = Array.from(new Set(tagsTransactionRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error create purchase request : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
