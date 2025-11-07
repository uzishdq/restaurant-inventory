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
