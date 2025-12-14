import z from "zod";
import { TItemTrx } from "./type-data";

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
  z.number("Required").refine(
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

export const transactionIdSchema = z
  .string()
  .regex(/^TRX-(IN|OUT|CHK)-\d{4}$/, {
    message: "Invalid transaction ID format.",
  });

export const DeleteUUIDSchema = z.object({
  id: z.uuid("Invalid ID format.").min(5),
});

const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Date format must be YYYY-MM-DD")
  .refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && val === d.toISOString().slice(0, 10);
  }, "Invalid date");

/* -------- ENUM --------  */
export const enumRole = ["ADMIN", "HEADKITCHEN", "MANAGER"] as const;
export const enumTypeTransaction = ["IN", "OUT", "CHECK"] as const;
export const enumStatusTransaction = [
  "PENDING",
  "ORDERED",
  "RECEIVED",
  "CANCELLED",
  "COMPLETED",
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
  supplierId: z.string().optional(),
  quantityDetailTransaction: validatedStock(1, 5000),
  quantityCheck: validatedStock(-500, 500),
  quantityDifference: validatedStock(-500, 500),
  note: z
    .string()
    .max(100, "must not exceed 100 characters.")
    .regex(
      allowedRegex,
      "Use only letters, numbers, spaces, dots, commas, or slashes."
    )
    .optional()
    .or(z.literal("")),
});

export const CreateTransactionTestSchema = (items: TItemTrx[]) =>
  z
    .object({
      typeTransaction: z.enum(enumTypeTransaction),
      detail: z
        .array(transactionDetailSchema)
        .min(1, "At least one transaction detail is required."),
    })
    .superRefine((data, ctx) => {
      data.detail.forEach((d, i) => {
        const item = items.find((it) => it.idItem === d.itemId);

        if (!item) {
          ctx.addIssue({
            code: "custom",
            path: ["detail", i, "itemId"],
            message: "Item not found.",
          });
          return;
        }

        // Supplier wajib hanya jika IN
        if (data.typeTransaction === "IN") {
          if (!d.supplierId) {
            ctx.addIssue({
              code: "custom",
              path: ["detail", i, "supplierId"],
              message: "Store is required for incoming transactions.",
            });
          }
        }

        // Validasi stok untuk OUT
        if (data.typeTransaction === "OUT") {
          if (d.quantityDetailTransaction > item.qty) {
            ctx.addIssue({
              code: "custom",
              path: ["detail", i, "quantityDetailTransaction"],
              message: `Quantity exceeds available stock (${item.qty}).`,
            });
          }
        }

        // Validasi CHECK
        if (data.typeTransaction === "CHECK") {
          if (d.quantityDetailTransaction !== item.qty) {
            ctx.addIssue({
              code: "custom",
              path: ["detail", i, "quantityDetailTransaction"],
              message: `System stock must be ${item.qty}.`,
            });
          }

          if (d.quantityDifference !== d.quantityCheck - item.qty) {
            ctx.addIssue({
              code: "custom",
              path: ["detail", i, "quantityDifference"],
              message: "Difference does not match check - system.",
            });
          }
        }

        //Validasi note
        if (["CHECK", "OUT"].includes(data.typeTransaction)) {
          if (!d.note || d.note.trim() === "") {
            ctx.addIssue({
              code: "custom",
              path: ["detail", i, "note"],
              message: "Note is required for this transactions.",
            });
          }
        }
      });
    });

export const DeleteTransactionSchema = z.object({
  idTransaction: transactionIdSchema,
});

export const UpdateTransactionSchema = z.object({
  idTransaction: transactionIdSchema,
  typeTransaction: z.enum(enumTypeTransaction),
  statusTransaction: z.enum(enumStatusTransaction, { message: "Required" }),
});

export const AddTransactionDetailSchema = (items: TItemTrx[]) =>
  z
    .object({
      idTransaction: transactionIdSchema,
      typeTransaction: z.enum(enumTypeTransaction),
      detail: z
        .array(transactionDetailSchema)
        .min(1, "At least one transaction detail is required."),
    })
    .superRefine((data, ctx) => {
      data.detail.forEach((d, i) => {
        const item = items.find((it) => it.idItem === d.itemId);

        if (!item) {
          ctx.addIssue({
            code: "custom",
            path: ["detail", i, "itemId"],
            message: "Item not found.",
          });
          return;
        }

        if (data.typeTransaction === "IN") {
          if (!d.supplierId) {
            ctx.addIssue({
              code: "custom",
              path: ["detail", i, "supplierId"],
              message: "Store is required for incoming transactions.",
            });
          }
        }

        if (data.typeTransaction === "OUT") {
          if (d.quantityDetailTransaction > item.qty) {
            ctx.addIssue({
              code: "custom",
              path: ["detail", i, "quantityDetailTransaction"],
              message: `Quantity exceeds available stock (${item.qty}).`,
            });
          }
        }

        //Validasi note
        if (["CHECK", "OUT"].includes(data.typeTransaction)) {
          if (!d.note || d.note.trim() === "") {
            ctx.addIssue({
              code: "custom",
              path: ["detail", i, "note"],
              message: "Note is required for this transactions.",
            });
          }
        }
      });
    });

export const UpdateTransactionDetailSchema = (items: TItemTrx[]) =>
  transactionDetailSchema
    .extend({
      idDetailTransaction: z.uuid("Invalid ID format.").min(5),
      typeTransaction: z.enum(enumTypeTransaction),
      statusTransaction: z.enum(enumStatusTransaction),
    })
    .superRefine((data, ctx) => {
      const item = items.find((it) => it.idItem === data.itemId);

      if (!item) {
        ctx.addIssue({
          code: "custom",
          path: ["itemId"],
          message: "Item not found.",
        });
        return;
      }

      if (data.typeTransaction === "IN") {
        if (!data.supplierId || data.supplierId.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["supplierId"],
            message: "Store is required for incoming transactions.",
          });
        }

        if (data.quantityDifference > 0) {
          if (!data.note || data.note.trim() === "") {
            ctx.addIssue({
              code: "custom",
              path: ["note"],
              message: "Note is required for damaged item.",
            });
          }
        }

        if (data.quantityCheck > data.quantityDetailTransaction) {
          ctx.addIssue({
            code: "custom",
            path: ["quantityCheck"],
            message: `Checked quantity cannot exceed the ordered quantity (${data.quantityDetailTransaction}).`,
          });
        }

        // Kurang dari batas minimal (-1)
        if (data.quantityCheck <= -1) {
          ctx.addIssue({
            code: "custom",
            path: ["quantityCheck"],
            message: "Checked quantity cannot be less than -1.",
          });
        }
      }

      if (data.typeTransaction === "OUT") {
        if (data.quantityDetailTransaction > item.qty) {
          ctx.addIssue({
            code: "custom",
            path: ["quantityDetailTransaction"],
            message: `Quantity exceeds available stock (${item.qty}).`,
          });
        }

        if (!data.note || data.note.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["note"],
            message: "Note is required for damaged item.",
          });
        }
      }
    });

export const UpdateTrxDetailStatusSchema = z.object({
  idDetailTransaction: z.uuid("Invalid ID format.").min(5),
  statusDetailTransaction: z.enum(enumStatusTransaction),
});

export const DeleteTransactionDetailSchema = z.object({
  idDetailTransaction: z.uuid("Invalid ID format.").min(5),
});

export const ReportTransactionSchema = z
  .object({
    type: z.enum(enumTypeTransaction, { message: "Required" }),
    startDate: DateSchema,
    endDate: DateSchema,
  })
  .refine(
    (data) => {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      return start <= end;
    },
    {
      message: "Start date must be earlier or equal to end date",
      path: ["startDate"],
    }
  );

/* -------- NOTIFICATION --------  */
export const NotificationSchema = z.object({
  id: z.uuid("Invalid ID format."),
});

export const NotificationRoleSchema = z.object({
  role: z.enum(enumRole),
});
