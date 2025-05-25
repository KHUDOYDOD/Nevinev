import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency, calculateDailyProfit, calculateTotalProfit } from "@/lib/utils";
import { CalculatorProps } from "@/types";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Calculator({ plans, onInvest }: CalculatorProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();

  const [amount, setAmount] = useState(500);
  const [days, setDays] = useState(30);
  const [selectedPlan, setSelectedPlan] = useState(plans[1]); // Default to premium plan

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setAmount(value);
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1 && value <= 365) {
      setDays(value);
    }
  };

  const handleAmountSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAmount(parseInt(e.target.value));
  };

  const handleDaysSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDays(parseInt(e.target.value));
  };

  const handlePlanChange = (plan: typeof plans[0]) => {
    setSelectedPlan(plan);
    if (amount < plan.minAmount) {
      setAmount(plan.minAmount);
    }
  };

  const handleInvest = () => {
    if (!user) {
      toast({
        title: t("auth.login"),
        description: t("auth.dontHaveAccount"),
        variant: "default",
      });
      return;
    }

    if (amount < selectedPlan.minAmount) {
      toast({
        title: t("calculator.investmentAmount"),
        description: `${t("tariffs.minInvestment")}: ${formatCurrency(selectedPlan.minAmount)}`,
        variant: "destructive",
      });
      return;
    }

    if (onInvest) {
      onInvest(amount, selectedPlan.id, days);
    }
  };

  const dailyProfit = calculateDailyProfit(amount, selectedPlan.dailyInterestRate);
  const totalProfit = calculateTotalProfit(amount, selectedPlan.dailyInterestRate, days);
  const finalAmount = amount + totalProfit;

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10 dark:bg-gray-800">
      <div className="flex flex-col md:flex-row md:space-x-8">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {t("calculator.investmentAmount")}
            </label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500">$</span>
              <Input
                type="number"
                value={amount}
                min={selectedPlan.minAmount}
                max={10000}
                onChange={handleAmountChange}
                className="w-full pl-10 pr-4 py-3"
              />
            </div>
            <input
              type="range"
              min={selectedPlan.minAmount}
              max={10000}
              value={amount}
              step={100}
              onChange={handleAmountSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2 dark:bg-gray-700"
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {t("calculator.tariff")}
            </label>
            <div className="grid grid-cols-3 gap-3">
              {plans.map((plan) => (
                <Button
                  key={plan.id}
                  type="button"
                  variant={selectedPlan.id === plan.id ? "default" : "outline"}
                  className="py-3 text-sm font-medium"
                  onClick={() => handlePlanChange(plan)}
                >
                  {plan.name} {plan.dailyInterestRate}%
                </Button>
              ))}
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-gray-300">
              {t("calculator.period")}
            </label>
            <div className="relative">
              <Input
                type="number"
                value={days}
                min={1}
                max={365}
                onChange={handleDaysChange}
                className="w-full px-4 py-3"
              />
            </div>
            <input
              type="range"
              min={1}
              max={365}
              value={days}
              onChange={handleDaysSliderChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer mt-2 dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="md:w-1/2 bg-gray-50 rounded-xl p-6 dark:bg-gray-700">
          <h3 className="text-lg font-semibold mb-4 dark:text-white">{t("calculator.title")}</h3>

          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("calculator.dailyProfit")}</p>
            <p className="text-2xl font-bold text-success">{formatCurrency(dailyProfit)}</p>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("calculator.totalProfit")}</p>
            <p className="text-2xl font-bold text-primary">{formatCurrency(totalProfit)}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">{t("calculator.totalAmount")}</p>
            <p className="text-3xl font-bold dark:text-white">{formatCurrency(finalAmount)}</p>
          </div>

          {user ? (
            <Button
              onClick={handleInvest}
              className="block w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg text-center transition duration-300 transform hover:-translate-y-1"
            >
              {t("calculator.investNow")}
            </Button>
          ) : (
            <Link href="/login">
              <Button className="block w-full py-3 px-4 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg text-center transition duration-300 transform hover:-translate-y-1">
                {t("calculator.investNow")}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
