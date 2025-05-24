import { useMemo } from "react";
import { Link } from "wouter";
import { useLanguage } from "@/hooks/use-language";
import { useAuth } from "@/hooks/use-auth";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { Tariff } from "@/lib/types";

interface TariffsSectionProps {
  tariffs: Tariff[];
}

export function TariffsSection({ tariffs }: TariffsSectionProps) {
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  const sortedTariffs = useMemo(() => {
    return [...tariffs].sort((a, b) => {
      return parseFloat(a.minAmount.toString()) - parseFloat(b.minAmount.toString());
    });
  }, [tariffs]);
  
  const getBackgroundClass = (index: number, total: number) => {
    if (index === Math.floor(total / 2)) {
      return "bg-primary/5 border-2 border-primary";
    }
    return "bg-white border border-gray-100";
  };
  
  const getButtonClass = (index: number, total: number) => {
    if (index === Math.floor(total / 2)) {
      return "bg-primary text-white shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30";
    }
    return "border-2 border-primary text-primary hover:bg-primary hover:text-white";
  };
  
  if (!sortedTariffs.length) return null;
  
  return (
    <section id="tariffs" className="py-16 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('tariffs.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('tariffs.subtitle')}</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {sortedTariffs.map((tariff, index) => {
            const dailyPercent = parseFloat(tariff.dailyPercent.toString());
            const minAmount = parseFloat(tariff.minAmount.toString());
            
            return (
              <div key={tariff.id} className="transform transition-all duration-300 card-hover">
                <div className={`rounded-xl shadow-lg overflow-hidden h-full transition-transform duration-300 ${getBackgroundClass(index, sortedTariffs.length)}`}>
                  {index === Math.floor(sortedTariffs.length / 2) && (
                    <div className="absolute top-0 right-0">
                      <div className="bg-accent text-primary font-bold py-1 px-4 rounded-bl-lg text-sm">
                        {t('tariffs.popular')}
                      </div>
                    </div>
                  )}
                  
                  <div className={`p-6 ${index === Math.floor(sortedTariffs.length / 2) ? 'pt-8 border-b border-primary/10' : 'bg-gray-50 border-b border-gray-100'}`}>
                    <div className="text-lg text-primary font-medium mb-1">
                      {t(`tariffs.${tariff.name.toLowerCase()}`)}
                    </div>
                    <div className="flex items-baseline">
                      <span className="text-4xl font-bold mr-2">{dailyPercent}%</span>
                      <span className="text-gray-500">/ {t('tariffs.per_day')}</span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center">
                        <Check className="text-green-500 mr-2 h-5 w-5" />
                        <span>
                          {t('tariffs.min_deposit')}: <strong>${minAmount.toFixed(0)}</strong>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Check className="text-green-500 mr-2 h-5 w-5" />
                        <span>
                          {t('tariffs.profit')}: <strong>{dailyPercent}% {t('tariffs.daily')}</strong>
                        </span>
                      </li>
                      <li className="flex items-center">
                        <Check className="text-green-500 mr-2 h-5 w-5" />
                        <span>{t('tariffs.daily_payments')}</span>
                      </li>
                      <li className="flex items-center">
                        <Check className="text-green-500 mr-2 h-5 w-5" />
                        <span>{t('tariffs.referral_program')}</span>
                      </li>
                      {index >= 1 && (
                        <li className="flex items-center">
                          <Check className="text-green-500 mr-2 h-5 w-5" />
                          <span>{t('tariffs.priority_support')}</span>
                        </li>
                      )}
                      {index >= 2 && (
                        <li className="flex items-center">
                          <Check className="text-green-500 mr-2 h-5 w-5" />
                          <span>{t('tariffs.vip_support')}</span>
                        </li>
                      )}
                    </ul>
                    
                    <Button 
                      asChild
                      className={`w-full ${getButtonClass(index, sortedTariffs.length)}`}
                    >
                      <Link href={isAuthenticated ? "/dashboard/deposits" : "/login"}>
                        {t('tariffs.choose_plan')}
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
