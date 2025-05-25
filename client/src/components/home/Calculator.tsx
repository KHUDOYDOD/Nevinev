import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";

type TariffType = "basic" | "premium" | "elite";

interface Tariff {
  id: number;
  type: TariffType;
  name: string;
  interestRate: number;
  minInvestment: number;
  referralBonus: number;
  isActive: boolean;
}

const Calculator = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  
  const { data: tariffs } = useQuery<Tariff[]>({
    queryKey: ['/api/tariffs'],
  });

  const [amount, setAmount] = useState<number>(500);
  const [selectedTariff, setSelectedTariff] = useState<TariffType>("premium");
  const [days, setDays] = useState<number>(30);
  
  const [rate, setRate] = useState<number>(10);
  const [dailyProfit, setDailyProfit] = useState<number>(0);
  const [totalProfit, setTotalProfit] = useState<number>(0);
  const [finalAmount, setFinalAmount] = useState<number>(0);

  useEffect(() => {
    // Find selected tariff
    const tariff = tariffs?.find(t => t.type === selectedTariff);
    const currentRate = tariff?.interestRate || 
      (selectedTariff === "basic" ? 5 : selectedTariff === "premium" ? 10 : 15);
    
    setRate(currentRate);
    
    // Calculate profits
    const daily = amount * (currentRate / 100);
    const total = daily * days;
    const final = amount + total;
    
    setDailyProfit(daily);
    setTotalProfit(total);
    setFinalAmount(final);
  }, [amount, selectedTariff, days, tariffs]);

  const handleAmountChange = (value: number) => {
    setAmount(value);
  };

  const handleDaysChange = (value: number) => {
    setDays(value);
  };

  const handleTariffChange = (tariff: TariffType) => {
    setSelectedTariff(tariff);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <section id="calculator" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('calculator.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('calculator.description')}</p>
        </motion.div>
        
        <motion.div 
          className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('calculator.investmentAmount')}
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500">$</span>
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => handleAmountChange(Number(e.target.value))}
                    min="100"
                    max="10000"
                    className="pl-10"
                  />
                </div>
                <Slider
                  value={[amount]}
                  min={100}
                  max={10000}
                  step={100}
                  onValueChange={(value) => handleAmountChange(value[0])}
                  className="mt-4"
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('calculator.selectTariff')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <Button 
                    type="button" 
                    variant={selectedTariff === "basic" ? "default" : "outline"}
                    onClick={() => handleTariffChange("basic")}
                    className="text-sm"
                  >
                    {t('common.basic')} 5%
                  </Button>
                  <Button 
                    type="button" 
                    variant={selectedTariff === "premium" ? "default" : "outline"}
                    onClick={() => handleTariffChange("premium")}
                    className="text-sm"
                  >
                    {t('common.premium')} 10%
                  </Button>
                  <Button 
                    type="button" 
                    variant={selectedTariff === "elite" ? "default" : "outline"}
                    onClick={() => handleTariffChange("elite")}
                    className="text-sm"
                  >
                    {t('common.elite')} 15%
                  </Button>
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('calculator.investmentPeriod')}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={days}
                    onChange={(e) => handleDaysChange(Number(e.target.value))}
                    min="1"
                    max="365"
                  />
                </div>
                <Slider
                  value={[days]}
                  min={1}
                  max={365}
                  onValueChange={(value) => handleDaysChange(value[0])}
                  className="mt-4"
                />
              </div>
            </div>
            
            <div className="md:w-1/2 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">{t('calculator.calculationResults')}</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">{t('calculator.dailyProfit')}</p>
                <p className="text-2xl font-bold text-success" id="daily-profit">
                  {formatCurrency(dailyProfit)}
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">{t('calculator.totalProfit')}</p>
                <p className="text-2xl font-bold text-primary" id="total-profit">
                  {formatCurrency(totalProfit)}
                </p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500">{t('calculator.totalAmount')}</p>
                <p className="text-3xl font-bold" id="final-amount">
                  {formatCurrency(finalAmount)}
                </p>
              </div>
              
              <Button asChild className="w-full py-6 h-auto">
                <Link href={user ? "/dashboard" : "/login"}>
                  {t('calculator.investNow')}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Calculator;
