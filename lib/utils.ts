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
