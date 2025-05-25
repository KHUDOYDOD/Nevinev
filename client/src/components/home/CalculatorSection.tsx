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
    <section id="calculator" className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-background dark:to-gray-900/20 relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute -top-40 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse animate-duration-very-slow"></div>
      <div className="absolute -bottom-40 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl animate-pulse animate-duration-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/3 rounded-full blur-3xl animate-float-rotate animate-duration-very-slow"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-blue-500/3 rounded-full blur-3xl animate-float animate-duration-slow"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-5 py-2 mb-6 rounded-full bg-gradient-to-r from-primary/10 to-secondary/10 backdrop-blur-sm shadow-lg shadow-primary/5">
            <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Инвестиционный калькулятор</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 leading-tight">
            Рассчитайте свою <span className="relative inline-block">
              <span className="relative z-10">прибыль</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-secondary/20 rounded-full -z-10 transform -skew-x-12"></span>
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in animate-delay-100 leading-relaxed">
            Используйте наш инвестиционный калькулятор для планирования инвестиций и расчета будущей прибыли
          </p>
        </div>
        
        <div className="max-w-5xl mx-auto backdrop-blur-sm bg-white/90 dark:bg-gray-900/50 rounded-3xl shadow-2xl p-8 md:p-10 border border-white/20 animate-scale-in transform hover:scale-[1.01] transition-all duration-500">
          <div className="flex flex-col md:flex-row md:space-x-10">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <div className="mb-8 group">
                <label className="block text-lg font-semibold text-foreground/90 mb-3 group-hover:text-primary transition-colors duration-300">
                  Сумма инвестиции ($)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-4 text-foreground/50 text-lg">$</span>
                  <Input
                    type="number"
                    value={amount}
                    min={selectedTariff?.minAmount || 100}
                    max={10000}
                    className="pl-10 h-14 text-lg font-medium bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring focus:ring-primary/20 shadow-sm"
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                </div>
                <div className="mt-4 relative">
                  <Slider
                    value={[amount]}
                    min={selectedTariff?.minAmount || 100}
                    max={10000}
                    step={100}
                    className="z-10"
                    onValueChange={(value) => setAmount(value[0])}
                  />
                  <div className="absolute h-2 inset-x-0 top-[7px] bg-gradient-to-r from-blue-200 to-primary/40 rounded-full -z-10 animate-pulse animate-duration-very-slow"></div>
                </div>
                
                <div className="flex justify-between mt-2 text-sm text-foreground/60">
                  <span>{selectedTariff?.minAmount || 100}$</span>
                  <span>10,000$</span>
                </div>
              </div>
              
              <div className="mb-8 group">
                <label className="block text-lg font-semibold text-foreground/90 mb-3 group-hover:text-primary transition-colors duration-300">
                  Выберите тариф
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {tariffs?.map((tariff, index) => (
                    <button
                      key={tariff.id}
                      type="button"
                      className={`py-4 border-2 rounded-xl text-base font-semibold transition-all duration-300 relative overflow-hidden shadow-md ${
                        selectedTariffIndex === index
                          ? 'bg-gradient-to-r from-primary to-secondary text-white border-transparent'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary/50 dark:hover:border-primary/50 bg-white/50 dark:bg-gray-800/50'
                      }`}
                      onClick={() => setSelectedTariffIndex(index)}
                    >
                      {selectedTariffIndex === index && (
                        <>
                          <span className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent animate-shine"></span>
                          <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-white animate-ping"></span>
                        </>
                      )}
                      <div className="flex flex-col items-center gap-1">
                        <span className={selectedTariffIndex === index ? "text-white" : "text-foreground"}>{tariff.name}</span>
                        <span className={`font-bold ${selectedTariffIndex === index ? "text-white" : "text-primary"}`}>{tariff.dailyRate}%</span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="mb-6 group">
                <label className="block text-lg font-semibold text-foreground/90 mb-3 group-hover:text-primary transition-colors duration-300">
                  Срок инвестирования (дней)
                </label>
                <div className="relative">
                  <Input
                    type="number"
                    value={days}
                    min={1}
                    max={365}
                    className="h-14 text-lg font-medium bg-white/50 dark:bg-gray-800/50 border-2 border-gray-200 dark:border-gray-700 rounded-xl focus:border-primary focus:ring focus:ring-primary/20 shadow-sm"
                    onChange={(e) => setDays(Number(e.target.value))}
                  />
                </div>
                <div className="mt-4 relative">
                  <Slider
                    value={[days]}
                    min={1}
                    max={365}
                    step={1}
                    className="z-10"
                    onValueChange={(value) => setDays(value[0])}
                  />
                  <div className="absolute h-2 inset-x-0 top-[7px] bg-gradient-to-r from-secondary/40 to-purple-200 rounded-full -z-10 animate-pulse animate-duration-very-slow"></div>
                </div>
                
                <div className="flex justify-between mt-2 text-sm text-foreground/60">
                  <span>1 день</span>
                  <span>365 дней</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 bg-gradient-to-br from-gray-50/80 to-white/50 dark:from-gray-800/30 dark:to-gray-900/50 rounded-2xl p-8 shadow-inner border border-white/30 dark:border-white/5 backdrop-blur-sm relative overflow-hidden group">
              {/* Декоративные элементы результатов */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-3xl -translate-x-10 -translate-y-20 group-hover:opacity-80 transition-opacity duration-700"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-full blur-3xl translate-y-20 -translate-x-10 group-hover:opacity-80 transition-opacity duration-700"></div>
              
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Результаты расчета</h3>
                
                <div className="mb-6 bg-white/40 dark:bg-gray-800/40 rounded-xl p-5 border border-white/20 dark:border-gray-700/20 shadow-sm transform hover:scale-105 transition-all duration-300 group/item">
                  <p className="text-sm text-foreground/60 mb-1">Ежедневная прибыль</p>
                  <p className="text-3xl font-extrabold text-success bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-400 group-hover/item:scale-105 transform transition-all duration-300" id="daily-profit">
                    {dailyProfit.toFixed(2)}$
                  </p>
                </div>
                
                <div className="mb-6 bg-white/40 dark:bg-gray-800/40 rounded-xl p-5 border border-white/20 dark:border-gray-700/20 shadow-sm transform hover:scale-105 transition-all duration-300 group/item">
                  <p className="text-sm text-foreground/60 mb-1">Общая прибыль за {days} {days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'}</p>
                  <p className="text-3xl font-extrabold text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary group-hover/item:scale-105 transform transition-all duration-300" id="total-profit">
                    {totalProfit.toFixed(2)}$
                  </p>
                </div>
                
                <div className="mb-8 bg-white/40 dark:bg-gray-800/40 rounded-xl p-5 border border-white/20 dark:border-gray-700/20 shadow-sm transform hover:scale-105 transition-all duration-300 group/item">
                  <p className="text-sm text-foreground/60 mb-1">Итоговая сумма</p>
                  <div className="flex items-baseline">
                    <p className="text-4xl font-extrabold group-hover/item:scale-105 transform transition-all duration-300" id="final-amount">
                      {finalAmount.toFixed(2)}$
                    </p>
                    <span className="ml-2 text-sm font-medium text-foreground/60">
                      (инвестиция + прибыль)
                    </span>
                  </div>
                </div>
                
                {isAuthenticated ? (
                  <Button
                    className="w-full py-7 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.02]"
                    asChild
                  >
                    <a href="/dashboard">Инвестировать сейчас</a>
                  </Button>
                ) : (
                  <Button
                    className="w-full py-7 bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold text-lg rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:scale-[1.02] relative overflow-hidden group/btn"
                    onClick={handleInvestClick}
                  >
                    <span className="relative z-10">Инвестировать сейчас</span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500"></span>
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
