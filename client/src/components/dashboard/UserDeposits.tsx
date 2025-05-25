import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { 
  PiggyBank, 
  Calendar, 
  Clock, 
  TrendingUp, 
  ArrowUpRight,
  Plus,
  DollarSign,
  ChevronRight
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

// Анимации для карточек
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

interface UserDepositsProps {
  deposits: any[];
}

export default function UserDeposits({ deposits = [] }: UserDepositsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("active");
  const [isInvestDialogOpen, setIsInvestDialogOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [investAmount, setInvestAmount] = useState("");

  // Получаем тарифные планы
  const { data: tariffs = [] } = useQuery({
    queryKey: ["/api/tariffs"],
  });

  // Форматирование валюты
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Фильтрация депозитов по статусу
  const filteredDeposits = deposits.filter((deposit) => {
    if (activeTab === "active") return deposit.isActive;
    if (activeTab === "completed") return !deposit.isActive;
    return true;
  });

  // Открытие диалога инвестирования с выбранным планом
  const handleOpenInvestDialog = (plan: any) => {
    setSelectedPlan(plan);
    setIsInvestDialogOpen(true);
  };

  // Расчет дневной прибыли
  const calculateDailyProfit = (amount: number, rate: number) => {
    return (amount * rate) / 100;
  };

  // Расчет общей прибыли
  const calculateTotalProfit = (amount: number, rate: number, days: number) => {
    return (amount * rate * days) / 100;
  };

  // Обработчик инвестирования
  const handleInvest = () => {
    // Здесь будет логика отправки запроса на сервер
    setIsInvestDialogOpen(false);
    setInvestAmount("");
  };

  // Преобразование статуса депозита в читаемый текст
  const getStatusText = (status: string, isActive: boolean) => {
    if (!isActive) return t('deposit.completed');
    if (status === "pending") return t('deposit.pending');
    return t('deposit.active');
  };

  // Получение цвета для статуса
  const getStatusColor = (status: string, isActive: boolean) => {
    if (!isActive) return "text-gray-500";
    if (status === "pending") return "text-amber-500";
    return "text-green-500";
  };

  // Компонент для пустого состояния
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <PiggyBank className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {t('deposits.noDepositsYet')}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {t('deposits.startInvestingDescription')}
      </p>
      <Button
        onClick={() => setIsInvestDialogOpen(true)}
        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
      >
        <Plus className="mr-2 h-4 w-4" />
        {t('deposits.makeFirstDeposit')}
      </Button>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">{t('dashboard.deposits')}</h2>
        <Button 
          onClick={() => setIsInvestDialogOpen(true)} 
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          {t('deposits.newDeposit')}
        </Button>
      </div>

      <Tabs defaultValue="active" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="active">
            {t('deposits.active')}
          </TabsTrigger>
          <TabsTrigger value="completed">
            {t('deposits.completed')}
          </TabsTrigger>
          <TabsTrigger value="all">
            {t('deposits.all')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {filteredDeposits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDeposits.map((deposit, index) => (
                <DepositCard
                  key={deposit.id}
                  deposit={deposit}
                  index={index}
                  formatCurrency={formatCurrency}
                  getStatusText={getStatusText}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="completed" className="space-y-4">
          {filteredDeposits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDeposits.map((deposit, index) => (
                <DepositCard
                  key={deposit.id}
                  deposit={deposit}
                  index={index}
                  formatCurrency={formatCurrency}
                  getStatusText={getStatusText}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>

        <TabsContent value="all" className="space-y-4">
          {filteredDeposits.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredDeposits.map((deposit, index) => (
                <DepositCard
                  key={deposit.id}
                  deposit={deposit}
                  index={index}
                  formatCurrency={formatCurrency}
                  getStatusText={getStatusText}
                  getStatusColor={getStatusColor}
                />
              ))}
            </div>
          ) : (
            <EmptyState />
          )}
        </TabsContent>
      </Tabs>

      {/* Доступные тарифные планы */}
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">{t('deposits.availablePlans')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tariffs.map((plan: any, index: number) => (
            <motion.div
              key={plan.id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={index}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-xl shadow-md overflow-hidden"
            >
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-4 py-3 text-white">
                <h4 className="font-bold text-lg">{plan.name}</h4>
                <p className="text-white/80 text-sm">{t('calculator.dailyReturn')}: {plan.dailyRate}%</p>
              </div>
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('calculator.minDeposit')}</span>
                    <span className="font-medium">{formatCurrency(plan.minDeposit)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('calculator.profit30Days')}</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {(plan.dailyRate * 30).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('calculator.referralBonus')}</span>
                    <span className="font-medium">{plan.referralBonus}%</span>
                  </div>
                </div>
                <Button 
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700"
                  onClick={() => handleOpenInvestDialog(plan)}
                >
                  {t('calculator.invest')}
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Диалог создания нового депозита */}
      <Dialog open={isInvestDialogOpen} onOpenChange={setIsInvestDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('deposits.newDeposit')}</DialogTitle>
            <DialogDescription>
              {selectedPlan ? (
                <div className="mt-2">
                  <Badge className="mb-2 bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900">
                    {selectedPlan.name}
                  </Badge>
                  <p>{t('deposits.dailyReturnRate')}: <span className="font-medium text-green-600 dark:text-green-400">{selectedPlan.dailyRate}%</span></p>
                </div>
              ) : (
                t('deposits.selectPlanAndAmount')
              )}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            {!selectedPlan && (
              <div className="space-y-2">
                <Label htmlFor="plan">{t('deposits.selectPlan')}</Label>
                <div className="grid grid-cols-2 gap-2">
                  {tariffs.map((plan: any) => (
                    <Button
                      key={plan.id}
                      type="button"
                      variant={selectedPlan?.id === plan.id ? "default" : "outline"}
                      className={cn(
                        selectedPlan?.id === plan.id 
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 border-indigo-600" 
                          : "",
                        "justify-start overflow-hidden text-sm h-auto py-2"
                      )}
                      onClick={() => setSelectedPlan(plan)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{plan.name}</div>
                        <div className="text-xs opacity-90">{plan.dailyRate}% {t('calculator.daily')}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">{t('common.amount')}</Label>
              <div className="relative">
                <Input
                  id="amount"
                  type="number"
                  placeholder={selectedPlan ? selectedPlan.minDeposit.toString() : "100"}
                  value={investAmount}
                  onChange={(e) => setInvestAmount(e.target.value)}
                  className="pl-8"
                />
                <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              </div>
              {selectedPlan && (
                <p className="text-xs text-gray-500">
                  {t('deposits.minDepositAmount')}: {formatCurrency(selectedPlan.minDeposit)}
                </p>
              )}
            </div>

            {selectedPlan && investAmount && parseFloat(investAmount) > 0 && (
              <div className="space-y-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('deposits.dailyProfit')}:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(calculateDailyProfit(parseFloat(investAmount), selectedPlan.dailyRate))}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">{t('deposits.monthlyProfit')}:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(calculateTotalProfit(parseFloat(investAmount), selectedPlan.dailyRate, 30))}
                  </span>
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsInvestDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="button"
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              disabled={!selectedPlan || !investAmount || parseFloat(investAmount) < (selectedPlan?.minDeposit || 0)}
              onClick={handleInvest}
            >
              {t('deposits.createDeposit')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Компонент карточки депозита
const DepositCard = ({ deposit, index, formatCurrency, getStatusText, getStatusColor }: any) => {
  const { t } = useTranslation();
  
  // Рассчитываем прогресс по дням (пример)
  const daysTotal = 30; // Допустим, депозит на 30 дней
  const daysActive = Math.min(10, daysTotal); // Пример: прошло 10 дней
  const progress = (daysActive / daysTotal) * 100;
  
  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <Card className="overflow-hidden">
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-lg">{deposit.tariffName || "Тарифный план"}</CardTitle>
              <CardDescription>
                {formatCurrency(deposit.amount)} • {t('deposits.dailyReturn')}: {deposit.dailyRate}%
              </CardDescription>
            </div>
            <Badge className={cn(
              "capitalize",
              deposit.isActive
                ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400"
            )}>
              {getStatusText(deposit.status, deposit.isActive)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Calendar className="h-4 w-4 mr-1" />
                <span>
                  {new Date(deposit.createdAt).toLocaleDateString('ru-RU')}
                </span>
              </div>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                <Clock className="h-4 w-4 mr-1" />
                <span>{daysActive} / {daysTotal} {t('common.days')}</span>
              </div>
            </div>
            
            {deposit.isActive && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{t('deposits.progress')}</span>
                  <span className="font-medium">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}
            
            <div className="bg-gray-50 dark:bg-gray-800 rounded-md p-3 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t('deposits.dailyProfit')}</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(deposit.dailyProfit)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500 dark:text-gray-400">{t('deposits.earnedTotal')}</span>
                <span className="font-medium text-green-600 dark:text-green-400">
                  {formatCurrency(deposit.dailyProfit * daysActive)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="border-t bg-gray-50 dark:bg-gray-800/50 pt-4">
          <Button variant="outline" className="w-full flex items-center justify-center gap-1">
            <TrendingUp className="h-4 w-4 mr-1" />
            {t('deposits.viewDetails')}
            <ChevronRight className="h-4 w-4 ml-auto" />
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};