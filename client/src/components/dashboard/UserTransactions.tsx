import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  ArrowUpCircle, 
  ArrowDownCircle, 
  TrendingUp, 
  RefreshCw,
  Clock,
  Check,
  X,
  Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Временные данные для транзакций
const mockTransactions = [
  {
    id: 1,
    type: "deposit",
    amount: 1000,
    status: "completed",
    description: "Пополнение счета",
    createdAt: new Date("2025-05-18T14:32:00"),
    completedAt: new Date("2025-05-18T14:35:00"),
  },
  {
    id: 2,
    type: "profit",
    amount: 25,
    status: "completed",
    description: "Ежедневная прибыль (Стандарт)",
    createdAt: new Date("2025-05-19T00:00:00"),
    completedAt: new Date("2025-05-19T00:00:00"),
  },
  {
    id: 3,
    type: "profit",
    amount: 25,
    status: "completed",
    description: "Ежедневная прибыль (Стандарт)",
    createdAt: new Date("2025-05-20T00:00:00"),
    completedAt: new Date("2025-05-20T00:00:00"),
  },
  {
    id: 4,
    type: "referral",
    amount: 100,
    status: "completed",
    description: "Реферальный бонус",
    createdAt: new Date("2025-05-21T15:42:00"),
    completedAt: new Date("2025-05-21T15:42:00"),
  },
  {
    id: 5,
    type: "withdraw",
    amount: 150,
    status: "pending",
    description: "Вывод средств",
    createdAt: new Date("2025-05-22T10:15:00"),
    completedAt: null,
  }
];

interface UserTransactionsProps {
  limit?: number;
}

export default function UserTransactions({ limit }: UserTransactionsProps) {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const transactions = mockTransactions;
  const displayTransactions = limit ? transactions.slice(0, limit) : transactions;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="mb-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t('dashboard.recentTransactions')}</h2>
        
        {!limit && (
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input 
                placeholder={t('dashboard.searchTransactions')} 
                className="pl-8 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>
            <Button variant="outline" className="border-gray-200 dark:border-gray-700">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t('dashboard.refresh')}
            </Button>
          </div>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 text-center">
          <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
            <RefreshCw className="h-8 w-8 text-gray-500 dark:text-gray-400" />
          </div>
          <h3 className="text-xl font-medium mb-2">{t('dashboard.noTransactions')}</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{t('dashboard.transactionsWillAppearHere')}</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-md">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900">
                  <TableHead>{t('dashboard.type')}</TableHead>
                  <TableHead>{t('dashboard.amount')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('dashboard.description')}</TableHead>
                  <TableHead className="hidden md:table-cell">{t('dashboard.date')}</TableHead>
                  <TableHead>{t('dashboard.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayTransactions.map((transaction) => (
                  <motion.tr 
                    key={transaction.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900 cursor-pointer"
                  >
                    <TableCell>
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.type)}
                        <span className="ml-2 font-medium hidden md:inline">
                          {getTransactionTypeName(transaction.type, t)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className={`font-medium ${getAmountColor(transaction.type)}`}>
                        {getAmountPrefix(transaction.type)}
                        {new Intl.NumberFormat('ru-RU', { 
                          style: 'currency', 
                          currency: 'USD',
                          maximumFractionDigits: 2
                        }).format(transaction.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-500 dark:text-gray-400">
                      {transaction.description}
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-gray-500 dark:text-gray-400">
                      {new Intl.DateTimeFormat('ru-RU', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      }).format(transaction.createdAt)}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={transaction.status} />
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
      
      {limit && transactions.length > limit && (
        <div className="text-center mt-4">
          <Button variant="outline" className="border-purple-200 text-purple-700 hover:bg-purple-50">
            {t('dashboard.viewAllTransactions')}
          </Button>
        </div>
      )}
    </motion.div>
  );
}

// Вспомогательные функции
function getTransactionIcon(type: string) {
  switch (type) {
    case 'deposit':
      return (
        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
          <ArrowDownCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
        </div>
      );
    case 'withdraw':
      return (
        <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
          <ArrowUpCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        </div>
      );
    case 'profit':
      return (
        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
          <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      );
    case 'referral':
      return (
        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center">
          <RefreshCw className="h-4 w-4 text-purple-600 dark:text-purple-400" />
        </div>
      );
    default:
      return (
        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
          <RefreshCw className="h-4 w-4 text-gray-600 dark:text-gray-400" />
        </div>
      );
  }
}

function getTransactionTypeName(type: string, t: any) {
  switch (type) {
    case 'deposit':
      return t('dashboard.deposit');
    case 'withdraw':
      return t('dashboard.withdraw');
    case 'profit':
      return t('dashboard.profit');
    case 'referral':
      return t('dashboard.referral');
    default:
      return type;
  }
}

function getAmountColor(type: string) {
  switch (type) {
    case 'deposit':
    case 'profit':
    case 'referral':
      return 'text-green-600 dark:text-green-400';
    case 'withdraw':
      return 'text-red-600 dark:text-red-400';
    default:
      return 'text-gray-900 dark:text-gray-100';
  }
}

function getAmountPrefix(type: string) {
  switch (type) {
    case 'deposit':
    case 'profit':
    case 'referral':
      return '+';
    case 'withdraw':
      return '-';
    default:
      return '';
  }
}

function StatusBadge({ status }: { status: string }) {
  let badgeClass = '';
  let icon = null;
  
  switch (status) {
    case 'completed':
      badgeClass = 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      icon = <Check className="w-3 h-3 mr-1" />;
      break;
    case 'pending':
      badgeClass = 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      icon = <Clock className="w-3 h-3 mr-1" />;
      break;
    case 'rejected':
      badgeClass = 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      icon = <X className="w-3 h-3 mr-1" />;
      break;
    default:
      badgeClass = 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  }
  
  return (
    <Badge className={`flex items-center ${badgeClass}`}>
      {icon}
      <span>{status}</span>
    </Badge>
  );
}