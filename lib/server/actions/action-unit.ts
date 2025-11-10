"use server";

import * as z from "zod";
import {
  CreateUnitSchema,
  DeleteUUIDSchema,
  UpdateUnitSchema,
} from "@/lib/schema-validation";
import { LABEL, tagsItemRevalidate, tagsUnitRevalidate } from "@/lib/constant";
import { auth } from "@/lib/auth";
import { revalidateTag } from "next/cache";
import { unitTable } from "@/lib/db/schema";
import { db } from "@/lib/db";
import { eq } from "drizzle-orm";

export const createUnit = async (values: z.infer<typeof CreateUnitSchema>) => {
  try {
    const validateValues = CreateUnitSchema.safeParse(values);

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
      .insert(unitTable)
      .values({ nameUnit: validateValues.data.nameUnit })
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.SAVED,
      };
    }

    const tagsToRevalidate = Array.from(new Set(tagsUnitRevalidate));
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

export const updateUnit = async (values: z.infer<typeof UpdateUnitSchema>) => {
  try {
    const validateValues = UpdateUnitSchema.safeParse(values);

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
      .update(unitTable)
      .set({ nameUnit: validateValues.data.nameUnit })
      .where(eq(unitTable.idUnit, validateValues.data.idUnit))
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.UPDATE,
      };
    }

    const tagsToRevalidate = Array.from(
      new Set([...tagsUnitRevalidate, ...tagsItemRevalidate])
    );

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

export const deleteUnit = async (values: z.infer<typeof DeleteUUIDSchema>) => {
  try {
    const validateValues = DeleteUUIDSchema.safeParse(values);

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
      .delete(unitTable)
      .where(eq(unitTable.idUnit, validateValues.data.id))
      .returning();

    if (!result) {
      return {
        ok: false,
        message: LABEL.INPUT.FAILED.DELETE,
      };
    }

    const tagsToRevalidate = Array.from(
      new Set([...tagsUnitRevalidate, ...tagsItemRevalidate])
    );

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
