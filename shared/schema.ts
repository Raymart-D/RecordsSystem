import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Record categories
export const RECORD_CATEGORIES = [
  "Invoice",
  "Receipt",
  "Contract",
  "Report",
  "Form",
  "Letter",
  "Memo",
  "Other"
] as const;

// Record statuses
export const RECORD_STATUSES = [
  "Active",
  "Archived",
  "Pending Review",
  "Confidential"
] as const;

// Main records table
export const records = pgTable("records", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").$type<typeof RECORD_CATEGORIES[number]>().notNull(),
  status: text("status").$type<typeof RECORD_STATUSES[number]>().notNull().default("Active"),
  fileType: text("file_type"),
  fileSize: integer("file_size"),
  content: text("content"),
  tags: text("tags"),
  dateCreated: timestamp("date_created").defaultNow().notNull(),
  dateModified: timestamp("date_modified").defaultNow().notNull(),
  isFavorite: boolean("is_favorite").default(false)
});

// Schema for inserting records
export const insertRecordSchema = createInsertSchema(records)
  .omit({ id: true })
  .extend({
    category: z.enum(RECORD_CATEGORIES),
    status: z.enum(RECORD_STATUSES).default("Active"),
    tags: z.string().optional(),
  });

// Schema for updating records
export const updateRecordSchema = insertRecordSchema.partial();

// Scanner configurations
export const scannerConfigs = pgTable("scanner_configs", {
  id: serial("id").primaryKey(),
  modelName: text("model_name").notNull().default("Brother ADS-2400N"),
  ipAddress: text("ip_address"),
  resolution: integer("resolution").default(300),
  colorMode: text("color_mode").default("Color"),
  duplex: boolean("duplex").default(true),
  autoFeeder: boolean("auto_feeder").default(true),
  isConnected: boolean("is_connected").default(false),
  lastConnected: timestamp("last_connected")
});

// Scanner config insert schema
export const insertScannerConfigSchema = createInsertSchema(scannerConfigs)
  .omit({ id: true });

// Types
export type Record = typeof records.$inferSelect;
export type InsertRecord = z.infer<typeof insertRecordSchema>;
export type UpdateRecord = z.infer<typeof updateRecordSchema>;
export type ScannerConfig = typeof scannerConfigs.$inferSelect;
export type InsertScannerConfig = z.infer<typeof insertScannerConfigSchema>;
