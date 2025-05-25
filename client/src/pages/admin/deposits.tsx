import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { AvatarPlaceholder } from '@/components/ui/avatar-placeholder';
import { Loader2, Ban } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function DepositsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [currentDeposit, setCurrentDeposit] = useState<any>(null);

  // Fetch all deposits
  const { data: deposits, isLoading } = useQuery({
    queryKey: ['/api/admin/deposits'],
  });

  // Cancel deposit mutation
  const cancelDepositMutation = useMutation({
    mutationFn: async (depositId: number) => {
      return await apiRequest('POST', `/api/admin/deposits/${depositId}/cancel`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/deposits'] });
      setCancelDialogOpen(false);
      toast({
        title: t('common.success'),
        description: t('admin.depositCancelled'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.cancelFailed'),
        variant: 'destructive',
      });
    },
  });

  // Handle cancel deposit click
  const handleCancelDeposit = (deposit: any) => {
    setCurrentDeposit(deposit);
    setCancelDialogOpen(true);
  };

  // Handle confirm cancel
  const handleConfirmCancel = () => {
    if (!currentDeposit) return;
    cancelDepositMutation.mutate(currentDeposit.id);
  };

  // Filter deposits based on search query and status
  const filteredDeposits = deposits?.filter((deposit: any) => {
    // Filter by status
    if (statusFilter !== 'all' && deposit.status !== statusFilter) {
      return false;
    }
    
    // Filter by search (deposit ID or username)
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        deposit.id.toString().includes(query) ||
        deposit.user.username.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.deposits')}</h1>
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
              <SelectItem value="active">{t('common.active')}</SelectItem>
              <SelectItem value="completed">{t('common.completed')}</SelectItem>
              <SelectItem value="cancelled">{t('common.cancelled')}</SelectItem>
            </SelectContent>
          </Select>
          
          <Input
            placeholder={t('admin.searchDeposits')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.depositsList')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : filteredDeposits?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">{t('common.id')}</th>
                    <th className="text-left p-4 font-medium">{t('common.user')}</th>
                    <th className="text-left p-4 font-medium">{t('tariffs.title')}</th>
                    <th className="text-left p-4 font-medium">{t('common.amount')}</th>
                    <th className="text-left p-4 font-medium">{t('calculator.dailyProfit')}</th>
                    <th className="text-left p-4 font-medium">{t('common.date')}</th>
                    <th className="text-left p-4 font-medium">{t('common.status')}</th>
                    <th className="text-left p-4 font-medium">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDeposits.map((deposit: any) => (
                    <tr key={deposit.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">{deposit.id}</td>
                      <td className="p-4">
                        <div className="flex items-center">
                          <AvatarPlaceholder name={deposit.user.fullName || deposit.user.username} className="mr-3" />
                          <div className="font-medium">{deposit.user.username}</div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div>{deposit.tariff.name}</div>
                        <div className="text-sm text-gray-500">{deposit.tariff.dailyRate}%</div>
                      </td>
                      <td className="p-4 font-medium">{formatCurrency(deposit.amount)}</td>
                      <td className="p-4 text-success">{formatCurrency(deposit.dailyProfit)}</td>
                      <td className="p-4 text-gray-500">{formatDate(deposit.createdAt)}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(deposit.status)}`}>
                          {t(`common.${deposit.status}`)}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex space-x-2">
                          {deposit.status === 'active' && (
                            <Button size="sm" variant="destructive" onClick={() => handleCancelDeposit(deposit)}>
                              <Ban className="h-4 w-4 mr-1" />
                              {t('admin.cancel')}
                            </Button>
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
              <p>{t('admin.noDepositsFound')}</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Cancel Deposit Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('admin.cancelDeposit')}</DialogTitle>
            <DialogDescription>
              {t('admin.cancelDepositConfirmation')}
            </DialogDescription>
          </DialogHeader>
          
          {currentDeposit && (
            <div className="py-4">
              <p className="mb-2">{t('admin.cancelDepositWarning')}</p>
              <div className="space-y-2 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('common.id')}:</span>
                  <span className="font-medium">#{currentDeposit.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('common.user')}:</span>
                  <span className="font-medium">{currentDeposit.user?.username}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('common.amount')}:</span>
                  <span className="font-medium">{formatCurrency(currentDeposit.amount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">{t('calculator.dailyProfit')}:</span>
                  <span className="font-medium text-success">{formatCurrency(currentDeposit.dailyProfit)}</span>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setCancelDialogOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              variant="destructive"
              onClick={handleConfirmCancel}
              disabled={cancelDepositMutation.isPending}
            >
              {cancelDepositMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <Ban className="mr-2 h-4 w-4" />
                  {t('admin.confirmCancel')}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
