import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet";
import { useLanguage } from "@/hooks/use-language";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { InvestmentCalculator } from "@/components/ui/investment-calculator";
import { HowItWorksSection } from "@/components/sections/how-it-works-section";
import { TariffsSection } from "@/components/sections/tariffs-section";
import { ActivitySection } from "@/components/sections/activity-section";
import { AdvantagesSection } from "@/components/sections/advantages-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { ContactSection } from "@/components/sections/contact-section";
import { Container } from "@/components/ui/container";
import { Tariff } from "@/lib/types";

export default function Home() {
  const { t, language } = useLanguage();
  
  const { data: tariffsData } = useQuery<{ tariffs: Tariff[] }>({
    queryKey: ['/api/tariffs/active'],
  });
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <>
      <Helmet>
        <title>TRADEPO | Smart Profit System</title>
        <meta name="description" content="Инвестиционная платформа с фиксированной ставкой доходности до 15% в сутки" />
        <meta property="og:title" content="TRADEPO | Smart Profit System" />
        <meta property="og:description" content="Инвестиционная платформа с фиксированной ставкой доходности до 15% в сутки" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tradepo.ru" />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        />
      </Helmet>
      
      <Header />
      
      <main>
        <HeroSection />
        
        <StatsSection />
        
        <section id="calculator" className="py-16 bg-white">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">{t('calculator.title')}</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t('calculator.subtitle')}</p>
            </div>
            
            {tariffsData?.tariffs && tariffsData.tariffs.length > 0 ? (
              <InvestmentCalculator tariffs={tariffsData.tariffs} />
            ) : (
              <div className="text-center py-8">
                <p>Loading calculator...</p>
              </div>
            )}
          </Container>
        </section>
        
        <HowItWorksSection />
        
        {tariffsData?.tariffs && tariffsData.tariffs.length > 0 && (
          <TariffsSection tariffs={tariffsData.tariffs} />
        )}
        
        <ActivitySection />
        
        <AdvantagesSection />
        
        <TestimonialsSection />
        
        <ContactSection />
      </main>
      
      <Footer />
    </>
  );
}
