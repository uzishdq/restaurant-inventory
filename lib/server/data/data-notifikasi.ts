"use server";

import { db } from "@/lib/db";
import { notificationsTable, userTable } from "@/lib/db/schema";
import { NotificationSchema } from "@/lib/schema-validation";
import { TNotifikasi } from "@/lib/type-data";
import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

export const getNotification = unstable_cache(
  async (id: string) => {
    try {
      const validateValues = NotificationSchema.safeParse({ id: id });

      if (!validateValues.success) {
        return { ok: false, data: null };
      }

      const [user] = await db
        .select({
          phoneNumber: userTable.phoneNumber,
          role: userTable.role,
        })
        .from(userTable)
        .where(eq(userTable.idUser, validateValues.data.id))
        .limit(1);

      if (!user) {
        return { ok: false, data: null };
      }

      if (user.role === "ADMIN") {
        const result = await db
          .select()
          .from(notificationsTable)
          .orderBy(asc(notificationsTable.tanggalNotification));

        if (result.length > 0) {
          return { ok: true, data: result as TNotifikasi[] };
        } else {
          return { ok: true, data: [] as TNotifikasi[] };
        }
      } else {
        const result = await db
          .select()
          .from(notificationsTable)
          .where(eq(notificationsTable.noTelpNotification, user.phoneNumber))
          .orderBy(asc(notificationsTable.tanggalNotification));

        if (result.length > 0) {
          return { ok: true, data: result as TNotifikasi[] };
        } else {
          return { ok: true, data: [] as TNotifikasi[] };
        }
      }
    } catch (error) {
      console.error("error item data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-notification"],
  {
    tags: ["get-notification"],
  }
);
