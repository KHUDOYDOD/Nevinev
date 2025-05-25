import React, { useState, useEffect, lazy, Suspense } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { 
  Wallet, 
  TrendingUp, 
  UserPlus, 
  Settings, 
  History, 
  CreditCard, 
  PiggyBank,
  ChevronRight,
  Bell,
  LogOut,
  HelpCircle,
  Menu,
  X,
  DollarSign,
  RefreshCw
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Импортируем компоненты вкладок (если будут ошибки, это нормально, они будут созданы позже)
const UserBalanceCard = lazy(() => import("./UserBalanceCard"));
const UserDeposits = lazy(() => import("./UserDeposits"));
const UserTransactions = lazy(() => import("./UserTransactions"));
const UserReferrals = lazy(() => import("./UserReferrals"));
const UserSettings = lazy(() => import("./UserSettings"));

// Типы для анимаций
const animationConfig = {
  stiffness: 100,
  damping: 15,
  duration: 0.6,
};

// Анимации для вкладок
const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.6,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }),
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

// Анимации для карточек
const cardVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -8,
    scale: 1.02,
    boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
    transition: { type: "spring", stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.98, transition: { duration: 0.1 } }
};

// Анимации для значков и иконок
const iconVariants = {
  hidden: { scale: 0, rotate: -20 },
  visible: (i: number) => ({
    scale: 1,
    rotate: 0,
    transition: {
      delay: i * 0.05 + 0.3,
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  })
};

// Анимации для боковой панели
const sidebarVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      type: "spring",
      stiffness: 100,
      damping: 15,
      staggerChildren: 0.07,
      delayChildren: 0.2
    }
  }
};

// Анимации для мобильного меню
const mobileMenuVariants = {
  closed: { x: "-100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
  open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
};

const backgroundVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.5, transition: { duration: 0.3 } }
};

export default function UserDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("balance");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Пульсирующие анимации для счетчиков
  const pulseValue = useMotionValue(1);
  const pulse = useTransform(pulseValue, [0.98, 1], [0.98, 1]);
  const rotate = useMotionValue(0);

  // Эффект волны для фона
  const [wavePhase, setWavePhase] = useState(0);

  // Запросы к API для получения данных
  const { data: depositsData = [], isLoading: isDepositsLoading } = useQuery({
    queryKey: ["/api/user/deposits"],
    enabled: !!user,
  });

  const { data: transactionsData = [], isLoading: isTransactionsLoading } = useQuery({
    queryKey: ["/api/user/transactions"],
    enabled: !!user,
  });

  const { data: referralsData = [], isLoading: isReferralsLoading } = useQuery({
    queryKey: ["/api/user/referrals"],
    enabled: !!user,
  });

  // Проверяем, что мы на клиенте для отображения аватара и анимаций
  useEffect(() => {
    setIsClient(true);

    // Запускаем пульсирующую анимацию
    const pulseAnimation = () => {
      pulseValue.set(0.98);
      setTimeout(() => {
        pulseValue.set(1);
      }, 800);
    };

    // Отключаем все автоматические анимации и обновления
    // Единственная анимация - при первой загрузке компонента
    const rotateAnimation = () => {
      rotate.set(0);
      rotate.set(360, { duration: 1.5, ease: "easeInOut" });
    };
    
    // Запускаем только один раз
    rotateAnimation();
    
    // Пустые интервалы для очистки
    const waveAnimation = null;
    const pulseInterval = null;
    const rotateInterval = null;

    return () => {
      clearInterval(pulseInterval);
      clearInterval(waveAnimation);
      clearInterval(rotateInterval);
    };
  }, []);

  // Элементы навигации
  const navItems = [
    {
      id: "balance",
      label: "Баланс",
      icon: <Wallet className="w-5 h-5" />,
      badge: null,
      color: "from-blue-500 to-indigo-600"
    },
    {
      id: "deposits",
      label: "Депозиты",
      icon: <PiggyBank className="w-5 h-5" />,
      badge: depositsData?.length || null,
      color: "from-emerald-500 to-green-600"
    },
    {
      id: "transactions",
      label: "Транзакции",
      icon: <History className="w-5 h-5" />,
      badge: transactionsData?.length > 5 ? 5 : transactionsData?.length || null,
      color: "from-amber-500 to-orange-600"
    },
    {
      id: "referrals",
      label: "Рефералы",
      icon: <UserPlus className="w-5 h-5" />,
      badge: referralsData?.length || null,
      color: "from-purple-500 to-fuchsia-600"
    },
    {
      id: "settings",
      label: "Настройки",
      icon: <Settings className="w-5 h-5" />,
      badge: null,
      color: "from-gray-500 to-gray-600"
    }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Панель быстрой навигации с улучшенной анимацией
  const QuickStats = () => (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <QuickStatCard
        title={t('stats.balance')}
        value={formatCurrency(user?.balance || 0)}
        icon={<DollarSign className="h-5 w-5" />}
        index={0}
        color="from-blue-500 to-indigo-600"
        bgColor="bg-blue-50 dark:bg-blue-900/10"
        onClick={() => setActiveTab("balance")}
      />
      <QuickStatCard
        title={t('stats.deposits')}
        value={depositsData?.length?.toString() || "0"}
        icon={<PiggyBank className="h-5 w-5" />}
        index={1}
        color="from-emerald-500 to-green-600"
        bgColor="bg-green-50 dark:bg-green-900/10"
        onClick={() => setActiveTab("deposits")}
      />
      <QuickStatCard
        title={t('stats.profit')}
        value={formatCurrency(1250)}
        icon={<TrendingUp className="h-5 w-5" />}
        index={2}
        color="from-purple-500 to-fuchsia-600"
        bgColor="bg-purple-50 dark:bg-purple-900/10"
        onClick={() => setActiveTab("transactions")}
      />
      <QuickStatCard
        title={t('stats.referrals')}
        value={referralsData?.length?.toString() || "0"}
        icon={<UserPlus className="h-5 w-5" />}
        index={3}
        color="from-amber-500 to-orange-600"
        bgColor="bg-amber-50 dark:bg-amber-900/10"
        onClick={() => setActiveTab("referrals")}
      />
    </div>
  );

  // Улучшенный компонент карточки быстрой статистики
  const QuickStatCard = ({ title, value, icon, index, color, bgColor, onClick }: any) => {
    return (
      <motion.div
        custom={index}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        whileTap="tap"
        onClick={onClick}
        className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-5 cursor-pointer"
      >
        <div className={`absolute top-0 right-0 w-24 h-24 rounded-bl-full opacity-20 ${bgColor} z-0`}></div>
        <div className="absolute -right-2 -top-2 w-12 h-12 rounded-full opacity-20 bg-gradient-to-br blur-xl"></div>

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <motion.div
              custom={index}
              variants={iconVariants}
              initial="hidden"
              animate="visible"
              className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br ${color} text-white shadow-lg`}
            >
              {icon}
            </motion.div>
          </div>

          <motion.p 
            style={{ scale: pulse }}
            className="text-2xl font-bold text-gray-800 dark:text-white"
          >
            {value}
          </motion.p>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="mt-2 w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden"
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${70 + Math.random() * 30}%` }}
              transition={{ delay: 0.5 + index * 0.1, duration: 0.8, ease: "easeOut" }}
              className={`h-full bg-gradient-to-r ${color}`}
            />
          </motion.div>
        </div>
      </motion.div>
    );
  };

  // Мобильное меню с улучшенной анимацией
  const MobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            variants={backgroundVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
          <motion.div
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
            className="fixed top-0 left-0 h-full w-72 bg-white dark:bg-gray-900 shadow-2xl z-50 overflow-y-auto rounded-r-2xl"
          >
            <div className="p-5 flex flex-col h-full">
              <div className="flex items-center justify-between mb-8">
                <motion.h2 
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="text-xl font-bold"
                >
                  <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    TRADEPO
                  </span>
                </motion.h2>
                <motion.div
                  initial={{ opacity: 0, rotate: -90 }}
                  animate={{ opacity: 1, rotate: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mb-8"
              >
                <div className="flex items-center space-x-3 mb-5">
                  <Avatar className="h-12 w-12 border-2 border-indigo-500/20 ring-2 ring-indigo-100 dark:ring-indigo-900/30">
                    {isClient && (
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'U'}`} />
                    )}
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">{user?.username || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white relative overflow-hidden">
                  <div className="absolute inset-0 overflow-hidden">
                    <svg className="absolute bottom-0 opacity-10" width="100%" height="40" viewBox="0 0 100 20">
                      <motion.path
                        d="M0 10 Q25 0, 50 10 T100 10 V20 H0 Z"
                        fill="white"
                        animate={{ d: [
                          "M0 10 Q25 0, 50 10 T100 10 V20 H0 Z",
                          "M0 10 Q25 20, 50 10 T100 10 V20 H0 Z",
                          "M0 10 Q25 0, 50 10 T100 10 V20 H0 Z"
                        ]}}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                      />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <p className="text-white/80">{t('dashboard.balance')}</p>
                    <motion.p 
                      className="text-2xl font-bold mt-1"
                      style={{ scale: pulse }}
                    >
                      {formatCurrency(user?.balance || 0)}
                    </motion.p>
                    <div className="flex items-center mt-2 text-white/80 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+2.4% {t('common.today')}</span>
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="flex-1 space-y-1.5">
                <AnimatePresence>
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      custom={i}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: (i) => ({
                          opacity: 1,
                          x: 0,
                          transition: {
                            delay: 0.3 + i * 0.08,
                            duration: 0.4
                          }
                        })
                      }}
                      initial="hidden"
                      animate="visible"
                      exit={{ opacity: 0, x: -20 }}
                    >
                      <Button
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start text-left h-12 rounded-xl relative overflow-hidden",
                          activeTab === item.id 
                            ? `bg-gradient-to-r ${item.color} text-white` 
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge variant="outline" className={cn(
                            "ml-auto",
                            activeTab === item.id 
                              ? "bg-white/20 text-white" 
                              : ""
                          )}>
                            {item.badge}
                          </Badge>
                        )}
                        {activeTab === item.id && (
                          <motion.div
                            layoutId="mobileActiveTab"
                            className="absolute inset-0 -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="mt-8 space-y-3"
              >
                <Button variant="outline" className="w-full justify-start text-left rounded-xl h-12">
                  <HelpCircle className="mr-3 h-5 w-5 text-indigo-500" />
                  <span className="font-medium">{t('common.help')}</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start text-left rounded-xl h-12 text-red-500 border-red-100 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
                  onClick={logout}
                >
                  <LogOut className="mr-3 h-5 w-5" />
                  <span className="font-medium">{t('auth.logout')}</span>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  // Функция для получения контента по активной вкладке
  const getTabContent = () => {
    switch (activeTab) {
      case "balance":
        return <UserBalanceCard user={user} />;
      case "deposits":
        return <UserDeposits deposits={depositsData} />;
      case "transactions":
        return <UserTransactions transactions={transactionsData} />;
      case "referrals":
        return <UserReferrals referrals={referralsData} user={user} />;
      case "settings":
        return <UserSettings user={user} />;
      default:
        return <UserBalanceCard user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 lg:pt-6 pb-10">
      <MobileMenu />

      <div className="container mx-auto px-4 py-6">
        {/* Мобильная шапка с улучшенной анимацией */}
        <div className="lg:hidden mb-8 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Button
              variant="outline"
              size="icon"
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl h-12 w-12"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent"
          >
            TRADEPO
          </motion.h1>

          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="flex items-center space-x-3"
          >
            <Button 
              variant="outline" 
              size="icon" 
              className="bg-white dark:bg-gray-800 shadow-md rounded-xl h-10 w-10 relative"
            >
              <Bell className="h-5 w-5" />
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
              >
                3
              </motion.span>
            </Button>

            <Avatar className="h-10 w-10 border-2 border-indigo-500/20 ring-2 ring-indigo-100 dark:ring-indigo-900/30">
              {isClient && (
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'U'}`} />
              )}
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                {user?.username?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Боковое меню (только на десктопе) с продвинутой анимацией */}
          <motion.div
            variants={sidebarVariants}
            initial="hidden"
            animate="visible"
            className="hidden lg:block w-72 shrink-0"
          >
            <div className="sticky top-6 space-y-6">
              {/* Профиль пользователя */}
              <motion.div 
                variants={cardVariants}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5 overflow-hidden"
              >
                <div className="flex items-center space-x-4 mb-5">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                  >
                    <Avatar className="h-14 w-14 border-2 border-indigo-500/20 ring-2 ring-indigo-100 dark:ring-indigo-900/30">
                      {isClient && (
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'U'}`} />
                      )}
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                        {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                  </motion.div>
                  <div>
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                      className="font-semibold text-gray-900 dark:text-gray-100"
                    >
                      {user?.username || 'User'}
                    </motion.p>
                    <motion.p 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-sm text-gray-500 dark:text-gray-400"
                    >
                      {user?.email || 'user@example.com'}
                    </motion.p>
                  </div>
                </div>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="p-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white relative overflow-hidden mb-5"
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <svg className="absolute bottom-0 opacity-10" width="100%" height="40" viewBox="0 0 100 20">
                      <motion.path
                        d="M0 10 Q25 0, 50 10 T100 10 V20 H0 Z"
                        fill="white"
                        animate={{ d: [
                          "M0 10 Q25 0, 50 10 T100 10 V20 H0 Z",
                          "M0 10 Q25 20, 50 10 T100 10 V20 H0 Z",
                          "M0 10 Q25 0, 50 10 T100 10 V20 H0 Z"
                        ]}}
                        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
                      />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-center mb-1">
                      <p className="text-white/80 text-sm">{t('dashboard.balance')}</p>
                      <motion.div
                        style={{ rotate }}
                        className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center cursor-pointer"
                      >
                        <RefreshCw className="h-3 w-3 text-white" />
                      </motion.div>
                    </div>
                    <motion.p 
                      className="text-2xl font-bold"
                      style={{ scale: pulse }}
                    >
                      {formatCurrency(user?.balance || 0)}
                    </motion.p>
                    <div className="flex items-center mt-2 text-white/80 text-xs">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span>+2.4% {t('common.today')}</span>
                    </div>
                  </div>
                </motion.div>

                <div className="space-y-2">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      custom={i}
                      variants={{
                        hidden: { opacity: 0, x: -20 },
                        visible: (i) => ({
                          opacity: 1,
                          x: 0,
                          transition: {
                            delay: 0.6 + i * 0.1,
                            duration: 0.4
                          }
                        })
                      }}
                    >
                      <Button
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start text-left h-12 rounded-xl relative overflow-hidden",
                          activeTab === item.id 
                            ? `bg-gradient-to-r ${item.color} text-white` 
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        onClick={() => setActiveTab(item.id)}
                      >
                        <span className="mr-3">{item.icon}</span>
                        <span className="font-medium">{item.label}</span>
                        {item.badge && (
                          <Badge variant="outline" className={cn(
                            "ml-auto",
                            activeTab === item.id 
                              ? "bg-white/20 text-white" 
                              : ""
                          )}>
                            {item.badge}
                          </Badge>
                        )}
                        {activeTab === item.id && (
                          <motion.div
                            layoutId="desktopActiveTab"
                            className="absolute inset-0 -z-10"
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                          />
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Нижний блок с дополнительными функциями */}
              <motion.div
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-5"
              >
                <motion.div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start text-left rounded-xl h-12">
                    <HelpCircle className="mr-3 h-5 w-5 text-indigo-500" />
                    <span className="font-medium">{t('common.help')}</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left rounded-xl h-12 text-red-500 border-red-100 hover:bg-red-50 dark:border-red-900/30 dark:hover:bg-red-900/20"
                    onClick={logout}
                  >
                    <LogOut className="mr-3 h-5 w-5" />
                    <span className="font-medium">{t('auth.logout')}</span>
                  </Button>
                </motion.div>
              </motion.div>
            </div>
          </motion.div>

          {/* Основной контент с улучшенными анимациями */}
          <div className="flex-1">
            {/* Заголовок страницы */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-8 hidden lg:block"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center">
                    Личный кабинет
                    <motion.div
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="ml-3"
                    >
                      <span className="inline-block px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded-full">
                        БЕТА
                      </span>
                    </motion.div>
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="icon" className="bg-white dark:bg-gray-800 shadow-md rounded-xl h-11 w-11 relative">
                    <Bell className="h-5 w-5" />
                    <motion.span 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                    >
                      3
                    </motion.span>
                  </Button>

                  <Button 
                    variant="default" 
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 h-11 rounded-xl shadow-lg shadow-indigo-500/20"
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t('deposit.title')}
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Быстрая статистика */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-8"
            >
              <QuickStats />
            </motion.div>

            {/* Мобильные вкладки с анимацией */}
            <div className="lg:hidden mb-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Tabs defaultValue={activeTab}>
                  <TabsList className="w-full grid grid-cols-5 h-16 bg-white dark:bg-gray-800 shadow-xl rounded-2xl">
                    {navItems.map((item) => (
                      <TabsTrigger
                        key={item.id}
                        value={item.id}
                        className="data-[state=active]:shadow-none data-[state=active]:bg-transparent relative overflow-hidden rounded-xl"
                      onClick={() => setActiveTab(item.id)}
                    >
                      <div className="flex flex-col items-center">
                        {item.icon}
                        <span className="text-xs mt-1.5">{item.label}</span>
                      </div>
                      {activeTab === item.id && (
                        <motion.div
                          layoutId="mobileTabIndicator"
                          className="absolute bottom-0 h-1 w-12 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600"
                          transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        />
                      )}
                    </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </motion.div>
            </div>

            {/* Основной контент с анимированными переходами */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ 
                  duration: 0.5, 
                  type: "spring",
                  stiffness: 100,
                  damping: 15
                }}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 overflow-hidden"
              >
                <React.Suspense fallback={
                  <div className="flex items-center justify-center py-20">
                    <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                  </div>
                }>
                  {getTabContent()}
                </React.Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}