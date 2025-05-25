import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { ArrowUpRight, CreditCard, TrendingUp, Wallet } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UserBalanceCardProps {
  balance: number;
  totalProfit?: number;
  totalInvested?: number;
  onWithdraw?: () => void;
  onDeposit?: () => void;
}

export default function UserBalanceCard({
  balance = 0,
  totalProfit = 0,
  totalInvested = 0,
  onWithdraw,
  onDeposit,
}: UserBalanceCardProps) {
  const { t } = useTranslation();
  
  // Форматирование чисел для отображения с 2 знаками после запятой
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Основная карточка баланса */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="col-span-1 md:col-span-2"
      >
        <Card className="overflow-hidden border dark:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 opacity-50" />
          <CardHeader className="relative">
            <CardTitle className="text-xl flex items-center">
              <Wallet className="h-5 w-5 mr-2 text-indigo-500" />
              {t('dashboard.yourBalance')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.balanceDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col space-y-2">
              <div className="flex items-baseline">
                <span className="text-3xl font-bold tracking-tight md:text-5xl">
                  {formatCurrency(balance)}
                </span>
                <span className="ml-2 text-sm text-muted-foreground">USD</span>
              </div>
              
              <div className="mt-4 flex space-x-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  </div>
                  <div className="ml-2">
                    <p className="text-gray-500 dark:text-gray-400">{t('dashboard.totalProfit')}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-50">
                      {formatCurrency(totalProfit)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                    <CreditCard className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="ml-2">
                    <p className="text-gray-500 dark:text-gray-400">{t('dashboard.totalInvested')}</p>
                    <p className="font-medium text-gray-900 dark:text-gray-50">
                      {formatCurrency(totalInvested)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Декоративные элементы */}
            <motion.div 
              className="absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br from-purple-500/30 to-indigo-500/30 blur-xl"
              animate={{ 
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
            <motion.div 
              className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 blur-xl"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1
              }}
            />
          </CardContent>
          <CardFooter className="relative flex flex-col sm:flex-row gap-3 pt-0">
            <Button
              onClick={onDeposit}
              className={cn(
                "w-full sm:w-auto",
                "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              )}
            >
              {t('dashboard.deposit')}
            </Button>
            <Button
              onClick={onWithdraw}
              variant="outline"
              className="w-full sm:w-auto border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-800"
            >
              {t('dashboard.withdraw')}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
      
      {/* Статистическая карточка */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card className="h-full border dark:border-gray-700">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-orange-500/10 opacity-50" />
          <CardHeader className="relative">
            <CardTitle className="text-xl flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-purple-500" />
              {t('dashboard.investmentStats')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.statsDesc')}
            </CardDescription>
          </CardHeader>
          <CardContent className="relative">
            <div className="flex flex-col space-y-6">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.activeInvestments')}
                </p>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-2xl font-bold">{(Math.random() * 5).toFixed(0)}</span>
                  <span className="inline-flex items-center rounded-md bg-green-50 dark:bg-green-900/40 px-2 py-1 text-xs font-medium text-green-700 dark:text-green-400">
                    <ArrowUpRight className="mr-1 h-3 w-3" />
                    <span>Active</span>
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.dailyEarnings')}
                </p>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-bold">
                    {formatCurrency(totalInvested * 0.015)}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {t('dashboard.referralEarnings')}
                </p>
                <div className="mt-1 flex items-center">
                  <span className="text-2xl font-bold">
                    {formatCurrency(totalProfit * 0.2)}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}