import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

type Tariff = {
  id: number;
  name: string;
  dailyRate: number;
  minAmount: number;
};

export default function CalculatorSection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  // Fetch tariffs from API
  const { data: tariffs, isLoading } = useQuery<Tariff[]>({
    queryKey: ['/api/tariffs'],
  });
  
  const [selectedTariffIndex, setSelectedTariffIndex] = useState(1); // Default to middle (Premium)
  const [amount, setAmount] = useState(500);
  const [days, setDays] = useState(30);
  
  // Update amount if selected tariff changes to ensure minimum amount
  useEffect(() => {
    if (tariffs && tariffs[selectedTariffIndex]) {
      const minAmount = tariffs[selectedTariffIndex].minAmount;
      if (amount < minAmount) {
        setAmount(minAmount);
      }
    }
  }, [selectedTariffIndex, tariffs]);
  
  const selectedTariff = tariffs && tariffs[selectedTariffIndex];
  const rate = selectedTariff ? selectedTariff.dailyRate : 10; // Default 10%
  
  const dailyProfit = amount * (rate / 100);
  const totalProfit = dailyProfit * days;
  const finalAmount = amount + totalProfit;
  
  // Handle login modal
  const handleInvestClick = () => {
    // This function would be used to navigate or open login modal
    const loginBtn = document.getElementById('login-button');
    if (loginBtn) {
      loginBtn.click();
    }
  };
  
  if (isLoading) {
    return (
      <section id="calculator" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('calculator.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('calculator.subtitle')}</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-16 w-full" />
                <Skeleton className="h-24 w-full" />
              </div>
              <Skeleton className="h-80 w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="calculator" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('calculator.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('calculator.subtitle')}</p>
        </div>
        
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-6 md:p-10">
          <div className="flex flex-col md:flex-row md:space-x-8">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('calculator.amount')} ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-3 text-gray-500">$</span>
                  <Input
                    type="number"
                    value={amount}
                    min={selectedTariff?.minAmount || 100}
                    max={10000}
                    className="pl-10"
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <Slider
                  value={[amount]}
                  min={selectedTariff?.minAmount || 100}
                  max={10000}
                  step={100}
                  className="mt-2"
                  onValueChange={(value) => setAmount(value[0])}
                />
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('calculator.tariff')}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {tariffs?.map((tariff, index) => (
                    <button
                      key={tariff.id}
                      type="button"
                      className={`py-3 border rounded-lg text-sm font-medium ${
                        selectedTariffIndex === index
                          ? 'bg-primary text-white border-primary'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedTariffIndex(index)}
                    >
                      {tariff.name} {tariff.dailyRate}%
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  {t('calculator.days')}
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={days}
                    min={1}
                    max={365}
                    className="w-full"
                    onChange={(e) => setDays(Number(e.target.value))}
                  />
                </div>
                <Slider
                  value={[days]}
                  min={1}
                  max={365}
                  step={1}
                  className="mt-2"
                  onValueChange={(value) => setDays(value[0])}
                />
              </div>
            </div>
            
            <div className="md:w-1/2 bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">{t('calculator.results')}</h3>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">{t('calculator.dailyProfit')}</p>
                <p className="text-2xl font-bold text-success" id="daily-profit">
                  ${dailyProfit.toFixed(2)}
                </p>
              </div>
              
              <div className="mb-4">
                <p className="text-sm text-gray-500">{t('calculator.totalProfit')}</p>
                <p className="text-2xl font-bold text-primary" id="total-profit">
                  ${totalProfit.toFixed(2)}
                </p>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-500">{t('calculator.finalAmount')}</p>
                <p className="text-3xl font-bold" id="final-amount">
                  ${finalAmount.toFixed(2)}
                </p>
              </div>
              
              {isAuthenticated ? (
                <Button
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-dark"
                  asChild
                >
                  <a href="/dashboard">{t('calculator.investNow')}</a>
                </Button>
              ) : (
                <Button
                  className="w-full py-3 px-4 bg-primary hover:bg-primary-dark"
                  onClick={handleInvestClick}
                >
                  {t('calculator.investNow')}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
