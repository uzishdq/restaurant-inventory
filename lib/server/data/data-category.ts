"use server";

import { db } from "@/lib/db";
import { categoryTable } from "@/lib/db/schema";
import { TCategory } from "@/lib/type-data";
import { unstable_cache } from "next/cache";

export const getCategory = unstable_cache(
  async () => {
    try {
      const result = await db.select().from(categoryTable);

      if (result.length > 0) {
        return { ok: true, data: result as TCategory[] };
      } else {
        return { ok: true, data: [] as TCategory[] };
      }
    } catch (error) {
      console.error("error category data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-category"],
  {
    tags: ["get-category"],
  }
);
