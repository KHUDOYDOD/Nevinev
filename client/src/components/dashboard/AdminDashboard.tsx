import { useTranslation } from "react-i18next";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Checkbox } from "@/components/ui/checkbox";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  ArrowUp, 
  ArrowDown, 
  RefreshCw, 
  Check, 
  X, 
  User, 
  Wallet, 
  ArrowRight,
  Clock,
  Calculator,
  BarChart3,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";

type User = {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  balance: number;
  referralCode: string;
  referredBy?: string;
  isAdmin: boolean;
};

type Deposit = {
  id: number;
  userId: number;
  tariffId: number;
  amount: number;
  isActive: boolean;
  createdAt: string;
};

type Transaction = {
  id: number;
  userId: number;
  type: string;
  amount: number;
  status: string;
  description: string;
  createdAt: string;
};

type Tariff = {
  id: number;
  name: string;
  dailyRate: number;
  minAmount: number;
  referralBonusRate: number;
  isActive: boolean;
  description: string;
};

type Stat = {
  id: number;
  totalUsers: number;
  totalInvested: number;
  totalPaid: number;
  updatedAt: string;
};

const tariffFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  dailyRate: z.number().min(0.1, { message: "Rate must be greater than 0.1%" }),
  minAmount: z.number().min(1, { message: "Minimum amount must be at least 1" }),
  referralBonusRate: z.number().min(0, { message: "Referral bonus rate must be greater than or equal to 0" }),
  isActive: z.boolean().default(true),
  description: z.string().optional(),
});

const adjustBalanceFormSchema = z.object({
  amount: z.number(),
  description: z.string().optional(),
});

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [editTariffId, setEditTariffId] = useState<number | null>(null);
  const [editTariffOpen, setEditTariffOpen] = useState(false);
  const [adjustBalanceOpen, setAdjustBalanceOpen] = useState(false);
  
  // Fetch users
  const { 
    data: users, 
    isLoading: isLoadingUsers,
    refetch: refetchUsers,
  } = useQuery<User[]>({
    queryKey: ['/api/admin/users'],
  });
  
  // Fetch deposits
  const {
    data: deposits,
    isLoading: isLoadingDeposits,
    refetch: refetchDeposits,
  } = useQuery<Deposit[]>({
    queryKey: ['/api/admin/deposits'],
  });
  
  // Fetch transactions
  const {
    data: transactions,
    isLoading: isLoadingTransactions,
    refetch: refetchTransactions,
  } = useQuery<Transaction[]>({
    queryKey: ['/api/admin/transactions'],
  });
  
  // Fetch tariffs
  const {
    data: tariffs,
    isLoading: isLoadingTariffs,
    refetch: refetchTariffs,
  } = useQuery<Tariff[]>({
    queryKey: ['/api/tariffs'],
  });
  
  // Fetch stats
  const {
    data: stats,
    isLoading: isLoadingStats,
    refetch: refetchStats,
  } = useQuery<Stat>({
    queryKey: ['/api/stats'],
  });
  
  // Approve transaction mutation
  const approveMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/admin/transactions/${id}/approve`, {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: t('admin.transactions.approveSuccess'),
        description: t('admin.transactions.approveSuccessDescription'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
      refetchTransactions();
    },
    onError: (error: any) => {
      toast({
        title: t('admin.transactions.approveError'),
        description: error.message || t('admin.transactions.approveErrorDescription'),
        variant: "destructive",
      });
    },
  });
  
  // Reject transaction mutation
  const rejectMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/admin/transactions/${id}/reject`, {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: t('admin.transactions.rejectSuccess'),
        description: t('admin.transactions.rejectSuccessDescription'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
      refetchTransactions();
    },
    onError: (error: any) => {
      toast({
        title: t('admin.transactions.rejectError'),
        description: error.message || t('admin.transactions.rejectErrorDescription'),
        variant: "destructive",
      });
    },
  });
  
  // Update tariff mutation
  const updateTariffMutation = useMutation({
    mutationFn: async (data: { id: number; tariff: z.infer<typeof tariffFormSchema> }) => {
      const res = await apiRequest('PUT', `/api/admin/tariffs/${data.id}`, data.tariff);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: t('admin.tariffs.updateSuccess'),
        description: t('admin.tariffs.updateSuccessDescription'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tariffs'] });
      refetchTariffs();
      setEditTariffOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('admin.tariffs.updateError'),
        description: error.message || t('admin.tariffs.updateErrorDescription'),
        variant: "destructive",
      });
    },
  });
  
  // Create tariff mutation
  const createTariffMutation = useMutation({
    mutationFn: async (data: z.infer<typeof tariffFormSchema>) => {
      const res = await apiRequest('POST', '/api/admin/tariffs', data);
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: t('admin.tariffs.createSuccess'),
        description: t('admin.tariffs.createSuccessDescription'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/tariffs'] });
      refetchTariffs();
      setEditTariffOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('admin.tariffs.createError'),
        description: error.message || t('admin.tariffs.createErrorDescription'),
        variant: "destructive",
      });
    },
  });
  
  // Adjust user balance mutation
  const adjustBalanceMutation = useMutation({
    mutationFn: async (data: { id: number; amount: number; description?: string }) => {
      const res = await apiRequest('POST', `/api/admin/users/${data.id}/balance`, {
        amount: data.amount,
        description: data.description,
      });
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: t('admin.users.adjustBalanceSuccess'),
        description: t('admin.users.adjustBalanceSuccessDescription'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      refetchUsers();
      setAdjustBalanceOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: t('admin.users.adjustBalanceError'),
        description: error.message || t('admin.users.adjustBalanceErrorDescription'),
        variant: "destructive",
      });
    },
  });
  
  // Calculate profits mutation
  const calculateProfitsMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest('POST', '/api/admin/calculate-profits', {});
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: t('admin.profits.calculateSuccess'),
        description: t('admin.profits.calculateSuccessDescription'),
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/transactions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/users'] });
      queryClient.invalidateQueries({ queryKey: ['/api/stats'] });
      refetchTransactions();
      refetchUsers();
      refetchStats();
    },
    onError: (error: any) => {
      toast({
        title: t('admin.profits.calculateError'),
        description: error.message || t('admin.profits.calculateErrorDescription'),
        variant: "destructive",
      });
    },
  });
  
  // Tariff form
  const tariffForm = useForm<z.infer<typeof tariffFormSchema>>({
    resolver: zodResolver(tariffFormSchema),
    defaultValues: {
      name: "",
      dailyRate: 0,
      minAmount: 0,
      referralBonusRate: 0,
      isActive: true,
      description: "",
    },
  });
  
  // Adjust balance form
  const adjustBalanceForm = useForm<z.infer<typeof adjustBalanceFormSchema>>({
    resolver: zodResolver(adjustBalanceFormSchema),
    defaultValues: {
      amount: 0,
      description: "",
    },
  });
  
  // Handle tariff edit/create
  const handleEditTariff = (tariffId: number | null) => {
    setEditTariffId(tariffId);
    
    if (tariffId !== null) {
      // Edit existing tariff
      const tariff = tariffs?.find(t => t.id === tariffId);
      if (tariff) {
        tariffForm.reset({
          name: tariff.name,
          dailyRate: tariff.dailyRate,
          minAmount: tariff.minAmount,
          referralBonusRate: tariff.referralBonusRate,
          isActive: tariff.isActive,
          description: tariff.description,
        });
      }
    } else {
      // New tariff
      tariffForm.reset({
        name: "",
        dailyRate: 5,
        minAmount: 100,
        referralBonusRate: 0.1,
        isActive: true,
        description: "",
      });
    }
    
    setEditTariffOpen(true);
  };
  
  // Handle tariff submit
  const onTariffSubmit = (values: z.infer<typeof tariffFormSchema>) => {
    if (editTariffId !== null) {
      // Update existing tariff
      updateTariffMutation.mutate({
        id: editTariffId,
        tariff: values,
      });
    } else {
      // Create new tariff
      createTariffMutation.mutate(values);
    }
  };
  
  // Handle adjust balance
  const handleAdjustBalance = (userId: number) => {
    setSelectedUserId(userId);
    adjustBalanceForm.reset({
      amount: 0,
      description: "",
    });
    setAdjustBalanceOpen(true);
  };
  
  // Handle adjust balance submit
  const onAdjustBalanceSubmit = (values: z.infer<typeof adjustBalanceFormSchema>) => {
    if (selectedUserId !== null) {
      adjustBalanceMutation.mutate({
        id: selectedUserId,
        amount: values.amount,
        description: values.description,
      });
    }
  };
  
  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('default', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Get transaction status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success">{t('admin.transactions.statusCompleted')}</Badge>;
      case 'pending':
        return <Badge variant="warning">{t('admin.transactions.statusPending')}</Badge>;
      case 'rejected':
        return <Badge variant="destructive">{t('admin.transactions.statusRejected')}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  
  // Get transaction type icon
  const getTransactionTypeIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowUp className="h-4 w-4 text-success" />;
      case 'withdrawal':
        return <ArrowDown className="h-4 w-4 text-primary" />;
      case 'profit':
        return <Check className="h-4 w-4 text-success" />;
      case 'referral':
        return <ArrowRight className="h-4 w-4 text-accent" />;
      default:
        return null;
    }
  };
  
  // Get user by id
  const getUserById = (userId: number) => {
    return users?.find(u => u.id === userId);
  };
  
  // Get tariff by id
  const getTariffById = (tariffId: number) => {
    return tariffs?.find(t => t.id === tariffId);
  };
  
  // Pending withdrawals count
  const pendingWithdrawalsCount = transactions?.filter(
    t => t.type === 'withdrawal' && t.status === 'pending'
  ).length || 0;
  
  // Total pending withdrawals amount
  const pendingWithdrawalsAmount = transactions
    ?.filter(t => t.type === 'withdrawal' && t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0) || 0;
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">{t('admin.title')}</h1>
        <p className="text-gray-500">{t('admin.welcome')}</p>
      </div>
      
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Users Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">{t('admin.stats.users')}</CardTitle>
              <User className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                stats?.totalUsers || 0
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('admin.stats.totalUsers')}
            </p>
          </CardContent>
        </Card>
        
        {/* Invested Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">{t('admin.stats.invested')}</CardTitle>
              <Wallet className="h-4 w-4 text-success" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                `$${(stats?.totalInvested || 0).toLocaleString()}`
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('admin.stats.totalInvested')}
            </p>
          </CardContent>
        </Card>
        
        {/* Paid Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">{t('admin.stats.paid')}</CardTitle>
              <ArrowDown className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingStats ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                `$${(stats?.totalPaid || 0).toLocaleString()}`
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('admin.stats.totalPaid')}
            </p>
          </CardContent>
        </Card>
        
        {/* Pending Withdrawals Card */}
        <Card>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium">{t('admin.stats.pendingWithdrawals')}</CardTitle>
              <Clock className="h-4 w-4 text-warning" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {isLoadingTransactions ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                `$${pendingWithdrawalsAmount.toLocaleString()}`
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {t('admin.stats.pendingCount', { count: pendingWithdrawalsCount })}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="dashboard">
        <TabsList className="mb-6">
          <TabsTrigger value="dashboard">
            <BarChart3 className="h-4 w-4 mr-2" />
            {t('admin.tabs.dashboard')}
          </TabsTrigger>
          <TabsTrigger value="users">
            <User className="h-4 w-4 mr-2" />
            {t('admin.tabs.users')}
          </TabsTrigger>
          <TabsTrigger value="deposits">
            <Wallet className="h-4 w-4 mr-2" />
            {t('admin.tabs.deposits')}
          </TabsTrigger>
          <TabsTrigger value="withdrawals">
            <ArrowDown className="h-4 w-4 mr-2" />
            {t('admin.tabs.withdrawals')}
          </TabsTrigger>
          <TabsTrigger value="tariffs">
            <Calculator className="h-4 w-4 mr-2" />
            {t('admin.tabs.tariffs')}
          </TabsTrigger>
        </TabsList>
        
        {/* Dashboard Tab */}
        <TabsContent value="dashboard">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Pending Withdrawals */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{t('admin.dashboard.pendingWithdrawals')}</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => refetchTransactions()}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('admin.refresh')}
                  </Button>
                </div>
                <CardDescription>
                  {t('admin.dashboard.pendingWithdrawalsDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingTransactions ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ))}
                  </div>
                ) : transactions?.filter(t => t.type === 'withdrawal' && t.status === 'pending').length ? (
                  <div className="space-y-4">
                    {transactions
                      .filter(t => t.type === 'withdrawal' && t.status === 'pending')
                      .slice(0, 5)
                      .map((transaction) => {
                        const user = getUserById(transaction.userId);
                        
                        return (
                          <div key={transaction.id} className="p-3 border border-gray-200 rounded-lg">
                            <div className="flex justify-between mb-2">
                              <p className="font-medium">{user?.username || `ID: ${transaction.userId}`}</p>
                              <Badge variant="warning">{t('admin.transactions.statusPending')}</Badge>
                            </div>
                            <div className="flex justify-between text-sm text-gray-500 mb-2">
                              <p>ID: W-{transaction.id}</p>
                              <p>{formatDate(transaction.createdAt)}</p>
                            </div>
                            <div className="flex justify-between items-center">
                              <p className="font-bold">${transaction.amount.toFixed(2)}</p>
                              <div className="space-x-2">
                                <Button
                                  variant="success"
                                  size="sm"
                                  onClick={() => approveMutation.mutate(transaction.id)}
                                  disabled={approveMutation.isPending}
                                >
                                  <Check className="h-4 w-4 mr-1" /> {t('admin.transactions.approve')}
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  onClick={() => rejectMutation.mutate(transaction.id)}
                                  disabled={rejectMutation.isPending}
                                >
                                  <X className="h-4 w-4 mr-1" /> {t('admin.transactions.reject')}
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{t('admin.dashboard.noPendingWithdrawals')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            {/* Recent Users */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{t('admin.dashboard.newUsers')}</CardTitle>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => refetchUsers()}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('admin.refresh')}
                  </Button>
                </div>
                <CardDescription>
                  {t('admin.dashboard.newUsersDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingUsers ? (
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <Skeleton className="h-12 w-full" />
                      </div>
                    ))}
                  </div>
                ) : users?.length ? (
                  <div className="space-y-4">
                    {users
                      .slice(0, 5)
                      .map((user) => (
                        <div key={user.id} className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold mr-3">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-medium">{user.username}</p>
                              <p className="text-sm text-gray-500">{user.email}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">
                              {t('admin.dashboard.balance')}: ${user.balance.toFixed(2)}
                            </p>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="text-xs text-primary"
                              onClick={() => handleAdjustBalance(user.id)}
                            >
                              {t('admin.dashboard.adjustBalance')}
                            </Button>
                          </div>
                        </div>
                      ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">{t('admin.dashboard.noUsers')}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>{t('admin.dashboard.actions')}</CardTitle>
              <CardDescription>
                {t('admin.dashboard.actionsDescription')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  onClick={() => calculateProfitsMutation.mutate()}
                  disabled={calculateProfitsMutation.isPending}
                >
                  {calculateProfitsMutation.isPending ? (
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      {t('admin.dashboard.calculating')}
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <Calculator className="h-4 w-4 mr-2" />
                      {t('admin.dashboard.calculateProfits')}
                    </div>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => {
                    refetchUsers();
                    refetchDeposits();
                    refetchTransactions();
                    refetchTariffs();
                    refetchStats();
                    
                    toast({
                      title: t('admin.dashboard.refreshSuccess'),
                      description: t('admin.dashboard.refreshSuccessDescription'),
                    });
                  }}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('admin.dashboard.refreshAll')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Users Tab */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('admin.users.title')}</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetchUsers()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('admin.refresh')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingUsers ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : users?.length ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{t('admin.users.username')}</TableHead>
                        <TableHead>{t('admin.users.email')}</TableHead>
                        <TableHead>{t('admin.users.fullName')}</TableHead>
                        <TableHead>{t('admin.users.balance')}</TableHead>
                        <TableHead>{t('admin.users.referralCode')}</TableHead>
                        <TableHead>{t('admin.users.referredBy')}</TableHead>
                        <TableHead>{t('admin.users.role')}</TableHead>
                        <TableHead>{t('admin.users.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.fullName || '-'}</TableCell>
                          <TableCell>${user.balance.toFixed(2)}</TableCell>
                          <TableCell>{user.referralCode}</TableCell>
                          <TableCell>{user.referredBy || '-'}</TableCell>
                          <TableCell>
                            {user.isAdmin ? (
                              <Badge>{t('admin.users.roleAdmin')}</Badge>
                            ) : (
                              <Badge variant="outline">{t('admin.users.roleUser')}</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleAdjustBalance(user.id)}
                            >
                              {t('admin.users.adjustBalance')}
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('admin.users.noUsers')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Deposits Tab */}
        <TabsContent value="deposits">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('admin.deposits.title')}</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetchDeposits()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('admin.refresh')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingDeposits ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : deposits?.length ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{t('admin.deposits.user')}</TableHead>
                        <TableHead>{t('admin.deposits.tariff')}</TableHead>
                        <TableHead>{t('admin.deposits.amount')}</TableHead>
                        <TableHead>{t('admin.deposits.date')}</TableHead>
                        <TableHead>{t('admin.deposits.status')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deposits.map((deposit) => {
                        const user = getUserById(deposit.userId);
                        const tariff = getTariffById(deposit.tariffId);
                        
                        return (
                          <TableRow key={deposit.id}>
                            <TableCell>{deposit.id}</TableCell>
                            <TableCell>{user?.username || `ID: ${deposit.userId}`}</TableCell>
                            <TableCell>
                              {tariff ? (
                                <div>
                                  {tariff.name}
                                  <div className="text-xs text-gray-500">
                                    {tariff.dailyRate}% / {t('admin.deposits.perDay')}
                                  </div>
                                </div>
                              ) : (
                                `ID: ${deposit.tariffId}`
                              )}
                            </TableCell>
                            <TableCell>${deposit.amount.toFixed(2)}</TableCell>
                            <TableCell>{formatDate(deposit.createdAt)}</TableCell>
                            <TableCell>
                              {deposit.isActive ? (
                                <Badge variant="success">{t('admin.deposits.active')}</Badge>
                              ) : (
                                <Badge variant="secondary">{t('admin.deposits.closed')}</Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('admin.deposits.noDeposits')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Withdrawals Tab */}
        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('admin.withdrawals.title')}</CardTitle>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => refetchTransactions()}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  {t('admin.refresh')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTransactions ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : transactions?.filter(t => t.type === 'withdrawal').length ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>{t('admin.withdrawals.user')}</TableHead>
                        <TableHead>{t('admin.withdrawals.amount')}</TableHead>
                        <TableHead>{t('admin.withdrawals.date')}</TableHead>
                        <TableHead>{t('admin.withdrawals.status')}</TableHead>
                        <TableHead>{t('admin.withdrawals.actions')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions
                        .filter(t => t.type === 'withdrawal')
                        .map((transaction) => {
                          const user = getUserById(transaction.userId);
                          
                          return (
                            <TableRow key={transaction.id}>
                              <TableCell>{transaction.id}</TableCell>
                              <TableCell>{user?.username || `ID: ${transaction.userId}`}</TableCell>
                              <TableCell>${transaction.amount.toFixed(2)}</TableCell>
                              <TableCell>{formatDate(transaction.createdAt)}</TableCell>
                              <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                              <TableCell>
                                {transaction.status === 'pending' && (
                                  <div className="flex space-x-2">
                                    <Button
                                      variant="success"
                                      size="sm"
                                      onClick={() => approveMutation.mutate(transaction.id)}
                                      disabled={approveMutation.isPending}
                                    >
                                      <Check className="h-4 w-4 mr-1" /> {t('admin.transactions.approve')}
                                    </Button>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      onClick={() => rejectMutation.mutate(transaction.id)}
                                      disabled={rejectMutation.isPending}
                                    >
                                      <X className="h-4 w-4 mr-1" /> {t('admin.transactions.reject')}
                                    </Button>
                                  </div>
                                )}
                              </TableCell>
                            </TableRow>
                          );
                        })}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('admin.withdrawals.noWithdrawals')}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Tariffs Tab */}
        <TabsContent value="tariffs">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{t('admin.tariffs.title')}</CardTitle>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => refetchTariffs()}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    {t('admin.refresh')}
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => handleEditTariff(null)}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {t('admin.tariffs.create')}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingTariffs ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i}>
                      <Skeleton className="h-12 w-full" />
                    </div>
                  ))}
                </div>
              ) : tariffs?.length ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {tariffs.map((tariff) => (
                    <div key={tariff.id} className="border border-gray-200 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                        <h3 className="font-bold text-lg">{tariff.name}</h3>
                        {tariff.isActive ? (
                          <Badge variant="success">{t('admin.tariffs.active')}</Badge>
                        ) : (
                          <Badge variant="secondary">{t('admin.tariffs.inactive')}</Badge>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('admin.tariffs.dailyRate')}
                          </label>
                          <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                            {tariff.dailyRate}%
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('admin.tariffs.minAmount')}
                          </label>
                          <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                            ${tariff.minAmount}
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('admin.tariffs.referralBonusRate')}
                          </label>
                          <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                            {tariff.referralBonusRate}%
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            {t('admin.tariffs.description')}
                          </label>
                          <div className="px-3 py-2 border border-gray-300 rounded-lg bg-gray-50">
                            {tariff.description || '-'}
                          </div>
                        </div>
                        <Button
                          className="w-full"
                          onClick={() => handleEditTariff(tariff.id)}
                        >
                          {t('admin.tariffs.edit')}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">{t('admin.tariffs.noTariffs')}</p>
                  <Button
                    className="mt-4"
                    onClick={() => handleEditTariff(null)}
                  >
                    {t('admin.tariffs.createFirst')}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Edit Tariff Dialog */}
      <Dialog open={editTariffOpen} onOpenChange={setEditTariffOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editTariffId !== null ? t('admin.tariffs.editTitle') : t('admin.tariffs.createTitle')}
            </DialogTitle>
            <DialogDescription>
              {editTariffId !== null ? t('admin.tariffs.editDescription') : t('admin.tariffs.createDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...tariffForm}>
            <form onSubmit={tariffForm.handleSubmit(onTariffSubmit)} className="space-y-4">
              <FormField
                control={tariffForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.tariffs.name')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={tariffForm.control}
                name="dailyRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.tariffs.dailyRate')} (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={tariffForm.control}
                name="minAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.tariffs.minAmount')} ($)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={tariffForm.control}
                name="referralBonusRate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.tariffs.referralBonusRate')} (%)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(parseFloat(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={tariffForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.tariffs.description')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={tariffForm.control}
                name="isActive"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                        {t('admin.tariffs.isActive')}
                      </FormLabel>
                      <p className="text-sm text-gray-500">
                        {t('admin.tariffs.isActiveDescription')}
                      </p>
                    </div>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditTariffOpen(false)}
                  disabled={updateTariffMutation.isPending || createTariffMutation.isPending}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={updateTariffMutation.isPending || createTariffMutation.isPending}
                >
                  {updateTariffMutation.isPending || createTariffMutation.isPending
                    ? t('common.processing')
                    : editTariffId !== null
                      ? t('admin.tariffs.update')
                      : t('admin.tariffs.create')
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Adjust Balance Dialog */}
      <Dialog open={adjustBalanceOpen} onOpenChange={setAdjustBalanceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.users.adjustBalanceTitle')}</DialogTitle>
            <DialogDescription>
              {t('admin.users.adjustBalanceDescription')}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...adjustBalanceForm}>
            <form onSubmit={adjustBalanceForm.handleSubmit(onAdjustBalanceSubmit)} className="space-y-4">
              <FormField
                control={adjustBalanceForm.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.users.amount')}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5">$</span>
                        <Input
                          type="number"
                          placeholder="-100 or 100"
                          className="pl-8"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </div>
                    </FormControl>
                    <p className="text-xs text-gray-500">
                      {t('admin.users.amountDescription')}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={adjustBalanceForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('admin.users.description')}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setAdjustBalanceOpen(false)}
                  disabled={adjustBalanceMutation.isPending}
                >
                  {t('common.cancel')}
                </Button>
                <Button
                  type="submit"
                  disabled={adjustBalanceMutation.isPending}
                >
                  {adjustBalanceMutation.isPending
                    ? t('common.processing')
                    : t('admin.users.confirm')
                  }
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
