"use server";
import * as z from "zod";
import { LABEL, tagsTransactionRevalidate } from "@/lib/constant";
import { CreateTransactionSchema } from "@/lib/schema-validation";
import { auth } from "@/lib/auth";
import { generateTransactionID } from "../data/data-transaction";
import { db } from "@/lib/db";
import { detailTransactionTable, transactionTable } from "@/lib/db/schema";
import { chunkArray } from "@/lib/utils";
import { revalidateTag } from "next/cache";

export const createTransaction = async (
  values: z.infer<typeof CreateTransactionSchema>
) => {
  try {
    const validateValues = CreateTransactionSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    const { typeTransaction, detail } = validateValues.data;

    const session = await auth();

    if (!session?.user.id) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const customId = await generateTransactionID(typeTransaction);

    const payload = detail.map((item) => ({
      ...item,
      transactionId: customId,
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
