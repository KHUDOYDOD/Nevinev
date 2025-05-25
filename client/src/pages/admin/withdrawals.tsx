import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { AvatarPlaceholder } from '@/components/ui/avatar-placeholder';
import { Loader2, Check, X } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useLocation } from 'wouter';

export default function WithdrawalsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [currentWithdrawal, setCurrentWithdrawal] = useState<any>(null);
  const [location] = useLocation();

  // Fetch all withdrawals
  const { data: withdrawals, isLoading } = useQuery({
    queryKey: ['/api/admin/withdrawals'],
  });

  // Handle URL params for direct actions
  useEffect(() => {
    const params = new URLSearchParams(location.split('?')[1]);
    const action = params.get('action');
    const id = params.get('id');
    
    if (action && id) {
      // Find the withdrawal
      const withdrawal = withdrawals?.find((w: any) => w.id.toString() === id);
      
      if (withdrawal) {
        setCurrentWithdrawal(withdrawal);
        
        if (action === 'approve') {
          setApproveDialogOpen(true);
        } else if (action === 'reject') {
          setRejectDialogOpen(true);
        }
      }
    }
  }, [withdrawals, location]);

  // Approve withdrawal mutation
  const approveWithdrawalMutation = useMutation({
    mutationFn: async (withdrawalId: number) => {
      return await apiRequest('POST', `/api/admin/withdrawals/${withdrawalId}/approve`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      setApproveDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('admin.withdrawalApproved'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.approveFailed'),
        variant: 'destructive',
      });
    },
  });

  // Reject withdrawal mutation
  const rejectWithdrawalMutation = useMutation({
    mutationFn: async (withdrawalId: number) => {
      return await apiRequest('POST', `/api/admin/withdrawals/${withdrawalId}/reject`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/withdrawals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/dashboard'] });
      setRejectDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('admin.withdrawalRejected'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.rejectFailed'),
        variant: 'destructive',
      });
    },
  });

  // Handle approve withdrawal click
  const handleApproveWithdrawal = (withdrawal: any) => {
    setCurrentWithdrawal(withdrawal);
    setApproveDialogOpen(true);
  };

  // Handle reject withdrawal click
  const handleRejectWithdrawal = (withdrawal: any) => {
    setCurrentWithdrawal(withdrawal);
    setRejectDialogOpen(true);
  };

  // Handle confirm approve
  const handleConfirmApprove = () => {
    if (!currentWithdrawal) return;
    approveWithdrawalMutation.mutate(currentWithdrawal.id);
  };

  // Handle confirm reject
  const handleConfirmReject = () => {
    if (!currentWithdrawal) return;
    rejectWithdrawalMutation.mutate(currentWithdrawal.id);
  };

  // Filter withdrawals based on search query and status
  const filteredWithdrawals = withdrawals?.filter((withdrawal: any) => {
    // Filter by status
    if (statusFilter !== 'all' && withdrawal.status !== statusFilter) {
      return false;
    }
    
    // Filter by search (withdrawal ID or username)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        withdrawal.id.toString().includes(query) ||
        withdrawal.user.username.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.withdrawals')}</h1>
        <div className="flex space-x-4">
          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
          >
            <SelectTrigger className="w-40">
              <SelectValue placeholder={t('common.status')} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('admin.allStatuses')}</SelectItem>
              <SelectItem value="pending">{t('common.pending')}</SelectItem>
              <SelectItem value="completed">{t('common.completed')}</SelectItem>
              <SelectItem value="rejected">{t('common.rejected')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder={t('admin.searchWithdrawals')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.withdrawalsList')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredWithdrawals?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">{t('common.id')}</th>
                    <th className="text-left p-4 font-medium">{t('common.user')}</th>
                    <th className="text-left p-4 font-medium">{t('common.amount')}</th>
                    <th className="text-left p-4 font-medium">{t('common.date')}</th>
                    <th className="text-left p-4 font-medium">{t('common.status')}</th>
                    <th className="text-left p-4 font-medium">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWithdrawals.map((withdrawal: any) => (
                    <tr key={withdrawal.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">W-{withdrawal.id}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <AvatarPlaceholder name={withdrawal.user.fullName || withdrawal.user.username} className="mr-3" />
                          <div>
                            <div className="font-medium">{withdrawal.user.username}</div>
                            <div className="text-sm text-gray-500">{withdrawal.user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-medium">{formatCurrency(withdrawal.amount)}</td>
                      <td className="p-4 text-gray-500">{formatDate(withdrawal.createdAt)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(withdrawal.status)}`}>
                          {t(`common.${withdrawal.status}`)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {withdrawal.status === 'pending' && (
                            <>
                              <Button size="sm" variant="success" onClick={() => handleApproveWithdrawal(withdrawal)}>
                                <Check className="h-4 w-4 mr-1" />
                                {t('admin.approve')}
                              </Button>
                              <Button size="sm" variant="destructive" onClick={() => handleRejectWithdrawal(withdrawal)}>
                                <X className="h-4 w-4 mr-1" />
                                {t('admin.reject')}
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{t('admin.noWithdrawalsFound')}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Approve Withdrawal Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.approveWithdrawal')}</DialogTitle>
            <DialogDescription>
              {t('admin.approveWithdrawalConfirmation')}
            </DialogDescription>
          </DialogHeader>
          
          {currentWithdrawal && (
            <div className="py-4">
              <div className="space-y-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('common.id')}:</span>
                  <span className="font-medium">W-{currentWithdrawal.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('common.user')}:</span>
                  <span className="font-medium">{currentWithdrawal.user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('common.amount')}:</span>
                  <span className="font-medium">{formatCurrency(currentWithdrawal.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('common.date')}:</span>
                  <span className="font-medium">{formatDate(currentWithdrawal.createdAt)}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setApproveDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="success"
              onClick={handleConfirmApprove}
              disabled={approveWithdrawalMutation.isPending}
            >
              {approveWithdrawalMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <Check className="mr-2 h-4 w-4" />
                  {t('admin.approve')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Withdrawal Dialog */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.rejectWithdrawal')}</DialogTitle>
            <DialogDescription>
              {t('admin.rejectWithdrawalConfirmation')}
            </DialogDescription>
          </DialogHeader>
          
          {currentWithdrawal && (
            <div className="py-4">
              <p className="mb-2">{t('admin.rejectWithdrawalWarning')}</p>
              <div className="space-y-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('common.id')}:</span>
                  <span className="font-medium">W-{currentWithdrawal.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('common.user')}:</span>
                  <span className="font-medium">{currentWithdrawal.user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('common.amount')}:</span>
                  <span className="font-medium">{formatCurrency(currentWithdrawal.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('common.date')}:</span>
                  <span className="font-medium">{formatDate(currentWithdrawal.createdAt)}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmReject}
              disabled={rejectWithdrawalMutation.isPending}
            >
              {rejectWithdrawalMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <X className="mr-2 h-4 w-4" />
                  {t('admin.reject')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
