import { useTranslation } from "react-i18next";

export default function AdvantagesSection() {
  const { t } = useTranslation();
  
  const advantages = [
    {
      icon: "shield-alt",
      title: t('advantages.security.title'),
      description: t('advantages.security.description'),
      color: "primary",
    },
    {
      icon: "chart-line",
      title: t('advantages.highProfit.title'),
      description: t('advantages.highProfit.description'),
      color: "success",
    },
    {
      icon: "wallet",
      title: t('advantages.instantPayouts.title'),
      description: t('advantages.instantPayouts.description'),
      color: "secondary",
    },
    {
      icon: "headset",
      title: t('advantages.support.title'),
      description: t('advantages.support.description'),
      color: "accent",
    },
  ];
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('advantages.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('advantages.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className={`w-16 h-16 bg-${advantage.color} bg-opacity-10 rounded-full flex items-center justify-center mb-4`}>
                <i className={`fas fa-${advantage.icon} text-2xl text-${advantage.color}`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
