"use server";

import { db } from "@/lib/db";
import {
  categoryTable,
  itemMovementTable,
  itemTable,
  unitTable,
} from "@/lib/db/schema";
import {
  TItem,
  TItemMovement,
  TItemMovementChart,
  TItemTrx,
  TLowItem,
  TStockReportItem,
} from "@/lib/type-data";
import { and, asc, count, eq, gte, inArray, lt, lte, sql } from "drizzle-orm";
import * as z from "zod";
import { unstable_cache } from "next/cache";
import { ReportItemSchema } from "@/lib/schema-validation";
import { LABEL } from "@/lib/constant";

export async function generateItemID() {
  const [result] = await db
    .select({ maxNo: sql<string>`max(${itemTable.idItem})` })
    .from(itemTable)
    .limit(1);

  const maxID = result.maxNo || "BB-0000";
  const currentNumber = Number.parseInt(maxID.split("-")[1], 10);
  const nextNumber = currentNumber + 1;
  const nextID = `BB-${nextNumber.toString().padStart(4, "0")}`;

  return nextID;
}

export const getItems = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          idItem: itemTable.idItem,
          nameItem: itemTable.nameItem,
          unitId: unitTable.idUnit,
          nameUnit: unitTable.nameUnit,
          categoryId: categoryTable.idCategory,
          nameCategory: categoryTable.nameCategory,
          stockQuantity: itemTable.stockQuantity,
          minStock: itemTable.minStock,
          createdAt: itemTable.createdAt,
          updatedAt: itemTable.updatedAt,
        })
        .from(itemTable)
        .leftJoin(unitTable, eq(itemTable.unitId, unitTable.idUnit))
        .leftJoin(
          categoryTable,
          eq(itemTable.categoryId, categoryTable.idCategory),
        )
        .orderBy(asc(itemTable.idItem));

      if (result.length > 0) {
        return { ok: true, data: result as TItem[] };
      } else {
        return { ok: true, data: [] as TItem[] };
      }
    } catch (error) {
      console.error("error item data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-items"],
  {
    tags: ["get-items"],
  },
);

export const getItemsMovement = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          idMovement: itemMovementTable.idMovement,
          transactionId: itemMovementTable.transactionId,
          typeMovement: itemMovementTable.typeMovement,
          itemId: itemMovementTable.itemId,
          nameItem: itemTable.nameItem,
          unitId: unitTable.idUnit,
          nameUnit: unitTable.nameUnit,
          categoryId: categoryTable.idCategory,
          nameCategory: categoryTable.nameCategory,
          quantityMovement: itemMovementTable.quantityMovement,
          dateExp: itemMovementTable.dateExp,
          createdAt: itemMovementTable.createdAt,
          updatedAt: itemMovementTable.updatedAt,
        })
        .from(itemMovementTable)
        .leftJoin(itemTable, eq(itemMovementTable.itemId, itemTable.idItem))
        .leftJoin(unitTable, eq(itemTable.unitId, unitTable.idUnit))
        .leftJoin(
          categoryTable,
          eq(itemTable.categoryId, categoryTable.idCategory),
        )
        .orderBy(asc(itemMovementTable.createdAt));

      if (result.length > 0) {
        return { ok: true, data: result as TItemMovement[] };
      } else {
        return { ok: true, data: [] as TItemMovement[] };
      }
    } catch (error) {
      console.error("error item data : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-items-movement"],
  {
    tags: ["get-items-movement"],
  },
);

export const getItemsTrx = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          idItem: itemTable.idItem,
          nameItem: itemTable.nameItem,
          nameUnit: unitTable.nameUnit,
          qty: itemTable.stockQuantity,
        })
        .from(itemTable)
        .leftJoin(unitTable, eq(unitTable.idUnit, itemTable.unitId))
        .orderBy(asc(itemTable.idItem));

      if (result.length > 0) {
        return { ok: true, data: result as TItemTrx[] };
      } else {
        return { ok: true, data: [] as TItemTrx[] };
      }
    } catch (error) {
      console.error("error item data trx: ", error);
      return { ok: false, data: null };
    }
  },
  ["get-items-trx"],
  {
    tags: ["get-items-trx"],
  },
);

export const getCountItem = unstable_cache(
  async () => {
    try {
      const [result] = await db.select({ total: count() }).from(itemTable);

      return { ok: true, data: result.total ?? 0 };
    } catch (error) {
      console.error("error count item : ", error);
      return { ok: false, data: 0 };
    }
  },
  ["get-count-item"],
  {
    tags: ["get-count-item"],
  },
);

export const getLowItem = unstable_cache(
  async () => {
    try {
      const result = await db
        .select({
          idItem: itemTable.idItem,
          nameItem: itemTable.nameItem,
          nameUnit: unitTable.nameUnit,
          stockQuantity: itemTable.stockQuantity,
          minStock: itemTable.minStock,
          updatedAt: itemTable.updatedAt,
        })
        .from(itemTable)
        .leftJoin(unitTable, eq(itemTable.unitId, unitTable.idUnit))
        .where(lte(itemTable.stockQuantity, itemTable.minStock))
        .orderBy(asc(itemTable.stockQuantity));

      if (result.length > 0) {
        return { ok: true, data: result as TLowItem[] };
      } else {
        return { ok: true, data: null };
      }
    } catch (error) {
      console.error("error low item : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-low-item"],
  {
    tags: ["get-low-item"],
  },
);

export const getItemMovementGrouped = unstable_cache(
  async () => {
    try {
      const now = new Date();

      // Awal bulan sekarang (tanggal 1)
      const startOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1,
      );

      // Akhir bulan sekarang (tanggal terakhir)
      const endOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth() + 1,
        0,
        23,
        59,
        59,
        999,
      );

      const allItems = await db
        .select({
          idItem: itemTable.idItem,
          name: itemTable.nameItem,
        })
        .from(itemTable)
        .orderBy(itemTable.nameItem);

      // Ambil data movement
      const movements = await db
        .select({
          idItem: itemTable.idItem,
          date: sql<string>`TO_CHAR(${itemMovementTable.createdAt}, 'YYYY-MM-DD')`,
          incoming: sql<number>`
            SUM(
              CASE
                WHEN ${itemMovementTable.typeMovement} = 'IN'
                THEN ${itemMovementTable.quantityMovement}
                ELSE 0
              END
            )
          `,
          outgoing: sql<number>`
            SUM(
              CASE
                WHEN ${itemMovementTable.typeMovement} = 'OUT'
                THEN ABS(${itemMovementTable.quantityMovement})
                ELSE 0
              END
            )
          `,
        })
        .from(itemMovementTable)
        .leftJoin(itemTable, eq(itemMovementTable.itemId, itemTable.idItem))
        .where(
          and(
            inArray(itemMovementTable.typeMovement, ["IN", "OUT"]),
            gte(itemMovementTable.createdAt, startOfCurrentMonth),
            lte(itemMovementTable.createdAt, endOfCurrentMonth),
          ),
        )
        .groupBy(
          itemTable.idItem,
          sql`TO_CHAR(${itemMovementTable.createdAt}, 'YYYY-MM-DD')`,
        )
        .orderBy(sql`TO_CHAR(${itemMovementTable.createdAt}, 'YYYY-MM-DD')`);

      // Gabungkan semua item dengan movement data
      const groupedByItem: TItemMovementChart[] = allItems.map((item) => {
        const itemMovements = movements.filter(
          (movement) => movement.idItem === item.idItem,
        );

        return {
          idItem: item.idItem,
          name: item.name,
          result: itemMovements.map((movement) => ({
            date: movement.date,
            incoming: Number(movement.incoming),
            outgoing: Number(movement.outgoing),
          })),
        };
      });

      return { ok: true, data: groupedByItem };
    } catch (error) {
      console.error("error count item : ", error);
      return { ok: false, data: null };
    }
  },
  ["get-item-movement-grouped"],
  {
    tags: ["get-item-movement-grouped"],
  },
);

export const getStockReport = unstable_cache(
  async (values: z.infer<typeof ReportItemSchema>) => {
    try {
      const validateValue = ReportItemSchema.safeParse(values);

      if (!validateValue.success) {
        return { ok: false, data: null, message: LABEL.ERROR.INVALID_FIELD };
      }

      const { startDate, endDate } = validateValue.data;

      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setDate(end.getDate() + 1);

      const report = await db
        .select({
          idItem: itemTable.idItem,
          nameItem: itemTable.nameItem,
          stokAkhir: itemTable.stockQuantity,
          stokMinimum: itemTable.minStock,
          nameCategory: categoryTable.nameCategory,
          nameUnit: unitTable.nameUnit,

          totalMasuk: sql<string>`
      COALESCE(SUM(CASE WHEN ${itemMovementTable.typeMovement} = 'IN' THEN ${itemMovementTable.quantityMovement} ELSE 0 END), 0)
    `.as("total_masuk"),

          totalKeluar: sql<string>`
      COALESCE(SUM(CASE WHEN ${itemMovementTable.typeMovement} = 'OUT' THEN ${itemMovementTable.quantityMovement} ELSE 0 END), 0)
    `.as("total_keluar"),

          totalKoreksi: sql<string>`
      COALESCE(SUM(CASE WHEN ${itemMovementTable.typeMovement} = 'CHECK' THEN ${itemMovementTable.quantityMovement} ELSE 0 END), 0)
    `.as("total_koreksi"),

          totalTransaksi: sql<number>`
      COUNT(${itemMovementTable.idMovement})
    `.as("total_transaksi"),
        })
        .from(itemTable)
        .innerJoin(
          // <-- GANTI KE INNER JOIN
          itemMovementTable,
          eq(itemTable.idItem, itemMovementTable.itemId),
        )
        .leftJoin(
          categoryTable,
          eq(categoryTable.idCategory, itemTable.categoryId),
        )
        .leftJoin(unitTable, eq(unitTable.idUnit, itemTable.unitId))
        .where(
          and(
            gte(itemMovementTable.createdAt, start),
            lt(itemMovementTable.createdAt, end),
          ),
        )
        .groupBy(
          itemTable.idItem,
          itemTable.nameItem,
          itemTable.stockQuantity,
          itemTable.minStock,
          categoryTable.nameCategory,
          unitTable.nameUnit,
        )
        .orderBy(asc(itemTable.idItem));

      const result = report.map((item): TStockReportItem => {
        const totalMasukDB = Number(item.totalMasuk) || 0; // selalu ≥ 0 dari DB
        const totalKeluarDB = Number(item.totalKeluar) || 0; // biasanya ≤ 0 dari DB
        const totalKoreksiDB = Number(item.totalKoreksi) || 0; // bisa positif atau negatif

        const stokAkhir = Math.max(0, Number(item.stokAkhir) || 0);
        const stokMinimum = Math.max(0, Number(item.stokMinimum) || 0);

        // Pisahkan koreksi berdasarkan tanda
        let koreksiMasuk = 0;
        let koreksiKeluar = 0;

        if (totalKoreksiDB >= 0) {
          koreksiMasuk = totalKoreksiDB;
        } else {
          koreksiKeluar = totalKoreksiDB; // tetap negatif di sini
        }

        // Gabungkan ke masing-masing bucket
        const totalMasuk = totalMasukDB + koreksiMasuk; // ≥ 0
        const totalKeluar = totalKeluarDB + koreksiKeluar; // ≤ 0

        // Total perubahan stok selama periode
        const totalPerubahan = totalMasuk + totalKeluar; // masuk + keluar (negatif)

        // Stok sebelum periode dimulai
        const stokAwal = Math.max(0, stokAkhir - totalPerubahan);

        const statusStok = stokAkhir <= stokMinimum ? "LOW_STOCK" : "NORMAL";

        return {
          idItem: item.idItem,
          nameItem: item.nameItem,
          nameCategory: item.nameCategory ?? "-",
          nameUnit: item.nameUnit ?? "-",

          stokAwal,
          stokAkhir,
          stokMinimum,
          statusStok,

          totalMasuk, // sudah termasuk koreksi positif
          totalKeluar: Math.abs(totalKeluar), // tampilkan nilai absolut di frontend
          totalPerubahan,
          totalTransaksi: item.totalTransaksi,
        };
      });

      if (result.length > 0) {
        return {
          ok: true,
          data: result,
          message: LABEL.SUCCESS.DATA_FOUND,
        };
      } else {
        return { ok: true, data: [], message: LABEL.ERROR.DATA_NOT_FOUND };
      }
    } catch (error) {
      console.error("error stock report : ", error);
      return { ok: false, data: null, message: LABEL.ERROR.SERVER };
    }
  },
  ["get-report-items"],
  {
    tags: ["get-report-items"],
  },
);
