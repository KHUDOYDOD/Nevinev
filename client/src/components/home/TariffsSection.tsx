import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { CheckIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/use-auth";

type Tariff = {
  id: number;
  name: string;
  dailyRate: number;
  minAmount: number;
  description: string;
};

export default function TariffsSection() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const isAuthenticated = !!user;
  
  // Fetch tariffs from API
  const { data: tariffs, isLoading } = useQuery<Tariff[]>({
    queryKey: ['/api/tariffs'],
  });
  
  // Handle login modal
  const handleTariffClick = () => {
    // This function would be used to navigate or open login modal
    const loginBtn = document.getElementById('login-button');
    if (loginBtn) {
      loginBtn.click();
    }
  };
  
  // Определяем разные градиенты для каждого тарифа
  const gradients = [
    'bg-gradient-to-br from-blue-500/90 to-blue-700/90', // Базовый
    'bg-gradient-to-br from-primary/90 to-accent/90',    // Премиум
    'bg-gradient-to-br from-purple-600/90 to-violet-800/90' // Элитный
  ];
  
  // Добавляем описания к тарифам
  const tariffDescriptions = [
    'Минимальный 100$ за 24 час 5%', // Базовый
    'Минимальный 500$ за 24 час 7%', // Премиум
    'Минимальный 1000$ за 24 час 10%' // Элитный
  ];
  
  if (isLoading) {
    return (
      <section id="tariffs" className="py-20 bg-gradient-to-b from-background to-gray-100 dark:from-background dark:to-gray-900/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 animate-fade-in">
            <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 backdrop-blur-sm">
              <span className="text-sm font-medium text-primary">Инвестиционные планы</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Выберите свой тариф</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Мы предлагаем различные инвестиционные планы для достижения ваших финансовых целей
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="tariff-card glassmorphism bg-white/5 backdrop-blur-md p-1 overflow-hidden">
              <Skeleton className="h-[550px] w-full" />
            </div>
            <div className="tariff-card glassmorphism bg-white/5 backdrop-blur-md p-1 overflow-hidden scale-105 md:translate-y-4">
              <Skeleton className="h-[550px] w-full" />
            </div>
            <div className="tariff-card glassmorphism bg-white/5 backdrop-blur-md p-1 overflow-hidden">
              <Skeleton className="h-[550px] w-full" />
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="tariffs" className="py-20 bg-gradient-to-b from-background to-gray-100 dark:from-background dark:to-gray-900/20 relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-secondary/5 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-1.5 mb-4 rounded-full bg-primary/10 backdrop-blur-sm">
            <span className="text-sm font-medium text-primary">Инвестиционные планы</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6 animate-fade-in">Выберите свой тариф</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto animate-fade-in animate-delay-100">
            Мы предлагаем различные инвестиционные планы для достижения ваших финансовых целей
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {tariffs?.map((tariff, index) => {
            const isPopular = index === 1; // Mark the middle one (Premium) as popular
            const animationDelay = `animate-delay-${index * 100 + 100}`;
            
            return (
              <div 
                key={tariff.id}
                className={`tariff-card glassmorphism animate-scale-in ${animationDelay} ${
                  isPopular ? 'md:scale-110 md:-translate-y-4 z-10 border-secondary/20 shadow-lg shadow-secondary/10' : 'border-white/10'
                }`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-secondary text-white font-bold py-1 px-6 rounded-full text-sm shadow-lg animate-pulse">
                      Популярный
                    </div>
                  </div>
                )}
                
                <div className={`${gradients[index]} rounded-t-xl p-6 text-white relative overflow-hidden`}>
                  {/* Декоративные элементы заголовка */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-x-10 -translate-y-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full -translate-x-12 translate-y-12"></div>
                  
                  <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-1 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white">{tariff.name}</h3>
                    <p className="text-white/80 text-sm mb-6">{tariffDescriptions[index] || 'Идеальный выбор для начинающих инвесторов'}</p>
                    
                    <div className="flex items-baseline mb-0 group">
                      <div className="relative">
                        <span className="text-6xl font-extrabold animate-pulse animate-duration-slow bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-300">{tariff.dailyRate}%</span>
                        <div className="absolute -inset-1 blur-xl opacity-30 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"></div>
                      </div>
                      <span className="text-white/90 ml-2 text-lg">/ 24ч</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 bg-white/5 backdrop-blur-sm rounded-b-xl">
                  <div className="mb-6 bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <p className="text-center">
                      <span className="block text-sm text-muted-foreground mb-1">Минимальная инвестиция</span>
                      <span className="text-2xl font-bold">{tariff.minAmount || 100}$</span>
                    </p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-secondary mr-2 flex-shrink-0" />
                      <span>Ежедневные выплаты</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-secondary mr-2 flex-shrink-0" />
                      <span>Вывод в любое время</span>
                    </li>
                    <li className="flex items-center">
                      <CheckIcon className="h-5 w-5 text-secondary mr-2 flex-shrink-0" />
                      <span>Реферальная программа</span>
                    </li>
                    {isPopular && (
                      <li className="flex items-center">
                        <CheckIcon className="h-5 w-5 text-secondary mr-2 flex-shrink-0" />
                        <span>Приоритетная поддержка</span>
                      </li>
                    )}
                    {index === 2 && (
                      <>
                        <li className="flex items-center">
                          <CheckIcon className="h-5 w-5 text-secondary mr-2 flex-shrink-0" />
                          <span>VIP поддержка 24/7</span>
                        </li>
                        <li className="flex items-center">
                          <CheckIcon className="h-5 w-5 text-secondary mr-2 flex-shrink-0" />
                          <span>Персональный инвест-менеджер</span>
                        </li>
                      </>
                    )}
                  </ul>
                  
                  <Button
                    className={`modern-button w-full py-6 ${
                      isPopular 
                        ? 'bg-secondary hover:bg-secondary/90 text-white font-bold' 
                        : 'bg-white/10 hover:bg-white/20 text-foreground font-medium border border-white/20'
                    } rounded-full shadow-lg transition-all duration-300`}
                    onClick={isAuthenticated ? () => window.location.href = "/dashboard" : handleTariffClick}
                  >
                    Выбрать тариф
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
