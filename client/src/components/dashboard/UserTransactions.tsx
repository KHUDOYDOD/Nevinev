import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  ArrowUp, 
  TrendingUp, 
  UserPlus, 
  Search, 
  ChevronLeft, 
  ChevronRight,
  Calendar,
  Download,
  Filter,
  Clock
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Анимации для карточек
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

interface UserTransactionsProps {
  transactions: any[];
}

export default function UserTransactions({ transactions = [] }: UserTransactionsProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [period, setPeriod] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const itemsPerPage = 10;

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Форматирование времени
  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('ru-RU', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Форматирование валюты
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Фильтрация транзакций
  const filteredTransactions = transactions.filter((transaction) => {
    // Фильтр по типу
    if (activeTab !== "all" && transaction.type !== activeTab) {
      return false;
    }

    // Фильтр по поиску
    if (search && !transaction.description?.toLowerCase().includes(search.toLowerCase())) {
      return false;
    }

    // Фильтр по периоду
    if (period !== "all") {
      const now = new Date();
      const transactionDate = new Date(transaction.createdAt);
      const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60 * 24));

      if (period === "today" && daysDiff > 0) return false;
      if (period === "week" && daysDiff > 7) return false;
      if (period === "month" && daysDiff > 30) return false;
    }

    return true;
  });

  // Сортировка транзакций
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    if (sortBy === "date-desc") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    if (sortBy === "date-asc") {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }
    if (sortBy === "amount-desc") {
      return b.amount - a.amount;
    }
    if (sortBy === "amount-asc") {
      return a.amount - b.amount;
    }
    return 0;
  });

  // Пагинация
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const paginatedTransactions = sortedTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Получение иконки для типа транзакции
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case "deposit":
        return <ArrowUp className="h-4 w-4" />;
      case "withdraw":
        return <ArrowUp className="h-4 w-4 transform rotate-180" />;
      case "profit":
        return <TrendingUp className="h-4 w-4" />;
      case "referral":
        return <UserPlus className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  // Получение цвета для типа транзакции
  const getTransactionColor = (type: string) => {
    switch (type) {
      case "deposit":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "withdraw":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      case "profit":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400";
      case "referral":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // Получение цвета для статуса транзакции
  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400";
      case "pending":
        return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400";
    }
  };

  // Получение имени типа транзакции
  const getTransactionTypeName = (type: string) => {
    switch (type) {
      case "deposit":
        return t('transaction.deposit');
      case "withdraw":
        return t('transaction.withdrawal');
      case "profit":
        return t('transaction.profit');
      case "referral":
        return t('transaction.referral');
      default:
        return type;
    }
  };

  // Получение имени статуса транзакции
  const getStatusName = (status: string) => {
    switch (status) {
      case "completed":
        return t('transaction.completed');
      case "pending":
        return t('transaction.pending');
      case "rejected":
        return t('transaction.rejected');
      default:
        return status;
    }
  };

  // Компонент для пустого состояния
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-12"
    >
      <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
        <Clock className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
        {t('transactions.noTransactionsYet')}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
        {t('transactions.noTransactionsDescription')}
      </p>
    </motion.div>
  );

  // Компонент для заголовка таблицы
  const TableHeader = () => (
    <div className="grid grid-cols-12 gap-4 border-b border-gray-200 dark:border-gray-700 pb-2 text-sm font-medium text-gray-500 dark:text-gray-400">
      <div className="col-span-3 md:col-span-2">{t('transactions.type')}</div>
      <div className="col-span-4 md:col-span-3">{t('transactions.date')}</div>
      <div className="col-span-3 md:col-span-2 text-right">{t('transactions.amount')}</div>
      <div className="hidden md:block md:col-span-3">{t('transactions.description')}</div>
      <div className="col-span-2 md:col-span-2 text-right">{t('transactions.status')}</div>
    </div>
  );

  // Компонент для строки таблицы
  const TransactionRow = ({ transaction, index }: { transaction: any; index: number }) => {
    const isPositive = transaction.type !== "withdraw";

    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        custom={index}
        className="grid grid-cols-12 gap-4 py-3 border-b border-gray-100 dark:border-gray-800 text-sm"
      >
        <div className="col-span-3 md:col-span-2 flex items-center">
          <Badge 
            variant="outline"
            className={cn("flex items-center gap-1 capitalize", getTransactionColor(transaction.type))}
          >
            {getTransactionIcon(transaction.type)}
            <span className="hidden md:inline">{getTransactionTypeName(transaction.type)}</span>
          </Badge>
        </div>
        
        <div className="col-span-4 md:col-span-3 flex flex-col justify-center">
          <span className="text-gray-900 dark:text-gray-100 font-medium">
            {formatDate(transaction.createdAt)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {formatTime(transaction.createdAt)}
          </span>
        </div>
        
        <div className="col-span-3 md:col-span-2 flex items-center justify-end">
          <span className={`font-semibold ${isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {isPositive ? '+' : '-'}{formatCurrency(transaction.amount)}
          </span>
        </div>
        
        <div className="hidden md:flex md:col-span-3 items-center">
          <span className="text-gray-700 dark:text-gray-300 truncate">
            {transaction.description || "-"}
          </span>
        </div>
        
        <div className="col-span-2 md:col-span-2 flex items-center justify-end">
          <Badge className={cn("capitalize", getStatusColor(transaction.status))}>
            {getStatusName(transaction.status)}
          </Badge>
        </div>
      </motion.div>
    );
  };

  // Компонент для пагинации
  const Pagination = () => (
    <div className="flex items-center justify-between">
      <div className="text-sm text-gray-500 dark:text-gray-400">
        {t('transactions.showing')} {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredTransactions.length)} {t('transactions.of')} {filteredTransactions.length}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold">{t('dashboard.transactions')}</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <Input
              placeholder={t('transactions.search')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-full"
            />
          </div>
          <div className="flex gap-2">
            <Select value={period} onValueChange={setPeriod}>
              <SelectTrigger className="w-[130px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder={t('transactions.period')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('transactions.allTime')}</SelectItem>
                <SelectItem value="today">{t('transactions.today')}</SelectItem>
                <SelectItem value="week">{t('transactions.thisWeek')}</SelectItem>
                <SelectItem value="month">{t('transactions.thisMonth')}</SelectItem>
              </SelectContent>
            </Select>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <Filter className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>{t('transactions.sortBy')}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSortBy("date-desc")}>
                  {t('transactions.dateNewest')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("date-asc")}>
                  {t('transactions.dateOldest')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("amount-desc")}>
                  {t('transactions.amountHighest')}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("amount-asc")}>
                  {t('transactions.amountLowest')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{t('transactions.exportData')}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="all">
            {t('transactions.all')}
          </TabsTrigger>
          <TabsTrigger value="deposit">
            {t('transaction.deposits')}
          </TabsTrigger>
          <TabsTrigger value="withdraw">
            {t('transaction.withdrawals')}
          </TabsTrigger>
          <TabsTrigger value="profit">
            {t('transaction.profits')}
          </TabsTrigger>
          <TabsTrigger value="referral">
            {t('transaction.referrals')}
          </TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <Clock className="h-5 w-5 text-blue-500" />
              {t('transactions.history')}
            </CardTitle>
            <CardDescription>
              {t('transactions.historyDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            {paginatedTransactions.length > 0 ? (
              <div className="space-y-4">
                <TableHeader />
                <div className="space-y-1">
                  {paginatedTransactions.map((transaction, index) => (
                    <TransactionRow 
                      key={transaction.id} 
                      transaction={transaction} 
                      index={index} 
                    />
                  ))}
                </div>
              </div>
            ) : (
              <EmptyState />
            )}
          </CardContent>
          {paginatedTransactions.length > 0 && (
            <CardFooter className="border-t pt-4">
              <Pagination />
            </CardFooter>
          )}
        </Card>
      </Tabs>
    </div>
  );
}