import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

interface Tariff {
  id: number;
  type: string;
  name: string;
  interestRate: number;
  minInvestment: number;
  referralBonus: number;
  isActive: boolean;
}

const Tariffs = () => {
  const { t } = useTranslation();
  const { user } = useAuth();

  const { data: tariffs } = useQuery<Tariff[]>({
    queryKey: ['/api/tariffs'],
  });

  const defaultTariffs = [
    {
      id: 1,
      type: "basic",
      name: t('tariffs.basic.title'),
      interestRate: 5,
      minInvestment: 100,
      referralBonus: 0.1,
      isActive: true,
      features: t('tariffs.basic.features', { returnObjects: true }) as string[],
      isPopular: false
    },
    {
      id: 2,
      type: "premium",
      name: t('tariffs.premium.title'),
      interestRate: 10,
      minInvestment: 500,
      referralBonus: 0.15,
      isActive: true,
      features: t('tariffs.premium.features', { returnObjects: true }) as string[],
      isPopular: true
    },
    {
      id: 3,
      type: "elite",
      name: t('tariffs.elite.title'),
      interestRate: 15,
      minInvestment: 1000,
      referralBonus: 0.2,
      isActive: true,
      features: t('tariffs.elite.features', { returnObjects: true }) as string[],
      isPopular: false
    }
  ];

  // Merge server tariffs with UI data if available
  const displayTariffs = tariffs 
    ? tariffs.map(tariff => {
        const uiTariff = defaultTariffs.find(dt => dt.type === tariff.type);
        return {
          ...tariff,
          features: uiTariff?.features || [],
          isPopular: tariff.type === "premium"
        };
      })
    : defaultTariffs;

  return (
    <section id="tariffs" className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('tariffs.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('tariffs.description')}</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayTariffs.map((tariff, index) => (
            <motion.div
              key={tariff.id}
              className={`bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:translate-y-[-0.5rem] ${
                tariff.isPopular ? 'relative md:scale-105 md:z-10' : ''
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              {tariff.isPopular && (
                <div className="absolute top-0 right-0">
                  <div className="bg-accent text-primary font-bold py-1 px-4 rounded-bl-lg text-sm">
                    {t('tariffs.premium.popular')}
                  </div>
                </div>
              )}
              <div className="p-8">
                <h3 className="text-2xl font-bold mb-2">{tariff.name}</h3>
                <p className="text-gray-500 mb-6">
                  {tariff.type === 'basic' 
                    ? t('tariffs.basic.description') 
                    : tariff.type === 'premium'
                    ? t('tariffs.premium.description')
                    : t('tariffs.elite.description')}
                </p>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-primary">{tariff.interestRate}%</span>
                  <span className="text-gray-500 ml-2">/ 24ч</span>
                </div>
                <p className="text-gray-600 mb-6">
                  {t('tariffs.basic.minInvestment')} <span className="font-bold">${tariff.minInvestment}</span>
                </p>
                <ul className="space-y-3 mb-8">
                  {tariff.features.map((feature, i) => (
                    <li key={i} className="flex items-center">
                      <Check className="text-success mr-2 h-5 w-5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  asChild
                  variant={tariff.isPopular ? "default" : "outline"}
                  className={`w-full ${tariff.isPopular ? 'bg-primary text-white' : 'border-primary text-primary hover:bg-primary hover:text-white'}`}
                >
                  <Link href={user ? "/dashboard" : "/login"}>
                    {t('tariffs.basic.button')}
                  </Link>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Tariffs;
