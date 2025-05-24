import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import AdminDashboard from "@/components/dashboard/AdminDashboard";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

export default function Admin() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading, isAdmin } = useAuth();
  
  // Check authentication and admin status
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    } else if (!isLoading && isAuthenticated && !isAdmin) {
      navigate("/dashboard");
    }
  }, [isAuthenticated, isLoading, isAdmin, navigate]);
  
  // Set the page title
  useEffect(() => {
    document.title = t('admin.pageTitle') + " | TRADEPO";
  }, [t]);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated || !isAdmin) {
    return null; // Will redirect in useEffect
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow bg-gray-50">
        <AdminDashboard />
      </main>
      <Footer />
    </div>
  );
}
