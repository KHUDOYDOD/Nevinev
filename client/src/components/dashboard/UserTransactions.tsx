import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
  ChevronDown,
  Calendar,
  RefreshCcw,
  FileDown,
  Check,
  X,
  CreditCard,
  Wallet,
  Clock,
  UserPlus
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Анимации
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Компонент для отображения транзакций
const UserTransactions = ({ transactions = [] }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [transactionType, setTransactionType] = useState("all");
  const [transactionStatus, setTransactionStatus] = useState("all");
  const [dateRange, setDateRange] = useState("all");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");

  // Пример транзакций, если не переданы
  const mockTransactions = useMemo(() => [
    {
      id: 1,
      type: "deposit",
      amount: 1000,
      status: "completed",
      description: "Пополнение баланса",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
    },
    {
      id: 2,
      type: "profit",
      amount: 50,
      status: "completed",
      description: "Ежедневная прибыль по тарифу Базовый",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString()
    },
    {
      id: 3,
      type: "withdraw",
      amount: 200,
      status: "pending",
      description: "Вывод средств",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString()
    },
    {
      id: 4,
      type: "referral",
      amount: 25,
      status: "completed",
      description: "Реферальное вознаграждение",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString()
    },
    {
      id: 5,
      type: "deposit",
      amount: 500,
      status: "completed",
      description: "Пополнение баланса",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString()
    },
    {
      id: 6,
      type: "withdraw",
      amount: 150,
      status: "rejected",
      description: "Вывод средств (недостаточно средств)",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      completedAt: new Date(Date.now() - 1000 * 60 * 25).toISOString()
    }
  ], []);

  // Используем переданные транзакции или мок-данные
  const allTransactions = transactions.length > 0 ? transactions : mockTransactions;

  // Фильтрация транзакций
  const filteredTransactions = useMemo(() => {
    let filtered = [...allTransactions];
    
    // Фильтр по поиску
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(t => 
        t.description?.toLowerCase().includes(searchLower) || 
        t.amount.toString().includes(searchLower)
      );
    }
    
    // Фильтр по типу
    if (transactionType !== "all") {
      filtered = filtered.filter(t => t.type === transactionType);
    }
    
    // Фильтр по статусу
    if (transactionStatus !== "all") {
      filtered = filtered.filter(t => t.status === transactionStatus);
    }
    
    // Фильтр по дате
    if (dateRange !== "all") {
      const now = new Date();
      let startDate;
      
      switch (dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
          break;
        case "week":
          startDate = new Date(now);
          startDate.setDate(now.getDate() - 7);
          break;
        case "month":
          startDate = new Date(now);
          startDate.setMonth(now.getMonth() - 1);
          break;
        default:
          startDate = new Date(0);
      }
      
      filtered = filtered.filter(t => new Date(t.createdAt) >= startDate);
    }
    
    // Сортировка
    filtered.sort((a, b) => {
      if (sortBy === "date") {
        return sortOrder === "desc" 
          ? new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === "amount") {
        return sortOrder === "desc" 
          ? b.amount - a.amount
          : a.amount - b.amount;
      }
      return 0;
    });
    
    return filtered;
  }, [allTransactions, search, transactionType, transactionStatus, dateRange, sortBy, sortOrder]);

  // Функция для форматирования даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Функция для форматирования валюты
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Функция для получения иконки по типу транзакции
  const getTransactionIcon = (type) => {
    switch (type) {
      case "deposit":
        return <ArrowDownRight className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case "withdraw":
        return <ArrowUpRight className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case "profit":
        return <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      case "referral":
        return <UserPlus className="h-4 w-4 text-purple-600 dark:text-purple-400" />;
      default:
        return <Wallet className="h-4 w-4 text-gray-600 dark:text-gray-400" />;
    }
  };

  // Функция для получения названия типа транзакции
  const getTransactionTypeName = (type) => {
    switch (type) {
      case "deposit":
        return t('transaction.deposit');
      case "withdraw":
        return t('transaction.withdraw');
      case "profit":
        return t('transaction.profit');
      case "referral":
        return t('transaction.referral');
      default:
        return type;
    }
  };

  // Функция для получения цвета и класса статуса
  const getStatusBadge = (status) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">
            <Check className="h-3 w-3 mr-1" />
            {t('transaction.completed')}
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400 hover:bg-amber-100">
            <Clock className="h-3 w-3 mr-1" />
            {t('transaction.pending')}
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 hover:bg-red-100">
            <X className="h-3 w-3 mr-1" />
            {t('transaction.rejected')}
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

  // Обработчик смены сортировки
  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
  };

  // Компонент для пустого состояния
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-10"
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <Clock className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {t('transaction.noTransactions')}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        {t('transaction.noTransactionsDesc')}
      </p>
      <Button variant="outline" onClick={() => {
        setSearch("");
        setTransactionType("all");
        setTransactionStatus("all");
        setDateRange("all");
      }}>
        <RefreshCcw className="h-4 w-4 mr-2" />
        {t('transaction.resetFilters')}
      </Button>
    </motion.div>
  );

  return (
    <div>
      <motion.h2 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold text-gray-900 dark:text-white mb-6"
      >
        {t('dashboard.transactions')}
      </motion.h2>
      
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-6 flex flex-col md:flex-row gap-3 items-end"
      >
        <div className="relative w-full md:w-1/3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder={t('transaction.search')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex flex-1 gap-3 w-full">
          <Select value={transactionType} onValueChange={setTransactionType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder={t('transaction.type')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('transaction.allTypes')}</SelectItem>
              <SelectItem value="deposit">{t('transaction.deposit')}</SelectItem>
              <SelectItem value="withdraw">{t('transaction.withdraw')}</SelectItem>
              <SelectItem value="profit">{t('transaction.profit')}</SelectItem>
              <SelectItem value="referral">{t('transaction.referral')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            className="ml-auto md:ml-0"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {t('transaction.filters')}
            <ChevronDown className={cn("h-4 w-4 ml-1 transition-transform", isFiltersOpen && "rotate-180")} />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="px-3">
                {sortOrder === "desc" ? 
                  <ArrowDownRight className="h-4 w-4" /> : 
                  <ArrowUpRight className="h-4 w-4" />
                }
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSort("date")}>
                <Calendar className="h-4 w-4 mr-2" />
                {t('transaction.sortDate')}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("amount")}>
                <Wallet className="h-4 w-4 mr-2" />
                {t('transaction.sortAmount')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" className="px-3">
            <FileDown className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {isFiltersOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-6 overflow-hidden"
          >
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium mb-3 text-sm">{t('transaction.status')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="status-all"
                      checked={transactionStatus === "all"}
                      onCheckedChange={() => setTransactionStatus("all")}
                      className="mr-2"
                    />
                    <label htmlFor="status-all" className="text-sm cursor-pointer">
                      {t('transaction.allStatuses')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="status-completed"
                      checked={transactionStatus === "completed"}
                      onCheckedChange={() => setTransactionStatus("completed")}
                      className="mr-2"
                    />
                    <label htmlFor="status-completed" className="text-sm cursor-pointer">
                      {t('transaction.completed')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="status-pending"
                      checked={transactionStatus === "pending"}
                      onCheckedChange={() => setTransactionStatus("pending")}
                      className="mr-2"
                    />
                    <label htmlFor="status-pending" className="text-sm cursor-pointer">
                      {t('transaction.pending')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="status-rejected"
                      checked={transactionStatus === "rejected"}
                      onCheckedChange={() => setTransactionStatus("rejected")}
                      className="mr-2"
                    />
                    <label htmlFor="status-rejected" className="text-sm cursor-pointer">
                      {t('transaction.rejected')}
                    </label>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium mb-3 text-sm">{t('transaction.dateRange')}</h3>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <Checkbox 
                      id="date-all"
                      checked={dateRange === "all"}
                      onCheckedChange={() => setDateRange("all")}
                      className="mr-2"
                    />
                    <label htmlFor="date-all" className="text-sm cursor-pointer">
                      {t('transaction.allTime')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="date-today"
                      checked={dateRange === "today"}
                      onCheckedChange={() => setDateRange("today")}
                      className="mr-2"
                    />
                    <label htmlFor="date-today" className="text-sm cursor-pointer">
                      {t('transaction.today')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="date-week"
                      checked={dateRange === "week"}
                      onCheckedChange={() => setDateRange("week")}
                      className="mr-2"
                    />
                    <label htmlFor="date-week" className="text-sm cursor-pointer">
                      {t('transaction.lastWeek')}
                    </label>
                  </div>
                  <div className="flex items-center">
                    <Checkbox 
                      id="date-month"
                      checked={dateRange === "month"}
                      onCheckedChange={() => setDateRange("month")}
                      className="mr-2"
                    />
                    <label htmlFor="date-month" className="text-sm cursor-pointer">
                      {t('transaction.lastMonth')}
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setTransactionType("all");
                    setTransactionStatus("all");
                    setDateRange("all");
                    setSearch("");
                  }}
                  className="w-full md:w-auto"
                >
                  <RefreshCcw className="h-4 w-4 mr-2" />
                  {t('transaction.resetFilters')}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {filteredTransactions.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
        >
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <TableHead className="w-[100px]">{t('transaction.type')}</TableHead>
                  <TableHead>{t('transaction.description')}</TableHead>
                  <TableHead>{t('transaction.date')}</TableHead>
                  <TableHead>{t('transaction.amount')}</TableHead>
                  <TableHead className="text-right">{t('transaction.status')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction.id || index}
                    variants={itemVariants}
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                  >
                    <TableCell className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                          {getTransactionIcon(transaction.type)}
                        </div>
                        <span className="text-sm font-medium hidden md:inline">
                          {getTransactionTypeName(transaction.type)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction.description || getTransactionTypeName(transaction.type)}
                    </TableCell>
                    <TableCell className="text-gray-500 text-sm">
                      {formatDate(transaction.createdAt)}
                    </TableCell>
                    <TableCell className={cn(
                      "font-medium",
                      transaction.type === "deposit" || transaction.type === "profit" || transaction.type === "referral"
                        ? "text-green-600 dark:text-green-400"
                        : "text-red-600 dark:text-red-400"
                    )}>
                      {transaction.type === "deposit" || transaction.type === "profit" || transaction.type === "referral"
                        ? `+${formatCurrency(transaction.amount)}`
                        : `-${formatCurrency(transaction.amount)}`
                      }
                    </TableCell>
                    <TableCell className="text-right">
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-800/50">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t('transaction.showing')} <span className="font-medium">{filteredTransactions.length}</span> {t('transaction.of')} <span className="font-medium">{allTransactions.length}</span> {t('transaction.transactions')}
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>
                {t('transaction.previous')}
              </Button>
              <Button variant="outline" size="sm" disabled>
                {t('transaction.next')}
              </Button>
            </div>
          </div>
        </motion.div>
      ) : (
        <EmptyState />
      )}
    </div>
  );
};

export default UserTransactions;