import { ROUTE_TITLES } from "./constant";
import { TReportTransaction } from "./type-data";
import { formatDateWIB } from "./utils";

export function getPageTitle(pathname: string): string {
  const title =
    ROUTE_TITLES.find((r) => r.pattern.test(pathname))?.title ?? "Page";

  return title;
}

export function isTransactionId(id: string) {
  return /^TRX-(IN|OUT|CHK)-\d{4}$/.test(id);
}

export function extractNotification(message: string) {
  const headerMatch = new RegExp(/\*([^*]+)\*/).exec(message);
  const header = headerMatch ? headerMatch[1].trim() : "Notification";
  const body = message.replace(headerMatch?.[0] ?? "", "").trim();
  return { header, body };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasChanges(oldObj: any, newObj: any, fields: string[]) {
  return fields.some((f) => oldObj[f] !== newObj[f]);
}

export function formatReportTransactionDates(
  data: TReportTransaction[] | null,
): TReportTransaction[] {
  if (!data) {
    return [];
  }

  return data.map((item) => ({
    ...item,
    dateTransaction: item.dateTransaction
      ? formatDateWIB(item.dateTransaction)
      : null,
  }));
}
