import z from "zod";

const allowedRegex = /^[a-zA-Z0-9.,/ \-']+$/;

const username = z
  .string()
  .min(5, "must be at least 5 characters long.")
  .max(50, "must not exceed 50 characters.")
  .regex(
    allowedRegex,
    "Use only letters, numbers, spaces, dots, commas, or slashes."
  )
  .refine((username) => !/\s/.test(username), {
    message: "can’t contain spaces.",
  });

const password = z
  .string()
  .min(6, "must be at least 6 characters long.")
  .max(50, "must not exceed 50 characters.");

export const IdSchema = z.object({
  id: z.uuid("Invalid ID format."),
});

const validatedStringSchema = (min = 5, max = 50) =>
  z
    .string()
    .min(min, `must be at least ${min} characters long.`)
    .max(max, `must not exceed ${max} characters.`)
    .regex(
      allowedRegex,
      "Use only letters, numbers, spaces, dots, commas, or slashes."
    );

const validatedPhoneSchema = z
  .string()
  .min(10, {
    message: "Phone number must be at least 10 digits long.",
  })
  .max(15, {
    message: "Phone number must not exceed 15 digits.",
  })
  .regex(/^[0-9]+$/, {
    message: "Phone number can contain digits only.",
  })
  .refine((value) => value.startsWith("0"), {
    message: "Phone number must start with the digit 0.",
  });

const validatedStock = (min = 0, max = 60) =>
  z.number().refine(
    (n) => {
      const allowZero = min === 0;
      return (n >= min && n <= max) || (allowZero && n === 0);
    },
    {
      message: `Must be at least ${min} - ${max}`,
    }
  );

const itemIdSchema = z.string().regex(/^BB-\d{4}$/, {
  message: "Invalid ID format.",
});

export const transactionIdSchema = z.string().regex(/^TRX-(IN|OUT)-\d{4}$/, {
  message: "Invalid transaction ID format.",
});

export const DeleteUUIDSchema = z.object({
  id: z.uuid("Invalid ID format.").min(5),
});

/* -------- ENUM --------  */
export const enumRole = ["ADMIN", "HEADKITCHEN", "MANAGER"] as const;
export const enumTypeTransaction = ["IN", "OUT"] as const;
export const enumStatusTransaction = [
  "PENDING",
  "ORDERED",
  "RECEIVED",
  "CANCELLED",
] as const;

/* -------- AUTH --------  */
export const LoginSchema = z.object({
  username: username,
  password: password,
});

/* -------- ACCOUNT --------  */
export const CreateAccountSchema = z.object({
  name: validatedStringSchema(5, 50),
  username: username,
  phoneNumber: validatedPhoneSchema,
  role: z.enum(enumRole),
});

export const ProfileUpdateSchema = z.object({
  name: validatedStringSchema(5, 50),
  phoneNumber: validatedPhoneSchema,
});

export const UsernameUpdateSchema = z
  .object({
    oldUsername: username,
    newUsername: username,
  })
  .refine((data) => data.oldUsername !== data.newUsername, {
    message: "New username must be different from the current username",
    path: ["newUsername"],
  });

export const PasswordUpdateSchema = z
  .object({
    oldPassword: password,
    newPassword: password,
    newConfirmPassword: password,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "New password must be different from the current password",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.newConfirmPassword, {
    message: "Passwords do not match",
    path: ["newConfirmPassword"],
  });

export const RoleUpdateSchema = z.object({
  idUser: z.uuid("Invalid ID format.").min(5),
  role: z.enum(enumRole),
});

/* -------- SUPPLIER --------  */
export const CreateSupplierSchema = z.object({
  store_name: validatedStringSchema(5, 50),
  nameSupplier: validatedStringSchema(5, 50),
  addressSupplier: validatedStringSchema(5, 100),
  phoneSupplier: validatedPhoneSchema,
});

export const UpdateSupplierSchema = z.object({
  idSupplier: z.uuid("Invalid ID format.").min(5),
  store_name: validatedStringSchema(5, 50),
  nameSupplier: validatedStringSchema(5, 50),
  addressSupplier: validatedStringSchema(5, 100),
  phoneSupplier: validatedPhoneSchema,
});

/* -------- UNIT --------  */
export const CreateUnitSchema = z.object({
  nameUnit: validatedStringSchema(2, 10),
});

export const UpdateUnitSchema = z.object({
  idUnit: z.uuid("Invalid ID format.").min(5),
  nameUnit: validatedStringSchema(2, 10),
});

/* -------- CATEGORY --------  */
export const CreateCategorySchema = z.object({
  nameCategory: validatedStringSchema(5, 10),
});

export const UpdateCategorySchema = z.object({
  idCategory: z.uuid("Invalid ID format.").min(5),
  nameCategory: validatedStringSchema(5, 10),
});

/* -------- ITEM --------  */
export const CreateItemSchema = z.object({
  nameItem: validatedStringSchema(5, 100),
  unitId: z.uuid("Invalid ID format.").min(5),
  categoryId: z.uuid("Invalid ID format.").min(5),
  minStock: validatedStock(),
});

export const UpdateItemSchema = z.object({
  idItem: itemIdSchema,
  nameItem: validatedStringSchema(5, 100),
  unitId: z.uuid("Invalid ID format.").min(5),
  categoryId: z.uuid("Invalid ID format.").min(5),
  minStock: validatedStock(),
});

export const DeleteItemSchema = z.object({
  idItem: itemIdSchema,
});

/* -------- TRANSACTION --------  */
const transactionDetailSchema = z.object({
  itemId: itemIdSchema,
  supplierId: z.uuid("Invalid ID format.").min(5),
  quantityDetailTransaction: validatedStock(1, 500),
});

export const CreateTransactionSchema = z.object({
  typeTransaction: z.enum(enumTypeTransaction),
  detail: z
    .array(transactionDetailSchema)
    .min(1, "At least one transaction detail is required."),
});

export const DeleteTransactionSchema = z.object({
  idTransaction: transactionIdSchema,
});
