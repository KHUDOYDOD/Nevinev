import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles enum
export const userRoleEnum = pgEnum('user_role', ['user', 'admin']);

// User schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: userRoleEnum("role").default("user").notNull(),
  balance: doublePrecision("balance").default(0).notNull(),
  referralCode: text("referral_code").notNull().unique(),
  referrerId: integer("referrer_id").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Language preference schema
export const languagePreferences = pgTable("language_preferences", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  language: text("language").notNull().default("ru"),
});

// Tariff plans
export const tariffEnum = pgEnum('tariff_type', ['basic', 'premium', 'elite']);

// Tariffs configuration
export const tariffs = pgTable("tariffs", {
  id: serial("id").primaryKey(),
  type: tariffEnum("type").notNull(),
  name: text("name").notNull(),
  interestRate: doublePrecision("interest_rate").notNull(),
  minInvestment: doublePrecision("min_investment").notNull(),
  referralBonus: doublePrecision("referral_bonus").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
});

// Deposit status enum
export const depositStatusEnum = pgEnum('deposit_status', ['active', 'completed', 'cancelled']);

// Deposits
export const deposits = pgTable("deposits", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  tariffId: integer("tariff_id").references(() => tariffs.id).notNull(),
  amount: doublePrecision("amount").notNull(),
  status: depositStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Transaction type enum
export const transactionTypeEnum = pgEnum('transaction_type', ['deposit', 'withdrawal', 'profit', 'referral']);

// Transaction status enum
export const transactionStatusEnum = pgEnum('transaction_status', ['pending', 'completed', 'failed']);

// Transactions
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  type: transactionTypeEnum("type").notNull(),
  amount: doublePrecision("amount").notNull(),
  status: transactionStatusEnum("status").default("pending").notNull(),
  description: text("description"),
  depositId: integer("deposit_id").references(() => deposits.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Testimonials
export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  content: text("content").notNull(),
  rating: integer("rating").notNull(),
  isApproved: boolean("is_approved").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Site statistics
export const statistics = pgTable("statistics", {
  id: serial("id").primaryKey(),
  totalUsers: integer("total_users").default(0).notNull(),
  totalDeposits: doublePrecision("total_deposits").default(0).notNull(),
  totalWithdrawals: doublePrecision("total_withdrawals").default(0).notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Content settings
export const siteContent = pgTable("site_content", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  valueRu: text("value_ru").notNull(),
  valueEn: text("value_en"),
  valueTj: text("value_tj"),
  valueKz: text("value_kz"),
  valueUz: text("value_uz"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  createdAt: true, 
  balance: true
});

export const insertLanguagePreferenceSchema = createInsertSchema(languagePreferences).omit({
  id: true
});

export const insertTariffSchema = createInsertSchema(tariffs).omit({
  id: true
});

export const insertDepositSchema = createInsertSchema(deposits).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  status: true
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  isApproved: true,
  createdAt: true
});

export const insertStatisticsSchema = createInsertSchema(statistics).omit({
  id: true,
  updatedAt: true
});

export const insertSiteContentSchema = createInsertSchema(siteContent).omit({
  id: true,
  updatedAt: true
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type LanguagePreference = typeof languagePreferences.$inferSelect;
export type InsertLanguagePreference = z.infer<typeof insertLanguagePreferenceSchema>;

export type Tariff = typeof tariffs.$inferSelect;
export type InsertTariff = z.infer<typeof insertTariffSchema>;

export type Deposit = typeof deposits.$inferSelect;
export type InsertDeposit = z.infer<typeof insertDepositSchema>;

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = z.infer<typeof insertTransactionSchema>;

export type Testimonial = typeof testimonials.$inferSelect;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;

export type Statistic = typeof statistics.$inferSelect;
export type InsertStatistic = z.infer<typeof insertStatisticsSchema>;

export type SiteContent = typeof siteContent.$inferSelect;
export type InsertSiteContent = z.infer<typeof insertSiteContentSchema>;
