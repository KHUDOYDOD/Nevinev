import { z } from "zod";

// Extended model definitions to solve typing issues
export interface User {
  id: number;
  username: string;
  password: string;
  email: string;
  fullName: string | null;
  role: string;
  balance: number;
  language: string;
  referralCode: string | null;
  referrerId: number | null;
  createdAt: Date;
}

export interface Tariff {
  id: number;
  name: string;
  nameEn: string;
  dailyRate: number;
  minDeposit: number;
  referralBonus: number;
  isActive: boolean;
}

export interface Deposit {
  id: number;
  userId: number;
  tariffId: number;
  amount: number;
  dailyProfit: number;
  status: string;
  isActive?: boolean;
  createdAt: Date;
}

export interface Transaction {
  id: number;
  userId: number;
  type: 'deposit' | 'withdraw' | 'profit' | 'referral';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  description?: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Content {
  id: number;
  key: string;
  valueRu: string;
  valueEn?: string;
  valueTj?: string;
  valueKz?: string;
  valueUz?: string;
}

export const userSchema = z.object({
  id: z.number(),
  username: z.string(),
  password: z.string(),
  email: z.string().email(),
  fullName: z.string().nullable(),
  role: z.string().default("user"),
  balance: z.number().default(0),
  language: z.string().default("ru"),
  referralCode: z.string().nullable(),
  referrerId: z.number().nullable(),
  createdAt: z.date()
});

export const insertUserSchema = userSchema.omit({ id: true }).partial({
  fullName: true,
  role: true,
  balance: true,
  language: true,
  referralCode: true,
  referrerId: true,
  createdAt: true
});

export type InsertUser = z.infer<typeof insertUserSchema>;