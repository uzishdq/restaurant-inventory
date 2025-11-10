"use server";

import * as z from "zod";
import {
  CreateItemSchema,
  DeleteItemSchema,
  UpdateItemSchema,
} from "@/lib/schema-validation";
import { LABEL, tagsItemRevalidate } from "@/lib/constant";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { itemTable } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { and, eq, ne } from "drizzle-orm";
import { generateItemID } from "../data/data-item";

export const createItem = async (values: z.infer<typeof CreateItemSchema>) => {
  try {
    const validateValues = CreateItemSchema.safeParse(values);

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

    const customId = await generateItemID();

    const [result] = await db
      .insert(itemTable)
      .values({
        idItem: customId,
        nameItem: validateValues.data.nameItem,
        unitId: validateValues.data.unitId,
        categoryId: validateValues.data.categoryId,
        stockQuantity: 0,
        minStock: validateValues.data.minStock,
      })
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsItemRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.SAVED,
    };
  } catch (error) {
    console.error("error create unit : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateItem = async (values: z.infer<typeof UpdateItemSchema>) => {
  try {
    const validateValues = UpdateItemSchema.safeParse(values);

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

    if (validateValues.data.nameItem) {
      const [isExisting] = await db
        .select({ nameItem: itemTable.nameItem })
        .from(itemTable)
        .where(
          and(
            eq(itemTable.nameItem, validateValues.data.nameItem),
            ne(itemTable.idItem, validateValues.data.idItem)
          )
        )
        .limit(1);

      if (isExisting) {
        return {
          ok: false,
          message: "This item name is already taken",
        };
      }
    }

    const [result] = await db
      .update(itemTable)
      .set({
        nameItem: validateValues.data.nameItem,
        unitId: validateValues.data.unitId,
        categoryId: validateValues.data.categoryId,
        minStock: validateValues.data.minStock,
      })
      .where(eq(itemTable.idItem, validateValues.data.idItem))
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsItemRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update unit : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const deleteItem = async (values: z.infer<typeof DeleteItemSchema>) => {
  try {
    const validateValues = DeleteItemSchema.safeParse(values);

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

    if (!session.user.role || session.user.role !== "ADMIN") {
      return {
        ok: false,
        message: LABEL.ERROR.UNAUTHORIZED,
      };
    }

    const [result] = await db
      .delete(itemTable)
      .where(eq(itemTable.idItem, validateValues.data.idItem))
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.DELETE,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsItemRevalidate));

    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.DELETE,
    };
  } catch (error) {
    console.error("error delete unit : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
