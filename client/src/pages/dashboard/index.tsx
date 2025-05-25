import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { ArrowUpCircle, ArrowDownCircle, Clock, Check, X, Loader2 } from 'lucide-react';

export default function DashboardIndex() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [depositDialogOpen, setDepositDialogOpen] = useState(false);
  const [withdrawDialogOpen, setWithdrawDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');

  // Fetch user data
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ['/api/users/current'],
  });

  // Fetch active deposits
  const { data: activeDeposits, isLoading: isDepositsLoading } = useQuery({
    queryKey: ['/api/deposits/active'],
  });

  // Fetch recent transactions
  const { data: recentTransactions, isLoading: isTransactionsLoading } = useQuery({
    queryKey: ['/api/transactions/recent'],
  });

  // Create deposit mutation
  const createDepositMutation = useMutation({
    mutationFn: async (amount: number) => {
      return await apiRequest('POST', '/api/deposits', { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/deposits/active'] });
      setDepositDialogOpen(false);
      setDepositAmount('');
      toast({
        title: t('common.success'),
        description: 'Deposit created successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || 'Failed to create deposit',
        variant: 'destructive',
      });
    },
  });

  // Create withdrawal mutation
  const createWithdrawalMutation = useMutation({
    mutationFn: async (amount: number) => {
      return await apiRequest('POST', '/api/transactions/withdraw', { amount });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions/recent'] });
      setWithdrawDialogOpen(false);
      setWithdrawAmount('');
      toast({
        title: t('common.success'),
        description: 'Withdrawal request submitted successfully!',
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || 'Failed to create withdrawal request',
        variant: 'destructive',
      });
    },
  });

  const handleDeposit = () => {
    const amount = parseFloat(depositAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: t('common.error'),
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }
    createDepositMutation.mutate(amount);
  };

  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: t('common.error'),
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }
    if (amount > (userData?.balance || 0)) {
      toast({
        title: t('common.error'),
        description: 'Insufficient balance',
        variant: 'destructive',
      });
      return;
    }
    createWithdrawalMutation.mutate(amount);
  };

  if (isUserLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">{t('common.loading')}</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">{t('dashboard.overview')}</h1>
      
      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('dashboard.balance')}</p>
            <p className="text-3xl font-bold">{formatCurrency(userData?.balance || 0)}</p>
            <div className="flex space-x-3 mt-4">
              <Dialog open={depositDialogOpen} onOpenChange={setDepositDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="flex-1">{t('dashboard.deposit')}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('dashboard.depositTitle')}</DialogTitle>
                    <DialogDescription>
                      Enter the amount you want to deposit
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="deposit-amount">{t('common.amount')}</Label>
                      <Input
                        id="deposit-amount"
                        type="number"
                        min="100"
                        placeholder="100"
                        value={depositAmount}
                        onChange={(e) => setDepositAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setDepositDialogOpen(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      onClick={handleDeposit}
                      disabled={createDepositMutation.isPending}
                    >
                      {createDepositMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.loading')}
                        </>
                      ) : (
                        t('dashboard.deposit')
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              
              <Dialog open={withdrawDialogOpen} onOpenChange={setWithdrawDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="flex-1">{t('dashboard.withdraw')}</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t('dashboard.withdrawTitle')}</DialogTitle>
                    <DialogDescription>
                      Enter the amount you want to withdraw
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="withdraw-amount">{t('common.amount')}</Label>
                      <Input
                        id="withdraw-amount"
                        type="number"
                        min="10"
                        max={userData?.balance}
                        placeholder="10"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setWithdrawDialogOpen(false)}
                    >
                      {t('common.cancel')}
                    </Button>
                    <Button 
                      onClick={handleWithdraw}
                      disabled={createWithdrawalMutation.isPending}
                    >
                      {createWithdrawalMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          {t('common.loading')}
                        </>
                      ) : (
                        t('dashboard.withdraw')
                      )}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('dashboard.activeDeposits')}</p>
            <p className="text-3xl font-bold">
              {formatCurrency(activeDeposits?.reduce((acc: number, dep: any) => acc + dep.amount, 0) || 0)}
            </p>
            <div className="flex items-center mt-4">
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div 
                  className="bg-success h-2.5 rounded-full" 
                  style={{ width: `${activeDeposits?.length ? 65 : 0}%` }}
                ></div>
              </div>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {activeDeposits?.length || 0} {t('dashboard.activeDeposits').toLowerCase()}
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-1">{t('dashboard.totalProfit')}</p>
            <p className="text-3xl font-bold text-success">
              {formatCurrency(userData?.totalProfit || 0)}
            </p>
            <div className="flex items-center mt-4">
              <p className="text-sm text-success flex items-center">
                <ArrowUpCircle className="h-4 w-4 mr-1" />
                {activeDeposits?.reduce((acc: number, dep: any) => acc + dep.dailyProfit, 0) || 0} {t('dashboard.perDay')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Active Deposits */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8">
        <CardContent className="p-6">
          <CardTitle className="text-xl font-bold mb-4">{t('dashboard.activeDeposits')}</CardTitle>
          {isDepositsLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : activeDeposits?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('tariffs.title')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.amount')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.date')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('calculator.dailyProfit')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.status')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {activeDeposits.map((deposit: any) => (
                    <tr key={deposit.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{deposit.tariff.name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{deposit.tariff.dailyRate}% / 24ч</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium">{formatCurrency(deposit.amount)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(deposit.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-success">{formatCurrency(deposit.dailyProfit)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(deposit.status)}`}>
                          {t(`common.${deposit.status}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>{t('dashboard.noActiveDeposits')}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Transaction History */}
      <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-8">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-4">
            <CardTitle className="text-xl font-bold">{t('dashboard.history')}</CardTitle>
            <Button variant="link" asChild>
              <a href="/dashboard/transactions">{t('dashboard.viewAll')}</a>
            </Button>
          </div>
          
          {isTransactionsLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : recentTransactions?.length ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.date')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.type')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.amount')}</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('common.status')}</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {recentTransactions.map((transaction: any) => (
                    <tr key={transaction.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {formatDate(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-2 ${
                            transaction.type === 'deposit' || transaction.type === 'profit' || transaction.type === 'referral_bonus'
                              ? 'bg-success'
                              : 'bg-primary'
                          }`}>
                            {transaction.type === 'deposit' || transaction.type === 'profit' || transaction.type === 'referral_bonus' ? (
                              <ArrowUpCircle className="h-5 w-5" />
                            ) : (
                              <ArrowDownCircle className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <div className="font-medium">
                              {transaction.type === 'deposit' && t('dashboard.deposit')}
                              {transaction.type === 'withdraw' && t('dashboard.withdraw')}
                              {transaction.type === 'profit' && 'Прибыль'}
                              {transaction.type === 'referral_bonus' && 'Реферальный бонус'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {transaction.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(transaction.status)}`}>
                          {transaction.status === 'pending' && (
                            <Clock className="h-3.5 w-3.5 mr-1" />
                          )}
                          {transaction.status === 'completed' && (
                            <Check className="h-3.5 w-3.5 mr-1" />
                          )}
                          {transaction.status === 'rejected' && (
                            <X className="h-3.5 w-3.5 mr-1" />
                          )}
                          {t(`common.${transaction.status}`)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <p>{t('dashboard.noTransactions')}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
