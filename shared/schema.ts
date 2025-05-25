import { pgTable, text, serial, integer, boolean, real, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table - Fixed circular reference
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
  fullName: text("full_name"),
  role: text("role").default("user").notNull(),
  balance: real("balance").default(0).notNull(),
  language: text("language").default("ru").notNull(),
  referralCode: text("referral_code").unique(),
  referrerId: integer("referrer_id"), // Removed circular reference
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
  fullName: true,
  language: true,
  referrerId: true,
});

// Tariffs table
export const tariffs = pgTable("tariffs", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  dailyRate: real("daily_rate").notNull(),
  minDeposit: real("min_deposit").notNull(),
  referralBonus: real("referral_bonus").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

export const insertTariffSchema = createInsertSchema(tariffs).pick({
  name: true,
  nameEn: true,
  dailyRate: true,
  minDeposit: true,
  referralBonus: true,
  isActive: true,
});

// Deposits table
export const deposits = pgTable("deposits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  tariffId: integer("tariff_id").notNull().references(() => tariffs.id),
  amount: real("amount").notNull(),
  dailyProfit: real("daily_profit").notNull(),
  status: text("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertDepositSchema = createInsertSchema(deposits).pick({
  userId: true,
  tariffId: true,
  amount: true,
  dailyProfit: true,
});

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: text("type").notNull(), // 'deposit', 'withdraw', 'referral_bonus', 'profit'
  amount: real("amount").notNull(),
  status: text("status").default("pending").notNull(), // 'pending', 'completed', 'rejected'
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  completedAt: timestamp("completed_at"),
});

export const insertTransactionSchema = createInsertSchema(transactions).pick({
  userId: true,
  type: true,
  amount: true,
  status: true,
  description: true,
});

// Statistics table
export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  totalUsers: integer("total_users").default(0).notNull(),
  totalInvested: real("total_invested").default(0).notNull(),
  totalPaid: real("total_paid").default(0).notNull(),
  newUsers24h: integer("new_users_24h").default(0).notNull(),
  newDeposits24h: integer("new_deposits_24h").default(0).notNull(),
  newWithdrawals24h: integer("new_withdrawals_24h").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const insertStatisticsSchema = createInsertSchema(statistics).pick({
  totalUsers: true,
  totalInvested: true,
  totalPaid: true,
  newUsers24h: true,
  newDeposits24h: true,
  newWithdrawals24h: true,
});

// Content table
export const content = pgTable("content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  valueRu: text("value_ru").notNull(),
  valueEn: text("value_en"),
  valueTj: text("value_tj"),
  valueKz: text("value_kz"),
  valueUz: text("value_uz"),
});

export const insertContentSchema = createInsertSchema(content).pick({
  key: true,
  valueRu: true,
  valueEn: true,
  valueTj: true,
  valueKz: true,
  valueUz: true,
});

// Export types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Tariff = typeof tariffs.$inferSelect;
export type InsertTariff = z.infer<typeof insertTariffSchema>;

export type Deposit = typeof deposits.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Statistic = typeof statistics.$inferSelect;
export type InsertStatistic = z.infer<typeof insertStatisticsSchema>;

export type Content = typeof content.$inferSelect;
export type InsertContent = z.infer<typeof insertContentSchema>;
