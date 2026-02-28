import {
  roleType,
  statusDetailTransactionType,
  statusTransactionType,
  stockStatusType,
  typeTransactionType,
} from "./type-data";

export type BadgeCategory =
  | "role"
  | "statusDetailTransaction"
  | "typeTransaction"
  | "statusTransaction"
  | "stockStatus";

export interface BadgeConfig {
  label: string;
  color: string;
}

// Use Record with explicit types
export const BADGE_CONFIG = {
  role: {
    SUPER_ADMIN: { label: "Super Admin", color: "bg-red-500" },
    ADMIN: { label: "Admin", color: "bg-gray-500" },
    MANAGER: { label: "Manager", color: "bg-blue-500" },
    HEADKITCHEN: { label: "Head Kitchen", color: "bg-yellow-500" },
  } satisfies Record<roleType, BadgeConfig>,

  statusDetailTransaction: {
    PENDING: { label: "Pending", color: "bg-gray-500" },
    ORDERED: { label: "Dalam Proses", color: "bg-blue-500" },
    RECEIVED: { label: "Diterima", color: "bg-yellow-500" },
    COMPLETED: { label: "Selesai", color: "bg-green-500" },
    CANCELLED: { label: "Dibatalkan", color: "bg-red-500" },
  } satisfies Record<statusDetailTransactionType, BadgeConfig>,

  typeTransaction: {
    CHECK: { label: "Pengecekan", color: "bg-blue-500" },
    IN: { label: "Masuk", color: "bg-green-500" },
    OUT: { label: "Keluar", color: "bg-red-500" },
  } satisfies Record<typeTransactionType, BadgeConfig>,

  statusTransaction: {
    PENDING: { label: "Pending", color: "bg-gray-500" },
    ORDERED: { label: "Dalam Proses", color: "bg-blue-500" },
    RECEIVED: { label: "Diterima", color: "bg-yellow-500" },
    COMPLETED: { label: "Selesai", color: "bg-green-500" },
    CANCELLED: { label: "Dibatalkan", color: "bg-red-500" },
  } satisfies Record<statusTransactionType, BadgeConfig>,

  stockStatus: {
    LOW_STOCK: { label: "Normal", color: "bg-green-500" },
    NORMAL: { label: "Low", color: "bg-red-500" },
  } satisfies Record<stockStatusType, BadgeConfig>,
} as const;

// Helper function to get badge config safely
export function getBadgeConfig(
  category: BadgeCategory,
  value: string,
): BadgeConfig | null {
  const categoryConfig = BADGE_CONFIG[category];

  // Type-safe access
  if (value in categoryConfig) {
    return categoryConfig[value as keyof typeof categoryConfig] as BadgeConfig;
  }

  return null;
}
