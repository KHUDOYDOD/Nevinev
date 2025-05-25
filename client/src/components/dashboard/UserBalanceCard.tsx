import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { ArrowUpRight, Wallet, TrendingUp, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserBalanceCard() {
  const { t } = useTranslation();
  const { user } = useAuth();

  const balanceValue = user?.balance || 0;
  const formattedBalance = new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(balanceValue);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8 w-full"
    >
      <div className="rounded-2xl overflow-hidden shadow-lg">
        <div className="bg-gradient-to-r from-purple-700 via-indigo-700 to-blue-700 p-6 relative">
          {/* Декоративные элементы */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mt-16 -mr-16"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-10 -mb-10"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-white text-lg font-medium mb-1">{t('dashboard.yourBalance')}</h2>
              <motion.div 
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
                className="flex items-center"
              >
                <span className="text-white text-3xl md:text-4xl font-bold">{formattedBalance}</span>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="ml-2 px-2 py-1 bg-green-500 bg-opacity-30 rounded-md text-green-300 text-sm flex items-center">
                    <TrendingUp className="w-3 h-3 mr-1" /> +12%
                  </span>
                </motion.div>
              </motion.div>
            </div>
            <div className="flex space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button className="bg-white/10 hover:bg-white/20 text-white border-0 flex items-center">
                  <Wallet className="mr-2 h-4 w-4" />
                  {t('dashboard.deposit')}
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 flex items-center">
                  <Banknote className="mr-2 h-4 w-4" />
                  {t('dashboard.withdraw')}
                </Button>
              </motion.div>
            </div>
          </div>
        </div>
        
        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 bg-white dark:bg-gray-900">
          <StatCard 
            title={t('dashboard.activeDeposits')} 
            value="3" 
            change="+2" 
            changePositive={true} 
            border={true}
          />
          <StatCard 
            title={t('dashboard.totalEarned')} 
            value="$1,240.50" 
            change="+$240.50" 
            changePositive={true} 
            border={true}
          />
          <StatCard 
            title={t('dashboard.referralEarnings')} 
            value="$320.00" 
            change="+$120.00" 
            changePositive={true} 
            border={false}
          />
        </div>
      </div>
    </motion.div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  changePositive: boolean;
  border: boolean;
}

const StatCard = ({ title, value, change, changePositive, border }: StatCardProps) => (
  <motion.div 
    whileHover={{ backgroundColor: 'rgba(249, 250, 251, 0.7)' }}
    className={`p-4 flex flex-col ${border ? 'border-r border-gray-200 dark:border-gray-700' : ''}`}
  >
    <span className="text-gray-500 dark:text-gray-400 text-sm">{title}</span>
    <span className="text-2xl font-bold mt-1 text-gray-800 dark:text-white">{value}</span>
    <div className="flex items-center mt-2">
      <span className={`text-sm ${changePositive ? 'text-green-500' : 'text-red-500'}`}>
        {change}
      </span>
      <ArrowUpRight className={`h-3 w-3 ml-1 ${changePositive ? 'text-green-500' : 'text-red-500'}`} />
    </div>
  </motion.div>
);