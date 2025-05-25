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
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-gray-900/80 border-b border-white/10 shadow-lg shadow-black/5">
      <Container className="py-4">
        <div className="flex justify-between items-center">
          <Link href="/" className="flex items-center group">
            <div className="relative">
              <span className="font-extrabold text-3xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary animate-pulse animate-duration-very-slow">TRADEPO</span>
              <div className="absolute -inset-1 blur-xl opacity-30 group-hover:opacity-100 transition duration-500 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-xl -z-10"></div>
            </div>
            <div className="ml-2 hidden sm:block">
              <span className="text-sm text-foreground/70 font-medium">
                | Smart Profit System
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-1 text-sm">
            <Link 
              href="/" 
              className={`font-medium px-4 py-2 rounded-full transition-all duration-300 relative group overflow-hidden ${location === '/' ? 'text-primary' : 'text-foreground/80 hover:text-primary'}`}
            >
              <span className="relative z-10">Главная</span>
              {location === '/' && (
                <span className="absolute inset-0 bg-primary/10 rounded-full -z-10"></span>
              )}
              <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-full transition-all duration-300 -z-10"></span>
            </Link>
            <Link 
              href="/#tariffs" 
              className="font-medium px-4 py-2 rounded-full transition-all duration-300 text-foreground/80 hover:text-primary relative group overflow-hidden"
            >
              <span className="relative z-10">Тарифы</span>
              <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-full transition-all duration-300 -z-10"></span>
            </Link>
            <Link 
              href="/#how-it-works" 
              className="font-medium px-4 py-2 rounded-full transition-all duration-300 text-foreground/80 hover:text-primary relative group overflow-hidden"
            >
              <span className="relative z-10">Как это работает</span>
              <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-full transition-all duration-300 -z-10"></span>
            </Link>
            <Link 
              href="/#reviews" 
              className="font-medium px-4 py-2 rounded-full transition-all duration-300 text-foreground/80 hover:text-primary relative group overflow-hidden"
            >
              <span className="relative z-10">Отзывы</span>
              <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-full transition-all duration-300 -z-10"></span>
            </Link>
            <Link 
              href="/#contacts" 
              className="font-medium px-4 py-2 rounded-full transition-all duration-300 text-foreground/80 hover:text-primary relative group overflow-hidden"
            >
              <span className="relative z-10">Контакты</span>
              <span className="absolute inset-0 bg-primary/0 group-hover:bg-primary/10 rounded-full transition-all duration-300 -z-10"></span>
            </Link>
          </nav>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            {isAuthenticated ? (
              <Button asChild className="hidden sm:inline-flex bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-full shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105">
                <Link href="/dashboard">
                  Личный кабинет
                </Link>
              </Button>
            ) : (
              <Button asChild id="login-button" className="hidden sm:inline-flex bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-full shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 transform hover:scale-105">
                <Link href="/login">
                  Войти
                </Link>
              </Button>
            )}
            
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-300"
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
