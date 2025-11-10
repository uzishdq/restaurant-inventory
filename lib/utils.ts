import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateKode(prefix: string, lastId?: string) {
  if (!lastId) return `${prefix}-0001`;
  const counter = parseInt(lastId.split("-")[1]) || 0;
  return `${prefix}-${String(counter + 1).padStart(4, "0")}`;
}

export function formatDateWIB(value?: Date | string | null): string {
  if (!value) return "—";

  const date = value instanceof Date ? value : new Date(value);

  // formatter untuk tanggal Indonesia, timezone WIB (Asia/Jakarta)
  const formatter = new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const formatted = formatter.format(date);

  return `${formatted} WIB`;
}

export function formatDateToIndo(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);

  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}
