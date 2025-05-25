import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency with the given locale
export function formatCurrency(amount: number, locale: string = 'ru-RU', currency: string = 'USD') {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

// Calculate investment profit
export function calculateProfit(amount: number, rate: number, days: number): {
  dailyProfit: number;
  totalProfit: number;
  totalAmount: number;
} {
  const dailyProfit = amount * (rate / 100);
  const totalProfit = dailyProfit * days;
  const totalAmount = amount + totalProfit;

  return {
    dailyProfit,
    totalProfit,
    totalAmount,
  };
}

// Generate random referral code
export function generateReferralCode(length: number = 8): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const charactersLength = characters.length;
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  
  return result;
}

// Format date with the given locale
export function formatDate(date: Date | string, locale: string = 'ru-RU'): string {
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

// Get transaction type label
export function getTransactionTypeLabel(type: string, t: any): string {
  const types: Record<string, string> = {
    'deposit': t('common.deposit'),
    'withdraw': t('common.withdraw'),
    'referral_bonus': t('common.referralBonus'),
    'profit': t('common.profit'),
  };
  
  return types[type] || type;
}

// Get transaction status badge color
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    'active': 'bg-green-100 text-green-800',
    'pending': 'bg-yellow-100 text-yellow-800',
    'completed': 'bg-green-100 text-green-800',
    'rejected': 'bg-red-100 text-red-800',
  };
  
  return colors[status] || 'bg-gray-100 text-gray-800';
}

// Format percentage
export function formatPercentage(percentage: number): string {
  return `${percentage.toFixed(1)}%`;
}

// Get initials from name
export function getInitials(name: string): string {
  if (!name) return '';
  
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

// Validate email
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

// Get language name
export function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    'ru': 'Русский',
    'en': 'English',
    'tj': 'Тоҷикӣ',
    'kz': 'Қазақша',
    'uz': 'O\'zbekcha',
  };
  
  return languages[code] || code;
}
