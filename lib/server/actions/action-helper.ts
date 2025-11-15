"use server";

import {
  LABEL,
  tagsCategoryRevalidate,
  tagsItemRevalidate,
  tagsSupplierRevalidate,
  tagsTransactionRevalidate,
  tagsUnitRevalidate,
  tagsUserRevalidate,
} from "@/lib/constant";
import { revalidateTag } from "next/cache";

export const revalidateData = async () => {
  try {
    const tagsToRevalidate = Array.from(
      new Set([
        ...tagsUnitRevalidate,
        ...tagsCategoryRevalidate,
        ...tagsItemRevalidate,
        ...tagsUserRevalidate,
        ...tagsSupplierRevalidate,
        ...tagsTransactionRevalidate,
      ])
    );

    await Promise.all(
      tagsToRevalidate.map((tag) => revalidateTag(tag, { expire: 0 }))
    );
    return {
      ok: true,
      message: LABEL.SUCCESS.REVALIDATE,
    };
  } catch (error) {
    console.error("error revalidate data : ", error);
    return {
      ok: false,
      message: LABEL.ERROR.DESCRIPTION,
    };
  }
};
