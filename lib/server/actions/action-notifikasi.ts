"use server";

import {
  TInputNotifikasi,
  TItemPurcaseNotif,
  TPurcaseMismatchNotif,
  TPurcaseNotif,
} from "@/lib/type-data";
import { getItemsTrx } from "../data/data-item";
import { getSuppliers } from "../data/data-supplier";
import {
  templatePurchaseMismatch,
  templatePurchaseRequest,
  templatePurchaseUpdate,
} from "@/lib/template-notif";
import { db } from "@/lib/db";
import { notificationsTable } from "@/lib/db/schema";
import { getUsersNumberByRole } from "../data/data-user";

export const supplierNotification = async (
  data: {
    itemId: string;
    supplierId: string;
    quantityDetailTransaction: number;
  }[]
) => {
  try {
    const [items, suppliers] = await Promise.all([
      getItemsTrx(),
      getSuppliers(),
    ]);

    if (!items.data || !suppliers.data) {
      return false;
    }

    const grouped = data.reduce((acc, cur) => {
      if (!acc[cur.supplierId]) acc[cur.supplierId] = [];
      acc[cur.supplierId].push(cur);
      return acc;
    }, {} as Record<string, typeof data>);

    const result: TPurcaseNotif[] = [];

    for (const supplierId in grouped) {
      const supplier = suppliers.data.find((s) => s.idSupplier === supplierId);
      if (!supplier) continue;

      const itemList: TItemPurcaseNotif[] = grouped[supplierId].map((d) => {
        const item = items.data.find((i) => i.idItem === d.itemId);
        return {
          nameItem: item?.nameItem ?? "",
          nameUnit: item?.nameUnit ?? "",
          qty: d.quantityDetailTransaction,
        };
      });

      result.push({
        store_name: supplier.store_name,
        nameSupplier: supplier.nameSupplier,
        phoneSupplier: supplier.phoneSupplier,
        items: itemList,
      });
    }

    const notificationData: TInputNotifikasi[] = result.map((r) => ({
      noTelpNotification: r.phoneSupplier,
      messageNotification: templatePurchaseRequest(r),
    }));

    await db.insert(notificationsTable).values(notificationData);

    console.log(notificationData);

    return true;
  } catch (error) {
    console.error("error supplier notification : ", error);
    return false;
  }
};

export const updateSupplierNotification = async (data: {
  itemId: string;
  supplierId: string;
  quantityDetailTransaction: number;
}) => {
  try {
    const [items, suppliers] = await Promise.all([
      getItemsTrx(),
      getSuppliers(),
    ]);

    if (!items.data || !suppliers.data) {
      return false;
    }

    // find supplier
    const supplier = suppliers.data.find(
      (s) => s.idSupplier === data.supplierId
    );

    if (!supplier) return false;

    // find item
    const item = items.data.find((i) => i.idItem === data.itemId);
    if (!item) return false;

    const result: TPurcaseNotif = {
      store_name: supplier.store_name,
      nameSupplier: supplier.nameSupplier,
      phoneSupplier: supplier.phoneSupplier,
      items: [
        {
          nameItem: item.nameItem,
          nameUnit: item.nameUnit,
          qty: data.quantityDetailTransaction,
        },
      ],
    };

    const notificationData: TInputNotifikasi = {
      noTelpNotification: result.phoneSupplier,
      messageNotification: templatePurchaseUpdate(result),
    };

    await db.insert(notificationsTable).values(notificationData);

    console.log(notificationData);

    return true;
  } catch (error) {
    console.error("error update supplier notification : ", error);
    return false;
  }
};

export const purchaseMismatchNotification = async (data: {
  itemId: string;
  supplierId: string;
  quantityDetailTransaction: number;
  quantityCheck: number | null;
  quantityDifference: number | null;
  note: string | null;
}) => {
  try {
    const [users, items, suppliers] = await Promise.all([
      getUsersNumberByRole("ADMIN"),
      getItemsTrx(),
      getSuppliers(),
    ]);

    if (!users.data || !items.data || !suppliers.data) {
      return false;
    }

    // find supplier
    const supplier = suppliers.data.find(
      (s) => s.idSupplier === data.supplierId
    );

    if (!supplier) return false;

    // find item
    const item = items.data.find((i) => i.idItem === data.itemId);
    if (!item) return false;

    const baseResult = {
      store_name: supplier.store_name,
      nameSupplier: supplier.nameSupplier,
      items: [
        {
          nameItem: item.nameItem,
          nameUnit: item.nameUnit,
          qty: data.quantityDetailTransaction,
          qtyCheck: data.quantityCheck ?? 0,
          qtyDifference: data.quantityDifference ?? 0,
          note: data.note ?? "tida ada note",
        },
      ],
    };

    const notificationData: TInputNotifikasi[] = users.data.map((admin) => {
      const notifData: TPurcaseMismatchNotif = {
        nameUser: admin.nameUser,
        ...baseResult,
      };

      return {
        noTelpNotification: admin.phoneNumber,
        messageNotification: templatePurchaseMismatch(notifData),
      };
    });

    await db.insert(notificationsTable).values(notificationData);

    console.log(notificationData);

    return true;
  } catch (error) {
    console.error("error update supplier notification : ", error);
    return false;
  }
};
