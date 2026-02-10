"use server";

import { db } from "@/lib/db";
import { unitTable } from "@/lib/db/schema";
import { TUnit } from "@/lib/type-data";
import { unstable_cache } from "next/cache";

export const getUnits = unstable_cache(
  async () => {
    try {
      const result = await db.select().from(unitTable);

      if (result.length > 0) {
        return { ok: true, data: result as TUnit[] };
      } else {
        return { ok: true, data: [] as TUnit[] };
      }
    } catch (error) {
      console.error("error unit data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-units"],
  {
    tags: ["get-units"],
  },
);
