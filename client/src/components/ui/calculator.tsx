import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { calculateProfit, formatCurrency } from '@/lib/utils';

interface CalculatorProps {
  onInvest?: (amount: number, rate: number, days: number) => void;
  className?: string;
}

export function Calculator({ onInvest, className }: CalculatorProps) {
  const { t } = useTranslation();
  const [amount, setAmount] = useState(500);
  const [rate, setRate] = useState(10);
  const [days, setDays] = useState(30);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    const { dailyProfit, totalProfit, totalAmount } = calculateProfit(amount, rate, days);
    setDailyProfit(dailyProfit);
    setTotalProfit(totalProfit);
    setTotalAmount(totalAmount);
  }, [amount, rate, days]);

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleRateChange = (value: number) => {
    setRate(value);
  };

  const handleDaysChange = (value: number) => {
    setDays(value);
  };

  const handleInvest = () => {
    if (onInvest) {
      onInvest(amount, rate, days);
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <Label className="block text-sm font-medium mb-2">
                {t('calculator.investmentAmount')}
              </Label>
              <Input
                type="number"
                min="100"
                max="10000"
                value={amount}
                onChange={(e) => handleAmountChange(Number(e.target.value))}
                className="w-full px-4 py-3 border-gray-300 rounded-lg"
              />
              <Slider
                defaultValue={[amount]}
                min={100}
                max={10000}
                step={100}
                onValueChange={([value]) => handleAmountChange(value)}
                className="w-full mt-2"
              />
            </div>
            
            <div className="mb-6">
              <Label className="block text-sm font-medium mb-2">
                {t('calculator.tariff')}
              </Label>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant={rate === 5 ? "default" : "outline"}
                  onClick={() => handleRateChange(5)}
                >
                  {t('calculator.tariffBasic')} 5%
                </Button>
                <Button
                  variant={rate === 10 ? "default" : "outline"}
                  onClick={() => handleRateChange(10)}
                >
                  {t('calculator.tariffPremium')} 10%
                </Button>
                <Button
                  variant={rate === 15 ? "default" : "outline"}
                  onClick={() => handleRateChange(15)}
                >
                  {t('calculator.tariffElite')} 15%
                </Button>
              </div>
            </div>
            
            <div className="mb-6">
              <Label className="block text-sm font-medium mb-2">
                {t('calculator.term')}
              </Label>
              <Input
                type="number"
                min="1"
                max="365"
                value={days}
                onChange={(e) => handleDaysChange(Number(e.target.value))}
                className="w-full px-4 py-3 border-gray-300 rounded-lg"
              />
              <Slider
                defaultValue={[days]}
                min={1}
                max={365}
                step={1}
                onValueChange={([value]) => handleDaysChange(value)}
                className="w-full mt-2"
              />
            </div>
          </div>
          
          <div className="bg-primary/5 dark:bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">
              {t('calculator.yourProfit')}
            </h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('calculator.dailyProfit')}
              </p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {formatCurrency(dailyProfit)}
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('calculator.totalProfit')}
              </p>
              <p className="text-2xl font-bold text-primary dark:text-primary-foreground">
                {formatCurrency(totalProfit)}
              </p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {t('calculator.totalAmount')}
              </p>
              <p className="text-3xl font-bold">
                {formatCurrency(totalAmount)}
              </p>
              <div className="flex items-center mt-2 text-sm text-green-600 dark:text-green-400">
                <span>{rate}% {t('calculator.perDay')}</span>
              </div>
            </div>
            
            <Button
              className="w-full"
              onClick={handleInvest}
            >
              {t('calculator.investNow')}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
