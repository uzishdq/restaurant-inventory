//ENUM
export type roleType = "ADMIN" | "HEADKITCHEN" | "MANAGER";
export type typeTransactionType = "IN" | "OUT";

//tambahkan APRROVED untuk setelah cek received ke tabel movement;
export type statusTransactionType =
  | "PENDING"
  | "ORDERED"
  | "RECEIVED"
  | "CANCELLED";

//TYPE
export type TUser = {
  idUser: string;
  nameUser: string;
  username: string;
  phoneNumber: string;
  role: roleType;
  createdAt: string;
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
