import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  ArrowDown, 
  ArrowUp, 
  Clock, 
  CreditCard, 
  DollarSign, 
  MoreHorizontal, 
  Search, 
  TrendingUp, 
  Users 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Transaction {
  id: number;
  type: "deposit" | "withdraw" | "profit" | "referral";
  amount: number;
  status: "pending" | "completed" | "rejected";
  date: Date;
  description?: string;
}

interface UserTransactionsProps {
  transactions: Transaction[];
  onViewAll?: () => void;
}

export default function UserTransactions({ 
  transactions = [], 
  onViewAll 
}: UserTransactionsProps) {
  const { t } = useTranslation();
  
  // Форматирование чисел для отображения с 2 знаками после запятой
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Функция для форматирования даты
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Получение типа транзакции на русском
  const getTypeText = (type: string) => {
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
  };
  
  // Получение иконки для типа транзакции
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDown className="h-4 w-4" />;
      case 'withdraw':
        return <ArrowUp className="h-4 w-4" />;
      case 'profit':
        return <TrendingUp className="h-4 w-4" />;
      case 'referral':
        return <Users className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };
  
  // Получение цвета для типа транзакции
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400';
      case 'withdraw':
        return 'text-orange-600 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-400';
      case 'profit':
        return 'text-green-600 bg-green-100 dark:bg-green-900/30 dark:text-green-400';
      case 'referral':
        return 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-400';
      default:
        return 'text-gray-600 bg-gray-100 dark:bg-gray-800 dark:text-gray-400';
    }
  };
  
  // Получение цвета для статуса транзакции
  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed':
        return "bg-green-500 hover:bg-green-600";
      case 'pending':
        return "bg-yellow-500 hover:bg-yellow-600";
      case 'rejected':
        return "bg-red-500 hover:bg-red-600";
      default:
        return "bg-gray-500 hover:bg-gray-600";
    }
  };
  
  // Получение значка для статуса транзакции
  const getStatusBadge = (status: string) => {
    let variant = 'default';
    
    switch (status) {
      case 'completed':
        variant = 'default';
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            {t('dashboard.completed')}
          </Badge>
        );
      case 'pending':
        variant = 'default';
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="mr-1 h-3 w-3" />
            {t('dashboard.pending')}
          </Badge>
        );
      case 'rejected':
        variant = 'destructive';
        return (
          <Badge variant={variant}>
            {t('dashboard.rejected')}
          </Badge>
        );
      default:
        return (
          <Badge variant={variant}>
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
      className="space-y-4"
    >
      <Card className="border dark:border-gray-700">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl">{t('dashboard.transactionHistory')}</CardTitle>
            <CardDescription>
              {t('dashboard.transactionsDesc')}
            </CardDescription>
          </div>
          
          <div className="flex items-center space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              className="border-gray-300 text-gray-600 dark:border-gray-600 dark:text-gray-400"
              onClick={onViewAll}
            >
              {t('dashboard.viewAll')}
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  type="search"
                  placeholder={t('dashboard.searchTransactions')}
                  className="pl-8 bg-white dark:bg-gray-800"
                />
              </div>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="shrink-0 border-gray-300 dark:border-gray-600">
                    <span>{t('dashboard.filter')}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem className="flex items-center">
                    <ArrowDown className="mr-2 h-4 w-4" />
                    {t('dashboard.deposit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <ArrowUp className="mr-2 h-4 w-4" />
                    {t('dashboard.withdraw')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    {t('dashboard.profit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex items-center">
                    <Users className="mr-2 h-4 w-4" />
                    {t('dashboard.referral')}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {t('dashboard.pending')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            
            {transactions.length === 0 ? (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <CreditCard className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                </div>
                <h3 className="text-lg font-medium mb-2">{t('dashboard.noTransactions')}</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {t('dashboard.noTransactionsDesc')}
                </p>
              </div>
            ) : (
              <div className="rounded-md border dark:border-gray-700">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50 dark:bg-gray-800">
                      <TableHead className="w-[100px]">{t('dashboard.type')}</TableHead>
                      <TableHead>{t('dashboard.amount')}</TableHead>
                      <TableHead className="hidden md:table-cell">{t('dashboard.date')}</TableHead>
                      <TableHead className="hidden sm:table-cell">{t('dashboard.status')}</TableHead>
                      <TableHead className="text-right w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {/* Демонстрационные данные для отображения */}
                    {[
                      {
                        id: 1,
                        type: 'profit' as const,
                        amount: 15.25,
                        status: 'completed' as const,
                        date: new Date(2025, 4, 24, 10, 30),
                        description: 'Ежедневная прибыль'
                      },
                      {
                        id: 2,
                        type: 'deposit' as const,
                        amount: 1000,
                        status: 'completed' as const,
                        date: new Date(2025, 4, 15, 14, 25),
                        description: 'Пополнение счета'
                      },
                      {
                        id: 3,
                        type: 'withdraw' as const,
                        amount: 500,
                        status: 'pending' as const,
                        date: new Date(2025, 4, 25, 9, 15),
                        description: 'Вывод средств'
                      },
                      {
                        id: 4,
                        type: 'referral' as const,
                        amount: 50,
                        status: 'completed' as const,
                        date: new Date(2025, 4, 20, 18, 45),
                        description: 'Реферальное вознаграждение'
                      },
                      {
                        id: 5,
                        type: 'withdraw' as const,
                        amount: 200,
                        status: 'rejected' as const,
                        date: new Date(2025, 4, 18, 16, 10),
                        description: 'Вывод средств'
                      }
                    ].map((transaction) => (
                      <TableRow key={transaction.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                        <TableCell>
                          <div className="flex items-center">
                            <span className={cn(
                              "flex items-center justify-center w-8 h-8 rounded-full mr-2",
                              getTypeColor(transaction.type)
                            )}>
                              {getTypeIcon(transaction.type)}
                            </span>
                            <span className="hidden sm:inline">
                              {getTypeText(transaction.type)}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className={cn(
                              "font-medium",
                              transaction.type === 'withdraw' ? "text-red-600 dark:text-red-400" : "text-green-600 dark:text-green-400"
                            )}>
                              {transaction.type === 'withdraw' ? '-' : '+'}{formatCurrency(transaction.amount)}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                              {transaction.description}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell text-gray-500 dark:text-gray-400">
                          {formatDate(transaction.date)}
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          {getStatusBadge(transaction.status)}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">Open menu</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>
                                {t('dashboard.viewDetails')}
                              </DropdownMenuItem>
                              {transaction.status === 'pending' && (
                                <>
                                  <DropdownMenuSeparator />
                                  <DropdownMenuItem className="text-red-600 dark:text-red-400">
                                    {t('dashboard.cancel')}
                                  </DropdownMenuItem>
                                </>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </CardContent>
        
        {transactions.length > 0 && (
          <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('dashboard.showing')} <span className="font-medium">5</span> {t('dashboard.of')} <span className="font-medium">24</span> {t('dashboard.transactions')}
            </p>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="border-gray-300 dark:border-gray-600"
                disabled={true}
              >
                {t('common.previous')}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-300 dark:border-gray-600"
              >
                {t('common.next')}
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}