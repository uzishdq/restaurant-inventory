"use server";

import * as z from "zod";
import {
  CreateSupplierSchema,
  UpdateSupplierSchema,
} from "@/lib/schema-validation";
import { LABEL, tagsSupplierRevalidate } from "@/lib/constant";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { supplierTable } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const createSupplier = async (
  values: z.infer<typeof CreateSupplierSchema>
) => {
  try {
    const validateValues = CreateSupplierSchema.safeParse(values);

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
      .insert(supplierTable)
      .values(validateValues.data)
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsSupplierRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.SAVED,
    };
  } catch (error) {
    console.error("error create supplier : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const updateSupplier = async (
  values: z.infer<typeof UpdateSupplierSchema>
) => {
  try {
    const validateValues = UpdateSupplierSchema.safeParse(values);

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
      .update(supplierTable)
      .set({
        store_name: validateValues.data.store_name,
        nameSupplier: validateValues.data.nameSupplier,
        addressSupplier: validateValues.data.addressSupplier,
        phoneSupplier: validateValues.data.phoneSupplier,
      })
      .where(eq(supplierTable.idSupplier, validateValues.data.idSupplier))
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsSupplierRevalidate));
    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );

    return {
      ok: true,
      message: LABEL.INPUT.SUCCESS.UPDATE,
    };
  } catch (error) {
    console.error("error update supplier : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
