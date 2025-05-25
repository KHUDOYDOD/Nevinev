import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { PlusCircle, TrendingUp, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

// Временные данные для депозитов
const mockDeposits = [
  {
    id: 1,
    amount: 1000,
    dailyProfit: 20,
    createdAt: new Date("2025-05-01"),
    status: "active",
    tariffName: "Стандарт",
    totalEarned: 240,
  },
  {
    id: 2,
    amount: 2500,
    dailyProfit: 62.5,
    createdAt: new Date("2025-05-15"),
    status: "active",
    tariffName: "Премиум",
    totalEarned: 625,
  },
  {
    id: 3,
    amount: 500,
    dailyProfit: 10,
    createdAt: new Date("2025-05-20"),
    status: "active",
    tariffName: "Старт",
    totalEarned: 50,
  }
];

interface UserDepositsProps {
  limit?: number;
}

export default function UserDeposits({ limit }: UserDepositsProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const deposits = mockDeposits;
  const displayDeposits = limit ? deposits.slice(0, limit) : deposits;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-8"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('dashboard.yourDeposits')}</h2>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
            <PlusCircle className="mr-2 h-4 w-4" />
            {t('dashboard.newDeposit')}
          </Button>
        </motion.div>
      </div>

      {deposits.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-10">
            <div className="rounded-full bg-blue-100 p-3 mb-4">
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium text-center mb-2">{t('dashboard.noDeposits')}</h3>
            <p className="text-gray-500 text-center mb-4">{t('dashboard.startInvesting')}</p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
              <PlusCircle className="mr-2 h-4 w-4" />
              {t('dashboard.createFirstDeposit')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {displayDeposits.map((deposit) => (
            <DepositCard key={deposit.id} deposit={deposit} />
          ))}
        </div>
      )}
      
      {limit && deposits.length > limit && (
        <div className="text-center mt-4">
          <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
            {t('dashboard.viewAllDeposits')}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

interface DepositCardProps {
  deposit: {
    id: number;
    amount: number;
    dailyProfit: number;
    createdAt: Date;
    status: string;
    tariffName: string;
    totalEarned: number;
  };
}

const DepositCard = ({ deposit }: DepositCardProps) => {
  const { t } = useTranslation();
  
  const formattedAmount = new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(deposit.amount);
  
  const formattedDailyProfit = new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(deposit.dailyProfit);
  
  const formattedTotalEarned = new Intl.NumberFormat('ru-RU', { 
    style: 'currency', 
    currency: 'USD',
    maximumFractionDigits: 2
  }).format(deposit.totalEarned);
  
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).format(deposit.createdAt);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const containerVariants = {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1, transition: { duration: 0.3 } },
    hover: { 
      scale: 1.02,
      boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
      transition: { duration: 0.2 }
    }
  };
  
  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      whileHover="hover"
    >
      <Card className="overflow-hidden border-0 shadow-md h-full">
        <div className="h-2 bg-gradient-to-r from-purple-600 to-blue-600"></div>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="text-xl">{deposit.tariffName}</CardTitle>
              <CardDescription>{formattedDate}</CardDescription>
            </div>
            <Badge className={getStatusColor(deposit.status)}>
              {deposit.status === 'active' ? t('dashboard.active') : deposit.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-500">
                <DollarSign className="h-4 w-4 mr-1" />
                <span>{t('dashboard.depositAmount')}:</span>
              </div>
              <span className="font-semibold text-gray-800 dark:text-gray-200">{formattedAmount}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-500">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>{t('dashboard.dailyProfit')}:</span>
              </div>
              <span className="font-semibold text-green-600 dark:text-green-400">{formattedDailyProfit}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-500">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{t('dashboard.totalEarned')}:</span>
              </div>
              <span className="font-semibold text-purple-600 dark:text-purple-400">{formattedTotalEarned}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-2">
          <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50 hover:border-purple-300">
            {t('dashboard.viewDetails')}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};