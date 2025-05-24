import { useLanguage } from "@/hooks/use-language";
import { Container } from "@/components/ui/container";

export function HowItWorksSection() {
  const { t } = useLanguage();

  const steps = [
    {
      number: 1,
      icon: "fa-user-plus",
      title: t('how_it_works.step1_title'),
      description: t('how_it_works.step1_description')
    },
    {
      number: 2,
      icon: "fa-dollar-sign",
      title: t('how_it_works.step2_title'),
      description: t('how_it_works.step2_description')
    },
    {
      number: 3,
      icon: "fa-hand-holding-dollar",
      title: t('how_it_works.step3_title'),
      description: t('how_it_works.step3_description')
    },
    {
      number: 4,
      icon: "fa-money-bill-transfer",
      title: t('how_it_works.step4_title'),
      description: t('how_it_works.step4_description')
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('how_it_works.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('how_it_works.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              <div className="bg-gray-50 rounded-xl p-8 h-full relative z-10 card-hover transition duration-300">
                <div className={`w-16 h-16 ${step.number === 4 ? 'bg-success' : 'bg-primary'} text-white rounded-full flex items-center justify-center text-2xl font-bold mb-6`}>
                  {step.number}
                </div>
                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 right-0 w-full h-1 border-t-2 border-dashed border-gray-300 z-0" style={{width: 'calc(100% - 3rem)', left: 'calc(100% - 1.5rem)'}}></div>
              )}
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
