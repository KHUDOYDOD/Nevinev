import { ReactNode, useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { LanguageSelector } from '@/components/ui/language-selector';
import { useAuth } from '@/hooks/use-auth';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { user } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const navItems = [
    { href: '/', label: t('nav.home') },
    { href: '/#tariffs', label: t('nav.tariffs') },
    { href: '/#how-it-works', label: t('nav.howItWorks') },
    { href: '/#reviews', label: t('nav.reviews') },
    { href: '/#contacts', label: t('nav.contacts') },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 bg-white dark:bg-gray-900 shadow-md z-50">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <Logo />
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6 text-sm">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className={`font-medium ${
                  location === item.href ? 'text-primary' : 'text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition'
                }`}>
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
          
          <div className="flex items-center space-x-4">
            {/* Language Selector */}
            <LanguageSelector />
            
            {/* Login/Dashboard Button */}
            {user ? (
              <Button asChild>
                <Link href="/dashboard">
                  <a>{t('nav.dashboard')}</a>
                </Link>
              </Button>
            ) : (
              <Button asChild variant="outline">
                <Link href="/login">
                  <a>{t('nav.login')}</a>
                </Link>
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="py-6">
                    <Logo className="mb-6" />
                    <nav className="flex flex-col space-y-4">
                      {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a className="font-medium py-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition">
                            {item.label}
                          </a>
                        </Link>
                      ))}
                      {user ? (
                        <Link href="/dashboard">
                          <a className="font-medium py-2 text-primary transition">
                            {t('nav.dashboard')}
                          </a>
                        </Link>
                      ) : (
                        <Link href="/login">
                          <a className="font-medium py-2 text-primary transition">
                            {t('nav.login')}
                          </a>
                        </Link>
                      )}
                    </nav>
                  </div>
                  <div className="mt-auto pb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {t('common.language')}
                      </span>
                      <LanguageSelector />
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <Logo variant="white" className="mb-4" />
              <p className="mb-4 text-gray-400">{t('footer.description')}</p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-telegram text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-vk text-xl"></i>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">{t('footer.quickLinks')}</h3>
              <ul className="space-y-3">
                {navItems.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <a className="text-gray-400 hover:text-white transition">{item.label}</a>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">{t('footer.legal')}</h3>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-400 hover:text-white transition">{t('footer.legal.terms')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">{t('footer.legal.privacy')}</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">{t('footer.legal.investment')}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-6">{t('footer.contact')}</h3>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <i className="fas fa-envelope text-primary mr-3"></i>
                  <span>support@tradepo.ru</span>
                </li>
                <li className="flex items-center">
                  <i className="fab fa-telegram text-primary mr-3"></i>
                  <span>@tradepo_support</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">{t('footer.copyright')}</p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Русский</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">English</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Тоҷикӣ</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">Қазақша</a>
              <a href="#" className="text-gray-400 hover:text-white transition text-sm">O'zbekcha</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Fixed login/register button for mobile */}
      <div className="fixed bottom-4 inset-x-0 flex justify-center md:hidden z-50">
        {user ? (
          <Button asChild className="px-6 py-3 rounded-full shadow-lg">
            <Link href="/dashboard">
              <a>{t('nav.dashboard')}</a>
            </Link>
          </Button>
        ) : (
          <Button asChild className="px-6 py-3 rounded-full shadow-lg">
            <Link href="/login">
              <a>{t('nav.login')}</a>
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
