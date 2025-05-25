import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calculator } from '@/components/ui/calculator';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useLocation } from 'wouter';

export default function CalculatorPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  
  // Fetch user data
  const { data: userData } = useQuery({
    queryKey: ['/api/users/current'],
  });

  const handleInvest = (amount: number, rate: number, days: number) => {
    if (!user) {
      toast({
        title: t('common.error'),
        description: 'Please log in to invest',
        variant: 'destructive',
      });
      return;
    }
    
    // Determine which tariff was selected based on the rate
    let tariffType = '';
    switch (rate) {
      case 5:
        tariffType = 'basic';
        break;
      case 10:
        tariffType = 'premium';
        break;
      case 15:
        tariffType = 'elite';
        break;
      default:
        tariffType = '';
    }
    
    setLocation('/dashboard/deposits');
    
    toast({
      title: t('common.info'),
      description: `${t('calculator.redirectedToDeposits')} (${tariffType}, ${amount})`,
    });
  };

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">{t('dashboard.calculator')}</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('calculator.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {t('calculator.description')}
          </p>
          
          <Calculator onInvest={handleInvest} />
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
