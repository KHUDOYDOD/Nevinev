import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
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
      
      {/* Mobile menu - улучшенная версия */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-fade-in">
          <div className="bg-white/95 dark:bg-gray-900/95 h-full max-w-xs w-full ml-auto py-6 px-6 flex flex-col relative animate-slide-in-right shadow-xl">
            <div className="flex justify-between items-center mb-8">
              <div className="relative">
                <span className="font-extrabold text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">TRADEPO</span>
                <div className="absolute -inset-1 blur-lg opacity-30 bg-gradient-to-r from-primary/50 to-secondary/50 rounded-xl -z-10"></div>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleMobileMenu}
                className="text-foreground/80 hover:text-primary hover:bg-primary/10 rounded-full transition-all duration-300"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>
            
            <nav className="flex flex-col space-y-2 flex-1">
              <Link 
                href="/" 
                className={`font-medium px-4 py-3 rounded-xl transition-all duration-300 ${
                  location === '/' ? 'bg-primary/10 text-primary' : 'text-foreground/80 hover:bg-primary/5 hover:text-primary'
                } group animate-fade-in animate-delay-100`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="flex items-center">
                  <span className="relative group-hover:translate-x-1 transition-transform duration-300">Главная</span>
                  {location === '/' && (
                    <span className="ml-2 w-1.5 h-1.5 rounded-full bg-primary"></span>
                  )}
                </div>
              </Link>
              <Link 
                href="/#tariffs" 
                className="font-medium px-4 py-3 rounded-xl text-foreground/80 hover:bg-primary/5 hover:text-primary transition-all duration-300 group animate-fade-in animate-delay-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative group-hover:translate-x-1 transition-transform duration-300">Тарифы</span>
              </Link>
              <Link 
                href="/#how-it-works" 
                className="font-medium px-4 py-3 rounded-xl text-foreground/80 hover:bg-primary/5 hover:text-primary transition-all duration-300 group animate-fade-in animate-delay-300"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative group-hover:translate-x-1 transition-transform duration-300">Как это работает</span>
              </Link>
              <Link 
                href="/#reviews" 
                className="font-medium px-4 py-3 rounded-xl text-foreground/80 hover:bg-primary/5 hover:text-primary transition-all duration-300 group animate-fade-in animate-delay-400"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative group-hover:translate-x-1 transition-transform duration-300">Отзывы</span>
              </Link>
              <Link 
                href="/#contacts" 
                className="font-medium px-4 py-3 rounded-xl text-foreground/80 hover:bg-primary/5 hover:text-primary transition-all duration-300 group animate-fade-in animate-delay-500"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative group-hover:translate-x-1 transition-transform duration-300">Контакты</span>
              </Link>
            </nav>
            
            <div className="mt-auto pt-6 border-t border-gray-100 dark:border-gray-800 animate-fade-in animate-delay-600">
              {isAuthenticated ? (
                <Button
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 py-6"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/dashboard";
                  }}
                >
                  Личный кабинет
                </Button>
              ) : (
                <Button
                  className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-bold rounded-xl shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 py-6"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    window.location.href = "/login";
                  }}
                >
                  Войти
                </Button>
              )}
              
              <div className="flex justify-center mt-4">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
