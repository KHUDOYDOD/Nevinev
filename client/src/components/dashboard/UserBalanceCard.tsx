import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  CreditCard, 
  Wallet, 
  ArrowUp, 
  DollarSign, 
  Copy, 
  CheckCircle2,
  TrendingUp,
  Clock
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

// Анимация для карточек
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

// Анимация для счетчиков
const counterVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut"
    }
  }
};

interface UserBalanceCardProps {
  user: any;
}

export default function UserBalanceCard({ user }: UserBalanceCardProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [amount, setAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("card");
  const [withdrawAddress, setWithdrawAddress] = useState("");
  const [isCopied, setIsCopied] = useState(false);
  const [activeDepositTab, setActiveDepositTab] = useState("card");

  // Форматирование валюты
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Мутация для пополнения счета
  const depositMutation = useMutation({
    mutationFn: async (data: { amount: number, method: string }) => {
      return apiRequest("/api/user/deposit", {
        method: "POST",
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current"] });
      toast({
        title: t('deposit.success'),
        description: t('deposit.successDescription', { amount }),
      });
      setAmount("");
    }
  });

  // Мутация для вывода средств
  const withdrawMutation = useMutation({
    mutationFn: async (data: { amount: number, method: string, address: string }) => {
      return apiRequest("/api/user/withdraw", {
        method: "POST",
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current"] });
      toast({
        title: t('withdraw.success'),
        description: t('withdraw.successDescription', { amount: withdrawAmount }),
      });
      setWithdrawAmount("");
      setWithdrawAddress("");
    }
  });

  // Обработчик пополнения счета
  const handleDeposit = () => {
    if (!amount || parseFloat(amount) <= 0) {
      toast({
        title: t('deposit.error'),
        description: t('deposit.invalidAmount'),
        variant: "destructive"
      });
      return;
    }

    depositMutation.mutate({
      amount: parseFloat(amount),
      method: activeDepositTab
    });
  };

  // Обработчик вывода средств
  const handleWithdraw = () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast({
        title: t('withdraw.error'),
        description: t('withdraw.invalidAmount'),
        variant: "destructive"
      });
      return;
    }

    if (parseFloat(withdrawAmount) > (user?.balance || 0)) {
      toast({
        title: t('withdraw.error'),
        description: t('withdraw.insufficientFunds'),
        variant: "destructive"
      });
      return;
    }

    if (!withdrawAddress && withdrawMethod !== "card") {
      toast({
        title: t('withdraw.error'),
        description: t('withdraw.addressRequired'),
        variant: "destructive"
      });
      return;
    }

    withdrawMutation.mutate({
      amount: parseFloat(withdrawAmount),
      method: withdrawMethod,
      address: withdrawAddress
    });
  };

  const handleCopyWalletAddress = () => {
    const walletAddress = "0xABC...789"; // Пример адреса кошелька
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: t('common.copied'),
      description: t('common.addressCopied'),
    });
  };

  // Данные для графика активности (пример)
  const activityData = [
    { date: "01.05", amount: 100 },
    { date: "05.05", amount: 250 },
    { date: "10.05", amount: 180 },
    { date: "15.05", amount: 320 },
    { date: "20.05", amount: 220 },
    { date: "25.05", amount: 450 }
  ];

  // Статистика
  const statistics = [
    {
      title: t('stats.deposits'),
      value: 12,
      icon: <CreditCard className="h-5 w-5" />,
      color: "bg-blue-500"
    },
    {
      title: t('stats.withdrawals'),
      value: 3,
      icon: <Wallet className="h-5 w-5" />,
      color: "bg-amber-500"
    },
    {
      title: t('stats.profit'),
      value: formatCurrency(1250),
      icon: <TrendingUp className="h-5 w-5" />,
      color: "bg-green-500"
    }
  ];

  // Последние транзакции
  const recentTransactions = [
    {
      id: 1,
      type: "deposit",
      amount: 100,
      date: "2025-05-20",
      status: "completed"
    },
    {
      id: 2,
      type: "profit",
      amount: 25,
      date: "2025-05-21",
      status: "completed"
    },
    {
      id: 3,
      type: "withdraw",
      amount: 75,
      date: "2025-05-22",
      status: "pending"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок и общий баланс */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <Card className="border-none shadow-xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl flex items-center gap-2">
              <DollarSign className="h-6 w-6" />
              {t('dashboard.balance')}
            </CardTitle>
            <CardDescription className="text-white/80">
              {t('dashboard.currentBalance')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={counterVariants}
              initial="hidden"
              animate="visible"
              className="text-4xl font-bold tracking-tight mt-2 mb-4"
            >
              {formatCurrency(user?.balance || 0)}
            </motion.div>
            
            <div className="grid grid-cols-3 gap-4 mt-6">
              {statistics.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="bg-white/10 backdrop-blur-sm rounded-lg p-3 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.color}`}>
                      {stat.icon}
                    </div>
                    <span className="text-sm font-medium">{stat.title}</span>
                  </div>
                  <span className="text-xl font-bold">{stat.value}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
          <div className="absolute top-0 right-0 w-60 h-60 bg-white/5 rounded-full -translate-x-1/3 -translate-y-1/2 z-0"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 z-0"></div>
        </Card>
      </motion.div>

      {/* Секция пополнения и вывода средств */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Пополнение баланса */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowUp className="h-5 w-5 text-green-500" />
                {t('deposit.title')}
              </CardTitle>
              <CardDescription>
                {t('deposit.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" onValueChange={setActiveDepositTab}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="card" className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t('deposit.card')}
                  </TabsTrigger>
                  <TabsTrigger value="crypto" className="flex-1">
                    <Wallet className="h-4 w-4 mr-2" />
                    {t('deposit.crypto')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="card">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="amount">{t('common.amount')}</Label>
                      <div className="relative">
                        <Input
                          id="amount"
                          type="number"
                          placeholder="100"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-8"
                        />
                        <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      onClick={handleDeposit}
                      disabled={depositMutation.isPending}
                    >
                      {depositMutation.isPending ? t('common.processing') : t('deposit.depositNow')}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="crypto">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="crypto-amount">{t('common.amount')}</Label>
                      <div className="relative">
                        <Input
                          id="crypto-amount"
                          type="number"
                          placeholder="100"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          className="pl-8"
                        />
                        <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    
                    <div>
                      <Label>{t('deposit.walletAddress')}</Label>
                      <div className="mt-1 relative">
                        <div className="flex items-center justify-between p-3 rounded-md bg-gray-100 dark:bg-gray-800 text-sm font-mono">
                          <span className="truncate">0xABC...789</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="ml-2 h-8 px-2"
                            onClick={handleCopyWalletAddress}
                          >
                            {isCopied ? (
                              <CheckCircle2 className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                      onClick={handleDeposit}
                      disabled={depositMutation.isPending}
                    >
                      {depositMutation.isPending ? t('common.processing') : t('deposit.depositNow')}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>

        {/* Вывод средств */}
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ArrowUp className="h-5 w-5 text-red-500 rotate-180" />
                {t('withdraw.title')}
              </CardTitle>
              <CardDescription>
                {t('withdraw.description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="card" onValueChange={setWithdrawMethod}>
                <TabsList className="w-full mb-4">
                  <TabsTrigger value="card" className="flex-1">
                    <CreditCard className="h-4 w-4 mr-2" />
                    {t('withdraw.card')}
                  </TabsTrigger>
                  <TabsTrigger value="crypto" className="flex-1">
                    <Wallet className="h-4 w-4 mr-2" />
                    {t('withdraw.crypto')}
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="card">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="withdraw-amount">{t('common.amount')}</Label>
                      <div className="relative">
                        <Input
                          id="withdraw-amount"
                          type="number"
                          placeholder="100"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="pl-8"
                        />
                        <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                      onClick={handleWithdraw}
                      disabled={withdrawMutation.isPending}
                    >
                      {withdrawMutation.isPending ? t('common.processing') : t('withdraw.withdrawNow')}
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="crypto">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="crypto-withdraw-amount">{t('common.amount')}</Label>
                      <div className="relative">
                        <Input
                          id="crypto-withdraw-amount"
                          type="number"
                          placeholder="100"
                          value={withdrawAmount}
                          onChange={(e) => setWithdrawAmount(e.target.value)}
                          className="pl-8"
                        />
                        <DollarSign className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="crypto-address">{t('withdraw.yourWalletAddress')}</Label>
                      <Input
                        id="crypto-address"
                        placeholder="0x..."
                        value={withdrawAddress}
                        onChange={(e) => setWithdrawAddress(e.target.value)}
                      />
                    </div>
                    
                    <Button
                      className="w-full bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700"
                      onClick={handleWithdraw}
                      disabled={withdrawMutation.isPending}
                    >
                      {withdrawMutation.isPending ? t('common.processing') : t('withdraw.withdrawNow')}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Последние транзакции */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              {t('dashboard.recentTransactions')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.recentTransactionsDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTransactions.map((transaction, i) => (
                <motion.div
                  key={transaction.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      transaction.type === 'deposit' ? 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400' :
                      transaction.type === 'withdraw' ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
                    }`}>
                      {transaction.type === 'deposit' ? <ArrowUp className="h-5 w-5" /> :
                       transaction.type === 'withdraw' ? <ArrowUp className="h-5 w-5 transform rotate-180" /> :
                       <TrendingUp className="h-5 w-5" />}
                    </div>
                    <div>
                      <p className="font-medium">{
                        transaction.type === 'deposit' ? t('transaction.deposit') :
                        transaction.type === 'withdraw' ? t('transaction.withdrawal') :
                        t('transaction.profit')
                      }</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {new Date(transaction.date).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.type === 'withdraw' ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {transaction.type === 'withdraw' ? '-' : '+'}{formatCurrency(transaction.amount)}
                    </p>
                    <p className={`text-xs ${
                      transaction.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                      transaction.status === 'pending' ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {transaction.status === 'completed' ? t('transaction.completed') :
                       transaction.status === 'pending' ? t('transaction.pending') : t('transaction.rejected')}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button variant="outline">
              {t('common.viewAll')}
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}