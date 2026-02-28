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
      MOVEMENT: "/dashboard/item-movement",
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
    REPORT: {
      TRANSACTION: "/dashboard/report-transaction",
      FIND_LAPORAN_TRANSACTION: (query: string) =>
        `/dashboard/report-transaction?${query}`,
      ITEM: "/dashboard/report-item",
      FIND_LAPORAN_ITEM: (query: string) => `/dashboard/report-item?${query}`,
    },
    ACCOUNT: "/dashboard/account",
    NOTIFICATION: "/dashboard/notification",
  },
};

export const DEFAULT_API_URL = "/api";
export const PUBLIC_API_URL = "/api/notifications";
export const DEFAULT_AUTH = "/api/auth";
export const PUBLIC_ROUTES = [ROUTES.PUBLIC.LOGIN];

export const transactionDetailRouteMap = {
  IN: ROUTES.AUTH.TRANSACTION.STOCK_IN.DETAIL,
  OUT: ROUTES.AUTH.TRANSACTION.STOCK_OUT.DETAIL,
  CHECK: ROUTES.AUTH.TRANSACTION.INVENTORY_CHECK.DETAIL,
} as const;

export const ROUTE_TITLES: { pattern: RegExp; title: string }[] = [
  // Public
  { pattern: /^\/$/, title: "Login" },

  // Dashboard
  { pattern: /^\/dashboard$/, title: "Dashboard" },

  // Master Data
  { pattern: /^\/dashboard\/users$/, title: "Manajemen Pengguna" },
  { pattern: /^\/dashboard\/supplier$/, title: "Supplier" },
  { pattern: /^\/dashboard\/items$/, title: "Bahan Baku" },
  { pattern: /^\/dashboard\/unit$/, title: "Satuan" },
  { pattern: /^\/dashboard\/category$/, title: "Kategori" },

  // Transaction
  { pattern: /^\/dashboard\/create-transaction$/, title: "Buat Transaksi" },
  { pattern: /^\/dashboard\/item-movement$/, title: "Pergerakan Bahan Baku" },

  // Stock In
  {
    pattern: /^\/dashboard\/incoming-item$/,
    title: "Pengadaan Bahan Baku",
  },
  {
    pattern: /^\/dashboard\/incoming-item\/detail\/.+$/,
    title: "Detail Pengadaan Bahan Baku",
  },

  // Stock Out
  {
    pattern: /^\/dashboard\/outgoing-item$/,
    title: "Bahan Baku Keluar",
  },
  {
    pattern: /^\/dashboard\/outgoing-item\/detail\/.+$/,
    title: "Detail Bahan Baku Keluar",
  },

  // Inventory Check
  {
    pattern: /^\/dashboard\/inventory-check$/,
    title: "Pemeriksaan Bahan Baku",
  },
  {
    pattern: /^\/dashboard\/inventory-check\/detail\/.+$/,
    title: "Detail Pemeriksaan Bahan Baku",
  },

  // Report
  {
    pattern: /^\/dashboard\/report-transaction$/,
    title: "Laporan Transaksi",
  },
  {
    pattern: /^\/dashboard\/report-item$/,
    title: "Laporan Bahan Baku",
  },

  // Account & Notification
  {
    pattern: /^\/dashboard\/account$/,
    title: "Akun Saya",
  },
  {
    pattern: /^\/dashboard\/notification$/,
    title: "Notifikasi",
  },
];

export const LABEL = {
  INPUT: {
    SUCCESS: {
      SAVED: "Berhasil menyimpan data.",
      UPDATE: "Berhasil memperbarui data.",
      DELETE: "Berhasil menghapus data.",
    },
    FAILED: {
      SAVED: "Gagal menyimpan data.",
      UPDATE: "Gagal memperbarui data.",
      DELETE: "Gagal menghapus data.",
    },
  },
  SUCCESS: {
    REVALIDATE: "Data berhasil diperbarui.",
    DATA_FOUND: "Data ditemukan.",
  },
  ERROR: {
    404: "Halaman tidak ditemukan.",
    CHECK_DATA: "Tidak ada perubahan data.",
    DATA_NOT_FOUND: "Data tidak ditemukan.",
    INVALID_FIELD: "Input tidak valid. Silakan periksa kembali data Anda.",
    DESCRIPTION: "Terjadi gangguan koneksi. Silakan coba lagi nanti.",
    SERVER: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    NOT_LOGIN: "Silakan masuk untuk melanjutkan.",
    NOT_ID_USER: "Akses ditolak. ID pengguna tidak valid.",
    UNAUTHORIZED: "Anda tidak memiliki izin untuk melakukan tindakan ini.",
  },
};

// TAGS VALIDATION
export const tagsUserRevalidate = [
  "get-account",
  "get-users",
  "get-notification",
  "get-users-numberByRole",
];
export const tagsUnitRevalidate = ["get-units"];
export const tagsCategoryRevalidate = ["get-category"];
export const tagsItemRevalidate = [
  "get-items",
  "get-count-item",
  "get-low-item",
  "get-items-trx",
  "get-items-movement",
  "get-item-movement-grouped",
];
export const tagsSupplierRevalidate = [
  "get-suppliers",
  "get-count-supplier",
  "get-suppliers-trx",
];
export const tagsTransactionRevalidate = [
  "get-transactions",
  "get-detail-transactions",
  "get-old-detail-transaction",
  "get-notification",
  "get-notif-sidebar",
  "get-last-transactions",
  "get-report-transactions",
  "get-report-items",
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
    name: "Cek Bahan Baku",
    value: "CHECK",
  },
  {
    name: "Pengadaan Bahan Baku",
    value: "IN",
  },
  {
    name: "Bahan Baku Keluar",
    value: "OUT",
  },
];

export const CO_TRANSACTION = [
  {
    type: "CHECK",
    value: "Sebelum Operasional",
  },
  {
    type: "CHECK",
    value: "Setelah Operasional",
  },
  {
    type: "IN",
    value: "Tidak sesuai",
  },
  {
    type: "OUT",
    value: "Kebutuhan Operasional",
  },
  {
    type: "OUT",
    value: "Diluar Operasional",
  },
];

export const STATUS_TRANSACTION = [
  {
    name: "Dalam Proses",
    value: "ORDERED",
  },
  {
    name: "Diterima",
    value: "RECEIVED",
  },
  {
    name: "Selesai",
    value: "COMPLETED",
  },
  {
    name: "Dibatalkan",
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
