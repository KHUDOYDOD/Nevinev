import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
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
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowDownRight, 
  ArrowUpRight, 
  Calendar, 
  Clock, 
  CreditCard, 
  DollarSign, 
  RefreshCw, 
  Search, 
  Users 
} from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

// Интерфейс для типа транзакции
interface Transaction {
  id: number;
  type: 'deposit' | 'withdraw' | 'profit' | 'referral';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  description?: string;
  createdAt: string;
}

interface UserTransactionsProps {
  transactions: Transaction[];
}

export default function UserTransactions({ transactions = [] }: UserTransactionsProps) {
  const { t } = useTranslation();
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Фильтрация транзакций
  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = searchTerm === '' || 
      transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.amount.toString().includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // Сортировка по дате (новые первыми)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Функция для отображения иконки типа транзакции
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="h-4 w-4 text-green-500" />;
      case 'withdraw':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'profit':
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'referral':
        return <Users className="h-4 w-4 text-purple-500" />;
      default:
        return <CreditCard className="h-4 w-4 text-gray-500" />;
    }
  };

  // Функция для отображения статуса транзакции
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            {t('dashboard.completed')}
          </Badge>
        );
      case 'pending':
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-600">
            <Clock className="h-3 w-3 mr-1" />
            {t('dashboard.pending')}
          </Badge>
        );
      case 'rejected':
        return (
          <Badge variant="destructive">
            {t('dashboard.rejected')}
          </Badge>
        );
      default:
        return (
          <Badge variant="outline">
            {status}
          </Badge>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <RefreshCw className="h-5 w-5 mr-2 text-blue-500" />
            {t('dashboard.recentTransactions')}
          </CardTitle>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t('dashboard.searchTransactions')}
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select
              value={filter}
              onValueChange={(value) => setFilter(value)}
            >
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder={t('dashboard.filterByType')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('dashboard.allTransactions')}</SelectItem>
                <SelectItem value="deposit">{t('dashboard.deposits')}</SelectItem>
                <SelectItem value="withdraw">{t('dashboard.withdrawals')}</SelectItem>
                <SelectItem value="profit">{t('dashboard.profits')}</SelectItem>
                <SelectItem value="referral">{t('dashboard.referrals')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        
        <CardContent>
          {sortedTransactions.length > 0 ? (
            <Table>
              <TableCaption>{t('dashboard.recentTransactionsDesc')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard.type')}</TableHead>
                  <TableHead>{t('dashboard.amount')}</TableHead>
                  <TableHead>{t('dashboard.date')}</TableHead>
                  <TableHead>{t('dashboard.status')}</TableHead>
                  <TableHead>{t('dashboard.description')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedTransactions.map((transaction) => (
                  <TableRow key={transaction.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        {getTransactionIcon(transaction.type)}
                        <span className="ml-2">{t(`dashboard.${transaction.type}`)}</span>
                      </div>
                    </TableCell>
                    <TableCell className={
                      transaction.type === 'withdraw' 
                        ? 'text-red-500 dark:text-red-400' 
                        : 'text-green-600 dark:text-green-400'
                    }>
                      {transaction.type === 'withdraw' ? '-' : '+'}
                      ${transaction.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5 mr-1" />
                        {new Date(transaction.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                      {transaction.description || '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 border border-dashed rounded-lg">
              <div className="flex justify-center mb-2">
                <RefreshCw className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dashboard.noTransactionsYet')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                {t('dashboard.transactionsWillAppearHere')}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}