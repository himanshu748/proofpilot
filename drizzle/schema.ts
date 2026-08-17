import { boolean, decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const documentStatus = ["pending review", "approved", "rejected"] as const;

export const documents = mysqlTable("documents", {
  id: varchar("id", { length: 36 }).primaryKey(),
  ownerId: int("ownerId").notNull(),
  fileName: varchar("fileName", { length: 255 }).notNull(),
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  storageUrl: varchar("storageUrl", { length: 768 }).notNull(),
  contentType: varchar("contentType", { length: 128 }).notNull().default("application/pdf"),
  status: mysqlEnum("status", documentStatus).notNull().default("pending review"),
  confidenceScore: decimal("confidenceScore", { precision: 5, scale: 4 }).notNull().default("0.0000"),
  extractionProvider: varchar("extractionProvider", { length: 64 }).notNull().default("Nutrient DWS"),
  extractionRequestId: varchar("extractionRequestId", { length: 128 }),
  signedStorageKey: varchar("signedStorageKey", { length: 512 }),
  signedStorageUrl: varchar("signedStorageUrl", { length: 768 }),
  signingRequestId: varchar("signingRequestId", { length: 128 }),
  finalizedAt: timestamp("finalizedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const extractedFields = mysqlTable("extractedFields", {
  id: varchar("id", { length: 36 }).primaryKey(),
  documentId: varchar("documentId", { length: 36 }).notNull(),
  fieldKey: varchar("fieldKey", { length: 128 }).notNull(),
  label: varchar("label", { length: 160 }).notNull(),
  value: text("value").notNull(),
  confidence: decimal("confidence", { precision: 5, scale: 4 }).notNull(),
  sourcePage: int("sourcePage"),
  sourceBounds: text("sourceBounds"),
  sourceCitation: text("sourceCitation"),
  requiresReview: boolean("requiresReview").notNull().default(false),
  editedByHuman: boolean("editedByHuman").notNull().default(false),
  reviewedAt: timestamp("reviewedAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export const auditEvents = mysqlTable("auditEvents", {
  id: varchar("id", { length: 36 }).primaryKey(),
  documentId: varchar("documentId", { length: 36 }).notNull(),
  actorId: int("actorId"),
  eventType: varchar("eventType", { length: 96 }).notNull(),
  message: text("message").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export const publicShares = mysqlTable("publicShares", {
  id: varchar("id", { length: 36 }).primaryKey(),
  documentId: varchar("documentId", { length: 36 }).notNull(),
  slug: varchar("slug", { length: 96 }).notNull().unique(),
  isPublic: boolean("isPublic").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  expiresAt: timestamp("expiresAt"),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
