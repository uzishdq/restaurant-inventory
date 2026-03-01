import z from "zod";
import { TItemTrx } from "./type-data";

const allowedRegex = /^[a-zA-Z0-9.,/ \-']+$/;

const username = z
  .string()
  .min(5, "Harus memiliki minimal 5 karakter.")
  .max(50, "Tidak boleh melebihi 50 karakter.")
  .regex(
    allowedRegex,
    "Gunakan hanya huruf, angka, spasi, titik, koma, atau garis miring.",
  )
  .refine((username) => !/\s/.test(username), {
    message: "Tidak boleh mengandung spasi.",
  });

const password = z
  .string()
  .min(6, "Harus memiliki minimal 6 karakter.")
  .max(50, "Tidak boleh melebihi 50 karakter.");

export const IdSchema = z.object({
  id: z.uuid("Format ID tidak valid."),
});

const validatedStringSchema = (min = 5, max = 50) =>
  z
    .string()
    .min(min, `Harus memiliki minimal ${min} karakter.`)
    .max(max, `Tidak boleh melebihi ${max} karakter.`)
    .regex(
      allowedRegex,
      "Gunakan hanya huruf, angka, spasi, titik, koma, atau garis miring.",
    );

const validatedPhoneSchema = z
  .string()
  .min(10, {
    message: "Nomor telepon harus terdiri minimal 10 digit.",
  })
  .max(15, {
    message: "Nomor telepon tidak boleh melebihi 15 digit.",
  })
  .regex(/^[0-9]+$/, {
    message: "Nomor telepon hanya boleh berisi angka.",
  })
  .refine((value) => value.startsWith("0"), {
    message: "Nomor telepon harus diawali dengan angka 0.",
  });

const validatedStock = (min = 0, max = 60) =>
  z.number("Kolom wajib diisi").refine(
    (n) => {
      const allowZero = min === 0;
      return (n >= min && n <= max) || (allowZero && n === 0);
    },
    {
      message: `Setidaknya harus ${min} - ${max}`,
    },
  );

const itemIdSchema = z.string().regex(/^BB-\d{4}$/, {
  message: "Format ID tidak valid.",
});

export const transactionIdSchema = z
  .string()
  .regex(/^TRX-(IN|OUT|CHK)-\d{4}$/, {
    message: "Format ID transaksi tidak valid.",
  });

export const DeleteUUIDSchema = z.object({
  id: z.uuid("Format ID tidak valid.").min(5),
});

const DateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Format tanggal harus YYYY-MM-DD")
  .refine((val) => {
    const d = new Date(val);
    return !isNaN(d.getTime()) && val === d.toISOString().slice(0, 10);
  }, "Tanggal tidak valid");

/* -------- ENUM --------  */
export const enumRole = [
  "SUPER_ADMIN",
  "ADMIN",
  "HEADKITCHEN",
  "MANAGER",
] as const;
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
    message: "Username baru harus berbeda dari username saat ini.",
    path: ["newUsername"],
  });

export const PasswordUpdateSchema = z
  .object({
    oldPassword: password,
    newPassword: password,
    newConfirmPassword: password,
  })
  .refine((data) => data.oldPassword !== data.newPassword, {
    message: "Password baru harus berbeda dari password saat ini.",
    path: ["newPassword"],
  })
  .refine((data) => data.newPassword === data.newConfirmPassword, {
    message: "Passwords tidak cocok",
    path: ["newConfirmPassword"],
  });

export const RoleUpdateSchema = z.object({
  idUser: z.uuid("Format ID tidak valid.").min(5),
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
  idSupplier: z.uuid("Format ID tidak valid.").min(5),
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
  idUnit: z.uuid("Format ID tidak valid.").min(5),
  nameUnit: validatedStringSchema(2, 10),
});

/* -------- CATEGORY --------  */
export const CreateCategorySchema = z.object({
  nameCategory: validatedStringSchema(5, 10),
});

export const UpdateCategorySchema = z.object({
  idCategory: z.uuid("Format ID tidak valid.").min(5),
  nameCategory: validatedStringSchema(5, 10),
});

/* -------- ITEM --------  */
export const CreateItemSchema = z.object({
  nameItem: validatedStringSchema(5, 100),
  unitId: z.uuid("Format ID tidak valid.").min(5),
  categoryId: z.uuid("Format ID tidak valid.").min(5),
  minStock: validatedStock(),
});

export const UpdateItemSchema = z.object({
  idItem: itemIdSchema,
  nameItem: validatedStringSchema(5, 100),
  unitId: z.uuid("Format ID tidak valid.").min(5),
  categoryId: z.uuid("Format ID tidak valid.").min(5),
  minStock: validatedStock(),
});

export const DeleteItemSchema = z.object({
  idItem: itemIdSchema,
});

/* -------- TRANSACTION --------  */
const transactionDetailSchema = z.object({
  itemId: itemIdSchema,
  supplierId: z.string().optional(),
  quantityDetailTransaction: validatedStock(0, 5000),
  quantityCheck: validatedStock(-500, 500),
  quantityDifference: validatedStock(-500, 500),
  note: z
    .string()
    .max(100, "Tidak boleh melebihi 100 karakter.")
    .regex(
      allowedRegex,
      "Gunakan hanya huruf, angka, spasi, titik, koma, atau garis miring.",
    )
    .optional()
    .or(z.literal("")),
});

const validateIN = (
  d: z.infer<typeof transactionDetailSchema>,
  i: number,
  ctx: z.RefinementCtx,
) => {
  if (!d.supplierId) {
    ctx.addIssue({
      code: "custom",
      path: ["detail", i, "supplierId"],
      message: "Toko ini diperlukan untuk Pengadaan Bahan Baku.",
    });
  }
  if (d.quantityDetailTransaction <= 0) {
    ctx.addIssue({
      code: "custom",
      path: ["detail", i, "quantityDetailTransaction"],
      message: "Jumlah pesanan harus lebih dari 0.",
    });
  }
};

const validateOUT = (
  d: z.infer<typeof transactionDetailSchema>,
  item: TItemTrx,
  i: number,
  ctx: z.RefinementCtx,
  condition?: string,
) => {
  if (d.quantityDetailTransaction > item.qty) {
    ctx.addIssue({
      code: "custom",
      path: ["detail", i, "quantityDetailTransaction"],
      message: `Quantity melebihi stok yang tersedia. (${item.qty}).`,
    });
  }

  if (condition === "Diluar Operasional" && !d.note?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["detail", i, "note"],
      message: "Perlu diisi.",
    });
  }
};

const validateCHECK = (
  d: z.infer<typeof transactionDetailSchema>,
  item: TItemTrx,
  i: number,
  ctx: z.RefinementCtx,
) => {
  if (d.quantityDetailTransaction !== item.qty) {
    ctx.addIssue({
      code: "custom",
      path: ["detail", i, "quantityDetailTransaction"],
      message: `Quantity sistem harus ${item.qty}.`,
    });
  }

  if (d.quantityDifference !== d.quantityCheck - item.qty) {
    ctx.addIssue({
      code: "custom",
      path: ["detail", i, "quantityDifference"],
      message: "Tidak sesuai dengan pengecekan sistem.",
    });
  }

  if (d.quantityCheck !== d.quantityDetailTransaction && !d.note?.trim()) {
    ctx.addIssue({
      code: "custom",
      path: ["detail", i, "note"],
      message: "Perlu diisi jika terdapat selisih.",
    });
  }
};

export const CreateTransactionTestSchema = (items: TItemTrx[]) =>
  z
    .object({
      typeTransaction: z.enum(enumTypeTransaction),
      condition: z.string().max(50).optional(),
      detail: z
        .array(transactionDetailSchema)
        .min(1, "Setidaknya satu detail transaksi diperlukan."),
    })
    .superRefine((data, ctx) => {
      if (data.typeTransaction === "CHECK" && !data.condition?.trim()) {
        ctx.addIssue({
          code: "custom",
          path: ["condition"],
          message: "Kondisi wajib diisi.",
        });
      }

      data.detail.forEach((d, i) => {
        const item = items.find((it) => it.idItem === d.itemId);

        if (!item) {
          ctx.addIssue({
            code: "custom",
            path: ["detail", i, "itemId"],
            message: "Bahan Baku tidak ditemukan.",
          });
          return;
        }

        switch (data.typeTransaction) {
          case "IN":
            validateIN(d, i, ctx);
            break;

          case "OUT":
            validateOUT(d, item, i, ctx, data.condition);
            break;

          case "CHECK":
            validateCHECK(d, item, i, ctx);
            break;
        }
      });
    });

export const DeleteTransactionSchema = z.object({
  idTransaction: transactionIdSchema,
});

export const UpdateTransactionSchema = z.object({
  idTransaction: transactionIdSchema,
  typeTransaction: z.enum(enumTypeTransaction),
  statusTransaction: z.enum(enumStatusTransaction, {
    message: "Kolom wajib diisi",
  }),
});

export const AddTransactionDetailSchema = (items: TItemTrx[]) =>
  z
    .object({
      idTransaction: transactionIdSchema,
      typeTransaction: z.enum(enumTypeTransaction),
      detail: z
        .array(transactionDetailSchema)
        .min(1, "Setidaknya satu detail transaksi diperlukan."),
    })
    .superRefine((data, ctx) => {
      data.detail.forEach((d, i) => {
        const item = items.find((it) => it.idItem === d.itemId);

        if (!item) {
          ctx.addIssue({
            code: "custom",
            path: ["detail", i, "itemId"],
            message: "Bahan Baku tidak ditemukan.",
          });
          return;
        }

        if (data.typeTransaction === "IN") {
          if (!d.supplierId) {
            ctx.addIssue({
              code: "custom",
              path: ["detail", i, "supplierId"],
              message: "Toko ini diperlukan untuk Pengadaan Bahan Baku.",
            });
          }
        }

        if (data.typeTransaction === "OUT") {
          if (d.quantityDetailTransaction > item.qty) {
            ctx.addIssue({
              code: "custom",
              path: ["detail", i, "quantityDetailTransaction"],
              message: `Quantity melebihi stok yang tersedia. (${item.qty}).`,
            });
          }
        }

        //Validasi note
        if (["CHECK", "OUT"].includes(data.typeTransaction)) {
          if (!d.note || d.note.trim() === "") {
            ctx.addIssue({
              code: "custom",
              path: ["detail", i, "note"],
              message: "Note diperlukan untuk transaksi ini.",
            });
          }
        }
      });
    });

export const UpdateTransactionDetailSchema = (items: TItemTrx[]) =>
  transactionDetailSchema
    .extend({
      idDetailTransaction: z.uuid("Format ID tidak valid.").min(5),
      typeTransaction: z.enum(enumTypeTransaction),
      statusTransaction: z.enum(enumStatusTransaction),
    })
    .superRefine((data, ctx) => {
      const item = items.find((it) => it.idItem === data.itemId);

      if (!item) {
        ctx.addIssue({
          code: "custom",
          path: ["itemId"],
          message: "Bahan Baku tidak ditemukan.",
        });
        return;
      }

      if (data.typeTransaction === "IN") {
        if (!data.supplierId || data.supplierId.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["supplierId"],
            message: "Toko ini diperlukan untuk Pengadaan Bahan Baku.",
          });
        }

        if (data.quantityDifference > 0) {
          if (!data.note || data.note.trim() === "") {
            ctx.addIssue({
              code: "custom",
              path: ["note"],
              message: "Note diperlukan untuk barang yang rusak.",
            });
          }
        }

        if (data.quantityCheck > data.quantityDetailTransaction) {
          ctx.addIssue({
            code: "custom",
            path: ["quantityCheck"],
            message: `Quantity yang diperiksa tidak boleh melebihi quantity yang dipesan. (${data.quantityDetailTransaction}).`,
          });
        }

        // Kurang dari batas minimal (-1)
        if (data.quantityCheck <= -1) {
          ctx.addIssue({
            code: "custom",
            path: ["quantityCheck"],
            message: "Quantity yang diperiksa tidak boleh kurang dari -1.",
          });
        }
      }

      if (data.typeTransaction === "OUT") {
        if (data.quantityDetailTransaction > item.qty) {
          ctx.addIssue({
            code: "custom",
            path: ["quantityDetailTransaction"],
            message: `Quantity melebihi stok yang tersedia (${item.qty}).`,
          });
        }

        if (!data.note || data.note.trim() === "") {
          ctx.addIssue({
            code: "custom",
            path: ["note"],
            message: "Note diperlukan untuk barang yang rusak.",
          });
        }
      }
    });

export const UpdateTrxDetailStatusSchema = z.object({
  idDetailTransaction: z.uuid("Format ID tidak valid.").min(5),
  statusDetailTransaction: z.enum(enumStatusTransaction),
});

export const DeleteTransactionDetailSchema = z.object({
  idDetailTransaction: z.uuid("Format ID tidak valid.").min(5),
});

export const ReportTransactionSchema = z
  .object({
    type: z.enum(enumTypeTransaction, { message: "Type wajib diisi" }),
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
      message: "Tanggal mulai harus lebih awal atau sama dengan tanggal akhir.",
      path: ["startDate"],
    },
  );

export const ReportItemSchema = z
  .object({
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
      message: "Tanggal mulai harus lebih awal atau sama dengan tanggal akhir.",
      path: ["endDate"],
    },
  );

/* -------- NOTIFICATION --------  */
export const NotificationSchema = z.object({
  id: z.uuid("Format ID tidak valid."),
});

export const NotificationRoleSchema = z.object({
  role: z.enum(enumRole),
});
