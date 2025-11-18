//ENUM
export type roleType = "ADMIN" | "HEADKITCHEN" | "MANAGER";
export type typeTransactionType = "IN" | "OUT" | "CHECK";

//tambahkan APRROVED untuk setelah cek received ke tabel movement;
export type statusTransactionType =
  | "PENDING"
  | "ORDERED"
  | "RECEIVED"
  | "CANCELLED"
  | "COMPLETED";
export type statusDetailTransactionType =
  | "PENDING"
  | "ORDERED"
  | "RECEIVED"
  | "CANCELLED"
  | "COMPLETED";
export type statusNotificationType = "PENDING" | "SENT" | "FAILED";

export type columnProps = {
  unit: TUnit[];
  category: TCategory[];
};

export type columnTrxProps = {
  items: TItemTrx[];
  suppliers: TSupplierTrx[];
};

//TYPE
export type TUser = {
  idUser: string;
  nameUser: string;
  username: string;
  phoneNumber: string;
  role: roleType;
  createdAt: string;
};

export type TUserNumber = {
  idUser: string;
  nameUser: string;
  phoneNumber: string;
  role: roleType;
};

export type TSupplier = {
  idSupplier: string;
  store_name: string;
  nameSupplier: string;
  addressSupplier: string;
  phoneSupplier: string;
};

export type TSupplierTrx = {
  idSupplier: string;
  store_name: string;
};

export type TUnit = {
  idUnit: string;
  nameUnit: string;
};

export type TCategory = {
  idCategory: string;
  nameCategory: string;
};

export type TItem = {
  idItem: string;
  nameItem: string;
  unitId: string;
  nameUnit: string;
  categoryId: string;
  nameCategory: string;
  stockQuantity: number;
  minStock: number;
  createdAt: Date;
  updatedAt: Date | null;
};

export type TItemTrx = {
  idItem: string;
  nameItem: string;
  nameUnit: string;
  qty: number;
};

export type TTransaction = {
  idTransaction: string;
  typeTransaction: typeTransactionType;
  dateTransaction: string;
  userId: string;
  nameUser: string;
  statusTransaction: statusTransactionType;
  totalItems: number;
};

export type TDetailTransaction = {
  idDetailTransaction: string;
  idTransaction: string;
  typeTransaction: typeTransactionType;
  itemId: string;
  nameItem: string;
  nameUnit: string;
  supplierId: string;
  store_name: string;
  quantityDetailTransaction: number;
  quantityCheck: number | null;
  quantityDifference: number | null;
  note: string | null;
  statusDetailTransaction: statusDetailTransactionType;
};

export type TOldDetailTransaction = {
  idDetailTransaction: string;
  transactionId: string;
  itemId: string;
  supplierId: string | null;
  quantityDetailTransaction: number;
  quantityCheck: number | null;
  quantityDifference: number | null;
  note: string | null;
  statusDetailTransaction: statusDetailTransactionType;
};

export type TInputNotifikasi = {
  noTelpNotification: string;
  messageNotification: string;
};

export type TNotifikasi = {
  idNotification: string;
  tanggalNotification: string;
  noTelpNotification: string | null;
  messageNotification: string;
  statusNotification: statusNotificationType;
};

export type TItemPurcaseNotif = {
  nameItem: string;
  nameUnit: string;
  qty: number;
};

export type TPurcaseNotif = {
  store_name: string;
  nameSupplier: string;
  phoneSupplier: string;
  items: TItemPurcaseNotif[];
};

export type TItemPurcaseMismatchNotif = {
  nameItem: string;
  nameUnit: string;
  qty: number;
  qtyCheck: number; // quantity hasil pengecekan
  qtyDifference: number; // selisih
  note?: string;
};

export type TPurcaseMismatchNotif = {
  nameUser: string;
  store_name: string;
  nameSupplier: string;
  items: TItemPurcaseMismatchNotif[];
};
