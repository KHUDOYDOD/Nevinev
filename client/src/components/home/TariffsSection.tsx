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
  
  if (isLoading) {
    return (
      <section id="tariffs" className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('tariffs.title')}</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">{t('tariffs.subtitle')}</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Skeleton className="h-[500px] w-full" />
            <Skeleton className="h-[500px] w-full" />
            <Skeleton className="h-[500px] w-full" />
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section id="tariffs" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('tariffs.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('tariffs.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tariffs?.map((tariff, index) => {
            const isPopular = index === 1; // Mark the middle one (Premium) as popular
            
            return (
              <div 
                key={tariff.id}
                className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-2 ${
                  isPopular ? 'relative' : ''
                }`}
              >
                {isPopular && (
                  <div className="absolute top-0 right-0">
                    <div className="bg-accent text-primary font-bold py-1 px-4 rounded-bl-lg text-sm">
                      {t('tariffs.popular')}
                    </div>
                  </div>
                )}
                
                <div className="p-8">
                  <h3 className="text-2xl font-bold mb-2">{tariff.name}</h3>
                  <p className="text-gray-500 mb-6">{tariff.description}</p>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold text-primary">{tariff.dailyRate}%</span>
                    <span className="text-gray-500 ml-2">/ 24{t('tariffs.hours')}</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    {t('tariffs.minInvestment')}: <span className="font-bold">${tariff.minAmount}</span>
                  </p>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-success mr-2"></i>
                      <span>{t('tariffs.features.dailyPayouts')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-success mr-2"></i>
                      <span>{t('tariffs.features.withdrawAnytime')}</span>
                    </li>
                    <li className="flex items-center">
                      <i className="fas fa-check-circle text-success mr-2"></i>
                      <span>{t('tariffs.features.referralProgram')}</span>
                    </li>
                    {isPopular && (
                      <li className="flex items-center">
                        <i className="fas fa-check-circle text-success mr-2"></i>
                        <span>{t('tariffs.features.prioritySupport')}</span>
                      </li>
                    )}
                    {index === 2 && (
                      <>
                        <li className="flex items-center">
                          <i className="fas fa-check-circle text-success mr-2"></i>
                          <span>{t('tariffs.features.vipSupport')}</span>
                        </li>
                        <li className="flex items-center">
                          <i className="fas fa-check-circle text-success mr-2"></i>
                          <span>{t('tariffs.features.personalManager')}</span>
                        </li>
                      </>
                    )}
                  </ul>
                  <Button
                    className={`w-full ${
                      isPopular 
                        ? 'bg-primary text-white hover:bg-primary-dark' 
                        : 'bg-white border border-primary text-primary hover:bg-primary hover:text-white'
                    }`}
                    onClick={isAuthenticated ? () => window.location.href = "/dashboard" : handleTariffClick}
                  >
                    {t('tariffs.chooseTariff')}
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
