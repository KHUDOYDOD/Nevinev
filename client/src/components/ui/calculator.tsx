import { useState, useEffect } from 'react';
import { useTranslation } from '@/i18n';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { TrendingUp, ArrowRightIcon } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'wouter';

interface Tariff {
  id: number;
  name: string;
  minAmount: number;
  dailyPercent: number;
  referralPercent: number;
  isActive: boolean;
  createdAt: string;
}

export function InvestmentCalculator() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [amount, setAmount] = useState(500);
  const [days, setDays] = useState(30);
  const [selectedTariffId, setSelectedTariffId] = useState<number | null>(null);
  
  const { data: tariffs = [] } = useQuery<Tariff[]>({
    queryKey: ['/api/tariffs'],
  });

  // Select premium tariff by default when tariffs are loaded
  useEffect(() => {
    if (tariffs.length > 0 && !selectedTariffId) {
      // Find premium tariff (usually the middle one)
      const premiumTariff = tariffs.find(t => t.name === 'Премиум' || t.name === 'Premium');
      if (premiumTariff) {
        setSelectedTariffId(premiumTariff.id);
      } else {
        // Default to the first tariff if premium not found
        setSelectedTariffId(tariffs[0].id);
      }
    }
  }, [tariffs, selectedTariffId]);

  const selectedTariff = tariffs.find(t => t.id === selectedTariffId) || null;
  
  const dailyRate = selectedTariff?.dailyPercent || 0;
  const dailyProfit = amount * (dailyRate / 100);
  const totalProfit = dailyProfit * days;
  const finalAmount = amount + totalProfit;
  
  const handleInvestClick = () => {
    if (!user) {
      navigate('/login');
    } else {
      navigate('/dashboard/deposits');
    }
  };
  
  const handleAmountChange = (newAmount: number) => {
    setAmount(newAmount);
    
    // If amount is less than the selected tariff's minimum, try to find a suitable tariff
    if (selectedTariff && newAmount < selectedTariff.minAmount) {
      const suitableTariff = tariffs
        .filter(t => t.isActive && newAmount >= t.minAmount)
        .sort((a, b) => b.minAmount - a.minAmount)[0];
      
      if (suitableTariff) {
        setSelectedTariffId(suitableTariff.id);
      }
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">{t('home.calculator.title')}</h2>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {t('home.calculator.subtitle')}
        </p>
      </div>
      
      <Card className="bg-white dark:bg-gray-900 shadow-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6 md:p-8 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-800">
              <div className="mb-6">
                <Label htmlFor="investment-amount" className="mb-2 block">
                  {t('home.calculator.amount')}
                </Label>
                <Input
                  id="investment-amount"
                  type="number"
                  min={100}
                  value={amount}
                  onChange={(e) => handleAmountChange(Number(e.target.value))}
                  className="mb-2"
                />
                <Slider
                  value={[amount]}
                  min={100}
                  max={10000}
                  step={100}
                  onValueChange={(values) => handleAmountChange(values[0])}
                  className="mt-4"
                />
              </div>
              
              <div className="mb-6">
                <Label className="mb-2 block">{t('home.calculator.tariff')}</Label>
                <div className="grid grid-cols-3 gap-3">
                  {tariffs.map((tariff) => (
                    <Button
                      key={tariff.id}
                      type="button"
                      variant={selectedTariffId === tariff.id ? "default" : "outline"}
                      onClick={() => setSelectedTariffId(tariff.id)}
                      className={cn(
                        amount < tariff.minAmount && "opacity-50 cursor-not-allowed",
                        tariff.name === "Премиум" || tariff.name === "Premium" ? "relative" : ""
                      )}
                      disabled={amount < tariff.minAmount}
                    >
                      {(tariff.name === "Премиум" || tariff.name === "Premium") && (
                        <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">
                          {t('home.tariffs.premium.popular')}
                        </span>
                      )}
                      {tariff.name}
                    </Button>
                  ))}
                </div>
                {selectedTariff && (
                  <p className="text-sm text-gray-500 mt-2">
                    {t('home.tariffs.minDeposit')} <span className="font-bold">${selectedTariff.minAmount}</span>
                  </p>
                )}
              </div>
              
              <div className="mb-6">
                <Label htmlFor="investment-days" className="mb-2 block">
                  {t('home.calculator.days')}
                </Label>
                <Input
                  id="investment-days"
                  type="number"
                  min={1}
                  max={365}
                  value={days}
                  onChange={(e) => setDays(Number(e.target.value))}
                  className="mb-2"
                />
                <Slider
                  value={[days]}
                  min={1}
                  max={365}
                  step={1}
                  onValueChange={(values) => setDays(values[0])}
                  className="mt-4"
                />
              </div>
            </div>
            
            <div className="p-6 md:p-8 bg-gradient-to-br from-primary/5 to-primary/10 dark:from-gray-800 dark:to-gray-800">
              <h3 className="text-lg font-semibold mb-6 text-gray-700 dark:text-gray-300">
                {t('home.calculator.results')}
              </h3>
              
              <div className="mb-8">
                <div className="text-3xl font-bold text-primary mb-2">
                  {formatCurrency(totalProfit)}
                </div>
                <div className="flex items-center text-sm text-green-600 dark:text-green-400">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span>
                    {dailyRate}% {t('home.tariffs.perDay')}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('home.calculator.dailyProfit')}</span>
                  <span className="font-medium text-green-600 dark:text-green-400">
                    {formatCurrency(dailyProfit)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('home.calculator.amount')}</span>
                  <span className="font-medium">
                    {formatCurrency(amount)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('home.calculator.totalProfit')}</span>
                  <span className="font-medium text-primary">
                    {formatCurrency(totalProfit)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">{t('home.calculator.finalAmount')}</span>
                  <span className="font-bold">
                    {formatCurrency(finalAmount)}
                  </span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                size="lg"
                onClick={handleInvestClick}
              >
                {t('home.calculator.invest')}
                <ArrowRightIcon className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
