import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { ArrowUpCircle, ArrowDownCircle, Clock, Check, X, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function TransactionsPage() {
  const { t } = useTranslation();
  const [filter, setFilter] = useState({
    type: 'all',
    status: 'all',
    search: '',
  });

  // Fetch all transactions
  const { data: transactions, isLoading } = useQuery({
    queryKey: ['/api/transactions'],
  });

  // Apply filters
  const filteredTransactions = transactions?.filter((transaction: any) => {
    // Filter by type
    if (filter.type !== 'all' && transaction.type !== filter.type) {
      return false;
    }

    // Filter by status
    if (filter.status !== 'all' && transaction.status !== filter.status) {
      return false;
    }

    // Filter by search (transaction ID)
    if (filter.search && !transaction.id.toString().includes(filter.search)) {
      return false;
    }

    return true;
  });

  const getTransactionIcon = (type: string) => {
    if (type === 'deposit' || type === 'profit' || type === 'referral_bonus') {
      return (
        <div className="w-8 h-8 rounded-full bg-success flex items-center justify-center text-white">
          <ArrowUpCircle className="h-5 w-5" />
        </div>
      );
    } else {
      return (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
          <ArrowDownCircle className="h-5 w-5" />
        </div>
      );
    }
  };

  const getTransactionTypeName = (type: string) => {
    switch (type) {
      case 'deposit':
        return t('dashboard.deposit');
      case 'withdraw':
        return t('dashboard.withdraw');
      case 'profit':
        return 'Прибыль';
      case 'referral_bonus':
        return 'Реферальный бонус';
      default:
        return type;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3.5 w-3.5 mr-1" />;
      case 'completed':
        return <Check className="h-3.5 w-3.5 mr-1" />;
      case 'rejected':
        return <X className="h-3.5 w-3.5 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">{t('dashboard.transactions')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.transactionHistory')}</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="mb-6">
            <TabsList className="grid grid-cols-4 w-full md:w-auto">
              <TabsTrigger value="all" onClick={() => setFilter({ ...filter, type: 'all' })}>
                {t('dashboard.all')}
              </TabsTrigger>
              <TabsTrigger value="deposit" onClick={() => setFilter({ ...filter, type: 'deposit' })}>
                {t('dashboard.deposits')}
              </TabsTrigger>
              <TabsTrigger value="withdraw" onClick={() => setFilter({ ...filter, type: 'withdraw' })}>
                {t('dashboard.withdrawals')}
              </TabsTrigger>
              <TabsTrigger value="profit" onClick={() => setFilter({ ...filter, type: 'profit' })}>
                {t('dashboard.profits')}
              </TabsTrigger>
            </TabsList>
            
            <div className="flex flex-col md:flex-row gap-4 mt-4">
              <div className="w-full md:w-1/3">
                <Label htmlFor="status-filter">{t('common.status')}</Label>
                <Select
                  value={filter.status}
                  onValueChange={(value) => setFilter({ ...filter, status: value })}
                >
                  <SelectTrigger id="status-filter">
                    <SelectValue placeholder={t('dashboard.allStatuses')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t('dashboard.allStatuses')}</SelectItem>
                    <SelectItem value="pending">{t('common.pending')}</SelectItem>
                    <SelectItem value="completed">{t('common.completed')}</SelectItem>
                    <SelectItem value="rejected">{t('common.rejected')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-full md:w-2/3">
                <Label htmlFor="search">{t('dashboard.searchById')}</Label>
                <Input
                  id="search"
                  placeholder={t('dashboard.enterTransactionId')}
                  value={filter.search}
                  onChange={(e) => setFilter({ ...filter, search: e.target.value })}
                />
              </div>
            </div>
            
            <TabsContent value="all" className="mt-6">
              {renderTransactionsTable(filteredTransactions, isLoading)}
            </TabsContent>
            <TabsContent value="deposit" className="mt-6">
              {renderTransactionsTable(filteredTransactions, isLoading)}
            </TabsContent>
            <TabsContent value="withdraw" className="mt-6">
              {renderTransactionsTable(filteredTransactions, isLoading)}
            </TabsContent>
            <TabsContent value="profit" className="mt-6">
              {renderTransactionsTable(filteredTransactions, isLoading)}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
  
  function renderTransactionsTable(transactions: any[], isLoading: boolean) {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      );
    }
    
    if (!transactions?.length) {
      return (
        <div className="text-center py-8 text-gray-500">
          <p>{t('dashboard.noTransactionsFound')}</p>
        </div>
      );
    }
    
    return (
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-medium">{t('common.id')}</th>
              <th className="text-left p-4 font-medium">{t('common.type')}</th>
              <th className="text-left p-4 font-medium">{t('common.amount')}</th>
              <th className="text-left p-4 font-medium">{t('common.date')}</th>
              <th className="text-left p-4 font-medium">{t('common.status')}</th>
              <th className="text-left p-4 font-medium">{t('common.description')}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction: any) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                <td className="p-4 font-medium">#{transaction.id}</td>
                <td className="p-4">
                  <div className="flex items-center">
                    {getTransactionIcon(transaction.type)}
                    <div className="ml-3">
                      <div className="font-medium">{getTransactionTypeName(transaction.type)}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">
                  <div className={`font-medium ${
                    transaction.type === 'deposit' || transaction.type === 'profit' || transaction.type === 'referral_bonus'
                      ? 'text-success'
                      : 'text-primary'
                  }`}>
                    {transaction.type === 'deposit' || transaction.type === 'profit' || transaction.type === 'referral_bonus'
                      ? '+'
                      : '-'
                    }{formatCurrency(transaction.amount)}
                  </div>
                </td>
                <td className="p-4 text-gray-500">
                  {formatDate(transaction.createdAt)}
                </td>
                <td className="p-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${getStatusColor(transaction.status)}`}>
                    {getStatusIcon(transaction.status)}
                    {t(`common.${transaction.status}`)}
                  </span>
                </td>
                <td className="p-4 text-gray-500">{transaction.description || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
}
