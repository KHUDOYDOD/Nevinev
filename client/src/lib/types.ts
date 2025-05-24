export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  balance: string | number;
  referralCode: string;
  referredBy?: string;
  isAdmin: boolean;
  language: string;
  createdAt: string | Date;
}

export interface Tariff {
  id: number;
  name: string;
  dailyPercent: string | number;
  minAmount: string | number;
  referralPercent: string | number;
  isActive: boolean;
}

export interface Deposit {
  id: number;
  userId: number;
  tariffId: number;
  amount: string | number;
  dailyProfit: string | number;
  isActive: boolean;
  createdAt: string | Date;
  tariff?: Tariff;
}

export interface Transaction {
  id: number;
  userId: number;
  amount: string | number;
  type: 'deposit' | 'withdraw' | 'profit' | 'referral';
  status: 'pending' | 'completed' | 'rejected';
  description?: string;
  relatedDepositId?: number;
  createdAt: string | Date;
}

export interface Referral {
  id: number;
  userId: number;
  referredUserId: number;
  commissionEarned: string | number;
  createdAt: string | Date;
  referredUser?: {
    id: number;
    username: string;
    fullName: string;
    createdAt: string | Date;
  };
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

export interface Stats {
  id: number;
  totalUsers: number;
  totalInvested: string | number;
  totalPaid: string | number;
  lastUpdated: string | Date;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  email: string;
  fullName: string;
  referredBy?: string;
  language: string;
}

export interface ChangePasswordData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface CreateDepositData {
  userId: number;
  tariffId: number;
  amount: string | number;
}

export interface WithdrawData {
  amount: string | number;
}

export interface UpdateUserData {
  fullName?: string;
  email?: string;
  language?: string;
}
