import { useLanguage } from "@/hooks/use-language";
import { Container } from "@/components/ui/container";

export function AdvantagesSection() {
  const { t } = useLanguage();

  const advantages = [
    {
      icon: "fa-shield-alt",
      iconColor: "text-primary",
      bgColor: "bg-primary bg-opacity-10",
      title: t('advantages.security_title'),
      description: t('advantages.security_description')
    },
    {
      icon: "fa-chart-line",
      iconColor: "text-success",
      bgColor: "bg-success bg-opacity-10",
      title: t('advantages.profit_title'),
      description: t('advantages.profit_description')
    },
    {
      icon: "fa-wallet",
      iconColor: "text-secondary",
      bgColor: "bg-secondary bg-opacity-10",
      title: t('advantages.withdrawal_title'),
      description: t('advantages.withdrawal_description')
    },
    {
      icon: "fa-headset",
      iconColor: "text-accent",
      bgColor: "bg-accent bg-opacity-10",
      title: t('advantages.support_title'),
      description: t('advantages.support_description')
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('advantages.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('advantages.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {advantages.map((advantage, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition duration-300">
              <div className={`w-16 h-16 ${advantage.bgColor} rounded-full flex items-center justify-center mb-4`}>
                <i className={`fas ${advantage.icon} text-2xl ${advantage.iconColor}`}></i>
              </div>
              <h3 className="text-xl font-bold mb-3">{advantage.title}</h3>
              <p className="text-gray-600">{advantage.description}</p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
