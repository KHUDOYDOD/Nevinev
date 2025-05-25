import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Route, Switch } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import AdminSidebar from "@/components/AdminSidebar";
import Statistics from "@/components/Statistics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ArrowUp,
  ArrowDown,
  Users,
  PiggyBank,
  Wallet,
  CreditCard,
  CheckCircle,
  XCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";

export default function Admin() {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [location, navigate] = useLocation();
  const [activeTab, setActiveTab] = useState("overview");

  // Проверка авторизации
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    } else if (user && !user.isAdmin) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, user, navigate]);

  // Запрос статистики
  const { data: statsData } = useQuery({
    queryKey: ["/api/statistics"],
    enabled: isAuthenticated && !!user?.isAdmin,
  });

  // Запрос тарифов
  const { data: tariffs } = useQuery({
    queryKey: ["/api/tariffs"],
    enabled: isAuthenticated && !!user?.isAdmin,
  });

  // Мокап данных для демонстрации
  const recentUsers = [
    {
      id: 1,
      username: "trader2025",
      email: "trader2025@example.com",
      date: new Date(2025, 4, 21),
      balance: 1500,
    },
    {
      id: 2,
      username: "investor88",
      email: "investor88@example.com",
      date: new Date(2025, 4, 22),
      balance: 3000,
    },
    {
      id: 3,
      username: "cryptolover",
      email: "cryptolover@example.com",
      date: new Date(2025, 4, 23),
      balance: 800,
    },
  ];

  const pendingWithdrawals = [
    {
      id: 1,
      username: "trader2025",
      amount: 500,
      date: new Date(2025, 4, 23),
      method: "VISA",
    },
    {
      id: 2,
      username: "investor88",
      amount: 1200,
      date: new Date(2025, 4, 23),
      method: "BTC",
    },
  ];

  // Форматирование чисел для отображения с валютой
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
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

  // Функция одобрения вывода
  const handleApproveWithdrawal = (id: number) => {
    console.log("Одобрен вывод:", id);
    // В реальном приложении здесь был бы вызов API
  };

  // Функция отклонения вывода
  const handleRejectWithdrawal = (id: number) => {
    console.log("Отклонен вывод:", id);
    // В реальном приложении здесь был бы вызов API
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <AdminSidebar />
      <div className="flex-1 md:ml-0 p-4 md:p-8 overflow-y-auto pt-16 md:pt-8">
        <Switch>
          <Route path="/admin" exact>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-6"
            >
              {/* Заголовок страницы */}
              <div className="flex flex-col md:flex-row justify-between md:items-center">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {t('admin.dashboard')}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>

              {/* Компонент статистики */}
              <Statistics
                totalUsers={statsData?.totalUsers || 0}
                totalInvested={statsData?.totalInvested || 0}
                totalPaid={statsData?.totalPaid || 0}
                newUsers24h={statsData?.newUsers24h || 0}
                newDeposits24h={statsData?.newDeposits24h || 0}
                newWithdrawals24h={statsData?.newWithdrawals24h || 0}
              />

              {/* Вкладки с последними данными */}
              <Tabs defaultValue="users" className="space-y-4">
                <TabsList className="grid grid-cols-2 w-full max-w-md">
                  <TabsTrigger value="users" className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t('admin.newUsers')}
                  </TabsTrigger>
                  <TabsTrigger value="withdrawals" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    {t('admin.pendingWithdrawals')}
                  </TabsTrigger>
                </TabsList>

                {/* Вкладка с новыми пользователями */}
                <TabsContent value="users">
                  <Card>
                    <CardHeader className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
                      <div className="relative">
                        <CardTitle className="text-xl flex items-center">
                          <Users className="h-5 w-5 mr-2 text-indigo-500" />
                          {t('admin.newUsers')}
                        </CardTitle>
                        <CardDescription>
                          {t('admin.recentlyRegistered')}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border dark:border-gray-700 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                              <th className="py-3 px-4 text-left">{t('common.username')}</th>
                              <th className="py-3 px-4 text-left hidden md:table-cell">{t('common.email')}</th>
                              <th className="py-3 px-4 text-left hidden md:table-cell">{t('common.date')}</th>
                              <th className="py-3 px-4 text-right">{t('common.balance')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {recentUsers.map((user) => (
                              <tr 
                                key={user.id} 
                                className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} />
                                      <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{user.username}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 hidden md:table-cell">{user.email}</td>
                                <td className="py-3 px-4 hidden md:table-cell">{formatDate(user.date)}</td>
                                <td className="py-3 px-4 text-right font-medium">{formatCurrency(user.balance)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 text-right">
                        <Button 
                          variant="outline" 
                          className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                          onClick={() => navigate("/admin/users")}
                        >
                          {t('admin.allUsers')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                {/* Вкладка с заявками на вывод */}
                <TabsContent value="withdrawals">
                  <Card>
                    <CardHeader className="relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
                      <div className="relative">
                        <CardTitle className="text-xl flex items-center">
                          <Wallet className="h-5 w-5 mr-2 text-indigo-500" />
                          {t('admin.withdrawalRequests')}
                        </CardTitle>
                        <CardDescription>
                          {t('admin.pendingApproval')}
                        </CardDescription>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="rounded-md border dark:border-gray-700 overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                              <th className="py-3 px-4 text-left">{t('common.username')}</th>
                              <th className="py-3 px-4 text-right">{t('common.amount')}</th>
                              <th className="py-3 px-4 text-left hidden md:table-cell">{t('common.date')}</th>
                              <th className="py-3 px-4 text-left hidden md:table-cell">{t('withdraw.withdrawalMethod')}</th>
                              <th className="py-3 px-4 text-right">{t('common.actions')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pendingWithdrawals.map((withdrawal) => (
                              <tr 
                                key={withdrawal.id} 
                                className="border-b dark:border-gray-700 last:border-0 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                              >
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <Avatar className="h-8 w-8">
                                      <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${withdrawal.username}`} />
                                      <AvatarFallback>{withdrawal.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                    <span className="font-medium">{withdrawal.username}</span>
                                  </div>
                                </td>
                                <td className="py-3 px-4 text-right font-medium">{formatCurrency(withdrawal.amount)}</td>
                                <td className="py-3 px-4 hidden md:table-cell">{formatDate(withdrawal.date)}</td>
                                <td className="py-3 px-4 hidden md:table-cell">
                                  <Badge variant="outline" className="bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                                    {withdrawal.method}
                                  </Badge>
                                </td>
                                <td className="py-3 px-4 text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button 
                                      size="sm" 
                                      className="bg-green-600 hover:bg-green-700 text-white"
                                      onClick={() => handleApproveWithdrawal(withdrawal.id)}
                                    >
                                      <CheckCircle className="h-4 w-4 mr-1" />
                                      {t('admin.approve')}
                                    </Button>
                                    <Button 
                                      size="sm"
                                      variant="destructive"
                                      onClick={() => handleRejectWithdrawal(withdrawal.id)}
                                    >
                                      <XCircle className="h-4 w-4 mr-1" />
                                      {t('admin.reject')}
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="mt-4 text-right">
                        <Button 
                          variant="outline"
                          className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                          onClick={() => navigate("/admin/withdrawals")}
                        >
                          {t('admin.allRequests')}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>

              {/* Статистика тарифов */}
              <Card>
                <CardHeader className="relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10" />
                  <div className="relative">
                    <CardTitle className="text-xl flex items-center">
                      <PiggyBank className="h-5 w-5 mr-2 text-indigo-500" />
                      {t('admin.tariffs')}
                    </CardTitle>
                    <CardDescription>
                      {t('admin.activeTariffs')}
                    </CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Array.isArray(tariffs) && tariffs.map((plan: any) => (
                      <Card key={plan.id} className="overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
                        <CardHeader className="p-4 bg-gradient-to-r from-indigo-50 to-indigo-100 dark:from-indigo-950/40 dark:to-indigo-900/40">
                          <CardTitle className="text-lg">{plan.name}</CardTitle>
                          <CardDescription>{plan.nameEn}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{t('admin.minAmount')}</span>
                            <span className="font-medium">${plan.minDeposit}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{t('admin.profitability')}</span>
                            <span className="font-medium text-green-600 dark:text-green-400">{plan.dailyRate}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{t('admin.refBonus')}</span>
                            <span className="font-medium">{plan.referralBonus}%</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-500 dark:text-gray-400">{t('admin.isActive')}</span>
                            <Badge variant={plan.isActive ? "outline" : "destructive"} className={plan.isActive ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400" : ""}>
                              {plan.isActive ? t('common.yes') : t('common.no')}
                            </Badge>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  <div className="mt-4 text-right">
                    <Button 
                      variant="outline"
                      className="text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30"
                      onClick={() => navigate("/admin/tariffs")}
                    >
                      {t('admin.tariffSettings')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </Route>
          {/* Здесь можно добавить другие маршруты админ-панели */}
          <Route>
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">{t('common.inDevelopment')}</h2>
                <p className="text-gray-500 dark:text-gray-400">{t('common.pageNotImplemented')}</p>
                <Button 
                  className="mt-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                  onClick={() => navigate("/admin")}
                >
                  {t('common.back')}
                </Button>
              </div>
            </div>
          </Route>
        </Switch>
      </div>
    </div>
  );
}