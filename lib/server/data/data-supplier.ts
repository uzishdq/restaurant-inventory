"use server";

import { db } from "@/lib/db";
import { supplierTable } from "@/lib/db/schema";
import { TSupplier } from "@/lib/type-data";
import { count } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getSuppliers = unstable_cache(
  async () => {
    try {
      const result = await db.select().from(supplierTable);

      if (result.length > 0) {
        return { ok: true, data: result as TSupplier[] };
      } else {
        return { ok: true, data: [] as TSupplier[] };
      }
    } catch (error) {
      console.error("error supplier data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-suppliers"],
  {
    tags: ["get-suppliers"],
  }
);

export const getCountSupplier = unstable_cache(
  async () => {
    try {
      const [result] = await db.select({ total: count() }).from(supplierTable);

      return { ok: true, data: result.total ?? 0 };
    } catch (error) {
      console.error("error count supplier : ", error);
      return { ok: false, data: 0 };
    }
  },
  ["get-count-supplier"],
  {
    tags: ["get-count-supplier"],
  }
);
