import { User, InvestmentPlan, Deposit, Transaction } from '@shared/schema';

export interface UserWithReferrals extends User {
  referrals?: User[];
}

export interface TariffCardProps {
  plan: InvestmentPlan;
  isPopular?: boolean;
  onSelect: (plan: InvestmentPlan) => void;
}

export interface CalculatorProps {
  plans: InvestmentPlan[];
  onInvest?: (amount: number, planId: number, days: number) => void;
}

export interface TestimonialItem {
  name: string;
  location: string;
  rating: number;
  text: string;
  initials: string;
}

export interface ActivityItem {
  id: number;
  userName: string;
  userInitials: string;
  type: 'user' | 'deposit' | 'withdrawal';
  amount?: number;
  tariff?: string;
  time: string;
  status?: string;
}

export interface DashboardStatsProps {
  balance: number;
  activeDeposits: number;
  totalDepositsAmount: number;
  totalProfit: number;
  profitChange: number;
}

export interface AdminStatsProps {
  totalUsers: number;
  totalInvested: number;
  totalPaid: number;
  pendingWithdrawals: number;
  userGrowth: number;
  investmentGrowth: number;
  paymentGrowth: number;
  pendingWithdrawalCount: number;
}

export interface SidebarLink {
  href: string;
  label: string;
  icon: string;
  active?: boolean;
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export type InvestmentStatus = 'active' | 'completed' | 'cancelled';
export type TransactionType = 'deposit' | 'withdrawal' | 'interest' | 'referral';
export type TransactionStatus = 'pending' | 'completed' | 'failed';
