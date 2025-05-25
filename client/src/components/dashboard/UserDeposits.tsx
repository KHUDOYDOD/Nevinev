import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  Calendar,
  CreditCard,
  ChevronRight,
  PlusCircle,
  Clock,
  BadgeDollarSign,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  PiggyBank,
  BarChart3,
  Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

// Анимации
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Компонент вкладки депозитов
const UserDeposits = ({ deposits = [] }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("active");
  const [newDepositAmount, setNewDepositAmount] = useState("");
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [isOpenNewDepositDialog, setIsOpenNewDepositDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // Запрос тарифных планов
  const { data: tariffs = [] } = useQuery({
    queryKey: ["/api/tariffs"],
  });

  // Мутация для создания нового депозита
  const createDepositMutation = useMutation({
    mutationFn: async (data: { amount: number, tariffId: number }) => {
      const response = await fetch("/api/user/deposits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Ошибка создания депозита");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/deposits"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current"] });
      setNewDepositAmount("");
      setSelectedPlan(null);
      setIsOpenNewDepositDialog(false);
      toast({
        title: "Успешно",
        description: "Депозит успешно создан",
        variant: "default"
      });
    },
    onError: () => {
      toast({
        title: "Ошибка",
        description: "Не удалось создать депозит. Пожалуйста, попробуйте позже",
        variant: "destructive"
      });
    }
  });

  // Обработчик создания нового депозита
  const handleCreateDeposit = () => {
    if (!newDepositAmount || isNaN(Number(newDepositAmount)) || Number(newDepositAmount) <= 0) {
      toast({
        title: t('error'),
        description: t('deposit.invalidAmount'),
        variant: "destructive"
      });
      return;
    }
    
    if (!selectedPlan) {
      toast({
        title: t('error'),
        description: t('deposit.noPlanSelected'),
        variant: "destructive"
      });
      return;
    }
    
    const minDeposit = selectedPlan.minDeposit || 100;
    if (Number(newDepositAmount) < minDeposit) {
      toast({
        title: t('error'),
        description: t('deposit.belowMin', { min: minDeposit }),
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    createDepositMutation.mutate({ 
      amount: Number(newDepositAmount),
      tariffId: selectedPlan.id
    });
    setTimeout(() => setIsProcessing(false), 1500);
  };

  // Форматирование валюты
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  // Компонент карточки депозита
  const DepositCard = ({ deposit }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const planName = tariffs.find(t => t.id === deposit.tariffId)?.name || 'План';
    const planRate = tariffs.find(t => t.id === deposit.tariffId)?.dailyRate || 1;
    
    // Рассчитаем дату истечения (для примера, 30 дней)
    const createdDate = new Date(deposit.createdAt);
    const expiryDate = new Date(createdDate);
    expiryDate.setDate(createdDate.getDate() + 30);
    
    // Рассчитаем прогресс
    const now = new Date();
    const totalDays = 30;
    const daysPassed = Math.min(
      Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)),
      totalDays
    );
    const progressPercent = Math.round((daysPassed / totalDays) * 100);
    
    // Рассчитаем прибыль
    const dailyProfit = deposit.amount * (planRate / 100);
    const totalEarned = dailyProfit * daysPassed;
    
    return (
      <motion.div
        variants={itemVariants}
        className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
      >
        <div className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                  {t('deposit.active')}
                </span>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{planName}</h3>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {t('deposit.created')}: {formatDate(deposit.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-gray-900 dark:text-gray-100">{formatCurrency(deposit.amount)}</p>
              <div className="flex items-center justify-end text-green-600 dark:text-green-400 text-sm">
                <TrendingUp className="h-3.5 w-3.5 mr-1" />
                <span>{planRate}% {t('deposit.daily')}</span>
              </div>
            </div>
          </div>
          
          <div className="space-y-3 mb-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">{t('deposit.progress')}</span>
              <span className="font-medium">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
              <span>{formatDate(deposit.createdAt)}</span>
              <span>{formatDate(expiryDate.toISOString())}</span>
            </div>
          </div>
          
          <div className="flex justify-between mb-3">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('deposit.daily')}</p>
              <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(dailyProfit)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{t('deposit.earned')}</p>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">{formatCurrency(totalEarned)}</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center mt-2"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="h-4 w-4 mr-1" />
                {t('common.less')}
              </>
            ) : (
              <>
                <ChevronDown className="h-4 w-4 mr-1" />
                {t('common.more')}
              </>
            )}
          </Button>
        </div>
        
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                <h4 className="font-medium mb-3">{t('deposit.details')}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('deposit.plan')}</span>
                    <span className="font-medium">{planName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('deposit.rate')}</span>
                    <span className="font-medium">{planRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('deposit.period')}</span>
                    <span className="font-medium">30 {t('deposit.days')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('deposit.daysPassed')}</span>
                    <span className="font-medium">{daysPassed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500 dark:text-gray-400">{t('deposit.daysLeft')}</span>
                    <span className="font-medium">{totalDays - daysPassed}</span>
                  </div>
                  <div className="flex justify-between pt-1 border-t border-gray-100 dark:border-gray-700 mt-1">
                    <span className="text-gray-500 dark:text-gray-400">{t('deposit.totalProfit')}</span>
                    <span className="font-medium text-green-600 dark:text-green-400">
                      {formatCurrency(dailyProfit * totalDays)}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // Компонент карточки тарифного плана
  const TariffCard = ({ tariff, isSelected, onSelect }) => {
    const dailyProfit = 1000 * (tariff.dailyRate / 100);
    const monthlyProfit = dailyProfit * 30;
    
    return (
      <motion.div
        variants={itemVariants}
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        className={cn(
          "bg-white dark:bg-gray-800 rounded-xl border overflow-hidden cursor-pointer relative group",
          isSelected 
            ? "border-indigo-500 dark:border-indigo-400 shadow-lg shadow-indigo-500/10" 
            : "border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md"
        )}
        onClick={() => onSelect(tariff)}
      >
        {isSelected && (
          <div className="absolute top-2 right-2 w-5 h-5 bg-indigo-500 dark:bg-indigo-400 rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3 h-3 text-white"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          </div>
        )}
        
        <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
        
        <div className="p-5">
          <h3 className="text-lg font-semibold mb-2">{tariff.nameEn}</h3>
          
          <div className="flex items-baseline mb-4">
            <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tariff.dailyRate}%</span>
            <span className="text-gray-500 dark:text-gray-400 ml-1">{t('deposit.daily')}</span>
          </div>
          
          <div className="space-y-3 mb-5">
            <div className="flex items-center">
              <BadgeDollarSign className="h-5 w-5 text-indigo-500 mr-2" />
              <span className="text-sm">{t('deposit.minAmount')}: {formatCurrency(tariff.minDeposit)}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="h-5 w-5 text-indigo-500 mr-2" />
              <span className="text-sm">{t('deposit.term')}: 30 {t('deposit.days')}</span>
            </div>
            <div className="flex items-center">
              <PiggyBank className="h-5 w-5 text-indigo-500 mr-2" />
              <span className="text-sm">{t('deposit.profit')}: {formatCurrency(monthlyProfit)} / {t('common.month')}</span>
            </div>
          </div>
          
          <div className="pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
              {t('deposit.exampleCalculation')}:
            </div>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span>{t('deposit.investment')}</span>
                <span className="font-medium">$1,000</span>
              </div>
              <div className="flex justify-between">
                <span>{t('deposit.dailyIncome')}</span>
                <span className="font-medium text-green-600 dark:text-green-400">${dailyProfit}</span>
              </div>
              <div className="flex justify-between">
                <span>{t('deposit.monthlyIncome')}</span>
                <span className="font-medium text-green-600 dark:text-green-400">${monthlyProfit}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  // Новый компонент для пустого состояния
  const EmptyState = ({ type }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-10"
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        {type === "deposits" ? (
          <PiggyBank className="h-8 w-8 text-gray-400" />
        ) : (
          <Clock className="h-8 w-8 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {type === "deposits" 
          ? t('deposit.noDeposits') 
          : t('deposit.noHistory')}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        {type === "deposits" 
          ? t('deposit.noDepositsDesc') 
          : t('deposit.noHistoryDesc')}
      </p>
      {type === "deposits" && (
        <Button 
          variant="default" 
          onClick={() => setIsOpenNewDepositDialog(true)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          {t('deposit.create')}
        </Button>
      )}
    </motion.div>
  );

  // Составные компоненты для статистики и прогнозов
  const DepositsStats = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    >
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">Активные депозиты</p>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
            <PiggyBank className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{deposits?.length || 0}</p>
        <div className="flex items-center mt-1 text-green-600 dark:text-green-400 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>Всего активно</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">Всего инвестировано</p>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg">
            <BadgeDollarSign className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(deposits?.reduce((sum, dep) => sum + dep.amount, 0) || 0)}
        </p>
        <div className="flex items-center mt-1 text-green-600 dark:text-green-400 text-sm">
          <Sparkles className="w-4 h-4 mr-1" />
          <span>Рабочий капитал</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">Прогнозируемая прибыль</p>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg">
            <BarChart3 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">
          {formatCurrency(deposits?.reduce((sum, dep) => {
            const tariff = tariffs.find(t => t.id === dep.tariffId);
            const rate = tariff?.dailyRate || 1;
            return sum + (dep.amount * (rate / 100) * 30);
          }, 0) || 0)}
        </p>
        <div className="flex items-center mt-1 text-purple-600 dark:text-purple-400 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>В следующем месяце</span>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            Депозиты
          </motion.h2>
          
          <div className="flex items-center gap-3">
            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger
                value="active"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                Активные
              </TabsTrigger>
              <TabsTrigger
                value="plans"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                Тарифы
              </TabsTrigger>
            </TabsList>
            
            <Button 
              variant="default"
              size="sm"
              onClick={() => setIsOpenNewDepositDialog(true)}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">{t('deposit.create')}</span>
            </Button>
          </div>
        </div>
        
        <AnimatePresence mode="wait">
          <TabsContent value="active" className="mt-0">
            {deposits?.length > 0 ? (
              <>
                <DepositsStats />
                
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-4"
                >
                  {deposits.map((deposit, index) => (
                    <DepositCard key={deposit.id || index} deposit={deposit} />
                  ))}
                </motion.div>
              </>
            ) : (
              <EmptyState type="deposits" />
            )}
          </TabsContent>
          
          <TabsContent value="plans" className="mt-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {tariffs.map((tariff) => (
                <TariffCard 
                  key={tariff.id} 
                  tariff={tariff}
                  isSelected={selectedPlan?.id === tariff.id}
                  onSelect={setSelectedPlan}
                />
              ))}
            </motion.div>
            
            {selectedPlan && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 flex justify-center"
              >
                <Button 
                  variant="default"
                  size="lg"
                  onClick={() => setIsOpenNewDepositDialog(true)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  <PlusCircle className="h-5 w-5 mr-2" />
                  {t('deposit.investIn')} {selectedPlan.nameEn}
                </Button>
              </motion.div>
            )}
          </TabsContent>
        </AnimatePresence>
      </Tabs>
      
      {/* Диалог создания нового депозита */}
      <Dialog open={isOpenNewDepositDialog} onOpenChange={setIsOpenNewDepositDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{t('deposit.create')}</DialogTitle>
            <DialogDescription>
              {t('deposit.createDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {!selectedPlan ? (
              <div className="space-y-3">
                <Label>{t('deposit.selectPlan')}</Label>
                <div className="grid grid-cols-1 gap-2">
                  {tariffs.map((tariff) => (
                    <Button
                      key={tariff.id}
                      variant="outline"
                      className={cn(
                        "justify-start h-auto py-3 px-4",
                        selectedPlan?.id === tariff.id && "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/20"
                      )}
                      onClick={() => setSelectedPlan(tariff)}
                    >
                      <div className="flex items-center w-full">
                        <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                          <PiggyBank className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium">{tariff.nameEn}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {tariff.dailyRate}% {t('deposit.daily')}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-gray-400" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between p-3 bg-indigo-50 dark:bg-indigo-950/20 rounded-lg mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center mr-3">
                      <PiggyBank className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <p className="font-medium">{selectedPlan.nameEn}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {selectedPlan.dailyRate}% {t('deposit.daily')}
                      </p>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setSelectedPlan(null)}
                  >
                    {t('common.change')}
                  </Button>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="depositAmount">{t('deposit.amount')}</Label>
                  <div className="relative">
                    <Input
                      id="depositAmount"
                      type="number"
                      placeholder={selectedPlan.minDeposit.toString()}
                      value={newDepositAmount}
                      onChange={e => setNewDepositAmount(e.target.value)}
                      className="pr-12"
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                      USD
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t('deposit.minAmountIs')} {formatCurrency(selectedPlan.minDeposit)}
                  </p>
                </div>
                
                {newDepositAmount && !isNaN(Number(newDepositAmount)) && Number(newDepositAmount) > 0 && (
                  <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('deposit.dailyProfit')}</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(Number(newDepositAmount) * (selectedPlan.dailyRate / 100))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{t('deposit.monthlyProfit')}</span>
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(Number(newDepositAmount) * (selectedPlan.dailyRate / 100) * 30)}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm pt-1 border-t border-gray-200 dark:border-gray-700">
                      <span className="text-gray-600 dark:text-gray-400">{t('deposit.totalProfit')} (30 {t('deposit.days')})</span>
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatCurrency(Number(newDepositAmount) * (selectedPlan.dailyRate / 100) * 30)}
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setIsOpenNewDepositDialog(false)}
            >
              {t('common.cancel')}
            </Button>
            
            {selectedPlan && (
              <Button 
                variant="default"
                disabled={isProcessing || !newDepositAmount}
                onClick={handleCreateDeposit}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                {isProcessing ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    {t('common.processing')}
                  </div>
                ) : (
                  <>{t('deposit.create')}</>
                )}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDeposits;