"use server";

import * as z from "zod";
import { LABEL, tagsCategoryRevalidate } from "@/lib/constant";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { categoryTable } from "@/lib/db/schema";
import { db } from "@/lib/db";
import {
  CreateCategorySchema,
  UpdateCategorySchema,
} from "@/lib/schema-validation";
import { eq } from "drizzle-orm";

export const createCategory = async (
  values: z.infer<typeof CreateCategorySchema>
) => {
  try {
    const validateValues = CreateCategorySchema.safeParse(values);

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

    const [result] = await db
      .insert(categoryTable)
      .values({ nameCategory: validateValues.data.nameCategory })
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsCategoryRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.SAVED,
    };
  } catch (error) {
    console.error("error create category : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateCategory = async (
  values: z.infer<typeof UpdateCategorySchema>
) => {
  try {
    const validateValues = UpdateCategorySchema.safeParse(values);

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

    const [result] = await db
      .update(categoryTable)
      .set({ nameCategory: validateValues.data.nameCategory })
      .where(eq(categoryTable.idCategory, validateValues.data.idCategory))
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsCategoryRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update category : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
