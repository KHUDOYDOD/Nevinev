import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { formatCurrency } from '@/lib/utils';
import { Loader2, Plus, Save } from 'lucide-react';

export default function TariffsPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newTariff, setNewTariff] = useState({
    name: '',
    nameEn: '',
    dailyRate: '',
    minDeposit: '',
    referralBonus: '',
    isActive: true,
  });

  // Fetch all tariffs
  const { data: tariffs, isLoading } = useQuery({
    queryKey: ['/api/admin/tariffs'],
  });

  // Create tariff mutation
  const createTariffMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/admin/tariffs', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tariffs'] });
      setCreateDialogOpen(false);
      setNewTariff({
        name: '',
        nameEn: '',
        dailyRate: '',
        minDeposit: '',
        referralBonus: '',
        isActive: true,
      });
      toast({
        title: t('common.success'),
        description: t('admin.tariffCreated'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.createFailed'),
        variant: 'destructive',
      });
    },
  });

  // Update tariff mutation
  const updateTariffMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return await apiRequest('PATCH', `/api/admin/tariffs/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/tariffs'] });
      toast({
        title: t('common.success'),
        description: t('admin.tariffUpdated'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('admin.updateFailed'),
        variant: 'destructive',
      });
    },
  });

  // Handle create tariff
  const handleCreateTariff = () => {
    // Validate fields
    if (!newTariff.name || !newTariff.nameEn || !newTariff.dailyRate || !newTariff.minDeposit || !newTariff.referralBonus) {
      toast({
        title: t('common.error'),
        description: t('admin.allFieldsRequired'),
        variant: 'destructive',
      });
      return;
    }

    // Convert to numbers
    const data = {
      ...newTariff,
      dailyRate: parseFloat(newTariff.dailyRate),
      minDeposit: parseFloat(newTariff.minDeposit),
      referralBonus: parseFloat(newTariff.referralBonus),
    };

    createTariffMutation.mutate(data);
  };

  // Handle update tariff
  const handleUpdateTariff = (tariff: any, field: string, value: any) => {
    let parsedValue = value;
    
    // Convert numeric fields
    if (['dailyRate', 'minDeposit', 'referralBonus'].includes(field)) {
      parsedValue = parseFloat(value);
      if (isNaN(parsedValue)) {
        toast({
          title: t('common.error'),
          description: t('admin.invalidNumber'),
          variant: 'destructive',
        });
        return;
      }
    }

    updateTariffMutation.mutate({
      id: tariff.id,
      data: { [field]: parsedValue },
    });
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t('admin.tariffs')}</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {t('admin.createTariff')}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t('admin.createTariff')}</DialogTitle>
              <DialogDescription>
                {t('admin.createTariffDescription')}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('admin.nameRu')}</Label>
                  <Input
                    id="name"
                    value={newTariff.name}
                    onChange={(e) => setNewTariff({ ...newTariff, name: e.target.value })}
                    placeholder="Базовый"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameEn">{t('admin.nameEn')}</Label>
                  <Input
                    id="nameEn"
                    value={newTariff.nameEn}
                    onChange={(e) => setNewTariff({ ...newTariff, nameEn: e.target.value })}
                    placeholder="Basic"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dailyRate">{t('admin.dailyRate')} (%)</Label>
                  <Input
                    id="dailyRate"
                    type="number"
                    value={newTariff.dailyRate}
                    onChange={(e) => setNewTariff({ ...newTariff, dailyRate: e.target.value })}
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minDeposit">{t('admin.minDeposit')} ($)</Label>
                  <Input
                    id="minDeposit"
                    type="number"
                    value={newTariff.minDeposit}
                    onChange={(e) => setNewTariff({ ...newTariff, minDeposit: e.target.value })}
                    placeholder="100"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="referralBonus">{t('admin.referralBonus')} (%)</Label>
                <Input
                  id="referralBonus"
                  type="number"
                  step="0.1"
                  value={newTariff.referralBonus}
                  onChange={(e) => setNewTariff({ ...newTariff, referralBonus: e.target.value })}
                  placeholder="0.1"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={newTariff.isActive}
                  onCheckedChange={(checked) => setNewTariff({ ...newTariff, isActive: checked })}
                />
                <Label htmlFor="isActive">{t('admin.active')}</Label>
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
                onClick={handleCreateTariff}
                disabled={createTariffMutation.isPending}
              >
                {createTariffMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('common.loading')}
                  </>
                ) : (
                  t('admin.createTariff')
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('admin.tariffSettings')}</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {tariffs?.map((tariff: any) => (
                <div key={tariff.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-6">
                  <h3 className="font-bold text-lg mb-3">{tariff.name}</h3>
                  <div className="space-y-4">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('admin.nameRu')}
                      </Label>
                      <Input
                        defaultValue={tariff.name}
                        onBlur={(e) => {
                          if (e.target.value !== tariff.name) {
                            handleUpdateTariff(tariff, 'name', e.target.value);
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('admin.nameEn')}
                      </Label>
                      <Input
                        defaultValue={tariff.nameEn}
                        onBlur={(e) => {
                          if (e.target.value !== tariff.nameEn) {
                            handleUpdateTariff(tariff, 'nameEn', e.target.value);
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('admin.dailyRate')} (%)
                      </Label>
                      <Input
                        type="number"
                        defaultValue={tariff.dailyRate}
                        onBlur={(e) => {
                          if (parseFloat(e.target.value) !== tariff.dailyRate) {
                            handleUpdateTariff(tariff, 'dailyRate', e.target.value);
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('admin.minDeposit')} ($)
                      </Label>
                      <Input
                        type="number"
                        defaultValue={tariff.minDeposit}
                        onBlur={(e) => {
                          if (parseFloat(e.target.value) !== tariff.minDeposit) {
                            handleUpdateTariff(tariff, 'minDeposit', e.target.value);
                          }
                        }}
                      />
                    </div>
                    
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        {t('admin.referralBonus')} (%)
                      </Label>
                      <Input
                        type="number"
                        step="0.1"
                        defaultValue={tariff.referralBonus}
                        onBlur={(e) => {
                          if (parseFloat(e.target.value) !== tariff.referralBonus) {
                            handleUpdateTariff(tariff, 'referralBonus', e.target.value);
                          }
                        }}
                      />
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id={`active-${tariff.id}`}
                        checked={tariff.isActive}
                        onCheckedChange={(checked) => {
                          handleUpdateTariff(tariff, 'isActive', checked);
                        }}
                      />
                      <Label htmlFor={`active-${tariff.id}`} className="cursor-pointer">
                        {tariff.isActive ? t('common.active') : t('common.inactive')}
                      </Label>
                    </div>
                  </div>
                </div>
              ))}

              {!tariffs?.length && (
                <div className="col-span-3 text-center py-8 text-gray-500">
                  <p>{t('admin.noTariffsFound')}</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setCreateDialogOpen(true)}
                  >
                    {t('admin.createFirstTariff')}
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </AdminLayout>
  );
}
