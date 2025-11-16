export const ROUTES = {
  PUBLIC: {
    LOGIN: "/",
  },
  AUTH: {
    DASHBOARD: "/dashboard",
    MASTER: {
      USERS: "/dashboard/users",
      SUPPLIER: "/dashboard/supplier",
      ITEMS: "/dashboard/items",
      UNIT: "/dashboard/unit",
      CATEGORY: "/dashboard/category",
    },
    TRANSACTION: {
      CREATE: "/dashboard/create-transaction",
      STOCK_IN: {
        INDEX: "/dashboard/incoming-item",
        DETAIL: (id: string) => `/dashboard/incoming-item/detail/${id}`,
      },
      STOCK_OUT: {
        INDEX: "/dashboard/outgoing-item",
        DETAIL: (id: string) => `/dashboard/outgoing-item/detail/${id}`,
      },
      INVENTORY_CHECK: {
        INDEX: "/dashboard/inventory-check",
        DETAIL: (id: string) => `/dashboard/inventory-check/detail/${id}`,
      },
    },
    ACCOUNT: "/dashboard/account",
    NOTIFICATION: "/dashboard/notification",
  },
};

export const DEFAULT_API_URL = "/api";
export const PUBLIC_API_URL = "/api/notifications";
export const DEFAULT_AUTH = "/api/auth";
export const PUBLIC_ROUTES = [ROUTES.PUBLIC.LOGIN];

export const LABEL = {
  INPUT: {
    SUCCESS: {
      SAVED: "Saved successfully.",
      UPDATE: "Updated successfully.",
      DELETE: "Deleted successfully.",
    },
    FAILED: {
      SAVED: "Couldn’t save data.",
      UPDATE: "Couldn’t update data.",
      DELETE: "Couldn’t delete data.",
    },
  },
  SUCCESS: {
    REVALIDATE: "Data is now fresh and updated.",
  },
  ERROR: {
    404: "Page Not Found",
    INVALID_FIELD: "Invalid input. Please check your data.",
    DESCRIPTION: "We’re having some connection issues. Try again shortly.",
    SERVER: "Something went wrong on our server. Please try again later.",
    NOT_LOGIN: "You need to sign in to continue.",
    NOT_ID_USER: "Access denied. Invalid member ID.",
    UNAUTHORIZED: "You’re not authorized to perform this action.",
  },
};

// TAGS VALIDATION
export const tagsUserRevalidate = [
  "get-account",
  "get-users",
  "get-notification",
];
export const tagsUnitRevalidate = ["get-units"];
export const tagsCategoryRevalidate = ["get-category"];
export const tagsItemRevalidate = [
  "get-items",
  "get-count-item",
  "get-items-trx",
];
export const tagsSupplierRevalidate = [
  "get-suppliers",
  "get-count-supplier",
  "get-suppliers-trx",
];
export const tagsTransactionRevalidate = [
  "get-transactions",
  "get-detail-transactions",
  "get-notification",
];

//ENUM SELECT
export const ROLE = [
  {
    name: "Admin",
    value: "ADMIN",
  },
  {
    name: "Head Kitchen",
    value: "HEADKITCHEN",
  },
  {
    name: "Manager",
    value: "MANAGER",
  },
];

export const TYPE_TRANSACTION = [
  {
    name: "Stock Check",
    value: "CHECK",
  },
  {
    name: "Stock In",
    value: "IN",
  },
  {
    name: "Stock Out",
    value: "OUT",
  },
];

export const STATUS_TRANSACTION = [
  {
    name: "Ordered",
    value: "ORDERED",
  },
  {
    name: "Receive",
    value: "RECEIVED",
  },
  {
    name: "Completed",
    value: "COMPLETED",
  },
  {
    name: "Cancelled",
    value: "CANCELLED",
  },
];

// DATE FILTER
export const YEARS = ["2022", "2023", "2024", "2025", "2026", "2027"];

export const MONTHS = [
  {
    title: "Januari",
    value: "01",
  },
  {
    title: "Februari",
    value: "02",
  },
  {
    title: "Maret",
    value: "03",
  },
  {
    title: "April",
    value: "04",
  },
  {
    title: "Mei",
    value: "05",
  },
  {
    title: "Juni",
    value: "06",
  },
  {
    title: "Juli",
    value: "07",
  },
  {
    title: "Agustus",
    value: "08",
  },
  {
    title: "September",
    value: "09",
  },
  {
    title: "Oktober",
    value: "10",
  },
  {
    title: "November",
    value: "11",
  },
  {
    title: "Desember",
    value: "12",
  },
];

// Color Select Transaction
export const statusColor: Record<string, string> = {
  PENDING: "text-gray-600",
  ORDERED: "text-blue-600",
  RECEIVED: "text-yellow-600",
  COMPLETED: "text-green-600",
  CANCELLED: "text-red-600",
};
