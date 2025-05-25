import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  HelpCircle
} from "lucide-react";

import UserBalanceCard from "./UserBalanceCard";
import UserDeposits from "./UserDeposits";
import UserTransactions from "./UserTransactions";
import UserReferrals from "./UserReferrals";
import UserSettings from "./UserSettings";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Анимации для вкладок
const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1 + 0.3,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

// Анимации для карточек
const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

// Анимации для заголовков
const headerVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

// Анимации для меню
const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

export default function UserDashboard() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("balance");
  const [isMobile, setIsMobile] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Проверка размера экрана
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Запросы к API для получения данных
  const { data: depositsData = [] } = useQuery({
    queryKey: ["/api/user/deposits"],
    enabled: !!user,
  });

  const { data: transactionsData = [] } = useQuery({
    queryKey: ["/api/user/transactions"],
    enabled: !!user,
  });

  const { data: referralsData = [] } = useQuery({
    queryKey: ["/api/user/referrals"],
    enabled: !!user,
  });

  // Элементы навигации
  const navItems = [
    {
      id: "balance",
      label: t('dashboard.balance'),
      icon: <Wallet className="w-5 h-5" />,
      badge: null
    },
    {
      id: "deposits",
      label: t('dashboard.deposits'),
      icon: <PiggyBank className="w-5 h-5" />,
      badge: depositsData?.length || null
    },
    {
      id: "transactions",
      label: t('dashboard.transactions'),
      icon: <History className="w-5 h-5" />,
      badge: transactionsData?.length > 5 ? 5 : transactionsData?.length || null
    },
    {
      id: "referrals",
      label: t('dashboard.referrals'),
      icon: <UserPlus className="w-5 h-5" />,
      badge: referralsData?.length || null
    },
    {
      id: "settings",
      label: t('dashboard.settings'),
      icon: <Settings className="w-5 h-5" />,
      badge: null
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

  // Панель быстрой навигации
  const QuickStats = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-4 gap-4"
    >
      <QuickStatCard
        title={t('stats.balance')}
        value={formatCurrency(user?.balance || 0)}
        icon={<Wallet className="h-5 w-5" />}
        color="indigo"
        onClick={() => setActiveTab("balance")}
      />
      <QuickStatCard
        title={t('stats.deposits')}
        value={depositsData?.length?.toString() || "0"}
        icon={<CreditCard className="h-5 w-5" />}
        color="green"
        onClick={() => setActiveTab("deposits")}
      />
      <QuickStatCard
        title={t('stats.profit')}
        value={formatCurrency(1250)}
        icon={<TrendingUp className="h-5 w-5" />}
        color="purple"
        onClick={() => setActiveTab("transactions")}
      />
      <QuickStatCard
        title={t('stats.referrals')}
        value={referralsData?.length?.toString() || "0"}
        icon={<UserPlus className="h-5 w-5" />}
        color="amber"
        onClick={() => setActiveTab("referrals")}
      />
    </motion.div>
  );

  // Компонент карточки быстрой статистики
  const QuickStatCard = ({ title, value, icon, color, onClick }: any) => {
    const colorClasses = {
      indigo: "from-indigo-500 to-blue-600 shadow-indigo-500/20",
      green: "from-green-500 to-emerald-600 shadow-green-500/20",
      purple: "from-purple-500 to-fuchsia-600 shadow-purple-500/20",
      amber: "from-amber-500 to-orange-600 shadow-amber-500/20"
    };

    return (
      <motion.div
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4 cursor-pointer group"
      >
        <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-bl-full z-0"
          style={{ background: `linear-gradient(to bottom right, var(--${color}-500), var(--${color}-600))` }}
        ></div>
        
        <div className="relative z-10 flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br ${colorClasses[color]} text-white shadow-lg`}>
              {icon}
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
          <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </div>
        </div>
      </motion.div>
    );
  };

  // Мобильное меню
  const MobileMenu = () => (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black z-40 lg:hidden"
          />
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-4 flex flex-col h-full">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  TRADEPO
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <ChevronRight className="h-5 w-5" />
                </Button>
              </div>

              <div className="mb-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-indigo-500/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'U'}`} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.username || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 p-3 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.balance')}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(user?.balance || 0)}</p>
                </div>
              </div>

              <div className="flex-1 space-y-1">
                <motion.div initial="hidden" animate="visible" className="space-y-1">
                  {navItems.map((item, i) => (
                    <motion.div
                      key={item.id}
                      custom={i}
                      variants={menuItemVariants}
                    >
                      <Button
                        variant={activeTab === item.id ? "default" : "ghost"}
                        className={cn(
                          "w-full justify-start text-left",
                          activeTab === item.id 
                            ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
                            : "hover:bg-gray-100 dark:hover:bg-gray-800"
                        )}
                        onClick={() => {
                          setActiveTab(item.id);
                          setIsMobileMenuOpen(false);
                        }}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.label}
                        {item.badge && (
                          <Badge variant="outline" className="ml-auto bg-white/20 text-white">
                            {item.badge}
                          </Badge>
                        )}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              <div className="mt-auto space-y-2">
                <Button variant="outline" className="w-full justify-start text-left">
                  <HelpCircle className="mr-2 h-4 w-4" />
                  {t('common.help')}
                </Button>
                <Button variant="outline" className="w-full justify-start text-left text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20" onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t('auth.logout')}
                </Button>
              </div>
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 lg:pt-6">
      <MobileMenu />
      
      <div className="container mx-auto px-4 py-6">
        {/* Мобильная шапка */}
        <div className="lg:hidden mb-6 flex items-center justify-between">
          <Button
            variant="outline"
            size="icon"
            className="bg-white dark:bg-gray-800 shadow-sm"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <ChevronRight className="h-5 w-5 rotate-180" />
          </Button>
          
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TRADEPO
          </h1>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" className="bg-white dark:bg-gray-800 shadow-sm relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            
            <Avatar className="h-9 w-9 border-2 border-indigo-500/20">
              <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'U'}`} />
              <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                {user?.username?.substring(0, 2).toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Боковое меню (только на десктопе) */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="hidden lg:block w-64 shrink-0"
          >
            <div className="sticky top-6 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4">
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="h-10 w-10 border-2 border-indigo-500/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'U'}`} />
                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                      {user?.username?.substring(0, 2).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user?.username || 'User'}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{user?.email || 'user@example.com'}</p>
                  </div>
                </div>
                
                <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 p-3 rounded-lg mb-4">
                  <p className="text-sm text-gray-600 dark:text-gray-300">{t('dashboard.balance')}</p>
                  <p className="text-xl font-bold text-gray-900 dark:text-white">{formatCurrency(user?.balance || 0)}</p>
                </div>
                
                <div className="space-y-1">
                  <motion.div initial="hidden" animate="visible" className="space-y-1">
                    {navItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        custom={i}
                        variants={menuItemVariants}
                      >
                        <Button
                          variant={activeTab === item.id ? "default" : "ghost"}
                          className={cn(
                            "w-full justify-start text-left relative overflow-hidden group",
                            activeTab === item.id 
                              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
                              : "hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}
                          onClick={() => setActiveTab(item.id)}
                        >
                          {activeTab !== item.id && (
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/5 group-hover:to-purple-400/5 transition-colors duration-300"></div>
                          )}
                          <span className="mr-2">{item.icon}</span>
                          {item.label}
                          {item.badge && (
                            <Badge variant="outline" className={cn(
                              "ml-auto",
                              activeTab === item.id 
                                ? "bg-white/20 text-white" 
                                : "bg-gray-100 dark:bg-gray-800"
                            )}>
                              {item.badge}
                            </Badge>
                          )}
                        </Button>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>
              </div>
              
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-4">
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start text-left">
                    <HelpCircle className="mr-2 h-4 w-4" />
                    {t('common.help')}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start text-left text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                    onClick={logout}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    {t('auth.logout')}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Основной контент */}
          <div className="flex-1">
            <motion.div
              variants={headerVariants}
              initial="hidden"
              animate="visible"
              className="mb-6"
            >
              <div className="hidden lg:flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                    {t('dashboard.personalAccount')}
                  </h1>
                  <p className="text-gray-500 dark:text-gray-400">
                    {new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Button variant="outline" size="icon" className="bg-white dark:bg-gray-800 shadow-sm relative">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      3
                    </span>
                  </Button>
                  
                  <Button variant="default" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <CreditCard className="mr-2 h-4 w-4" />
                    {t('deposit.title')}
                  </Button>
                </div>
              </div>
            </motion.div>
            
            {/* Быстрая статистика */}
            <div className="mb-8">
              <QuickStats />
            </div>
            
            {/* Мобильные вкладки */}
            <div className="lg:hidden mb-6">
              <TabsList className="w-full grid grid-cols-5 h-14 bg-white dark:bg-gray-800 shadow-md rounded-xl">
                {navItems.map((item) => (
                  <TabsTrigger
                    key={item.id}
                    value={item.id}
                    className="data-[state=active]:shadow-none data-[state=active]:bg-transparent relative overflow-hidden"
                    onClick={() => setActiveTab(item.id)}
                  >
                    <div className="flex flex-col items-center">
                      {item.icon}
                      <span className="text-xs mt-1">{item.label}</span>
                    </div>
                    {activeTab === item.id && (
                      <motion.div
                        layoutId="activeIndicator"
                        className="absolute bottom-0 h-0.5 w-10 bg-gradient-to-r from-indigo-600 to-purple-600"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            
            {/* Основной контент */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 p-6"
              >
                {getTabContent()}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}