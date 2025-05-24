import { useState, useEffect } from "react";
import { useLanguage } from "@/hooks/use-language";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { CurrencyFormatter } from "@/components/ui/currency-formatter";
import { TrendingUp } from "lucide-react";
import { Tariff } from "@/lib/types";

interface InvestmentCalculatorProps {
  tariffs: Tariff[];
  onInvest?: (amount: number, tariffId: number) => void;
}

export function InvestmentCalculator({ tariffs, onInvest }: InvestmentCalculatorProps) {
  const { t } = useLanguage();
  const [amount, setAmount] = useState(500);
  const [days, setDays] = useState(30);
  const [selectedTariffId, setSelectedTariffId] = useState<number | null>(null);
  const [selectedTariff, setSelectedTariff] = useState<Tariff | null>(null);
  const [dailyProfit, setDailyProfit] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [finalAmount, setFinalAmount] = useState(0);

  useEffect(() => {
    if (tariffs.length > 0) {
      // Default to premium tariff (10%) or the middle tariff if there are 3
      const defaultTariff = tariffs.find(t => parseFloat(t.dailyPercent.toString()) === 10) || tariffs[Math.floor(tariffs.length / 2)];
      setSelectedTariffId(defaultTariff.id);
      setSelectedTariff(defaultTariff);
    }
  }, [tariffs]);

  useEffect(() => {
    if (selectedTariff) {
      const rate = parseFloat(selectedTariff.dailyPercent.toString());
      const dailyProfit = amount * (rate / 100);
      const totalProfit = dailyProfit * days;
      const finalAmount = amount + totalProfit;
      
      setDailyProfit(dailyProfit);
      setTotalProfit(totalProfit);
      setFinalAmount(finalAmount);
    }
  }, [amount, days, selectedTariff]);

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleDaysChange = (value: number) => {
    setDays(value);
  };

  const handleTariffSelect = (tariffId: number) => {
    const tariff = tariffs.find(t => t.id === tariffId);
    if (tariff) {
      setSelectedTariffId(tariffId);
      setSelectedTariff(tariff);
      
      // Ensure minimum amount for the selected tariff
      const minAmount = parseFloat(tariff.minAmount.toString());
      if (amount < minAmount) {
        setAmount(minAmount);
      }
    }
  };

  if (!selectedTariff) return null;

  return (
    <Card className="shadow-lg">
      <CardContent className="p-6 md:p-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('calculator.investment_amount')} ($)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500">$</span>
                <Input
                  type="number"
                  value={amount}
                  min={selectedTariff ? parseFloat(selectedTariff.minAmount.toString()) : 100}
                  max={10000}
                  onChange={(e) => handleAmountChange(parseInt(e.target.value) || 0)}
                  className="pl-10"
                />
              </div>
              <Slider
                value={[amount]}
                min={selectedTariff ? parseFloat(selectedTariff.minAmount.toString()) : 100}
                max={10000}
                step={100}
                onValueChange={(value) => handleAmountChange(value[0])}
                className="mt-2"
              />
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('calculator.tariff')}
              </label>
              <div className="grid grid-cols-3 gap-3">
                {tariffs.map((tariff) => (
                  <Button
                    key={tariff.id}
                    type="button"
                    variant={selectedTariffId === tariff.id ? "default" : "outline"}
                    onClick={() => handleTariffSelect(tariff.id)}
                  >
                    {t(`tariffs.${tariff.name.toLowerCase()}`)} {tariff.dailyPercent}%
                  </Button>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {t('calculator.investment_period')} ({t('calculator.days')})
              </label>
              <Input
                type="number"
                value={days}
                min={1}
                max={365}
                onChange={(e) => handleDaysChange(parseInt(e.target.value) || 1)}
              />
              <Slider
                value={[days]}
                min={1}
                max={365}
                step={1}
                onValueChange={(value) => handleDaysChange(value[0])}
                className="mt-2"
              />
            </div>
          </div>
          
          <div className="bg-gray-900 text-white rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">{t('calculator.results')}</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-400">{t('calculator.daily_profit')}</p>
              <p className="text-2xl font-bold text-green-400">
                <CurrencyFormatter value={dailyProfit} />
              </p>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-400">{t('calculator.total_profit')}</p>
              <p className="text-2xl font-bold text-primary">
                <CurrencyFormatter value={totalProfit} />
              </p>
            </div>
            
            <div className="mb-6">
              <p className="text-sm text-gray-400">{t('calculator.final_amount')}</p>
              <p className="text-3xl font-bold">
                <CurrencyFormatter value={finalAmount} />
              </p>
            </div>
            
            <div className="flex items-center text-sm text-green-400 mb-6">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span>
                {t('calculator.rate')}{' '}
                <span className="font-bold">{selectedTariff.dailyPercent}%</span>{' '}
                {t('calculator.per_day')}
              </span>
            </div>
            
            {onInvest && (
              <Button 
                className="w-full" 
                onClick={() => onInvest(amount, selectedTariff.id)}
              >
                {t('calculator.invest_now')}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
