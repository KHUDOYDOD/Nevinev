import { useTranslation } from "react-i18next";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import CalculatorSection from "@/components/home/CalculatorSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import TariffsSection from "@/components/home/TariffsSection";
import ActivitySection from "@/components/home/ActivitySection";
import AdvantagesSection from "@/components/home/AdvantagesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import ContactSection from "@/components/home/ContactSection";
import WhyChooseUsSection from "@/components/home/WhyChooseUsSection";
import HowToStartSection from "@/components/home/HowToStartSection";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

export default function Home() {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { isAuthenticated, isAdmin } = useAuth();
  
  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (isAuthenticated) {
      if (isAdmin) {
        window.location.href = "/admin";
      } else {
        window.location.href = "/dashboard";
      }
    }
  }, [isAuthenticated, isAdmin]);
  
  // Set the page title
  useEffect(() => {
    document.title = "TRADEPO | Smart Profit System";
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <StatsSection />
        <WhyChooseUsSection />
        <HowToStartSection />
        <CalculatorSection />
        <TariffsSection />
        <HowItWorksSection />
        <ActivitySection />
        <AdvantagesSection />
        <TestimonialsSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
}
