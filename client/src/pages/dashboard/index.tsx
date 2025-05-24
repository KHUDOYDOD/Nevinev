import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { UserDashboardLayout } from "@/components/layout/user-dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CurrencyFormatter } from "@/components/ui/currency-formatter";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  ArrowUp,
  ArrowDown,
  BarChart2,
  RefreshCw,
  Copy,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PlusCircle,
  MinusCircle,
} from "lucide-react";

import {
  Deposit,
  Transaction,
  User,
  Tariff
} from "@/lib/types";

const withdrawSchema = z.object({
  amount: z.string()
    .refine(val => !isNaN(parseFloat(val)), "Amount must be a valid number")
    .refine(val => parseFloat(val) > 0, "Amount must be greater than 0"),
});

const depositSchema = z.object({
  amount: z.string()
    .refine(val => !isNaN(parseFloat(val)), "Amount must be a valid number")
    .refine(val => parseFloat(val) > 0, "Amount must be greater than 0"),
});

export default function Dashboard() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();

  const { data: depositsData } = useQuery<{ deposits: Deposit[] }>({
    queryKey: ['/api/deposits'],
  });

  const { data: transactionsData } = useQuery<{ transactions: Transaction[] }>({
    queryKey: ['/api/transactions', { limit: 5 }],
  });

  useEffect(() => {
    // Refresh user data on component mount
    queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
  }, []);

  const withdrawForm = useForm<{ amount: string }>({
    resolver: zodResolver(withdrawSchema),
    defaultValues: {
      amount: "",
    },
  });

  const depositForm = useForm<{ amount: string }>({
    resolver: zodResolver(depositSchema),
    defaultValues: {
      amount: "",
    },
  });

  const handleWithdraw = async (values: { amount: string }) => {
    try {
      await apiRequest("POST", "/api/transactions/withdraw", {
        amount: values.amount,
      });

      toast({
        title: t('dashboard.withdraw_success'),
        description: `${t('dashboard.withdraw_amount')}: $${values.amount}`,
      });

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      
      // Reset form
      withdrawForm.reset();
    } catch (error) {
      console.error("Withdrawal error:", error);
      toast({
        title: t('dashboard.withdraw_error'),
        description: error instanceof Error ? error.message : t('dashboard.insufficient_balance'),
        variant: "destructive",
      });
    }
  };

  const handleDeposit = async (values: { amount: string }) => {
    try {
      await apiRequest("POST", "/api/transactions/deposit-balance", {
        amount: values.amount,
      });

      toast({
        title: t('dashboard.deposit_success'),
        description: `${t('dashboard.deposit_amount')}: $${values.amount}`,
      });

      // Refresh data
      queryClient.invalidateQueries({ queryKey: ['/api/auth/me'] });
      queryClient.invalidateQueries({ queryKey: ['/api/transactions'] });
      
      // Reset form
      depositForm.reset();
    } catch (error) {
      console.error("Deposit error:", error);
      toast({
        title: t('dashboard.deposit_error'),
        description: error instanceof Error ? error.message : t('dashboard.deposit_failed'),
        variant: "destructive",
      });
    }
  };

  const getActiveDepositsAmount = () => {
    if (!depositsData?.deposits) return 0;
    
    return depositsData.deposits
      .filter(deposit => deposit.isActive)
      .reduce((sum, deposit) => sum + parseFloat(deposit.amount.toString()), 0);
  };

  const getActiveDepositsCount = () => {
    if (!depositsData?.deposits) return 0;
    
    return depositsData.deposits.filter(deposit => deposit.isActive).length;
  };

  const getTotalProfit = () => {
    if (!transactionsData?.transactions) return 0;
    
    return transactionsData.transactions
      .filter(tx => tx.type === "profit" && tx.status === "completed")
      .reduce((sum, tx) => sum + parseFloat(tx.amount.toString()), 0);
  };

  return (
    <UserDashboardLayout>
      <Helmet>
        <title>{t('dashboard.overview')} | TRADEPO</title>
      </Helmet>
      
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">{t('dashboard.overview')}</h1>
        
        {/* Balance Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500 text-sm mb-1">{t('dashboard.balance')}</p>
              <p className="text-3xl font-bold">
                <CurrencyFormatter value={parseFloat(user?.balance?.toString() || "0")} />
              </p>
              <div className="flex space-x-3 mt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark flex-1">
                      <PlusCircle className="w-4 h-4 mr-2" />
                      {t('dashboard.deposit_btn')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('dashboard.deposit_btn')}</DialogTitle>
                    </DialogHeader>
                    <Form {...depositForm}>
                      <form onSubmit={depositForm.handleSubmit(handleDeposit)} className="space-y-4">
                        <FormField
                          control={depositForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.deposit_amount')}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                  <Input type="text" className="pl-7" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <DialogClose asChild>
                            <Button variant="outline">{t('cancel')}</Button>
                          </DialogClose>
                          <Button type="submit">{t('confirm')}</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
                
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="px-4 py-2 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white flex-1">
                      <MinusCircle className="w-4 h-4 mr-2" />
                      {t('dashboard.withdraw_btn')}
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{t('dashboard.withdraw_btn')}</DialogTitle>
                    </DialogHeader>
                    <Form {...withdrawForm}>
                      <form onSubmit={withdrawForm.handleSubmit(handleWithdraw)} className="space-y-4">
                        <FormField
                          control={withdrawForm.control}
                          name="amount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.withdrawal_amount')}</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                                  <Input type="text" className="pl-7" {...field} />
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="flex justify-end space-x-2">
                          <DialogClose asChild>
                            <Button variant="outline">{t('cancel')}</Button>
                          </DialogClose>
                          <Button type="submit">{t('confirm')}</Button>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500 text-sm mb-1">{t('dashboard.active_deposits')}</p>
              <p className="text-3xl font-bold">
                <CurrencyFormatter value={getActiveDepositsAmount()} />
              </p>
              <div className="flex items-center mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-success h-2.5 rounded-full" 
                    style={{ width: `${Math.min((getActiveDepositsAmount() / 1000) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                {getActiveDepositsCount()} {t('dashboard.active_deposits').toLowerCase()}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <p className="text-gray-500 text-sm mb-1">{t('dashboard.total_profit')}</p>
              <p className="text-3xl font-bold text-success">
                +<CurrencyFormatter value={getTotalProfit()} />
              </p>
              <div className="flex items-center mt-4">
                <p className="text-sm text-success flex items-center">
                  <ArrowUpRight className="mr-1 h-4 w-4" />
                  {depositsData?.deposits && depositsData.deposits.length > 0 ? (
                    t('dashboard.profit_from_deposits')
                  ) : (
                    t('dashboard.no_active_deposits')
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Active Deposits */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('dashboard.active_deposits')}</h2>
              <Link href="/dashboard/deposits">
                <Button variant="outline" size="sm">
                  <Wallet className="mr-2 h-4 w-4" />
                  {t('dashboard.view_all_deposits')}
                </Button>
              </Link>
            </div>
            
            {depositsData?.deposits && depositsData.deposits.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('dashboard.tariff')}</TableHead>
                      <TableHead>{t('dashboard.amount')}</TableHead>
                      <TableHead>{t('dashboard.created_date')}</TableHead>
                      <TableHead>{t('dashboard.daily_profit')}</TableHead>
                      <TableHead>{t('dashboard.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {depositsData.deposits
                      .filter(deposit => deposit.isActive)
                      .slice(0, 3)
                      .map((deposit) => (
                        <TableRow key={deposit.id}>
                          <TableCell className="font-medium">
                            {deposit.tariff ? t(`tariffs.${deposit.tariff.name.toLowerCase()}`) : `Tariff #${deposit.tariffId}`}
                          </TableCell>
                          <TableCell>
                            <CurrencyFormatter value={parseFloat(deposit.amount.toString())} />
                          </TableCell>
                          <TableCell>
                            {new Date(deposit.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-success">
                            +<CurrencyFormatter value={parseFloat(deposit.dailyProfit.toString())} />
                          </TableCell>
                          <TableCell>
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {t('dashboard.active_status')}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('dashboard.no_active_deposits')}</p>
                <Link href="/dashboard/deposits">
                  <Button className="mt-4">
                    {t('dashboard.create_deposit')}
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Transaction History */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{t('dashboard.transaction_history')}</h2>
              <Link href="/dashboard/transactions">
                <Button variant="outline" size="sm">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  {t('dashboard.view_all_transactions')}
                </Button>
              </Link>
            </div>
            
            {transactionsData?.transactions && transactionsData.transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t('dashboard.date')}</TableHead>
                      <TableHead>{t('dashboard.type')}</TableHead>
                      <TableHead>{t('dashboard.amount')}</TableHead>
                      <TableHead>{t('dashboard.status')}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactionsData.transactions.slice(0, 5).map((transaction) => (
                      <TableRow key={transaction.id}>
                        <TableCell>
                          {new Date(transaction.createdAt).toLocaleDateString()} {new Date(transaction.createdAt).toLocaleTimeString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white mr-2 ${
                              transaction.type === 'deposit' ? 'bg-primary' :
                              transaction.type === 'withdraw' ? 'bg-danger' :
                              transaction.type === 'profit' ? 'bg-success' :
                              'bg-secondary'
                            }`}>
                              {transaction.type === 'deposit' && <ArrowUp className="h-4 w-4" />}
                              {transaction.type === 'withdraw' && <ArrowDown className="h-4 w-4" />}
                              {transaction.type === 'profit' && <RefreshCw className="h-4 w-4" />}
                              {transaction.type === 'referral' && <Copy className="h-4 w-4" />}
                            </div>
                            <div>
                              <div className="font-medium">
                                {transaction.type === 'deposit' && t('dashboard.deposit_type')}
                                {transaction.type === 'withdraw' && t('dashboard.withdraw_type')}
                                {transaction.type === 'profit' && t('dashboard.profit_type')}
                                {transaction.type === 'referral' && t('dashboard.referral_type')}
                              </div>
                              {transaction.description && (
                                <div className="text-sm text-gray-500">{transaction.description}</div>
                              )}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className={`font-medium ${
                          transaction.type === 'withdraw' ? 'text-danger' :
                          transaction.type === 'deposit' || transaction.type === 'profit' || transaction.type === 'referral' ? 'text-success' : ''
                        }`}>
                          {transaction.type === 'withdraw' ? '-' : '+'}
                          <CurrencyFormatter value={parseFloat(transaction.amount.toString())} />
                        </TableCell>
                        <TableCell>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            transaction.status === 'completed' ? 'bg-green-100 text-green-800' :
                            transaction.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status === 'completed' && t('dashboard.completed_status')}
                            {transaction.status === 'pending' && t('dashboard.pending_status')}
                            {transaction.status === 'rejected' && t('dashboard.rejected_status')}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">{t('dashboard.no_transactions')}</p>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Referral Program */}
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-bold mb-4">{t('dashboard.referral_program')}</h2>
            <p className="text-gray-600 mb-4">{t('dashboard.referral_description')}</p>
            
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-500 mb-2">{t('dashboard.referral_link')}:</p>
              <div className="flex">
                <Input 
                  type="text" 
                  value={`https://tradepo.ru/register?ref=${user?.referralCode}`} 
                  readOnly 
                  className="flex-1 bg-white" 
                />
                <Button 
                  className="ml-2" 
                  onClick={() => {
                    navigator.clipboard.writeText(`https://tradepo.ru/register?ref=${user?.referralCode}`);
                    toast({
                      title: t('dashboard.copied'),
                      description: t('dashboard.referral_link_copied'),
                    });
                  }}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t('dashboard.copy')}
                </Button>
              </div>
            </div>
            
            <Link href="/dashboard/referrals">
              <Button variant="outline" className="w-full">
                {t('dashboard.view_referral_stats')}
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </UserDashboardLayout>
  );
}
