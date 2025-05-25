import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';

export default function DepositsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [selectedTariff, setSelectedTariff] = useState('');

  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ['/api/users/current'],
  });

  // Fetch all deposits
  const { data: deposits, isLoading: isDepositsLoading } = useQuery({
    queryKey: ['/api/deposits'],
  });

  // Fetch available tariffs
  const { data: tariffs, isLoading: isTariffsLoading } = useQuery({
    queryKey: ['/api/tariffs'],
  });

  // Create deposit mutation
  const createDepositMutation = useMutation({
    mutationFn: async ({ amount, tariffId }: { amount: number; tariffId: number }) => {
      return await apiRequest('POST', '/api/deposits', { amount, tariffId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/current'] });
      queryClient.invalidateQueries({ queryKey: ['/api/deposits'] });
      setCreateDialogOpen(false);
      setAmount('');
      setSelectedTariff('');
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

  const handleCreateDeposit = () => {
    const amountValue = parseFloat(amount);
    const tariffId = parseInt(selectedTariff);
    
    if (isNaN(amountValue) || amountValue <= 0) {
      toast({
        title: t('common.error'),
        description: 'Please enter a valid amount',
        variant: 'destructive',
      });
      return;
    }
    
    if (isNaN(tariffId)) {
      toast({
        title: t('common.error'),
        description: 'Please select a tariff',
        variant: 'destructive',
      });
      return;
    }
    
    const selectedTariffObj = tariffs?.find((t: any) => t.id === tariffId);
    if (selectedTariffObj && amountValue < selectedTariffObj.minDeposit) {
      toast({
        title: t('common.error'),
        description: `Minimum deposit for this tariff is ${formatCurrency(selectedTariffObj.minDeposit)}`,
        variant: 'destructive',
      });
      return;
    }
    
    if (amountValue > (userData?.balance || 0)) {
      toast({
        title: t('common.error'),
        description: 'Insufficient balance',
        variant: 'destructive',
      });
      return;
    }
    
    createDepositMutation.mutate({ amount: amountValue, tariffId });
  };

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('dashboard.deposits')}</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Check className="mr-2 h-4 w-4" />
              {t('dashboard.createDeposit')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('dashboard.depositTitle')}</DialogTitle>
              <DialogDescription>
                {t('dashboard.depositDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tariff">{t('calculator.tariff')}</Label>
                <Select 
                  value={selectedTariff}
                  onValueChange={setSelectedTariff}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t('dashboard.selectTariff')} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>{t('tariffs.title')}</SelectLabel>
                      {isTariffsLoading ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          {t('common.loading')}
                        </div>
                      ) : (
                        tariffs?.filter((tariff: any) => tariff.isActive).map((tariff: any) => (
                          <SelectItem key={tariff.id} value={tariff.id.toString()}>
                            {tariff.name} - {tariff.dailyRate}% ({formatCurrency(tariff.minDeposit)} min)
                          </SelectItem>
                        ))
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deposit-amount">{t('common.amount')}</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  min={selectedTariff ? (tariffs?.find((t: any) => t.id.toString() === selectedTariff)?.minDeposit || 100) : 100}
                  max={userData?.balance || 0}
                  placeholder="100"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <p className="text-sm text-gray-500">
                  {t('dashboard.balanceAvailable')}: {formatCurrency(userData?.balance || 0)}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setCreateDialogOpen(false)}
              >
                {t('common.cancel')}
              </Button>
              <Button 
                onClick={handleCreateDeposit}
                disabled={createDepositMutation.isPending}
              >
                {createDepositMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('dashboard.createDeposit')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.allDeposits')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isDepositsLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : deposits?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium">{t('common.id')}</th>
                    <th className="text-left p-4 font-medium">{t('tariffs.title')}</th>
                    <th className="text-left p-4 font-medium">{t('common.amount')}</th>
                    <th className="text-left p-4 font-medium">{t('calculator.dailyProfit')}</th>
                    <th className="text-left p-4 font-medium">{t('common.date')}</th>
                    <th className="text-left p-4 font-medium">{t('common.status')}</th>
                  </tr>
                </thead>
                <tbody>
                  {deposits.map((deposit: any) => (
                    <tr key={deposit.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                      <td className="p-4">{deposit.id}</td>
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
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>{t('dashboard.noDeposits')}</p>
              <Button 
                variant="outline" 
                className="mt-4"
                onClick={() => setCreateDialogOpen(true)}
              >
                {t('dashboard.createFirstDeposit')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
