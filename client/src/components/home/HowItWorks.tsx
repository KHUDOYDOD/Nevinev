import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";

const HowItWorks = () => {
  const { t } = useTranslation();
  
  const steps = [
    {
      number: 1,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      icon: "fas fa-user-plus",
      isLast: false,
    },
    {
      number: 2,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      icon: "fas fa-wallet",
      isLast: false,
    },
    {
      number: 3,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      icon: "fas fa-hand-holding-dollar",
      isLast: false,
    },
    {
      number: 4,
      title: t('howItWorks.step4.title'),
      description: t('howItWorks.step4.description'),
      icon: "fas fa-money-bill-transfer",
      isLast: true,
    },
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('howItWorks.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('howItWorks.description')}</p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <motion.div 
              key={step.number}
              className="relative"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-gray-50 rounded-xl p-8 h-full relative z-10 card-hover transition duration-300">
                <div className={`w-16 h-16 ${step.number === 4 ? 'bg-success' : 'bg-primary'} text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {!step.isLast && (
                <div className="hidden lg:block absolute top-10 right-0 w-full h-1 border-t-2 border-dashed border-gray-300 z-0" style={{ width: 'calc(100% - 3rem)', left: 'calc(100% - 1.5rem)' }}></div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
