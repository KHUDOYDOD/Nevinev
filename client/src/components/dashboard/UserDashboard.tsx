import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { 
  LayoutDashboard, 
  PiggyBank, 
  BarChart4, 
  Users, 
  Settings,
  TrendingUp
} from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import UserBalanceCard from "./UserBalanceCard";
import UserDeposits from "./UserDeposits";
import UserTransactions from "./UserTransactions";
import UserReferrals from "./UserReferrals";
import UserSettings from "./UserSettings";

export default function UserDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Временные данные для демонстрации
  const demoDeposits = [
    {
      id: 1,
      tariffName: t('common.basic'),
      amount: 500,
      dailyProfit: 25,
      date: new Date(2025, 4, 15),
      status: "active" as const,
      duration: 30,
      daysLeft: 20
    },
    {
      id: 2,
      tariffName: t('common.premium'),
      amount: 1000,
      dailyProfit: 100,
      date: new Date(2025, 4, 20),
      status: "active" as const,
      duration: 30,
      daysLeft: 25
    }
  ];
  
  const demoTransactions = [
    {
      id: 1,
      type: "deposit" as const,
      amount: 500,
      status: "completed" as const,
      date: new Date(2025, 4, 15),
      description: "Депозит Базовый"
    },
    {
      id: 2,
      type: "profit" as const,
      amount: 25,
      status: "completed" as const,
      date: new Date(2025, 4, 16),
      description: "Начисление прибыли"
    },
    {
      id: 3,
      type: "deposit" as const,
      amount: 1000,
      status: "completed" as const,
      date: new Date(2025, 4, 20),
      description: "Депозит Премиум"
    },
    {
      id: 4,
      type: "profit" as const,
      amount: 125,
      status: "completed" as const,
      date: new Date(2025, 4, 21),
      description: "Начисление прибыли"
    },
    {
      id: 5,
      type: "withdraw" as const,
      amount: 100,
      status: "pending" as const,
      date: new Date(2025, 4, 22),
      description: "Вывод средств"
    }
  ];
  
  const demoReferrals = [
    {
      id: 1,
      username: 'trader2025',
      email: 'trader2025@example.com',
      joinDate: new Date(2025, 4, 10),
      isActive: true,
      earned: 25.50
    },
    {
      id: 2,
      username: 'investpro',
      email: 'investpro@example.com',
      joinDate: new Date(2025, 4, 12),
      isActive: true,
      earned: 37.20
    },
    {
      id: 3,
      username: 'cryptomaster',
      email: 'cryptomaster@example.com',
      joinDate: new Date(2025, 4, 18),
      isActive: false,
      earned: 0
    }
  ];
  
  // Обработчики для кнопок действий
  const handleDeposit = () => {
    console.log("Открытие модала депозита");
  };
  
  const handleWithdraw = () => {
    console.log("Открытие модала вывода");
  };
  
  const handleNewDeposit = () => {
    console.log("Создание нового депозита");
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              {t('dashboard.overview')}
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              {t('common.welcome')}, {user?.username}!
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <div className="relative">
              <div className="absolute inset-0 flex items-center px-4">
                <div className="w-full border-t dark:border-gray-700"></div>
              </div>
              <TabsList className="relative bg-transparent flex justify-start space-x-2 overflow-x-auto pb-2 scrollbar-hide">
                <TabsTrigger 
                  value="overview" 
                  className="flex items-center gap-2 rounded-md px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>{t('dashboard.overview')}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="deposits" 
                  className="flex items-center gap-2 rounded-md px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <PiggyBank className="h-4 w-4" />
                  <span>{t('dashboard.deposits')}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="transactions" 
                  className="flex items-center gap-2 rounded-md px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <BarChart4 className="h-4 w-4" />
                  <span>{t('dashboard.transactions')}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="referrals" 
                  className="flex items-center gap-2 rounded-md px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <Users className="h-4 w-4" />
                  <span>{t('dashboard.referrals')}</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="flex items-center gap-2 rounded-md px-3 py-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-indigo-600 data-[state=active]:to-purple-600 data-[state=active]:text-white"
                >
                  <Settings className="h-4 w-4" />
                  <span>{t('dashboard.settings')}</span>
                </TabsTrigger>
              </TabsList>
            </div>
          
            <TabsContent value="overview" className="space-y-6 mt-6">
              {/* Обзор баланса */}
              <UserBalanceCard
                balance={user?.balance || 0}
                totalProfit={250}
                totalInvested={1500}
                onDeposit={handleDeposit}
                onWithdraw={handleWithdraw}
              />
              
              {/* Активные депозиты */}
              <UserDeposits
                deposits={demoDeposits}
                onNewDeposit={handleNewDeposit}
              />
              
              {/* История транзакций */}
              <UserTransactions
                transactions={demoTransactions.slice(0, 3)}
                onViewAll={() => setActiveTab("transactions")}
              />
              
              {/* Статистика */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 rounded-lg p-6 shadow-sm border border-indigo-100 dark:border-indigo-900"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('dashboard.deposits')}</h3>
                    <div className="p-2 bg-indigo-100 dark:bg-indigo-900/50 rounded-md">
                      <PiggyBank className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-50">
                    {demoDeposits.length}
                  </p>
                  <div className="flex items-center text-green-600 dark:text-green-400 mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      +25% {t('admin.for24Hours')}
                    </span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 rounded-lg p-6 shadow-sm border border-green-100 dark:border-green-900"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('dashboard.earned')}</h3>
                    <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-md">
                      <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-50">
                    $250
                  </p>
                  <div className="flex items-center text-green-600 dark:text-green-400 mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      +12% {t('admin.for24Hours')}
                    </span>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/40 dark:to-fuchsia-950/40 rounded-lg p-6 shadow-sm border border-purple-100 dark:border-purple-900"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">{t('dashboard.referrals')}</h3>
                    <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-md">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>
                  <p className="text-3xl font-bold mt-2 text-gray-900 dark:text-gray-50">
                    {demoReferrals.length}
                  </p>
                  <div className="flex items-center text-green-600 dark:text-green-400 mt-1">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      +33% {t('admin.for24Hours')}
                    </span>
                  </div>
                </motion.div>
              </div>
            </TabsContent>
            
            <TabsContent value="deposits" className="space-y-6 mt-6">
              <UserDeposits
                deposits={demoDeposits}
                onNewDeposit={handleNewDeposit}
              />
            </TabsContent>
            
            <TabsContent value="transactions" className="space-y-6 mt-6">
              <UserTransactions
                transactions={demoTransactions}
              />
            </TabsContent>
            
            <TabsContent value="referrals" className="space-y-6 mt-6">
              <UserReferrals
                referralCode={user?.referralCode || "TRADEPO2025"}
                referrals={demoReferrals}
                totalEarned={62.70}
              />
            </TabsContent>
            
            <TabsContent value="settings" className="space-y-6 mt-6">
              <UserSettings />
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </div>
  );
}