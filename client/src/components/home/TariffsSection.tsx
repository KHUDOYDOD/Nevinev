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
      {/* Улучшенные декоративные элементы фона */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse animate-duration-very-slow"></div>
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse animate-duration-slow"></div>
      <div className="absolute top-1/3 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl animate-float-rotate animate-duration-very-slow"></div>
      <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-float animate-duration-slow"></div>
      
      {/* Декоративные частицы */}
      <div className="absolute top-1/4 left-1/3 w-2 h-2 bg-blue-400 rounded-full animate-float animate-duration-slow opacity-40"></div>
      <div className="absolute top-1/2 right-1/3 w-1 h-1 bg-purple-400 rounded-full animate-float-sideways animate-duration-slow opacity-40"></div>
      <div className="absolute bottom-1/4 left-1/2 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-float-rotate animate-duration-slow opacity-40"></div>
      <div className="absolute bottom-1/2 right-1/4 w-2 h-2 bg-green-400 rounded-full animate-float animate-duration-very-slow opacity-40"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-5 py-2 mb-6 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 backdrop-blur-sm shadow-lg shadow-primary/5">
            <span className="text-sm font-semibold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">Инвестиционные планы</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 leading-tight">
            Выберите свой <span className="relative inline-block">
              <span className="relative z-10">тариф</span>
              <span className="absolute bottom-2 left-0 w-full h-3 bg-primary/20 rounded-full -z-10 transform skew-x-12"></span>
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg animate-fade-in animate-delay-100 leading-relaxed">
            Мы предлагаем различные инвестиционные планы для достижения ваших финансовых целей, выбирайте оптимальный вариант и начинайте зарабатывать прямо сейчас
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {tariffs?.map((tariff, index) => {
            const isPopular = index === 1; // Mark the middle one (Premium) as popular
            const animationDelay = `animate-delay-${index * 100 + 100}`;
            
            return (
              <div 
                key={tariff.id}
                className={`tariff-card group animate-scale-in ${animationDelay} 
                  ${isPopular 
                    ? 'md:scale-110 md:-translate-y-4 z-10 relative border border-secondary/30 rounded-2xl shadow-xl shadow-secondary/20' 
                    : 'border border-white/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500'
                  }`}
              >
                {/* Эффект свечения для карточки */}
                <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10 blur-xl ${
                  isPopular ? 'bg-secondary/20' : index === 0 ? 'bg-blue-500/20' : 'bg-purple-600/20'
                }`}></div>
                
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                    <div className="bg-gradient-to-r from-secondary to-primary text-white font-bold py-1.5 px-8 rounded-full text-sm shadow-lg animate-pulse animate-duration-slow flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      <span>Популярный</span>
                    </div>
                  </div>
                )}
                
                <div className={`${gradients[index]} rounded-t-2xl p-8 text-white relative overflow-hidden group-hover:shadow-lg transition-all duration-500`}>
                  {/* Улучшенные декоративные элементы заголовка */}
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-x-10 -translate-y-16 group-hover:bg-white/15 transition-all duration-500"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-12 translate-y-12 group-hover:bg-white/15 transition-all duration-500"></div>
                  
                  {/* Анимированные частицы внутри карточки */}
                  <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-white rounded-full animate-float opacity-70"></div>
                  <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-white rounded-full animate-float-sideways opacity-70"></div>
                  
                  <div className="relative z-10 text-center">
                    <h3 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-200 to-white inline-block">{tariff.name}</h3>
                    <div className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6 inline-block">
                      <p className="text-white/90 text-sm">{tariffDescriptions[index] || 'Идеальный выбор для начинающих инвесторов'}</p>
                    </div>
                    
                    <div className="flex items-baseline justify-center mb-2 group/rate">
                      <div className="relative">
                        <span className="text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 group-hover/rate:scale-110 transition-transform duration-300">{tariff.dailyRate}%</span>
                        <div className="absolute -inset-1 blur-xl opacity-30 group-hover/rate:opacity-100 transition duration-500 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl"></div>
                      </div>
                      <span className="text-white/90 ml-3 text-xl">/ 24ч</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-8 bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-sm rounded-b-2xl">
                  <div className="mb-8 bg-gradient-to-br from-white/10 to-white/15 backdrop-blur-sm rounded-xl p-5 border border-white/5 shadow-inner transform hover:scale-105 transition-transform duration-300">
                    <p className="text-center">
                      <span className="block text-sm text-white/60 mb-1">Минимальная инвестиция</span>
                      <span className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">{tariff.minAmount || 100}$</span>
                    </p>
                  </div>
                  
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-center group/item transition-all duration-300 hover:translate-x-1">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3 group-hover/item:bg-secondary/30 transition-colors duration-300">
                        <CheckIcon className="h-4 w-4 text-secondary" />
                      </div>
                      <span className="text-foreground/90">Ежедневные выплаты</span>
                    </li>
                    <li className="flex items-center group/item transition-all duration-300 hover:translate-x-1">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3 group-hover/item:bg-secondary/30 transition-colors duration-300">
                        <CheckIcon className="h-4 w-4 text-secondary" />
                      </div>
                      <span className="text-foreground/90">Вывод в любое время</span>
                    </li>
                    <li className="flex items-center group/item transition-all duration-300 hover:translate-x-1">
                      <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3 group-hover/item:bg-secondary/30 transition-colors duration-300">
                        <CheckIcon className="h-4 w-4 text-secondary" />
                      </div>
                      <span className="text-foreground/90">Реферальная программа</span>
                    </li>
                    {isPopular && (
                      <li className="flex items-center group/item transition-all duration-300 hover:translate-x-1">
                        <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3 group-hover/item:bg-secondary/30 transition-colors duration-300">
                          <CheckIcon className="h-4 w-4 text-secondary" />
                        </div>
                        <span className="text-foreground/90">Приоритетная поддержка</span>
                      </li>
                    )}
                    {index === 2 && (
                      <>
                        <li className="flex items-center group/item transition-all duration-300 hover:translate-x-1">
                          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3 group-hover/item:bg-secondary/30 transition-colors duration-300">
                            <CheckIcon className="h-4 w-4 text-secondary" />
                          </div>
                          <span className="text-foreground/90">VIP поддержка 24/7</span>
                        </li>
                        <li className="flex items-center group/item transition-all duration-300 hover:translate-x-1">
                          <div className="w-8 h-8 rounded-full bg-secondary/20 flex items-center justify-center mr-3 group-hover/item:bg-secondary/30 transition-colors duration-300">
                            <CheckIcon className="h-4 w-4 text-secondary" />
                          </div>
                          <span className="text-foreground/90">Персональный инвест-менеджер</span>
                        </li>
                      </>
                    )}
                  </ul>
                  
                  <Button
                    className={`w-full py-7 relative overflow-hidden group-hover:shadow-xl transition-all duration-500 ${
                      isPopular 
                        ? 'bg-gradient-to-r from-secondary to-primary hover:to-secondary text-white font-bold text-lg' 
                        : 'bg-gradient-to-r from-white/10 to-white/20 hover:from-white/15 hover:to-white/25 text-foreground font-medium border border-white/10 text-lg'
                    } rounded-xl shadow-lg transform hover:scale-105 hover:shadow-2xl`}
                    onClick={isAuthenticated ? () => window.location.href = "/dashboard" : handleTariffClick}
                  >
                    <span className="relative z-10">Выбрать тариф</span>
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></span>
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
