import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function getInitials(name: string): string {
  if (!name) return "U";
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function calculateProfit(
  amount: number,
  rate: number,
  days: number
): {
  dailyProfit: number;
  totalProfit: number;
  finalAmount: number;
} {
  const dailyProfit = amount * (rate / 100);
  const totalProfit = dailyProfit * days;
  const finalAmount = amount + totalProfit;

  return {
    dailyProfit,
    totalProfit,
    finalAmount,
  };
}

// Generate random time string for activity items
export function getRandomTimeAgo(): string {
  const minutes = Math.floor(Math.random() * 60) + 1;
  return `${minutes} минут назад`;
}

// Safely parse JSON with a fallback
export function safeJsonParse<T>(value: string, fallback: T): T {
  try {
    return JSON.parse(value) as T;
  } catch (error) {
    return fallback;
  }
}

// For countdown animation
export function animateValue(
  obj: HTMLElement,
  start: number,
  end: number,
  duration: number
): void {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const currentValue = Math.floor(progress * (end - start) + start);
    obj.textContent = currentValue.toLocaleString();
    
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}
