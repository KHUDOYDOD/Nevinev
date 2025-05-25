import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  AlertCircle,
  Clock,
  Check, 
  Layers, 
  LineChart,
  TrendingUp 
} from "lucide-react";

// Интерфейсы для данных
interface Deposit {
  id: number;
  tariffId: number;
  tariffName: string;
  amount: number;
  dailyProfit: number;
  status: string;
  createdAt: string;
  isActive: boolean;
}

interface UserDepositsProps {
  deposits: Deposit[];
  onCreateDeposit: () => void;
}

export default function UserDeposits({ deposits = [], onCreateDeposit }: UserDepositsProps) {
  const { t } = useTranslation();
  const [activeDeposit, setActiveDeposit] = useState<number | null>(null);
  
  // Сортируем депозиты по дате (новые первыми)
  const sortedDeposits = [...deposits].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Всего вложений
  const totalInvested = deposits.reduce((sum, deposit) => sum + deposit.amount, 0);
  
  // Ежедневная прибыль
  const dailyProfit = deposits.reduce((sum, deposit) => 
    deposit.isActive ? sum + deposit.dailyProfit : sum, 0
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md border dark:border-gray-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-xl flex items-center">
                <Layers className="h-5 w-5 mr-2 text-indigo-500" /> 
                {t('dashboard.yourDeposits')}
              </CardTitle>
              <CardDescription>
                {t('dashboard.activeDepositsDesc')}
              </CardDescription>
            </div>
            <Button 
              onClick={onCreateDeposit}
              className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
            >
              {t('dashboard.createDeposit')}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <TrendingUp className="h-5 w-5 text-blue-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('dashboard.totalInvested')}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${totalInvested.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <LineChart className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('dashboard.dailyProfit')}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                ${dailyProfit.toLocaleString()}
              </div>
            </div>
            
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 p-4 rounded-lg shadow-sm">
              <div className="flex items-center mb-2">
                <Clock className="h-5 w-5 text-purple-500 mr-2" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t('dashboard.activeDeposits')}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white">
                {deposits.filter(d => d.isActive).length}
              </div>
            </div>
          </div>
          
          {deposits.length > 0 ? (
            <Table>
              <TableCaption>{t('dashboard.depositsList')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard.plan')}</TableHead>
                  <TableHead>{t('dashboard.amount')}</TableHead>
                  <TableHead>{t('dashboard.dailyProfit')}</TableHead>
                  <TableHead>{t('dashboard.date')}</TableHead>
                  <TableHead>{t('dashboard.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedDeposits.map((deposit) => (
                  <TableRow 
                    key={deposit.id} 
                    className={
                      activeDeposit === deposit.id 
                        ? "bg-blue-50 dark:bg-blue-900/20" 
                        : ""
                    }
                    onClick={() => setActiveDeposit(deposit.id === activeDeposit ? null : deposit.id)}
                  >
                    <TableCell className="font-medium">{deposit.tariffName}</TableCell>
                    <TableCell>${deposit.amount.toLocaleString()}</TableCell>
                    <TableCell className="text-green-600 dark:text-green-400">
                      +${deposit.dailyProfit.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(deposit.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {deposit.isActive ? (
                        <Badge className="bg-green-500">
                          <Check className="h-3 w-3 mr-1" />
                          {t('dashboard.active')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {t('dashboard.completed')}
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 border border-dashed rounded-lg">
              <div className="flex justify-center mb-2">
                <Layers className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dashboard.noDepositsYet')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                {t('dashboard.createFirstDeposit')}
              </p>
              <Button 
                onClick={onCreateDeposit}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                {t('dashboard.createDeposit')}
              </Button>
            </div>
          )}
        </CardContent>
        
        {deposits.length > 0 && (
          <CardFooter className="border-t px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4 mr-2" />
              <span>
                {t('dashboard.depositUpdatesDaily')}
              </span>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}