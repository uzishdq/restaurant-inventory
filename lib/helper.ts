export function isTransactionId(id: string) {
  return /^TRX-(IN|OUT)-\d{4}$/.test(id);
}
