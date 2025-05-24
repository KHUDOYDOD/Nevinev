import { useTranslation } from "react-i18next";

export default function HowItWorksSection() {
  const { t } = useTranslation();
  
  const steps = [
    {
      number: 1,
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      icon: "user-plus",
    },
    {
      number: 2,
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      icon: "wallet",
    },
    {
      number: 3,
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      icon: "hand-holding-dollar",
    },
    {
      number: 4,
      title: t('howItWorks.step4.title'),
      description: t('howItWorks.step4.description'),
      icon: "money-bill-transfer",
      isLast: true,
    },
  ];
  
  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('howItWorks.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('howItWorks.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative">
              <div className="bg-gray-50 rounded-xl p-8 h-full relative z-10 card-hover transition duration-300">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6">
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {!step.isLast && (
                <div className="hidden lg:block absolute top-10 right-0 w-full h-1 border-t-2 border-dashed border-gray-300 z-0" style={{ width: "calc(100% - 3rem)", left: "calc(100% - 1.5rem)" }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
