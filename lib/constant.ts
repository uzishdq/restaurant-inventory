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
    ACCOUNT: "/dashboard/account",
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
  ERROR: {
    INVALID_FIELD: "Invalid input. Please check your data.",
    DESCRIPTION: "We’re having some connection issues. Try again shortly.",
    SERVER: "Something went wrong on our server. Please try again later.",
    NOT_LOGIN: "You need to sign in to continue.",
    NOT_ID_USER: "Access denied. Invalid member ID.",
    UNAUTHORIZED: "You’re not authorized to perform this action.",
  },
};

// TAGS VALIDATION
export const tagsUserRevalidate = ["get-account", "get-users"];
export const tagsUnitRevalidate = ["get-units"];
export const tagsCategoryRevalidate = ["get-category"];
export const tagsItemRevalidate = ["get-items"];
export const tagsSupplierRevalidate = ["get-suppliers"];

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
