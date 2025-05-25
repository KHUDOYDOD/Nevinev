import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Wallet,
  Copy,
  Check,
  BarChart3,
  BadgeDollarSign,
  TrendingUp,
  ChevronRight,
  Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

// Анимации
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

// Компонент карточки баланса
const UserBalanceCard = ({ user }) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("overview");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [copied, setCopied] = useState(false);

  // Мутации для операций с балансом
  const depositMutation = useMutation({
    mutationFn: async (amount: number) => {
      const response = await fetch("/api/user/deposit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount })
      });
      
      if (!response.ok) {
        throw new Error("Ошибка депозита");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/transactions"] });
      setDepositAmount("");
      toast({
        title: t('success'),
        description: t('deposit.success'),
        variant: "default"
      });
    },
    onError: () => {
      toast({
        title: t('error'),
        description: t('deposit.error'),
        variant: "destructive"
      });
    }
  });

  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: number, address: string }) => {
      const response = await fetch("/api/user/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error("Ошибка вывода");
      }
      
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current"] });
      queryClient.invalidateQueries({ queryKey: ["/api/user/transactions"] });
      setWithdrawAmount("");
      setWithdrawAddress("");
      toast({
        title: t('success'),
        description: t('withdraw.success'),
        variant: "default"
      });
    },
    onError: () => {
      toast({
        title: t('error'),
        description: t('withdraw.error'),
        variant: "destructive"
      });
    }
  });

  // Обработчики операций
  const handleDeposit = () => {
    if (!depositAmount || isNaN(Number(depositAmount)) || Number(depositAmount) <= 0) {
      toast({
        title: t('error'),
        description: t('deposit.invalidAmount'),
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    depositMutation.mutate(Number(depositAmount));
    setTimeout(() => setIsProcessing(false), 1500);
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || isNaN(Number(withdrawAmount)) || Number(withdrawAmount) <= 0) {
      toast({
        title: t('error'),
        description: t('withdraw.invalidAmount'),
        variant: "destructive"
      });
      return;
    }
    
    if (Number(withdrawAmount) > user?.balance) {
      toast({
        title: t('error'),
        description: t('withdraw.insufficientFunds'),
        variant: "destructive"
      });
      return;
    }
    
    if (!withdrawAddress) {
      toast({
        title: t('error'),
        description: t('withdraw.noAddress'),
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    withdrawMutation.mutate({ 
      amount: Number(withdrawAmount),
      address: withdrawAddress
    });
    setTimeout(() => setIsProcessing(false), 1500);
  };

  const copyWalletAddress = () => {
    navigator.clipboard.writeText("0x1234567890AbCdEf1234567890AbCdEf12345678");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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

  // Карточки статистики
  const BalanceStats = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible" 
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    >
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('stats.totalBalance')}</p>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 text-white flex items-center justify-center shadow-lg">
            <Wallet className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(user?.balance || 0)}</p>
        <div className="flex items-center mt-1 text-green-600 dark:text-green-400 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>+5.2% {t('common.thisWeek')}</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('stats.totalEarned')}</p>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg">
            <BadgeDollarSign className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(1800)}</p>
        <div className="flex items-center mt-1 text-purple-600 dark:text-purple-400 text-sm">
          <Sparkles className="w-4 h-4 mr-1" />
          <span>{t('stats.lastWeekUp')}</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('stats.activeDeposits')}</p>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-lg">
            <BarChart3 className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">2</p>
        <div className="flex items-center mt-1 text-green-600 dark:text-green-400 text-sm">
          <ArrowUpRight className="w-4 h-4 mr-1" />
          <span>{t('deposit.active')}</span>
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
            {t('dashboard.balance')}
          </motion.h2>
          
          <Tabs defaultValue="overview">
            <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
              <TabsTrigger
                value="overview"
                className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                {t('common.overview')}
              </TabsTrigger>
            <TabsTrigger
              value="deposit"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              {t('deposit.title')}
            </TabsTrigger>
            <TabsTrigger
              value="withdraw"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              {t('withdraw.title')}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <AnimatePresence mode="wait">
          <TabsContent value="overview" className="mt-0">
            <BalanceStats />
            
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{t('dashboard.balanceDetails')}</h3>
                  <p className="text-gray-500 dark:text-gray-400">{t('dashboard.balanceDescription')}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-800/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">{t('deposit.yourWallet')}</h4>
                    <div className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-lg mb-3">
                      <div className="text-sm text-gray-600 dark:text-gray-300 font-mono overflow-hidden text-ellipsis">
                        0x1234...5678
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={copyWalletAddress}
                        className="h-8 px-3"
                      >
                        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      </Button>
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setActiveTab("deposit")}
                      >
                        <ArrowDownRight className="h-4 w-4 mr-1" />
                        {t('deposit.title')}
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        onClick={() => setActiveTab("withdraw")}
                      >
                        <ArrowUpRight className="h-4 w-4 mr-1" />
                        {t('withdraw.title')}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 p-4 rounded-lg">
                    <h4 className="font-medium mb-3">{t('stats.earnings')}</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">{t('stats.thisWeek')}</span>
                        <span className="font-semibold">{formatCurrency(320)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">{t('stats.thisMonth')}</span>
                        <span className="font-semibold">{formatCurrency(1250)}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">{t('stats.allTime')}</span>
                        <span className="font-semibold">{formatCurrency(1800)}</span>
                      </div>
                      <div className="w-full h-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-full mt-4 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: "65%" }}
                          transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600"
                        />
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-1">
                        {t('stats.monthlyTarget')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-5">
                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white w-full md:w-auto"
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    {t('common.viewAllStatistics')}
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="deposit" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('deposit.title')}</CardTitle>
                  <CardDescription>{t('deposit.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 p-4 rounded-lg mb-4">
                      <div className="flex items-center">
                        <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('deposit.yourWallet')}</h4>
                      </div>
                      <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded-md flex items-center justify-between">
                        <div className="font-mono text-sm text-gray-600 dark:text-gray-300">0x1234567890AbCdEf1234567890AbCdEf12345678</div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={copyWalletAddress}
                          className="h-8 px-3"
                        >
                          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="depositAmount">{t('deposit.amount')}</Label>
                      <div className="relative">
                        <Input
                          id="depositAmount"
                          type="number"
                          placeholder="100"
                          value={depositAmount}
                          onChange={e => setDepositAmount(e.target.value)}
                          className="pr-12"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                          USD
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {t('deposit.info')}
                      </p>
                      
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[100, 200, 500, 1000].map(amount => (
                          <Button
                            key={amount}
                            variant="outline"
                            className="w-full"
                            onClick={() => setDepositAmount(amount.toString())}
                          >
                            ${amount}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                    onClick={handleDeposit}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {t('common.processing')}
                      </div>
                    ) : (
                      <>{t('deposit.button')}</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="withdraw" className="mt-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('withdraw.title')}</CardTitle>
                  <CardDescription>{t('withdraw.description')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-4 rounded-lg mb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-100">{t('dashboard.availableBalance')}</h4>
                          <p className="text-2xl font-bold mt-1">{formatCurrency(user?.balance || 0)}</p>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                          <Wallet className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="withdrawAmount">{t('withdraw.amount')}</Label>
                      <div className="relative">
                        <Input
                          id="withdrawAmount"
                          type="number"
                          placeholder="50"
                          value={withdrawAmount}
                          onChange={e => setWithdrawAmount(e.target.value)}
                          className="pr-12"
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                          USD
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="withdrawAddress">{t('withdraw.address')}</Label>
                      <Input
                        id="withdrawAddress"
                        type="text"
                        placeholder="0x..."
                        value={withdrawAddress}
                        onChange={e => setWithdrawAddress(e.target.value)}
                      />
                    </div>
                    
                    <div className="pt-2">
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                        {t('withdraw.info')}
                      </p>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{t('withdraw.amount')}</span>
                          <span className="font-medium">{withdrawAmount ? `$${withdrawAmount}` : '-'}</span>
                        </div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-300">{t('withdraw.fee')}</span>
                          <span className="font-medium">$0</span>
                        </div>
                        <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium">{t('withdraw.total')}</span>
                            <span className="font-semibold">{withdrawAmount ? `$${withdrawAmount}` : '-'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    className="w-full bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700"
                    onClick={handleWithdraw}
                    disabled={isProcessing}
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {t('common.processing')}
                      </div>
                    ) : (
                      <>{t('withdraw.button')}</>
                    )}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default UserBalanceCard;