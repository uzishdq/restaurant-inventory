"use server";

import * as z from "zod";
import {
  ReportItemSchema,
  ReportTransactionSchema,
} from "@/lib/schema-validation";
import { LABEL } from "@/lib/constant";
import { auth } from "@/lib/auth";

export const findReportTransaction = async (
  values: z.infer<typeof ReportTransactionSchema>,
) => {
  try {
    const session = await auth();

    if (!session?.user.id || !session?.user.role) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const validateValues = ReportTransactionSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    return {
      ok: true,
      message: "transaction report validation was successful",
    };
  } catch (error) {
    console.error("error find transaction report : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};

export const findReportItem = async (
  values: z.infer<typeof ReportItemSchema>,
) => {
  try {
    const session = await auth();

    if (!session?.user.id || !session?.user.role) {
      return {
        ok: false,
        message: LABEL.ERROR.NOT_LOGIN,
      };
    }

    const validateValues = ReportItemSchema.safeParse(values);

    if (!validateValues.success) {
      return { ok: false, message: LABEL.ERROR.INVALID_FIELD };
    }

    return {
      ok: true,
      message: "item report validation was successful",
    };
  } catch (error) {
    console.error("error find item report : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.SERVER,
    };
  }
};
