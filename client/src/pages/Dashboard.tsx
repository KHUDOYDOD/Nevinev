import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import UserDashboard from "@/components/dashboard/UserDashboard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Dashboard() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  
  // Check authentication and redirect if needed
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    } else if (!isLoading && isAuthenticated && isAdmin) {
      navigate("/admin");
    }
  }, [isAuthenticated, isLoading, isAdmin, navigate]);
  
  // Set the page title
  useEffect(() => {
    document.title = t('dashboard.pageTitle') + " | TRADEPO";
  }, [t]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <UserDashboard />
      </main>
      <Footer />
    </div>
  );
}
