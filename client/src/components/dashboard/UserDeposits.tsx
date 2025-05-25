import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Plus, TrendingUp, Clock, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Deposit {
  id: number;
  tariffName: string;
  amount: number;
  dailyProfit: number;
  date: Date;
  status: "active" | "completed" | "pending";
  duration?: number; // в днях
  daysLeft?: number;
}

interface UserDepositsProps {
  deposits: Deposit[];
  onNewDeposit?: () => void;
}

export default function UserDeposits({ 
  deposits = [], 
  onNewDeposit 
}: UserDepositsProps) {
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
  
  // Функция для форматирования даты
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Получение статуса депозита на русском
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return t('dashboard.active');
      case 'completed':
        return t('dashboard.completed');
      case 'pending':
        return t('dashboard.pending');
      default:
        return status;
    }
  };
  
  // Получение цвета для статуса
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'completed':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'pending':
        return 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  // Получение иконки статуса
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <TrendingUp className="h-4 w-4" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'pending':
        return <Clock className="h-4 w-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card className="border dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{t('dashboard.yourDeposits')}</CardTitle>
            <CardDescription>
              {t('dashboard.depositsDesc')}
            </CardDescription>
          </div>
          <Button 
            onClick={onNewDeposit}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t('dashboard.newDeposit')}
          </Button>
        </CardHeader>
        
        <CardContent>
          {deposits.length === 0 ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <TrendingUp className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t('dashboard.noDeposits')}</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {t('dashboard.noDepositsDesc')}
              </p>
              <Button 
                onClick={onNewDeposit}
                className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.makeFirstDeposit')}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Демонстрационные данные для отображения */}
              {[
                {
                  id: 1,
                  tariffName: 'Стандарт',
                  amount: 1000,
                  dailyProfit: 15,
                  date: new Date(2025, 4, 15),
                  status: 'active' as const,
                  duration: 30,
                  daysLeft: 20
                },
                {
                  id: 2,
                  tariffName: 'Премиум',
                  amount: 5000,
                  dailyProfit: 100,
                  date: new Date(2025, 4, 10),
                  status: 'active' as const,
                  duration: 60,
                  daysLeft: 45
                },
                {
                  id: 3,
                  tariffName: 'Базовый',
                  amount: 500,
                  dailyProfit: 5,
                  date: new Date(2025, 3, 25),
                  status: 'completed' as const,
                  duration: 30,
                  daysLeft: 0
                }
              ].map((deposit) => (
                <div 
                  key={deposit.id}
                  className="p-4 rounded-lg border dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                    <div>
                      <h3 className="text-lg font-semibold flex items-center">
                        {deposit.tariffName}
                        <span className={cn(
                          "ml-2 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                          getStatusColor(deposit.status)
                        )}>
                          {getStatusIcon(deposit.status)}
                          <span className="ml-1">{getStatusText(deposit.status)}</span>
                        </span>
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(deposit.date)}
                      </p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <p className="text-lg font-bold">{formatCurrency(deposit.amount)}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        +{formatCurrency(deposit.dailyProfit)} / {t('common.day')}
                      </p>
                    </div>
                  </div>
                  
                  {deposit.status === 'active' && deposit.duration && deposit.daysLeft !== undefined && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>{t('dashboard.daysLeft')}: {deposit.daysLeft} / {deposit.duration}</span>
                        <span>{((deposit.duration - deposit.daysLeft) / deposit.duration * 100).toFixed(0)}%</span>
                      </div>
                      <Progress 
                        value={(deposit.duration - deposit.daysLeft) / deposit.duration * 100} 
                        className="h-2 bg-gray-100 dark:bg-gray-700"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        
        {deposits.length > 0 && (
          <CardFooter className="border-t px-6 py-4">
            <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-3">
                  <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.totalDailyProfit')}</p>
                  <p className="text-lg font-semibold">{formatCurrency(120)}</p>
                </div>
              </div>
              
              <Button
                onClick={onNewDeposit}
                variant="outline"
                className="w-full sm:w-auto border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-400 dark:hover:bg-gray-800"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('dashboard.newDeposit')}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}