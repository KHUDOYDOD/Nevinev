import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  ShieldCheck, 
  TrendingUp, 
  Wallet, 
  Headphones 
} from "lucide-react";

const Advantages = () => {
  const { t } = useTranslation();
  
  const advantages = [
    {
      icon: <ShieldCheck className="text-2xl" />,
      title: t('advantages.security.title'),
      description: t('advantages.security.description'),
      bgColor: 'bg-primary-light'
    },
    {
      icon: <TrendingUp className="text-2xl" />,
      title: t('advantages.highProfitability.title'),
      description: t('advantages.highProfitability.description'),
      bgColor: 'bg-success-light'
    },
    {
      icon: <Wallet className="text-2xl" />,
      title: t('advantages.instantPayments.title'),
      description: t('advantages.instantPayments.description'),
      bgColor: 'bg-secondary-light'
    },
    {
      icon: <Headphones className="text-2xl" />,
      title: t('advantages.support.title'),
      description: t('advantages.support.description'),
      bgColor: 'bg-accent-light'
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('advantages.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('advantages.description')}</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="w-16 h-16 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                {advantage.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Advantages;
