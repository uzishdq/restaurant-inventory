import { relations } from "drizzle-orm";
import {
  date,
  integer,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

//USER
export const userRoleEnum = pgEnum("user_role", [
  "SUPER_ADMIN",
  "ADMIN",
  "HEADKITCHEN",
  "MANAGER",
]);

export const userTable = pgTable("user", {
  idUser: uuid("id_user").primaryKey().defaultRandom(),
  nameUser: varchar("name_user", { length: 225 }).notNull(),
  username: varchar("username", { length: 255 }).unique().notNull(),
  password: varchar("password", { length: 255 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 20 }).unique().notNull(),
  role: userRoleEnum("role_user").default("HEADKITCHEN").notNull(),
  createdAt: date("created_at").notNull().defaultNow(),
});

//supplier
export const supplierTable = pgTable("supplier", {
  idSupplier: uuid("id_supplier").primaryKey().defaultRandom(),
  store_name: varchar("store_name", { length: 225 }),
  nameSupplier: varchar("name_supplier", { length: 225 }),
  addressSupplier: varchar("address_supplier", { length: 225 }),
  phoneSupplier: varchar("phone_supplier", { length: 20 }).unique().notNull(),
});

//UNIT
export const unitTable = pgTable("unit", {
  idUnit: uuid("id_unit").primaryKey().defaultRandom(),
  nameUnit: varchar("name_unit", { length: 50 }).unique().notNull(),
});

//CATEGORY
export const categoryTable = pgTable("category", {
  idCategory: uuid("id_category").primaryKey().defaultRandom(),
  nameCategory: varchar("name_category", { length: 255 }).unique().notNull(),
});

//ITEM
export const itemTable = pgTable("item", {
  idItem: varchar("id_item", { length: 20 }).primaryKey().notNull(),
  nameItem: varchar("name_item", { length: 255 }).unique().notNull(),
  unitId: uuid("unit_id")
    .notNull()
    .references(() => unitTable.idUnit, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categoryTable.idCategory, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  stockQuantity: integer("stock_quantity").notNull(),
  minStock: integer("min_stock").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//TRANSACTION
export const typeTransaction = pgEnum("type_transaction", [
  "IN",
  "OUT",
  "CHECK",
]);
export const statusTransaction = pgEnum("status_transaction", [
  "PENDING",
  "ORDERED",
  "RECEIVED",
  "CANCELLED",
  "COMPLETED",
]);

export const transactionTable = pgTable("transaction", {
  idTransaction: varchar("id_transaction", { length: 20 })
    .primaryKey()
    .notNull(),
  typeTransaction: typeTransaction("type_transaction").default("IN").notNull(),
  dateTransaction: timestamp("date_transaction").notNull().defaultNow(),
  userId: uuid("user_id")
    .notNull()
    .references(() => userTable.idUser, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  condition: varchar("condition", { length: 255 }).notNull(),
  statusTransaction: statusTransaction("status_transaction")
    .default("PENDING")
    .notNull(),
});

//DETAIL TRANSACTION
export const detailTransactionTable = pgTable("detail_transaction", {
  idDetailTransaction: uuid("id_detail_transaction")
    .primaryKey()
    .defaultRandom(),
  transactionId: varchar("transaction_id", { length: 20 })
    .notNull()
    .references(() => transactionTable.idTransaction, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  itemId: varchar("item_id", { length: 20 })
    .notNull()
    .references(() => itemTable.idItem, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  supplierId: uuid("supplier_id").references(() => supplierTable.idSupplier, {
    onUpdate: "cascade",
    onDelete: "cascade",
  }),
  quantityDetailTransaction: integer("quantity_detail_transaction").notNull(),
  quantityCheck: integer("quantity_check"),
  quantityDifference: integer("quantity_difference"),
  note: varchar("note", { length: 225 }),
  statusDetailTransaction: statusTransaction("status_detail_transaction")
    .default("PENDING")
    .notNull(),
});

//ITEM MOVEMENT
export const typeMovement = pgEnum("type_movement", ["IN", "OUT", "CHECK"]);

export const itemMovementTable = pgTable("item_movement", {
  idMovement: uuid("id_movement").primaryKey().defaultRandom(),
  transactionId: varchar("transaction_id", { length: 20 })
    .notNull()
    .references(() => transactionTable.idTransaction, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  typeMovement: typeMovement("type_movement").default("IN").notNull(),
  itemId: varchar("item_id", { length: 20 })
    .notNull()
    .references(() => itemTable.idItem, {
      onUpdate: "cascade",
      onDelete: "cascade",
    }),
  quantityMovement: integer("quantity_movement").notNull(),
  dateExp: date("date_exp").notNull().defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date()),
});

//NOTIFICATIONS
export const statusNotificationEnum = pgEnum("status_notification", [
  "PENDING",
  "ONPROGRESS",
  "SENT",
  "FAILED",
]);

export const notificationsTable = pgTable("notifications", {
  idNotification: uuid("id_notifications").primaryKey().defaultRandom(),
  tanggalNotification: date("tanggal_notification").notNull().defaultNow(),
  noTelpNotification: varchar("telepon_notification", { length: 20 }),
  messageNotification: text("message_notification").notNull(),
  statusNotification: statusNotificationEnum("status_notification")
    .default("PENDING")
    .notNull(),
});

// RELATIONS USER
export const userRelations = relations(userTable, ({ many }) => ({
  transaction: many(transactionTable),
}));

// RELATIONS SUPPLIER
export const supplierRelations = relations(supplierTable, ({ many }) => ({
  detailTransaction: many(detailTransactionTable),
}));

// RELATIONS UNIT
export const unitRelations = relations(unitTable, ({ many }) => ({
  item: many(itemTable),
}));

// RELATIONS CATEGORY
export const categoryRelations = relations(categoryTable, ({ many }) => ({
  item: many(itemTable),
}));

// RELATIONS ITEM
export const itemRelations = relations(itemTable, ({ one, many }) => ({
  unit: one(unitTable, {
    fields: [itemTable.unitId],
    references: [unitTable.idUnit],
  }),
  category: one(categoryTable, {
    fields: [itemTable.categoryId],
    references: [categoryTable.idCategory],
  }),
  detailTransaction: many(detailTransactionTable),
  itemMovement: many(itemMovementTable),
}));

// RELATIONS TRANSACTION
export const transactionRelations = relations(
  transactionTable,
  ({ one, many }) => ({
    user: one(userTable, {
      fields: [transactionTable.userId],
      references: [userTable.idUser],
    }),
    detailTransaction: many(detailTransactionTable),
    itemMovement: many(itemMovementTable),
  }),
);

// RELATIONS DETAIL TRANSACTION
export const detailTransactionRelations = relations(
  detailTransactionTable,
  ({ one }) => ({
    transaction: one(transactionTable, {
      fields: [detailTransactionTable.transactionId],
      references: [transactionTable.idTransaction],
    }),
    item: one(itemTable, {
      fields: [detailTransactionTable.itemId],
      references: [itemTable.idItem],
    }),
    supplier: one(supplierTable, {
      fields: [detailTransactionTable.supplierId],
      references: [supplierTable.idSupplier],
    }),
  }),
);

// RELATIONS ITEM MOVEMENT
export const itemMovementRelations = relations(
  itemMovementTable,
  ({ one }) => ({
    transaction: one(transactionTable, {
      fields: [itemMovementTable.transactionId],
      references: [transactionTable.idTransaction],
    }),
    item: one(itemTable, {
      fields: [itemMovementTable.itemId],
      references: [itemTable.idItem],
    }),
  }),
);
