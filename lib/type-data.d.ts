//ENUM
export type roleType = "ADMIN" | "HEADKITCHEN" | "MANAGER";

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
