export function isTransactionId(id: string) {
  return /^TRX-(IN|OUT|CHK)-\d{4}$/.test(id);
}

export function extractNotification(message: string) {
  const headerMatch = message.match(/\*([^*]+)\*/);
  const header = headerMatch ? headerMatch[1].trim() : "Notification";
  const body = message.replace(headerMatch?.[0] ?? "", "").trim();
  return { header, body };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function hasChanges(oldObj: any, newObj: any, fields: string[]) {
  return fields.some((f) => oldObj[f] !== newObj[f]);
}
