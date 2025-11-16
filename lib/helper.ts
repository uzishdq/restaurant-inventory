export function isTransactionId(id: string) {
  return /^TRX-(IN|OUT|CHK)-\d{4}$/.test(id);
}

export function extractNotification(message: string) {
  const headerMatch = message.match(/\*([^*]+)\*/);
  const header = headerMatch ? headerMatch[1].trim() : "Notification";
  const body = message.replace(headerMatch?.[0] ?? "", "").trim();
  return { header, body };
}
