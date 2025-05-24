import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Container } from "@/components/ui/container";
import { Menu, X } from "lucide-react";

export function Header() {
  const { t } = useLanguage();
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  
  return (
    <header className="sticky top-0 bg-white shadow-md z-50">
      <Container className="py-3">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center">
            <span className="font-bold text-2xl text-primary">TRADEPO</span>
            <span className="text-sm text-gray-500 ml-2 hidden sm:inline">
              | Smart Profit System
            </span>
          </Link>
          
          <nav className="hidden md:flex space-x-6 text-sm">
            <Link 
              href="/" 
              className={`font-medium ${location === '/' ? 'text-primary' : 'text-gray-600 hover:text-primary'} transition`}
            >
              {t('nav.home')}
            </Link>
            <Link 
              href="/#tariffs" 
              className="font-medium text-gray-600 hover:text-primary transition"
            >
              {t('nav.tariffs')}
            </Link>
            <Link 
              href="/#how-it-works" 
              className="font-medium text-gray-600 hover:text-primary transition"
            >
              {t('nav.how_it_works')}
            </Link>
            <Link 
              href="/#reviews" 
              className="font-medium text-gray-600 hover:text-primary transition"
            >
              {t('nav.reviews')}
            </Link>
            <Link 
              href="/#contacts" 
              className="font-medium text-gray-600 hover:text-primary transition"
            >
              {t('nav.contacts')}
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {isAuthenticated ? (
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/dashboard">
                  {t('nav.dashboard')}
                </Link>
              </Button>
            ) : (
              <Button asChild className="hidden sm:inline-flex">
                <Link href="/login">
                  {t('nav.login')}
                </Link>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleMobileMenu}
            >
              <Menu className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </Container>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white py-4 px-4 border-t border-gray-100">
          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
              <X className="h-6 w-6" />
            </Button>
          </div>
          <nav className="flex flex-col space-y-4">
            <Link 
              href="/" 
              className="font-medium text-gray-600 hover:text-primary transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.home')}
            </Link>
            <Link 
              href="/#tariffs" 
              className="font-medium text-gray-600 hover:text-primary transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.tariffs')}
            </Link>
            <Link 
              href="/#how-it-works" 
              className="font-medium text-gray-600 hover:text-primary transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.how_it_works')}
            </Link>
            <Link 
              href="/#reviews" 
              className="font-medium text-gray-600 hover:text-primary transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.reviews')}
            </Link>
            <Link 
              href="/#contacts" 
              className="font-medium text-gray-600 hover:text-primary transition py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('nav.contacts')}
            </Link>
            
            {isAuthenticated ? (
              <Link 
                href="/dashboard"
                className="font-medium text-primary hover:text-primary/80 transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.dashboard')}
              </Link>
            ) : (
              <Link 
                href="/login"
                className="font-medium text-primary hover:text-primary/80 transition py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('nav.login')}
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
