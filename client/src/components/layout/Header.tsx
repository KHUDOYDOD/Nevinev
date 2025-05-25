import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, ChevronDown, ChevronRight, User, Globe, LogOut, Moon, Sun } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  // Отслеживание скролла для изменения стиля хедера
  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 20;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrolled]);

  const menuItems = [
    { href: "/", label: "Главная" },
    { href: "#tariffs", label: "Тарифы" },
    { href: "#how-it-works", label: "Как начать" },
    { href: "#reviews", label: "Отзывы" },
    { href: "#contacts", label: "Контакты" },
  ];

  return (
    <motion.header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled 
          ? "bg-gradient-to-r from-indigo-900/95 via-purple-900/95 to-blue-900/95 backdrop-blur-md shadow-lg py-2" 
          : "bg-transparent py-4"
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        {/* Логотип с анимацией */}
        <Link href="/">
          <motion.div 
            className="flex items-center"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <motion.span 
              className="font-bold text-2xl bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent"
              animate={{
                textShadow: [
                  "0 0 5px rgba(217, 70, 239, 0.5)",
                  "0 0 15px rgba(217, 70, 239, 0.8)",
                  "0 0 5px rgba(217, 70, 239, 0.5)"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              TRADEPO
            </motion.span>
            <motion.div 
              className="flex items-center ml-2 text-sm text-white/90"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <span className="hidden sm:inline mr-1">|</span>
              <span className="hidden sm:inline">Smart Profit System</span>
            </motion.div>
          </motion.div>
        </Link>

        {/* Десктопная навигация с анимацией */}
        <nav className="hidden md:flex space-x-1">
          {menuItems.map((item, index) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.05 }}
            >
              <a
                href={item.href}
                className={`relative px-4 py-2 font-medium rounded-full text-sm transition-all ${
                  location === item.href
                    ? "text-white"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {location === item.href && (
                  <motion.span
                    className="absolute inset-0 bg-white/10 rounded-full -z-10"
                    layoutId="activeNavItem"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                {item.label}
              </a>
            </motion.div>
          ))}
        </nav>

        {/* Правая часть с кнопками */}
        <div className="flex items-center space-x-2">
          {/* Переключатель темы */}
          <motion.button
            className="p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? (
              <Sun className="h-5 w-5" />
            ) : (
              <Moon className="h-5 w-5" />
            )}
          </motion.button>
          
          {/* Переключатель языка */}
          <LanguageSwitcher />

          {/* Кнопки авторизации/личный кабинет */}
          <AnimatePresence>
            {user ? (
              <motion.div 
                className="flex items-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <motion.div
                  className="relative group"
                  whileHover={{ scale: 1.05 }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-white/10 text-white hover:bg-white/20 rounded-full hidden sm:flex px-4"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="mr-1">Кабинет</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                  
                  {/* Выпадающее меню */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-gradient-to-b from-indigo-800/95 to-purple-900/95 backdrop-blur-lg rounded-xl border border-white/10 shadow-xl overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100">
                    <div className="py-2 px-1">
                      <Link href="/dashboard">
                        <motion.a 
                          className="flex items-center w-full px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                          whileHover={{ x: 5 }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Личный кабинет
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </motion.a>
                      </Link>
                      
                      {user.role === "admin" && (
                        <Link href="/admin">
                          <motion.a 
                            className="flex items-center w-full px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                            whileHover={{ x: 5 }}
                          >
                            <svg 
                              className="h-4 w-4 mr-2" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M9 9h.01" />
                              <path d="M15 9h.01" />
                              <path d="M9 15h.01" />
                              <path d="M15 15h.01" />
                            </svg>
                            Панель администратора
                            <ChevronRight className="h-4 w-4 ml-auto" />
                          </motion.a>
                        </Link>
                      )}
                      
                      <motion.button 
                        className="flex items-center w-full px-4 py-2 text-sm text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all"
                        onClick={() => logout()}
                        whileHover={{ x: 5 }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Выйти
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="hidden sm:block"
              >
                <Button 
                  asChild
                  className="bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white border-0 rounded-full relative overflow-hidden group"
                >
                  <Link href="/login">
                    <span className="relative z-10">Войти</span>
                    {/* Анимированный блик */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out"></span>
                  </Link>
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Мобильное меню */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <motion.button
                className="md:hidden p-2 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                aria-label="Открыть меню"
              >
                <Menu className="h-5 w-5" />
              </motion.button>
            </SheetTrigger>
            <SheetContent 
              side="right" 
              className="w-[300px] sm:w-[400px] bg-gradient-to-b from-indigo-900 to-purple-900 border-l border-white/10 text-white"
            >
              <motion.div 
                className="flex flex-col h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className="text-2xl font-bold my-8 bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent"
                  animate={{
                    textShadow: [
                      "0 0 5px rgba(217, 70, 239, 0.5)",
                      "0 0 15px rgba(217, 70, 239, 0.8)",
                      "0 0 5px rgba(217, 70, 239, 0.5)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  TRADEPO
                </motion.div>
                
                <nav className="flex flex-col gap-2 mt-4">
                  {menuItems.map((item, index) => (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      className="px-4 py-3 text-base font-medium hover:bg-white/10 rounded-lg transition-all flex items-center"
                      onClick={() => setIsMenuOpen(false)}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ x: 5 }}
                    >
                      {item.label}
                      <ChevronRight className="h-4 w-4 ml-auto" />
                    </motion.a>
                  ))}
                </nav>
                
                <div className="mt-auto mb-8">
                  {user ? (
                    <div className="space-y-2">
                      <Link href="/dashboard">
                        <motion.a 
                          className="flex items-center w-full px-4 py-3 text-base font-medium hover:bg-white/10 rounded-lg transition-all"
                          onClick={() => setIsMenuOpen(false)}
                          whileHover={{ x: 5 }}
                        >
                          <User className="h-4 w-4 mr-2" />
                          Личный кабинет
                          <ChevronRight className="h-4 w-4 ml-auto" />
                        </motion.a>
                      </Link>
                      
                      {user.role === "admin" && (
                        <Link href="/admin">
                          <motion.a 
                            className="flex items-center w-full px-4 py-3 text-base font-medium hover:bg-white/10 rounded-lg transition-all"
                            onClick={() => setIsMenuOpen(false)}
                            whileHover={{ x: 5 }}
                          >
                            <svg 
                              className="h-4 w-4 mr-2" 
                              viewBox="0 0 24 24" 
                              fill="none" 
                              stroke="currentColor" 
                              strokeWidth="2" 
                              strokeLinecap="round" 
                              strokeLinejoin="round"
                            >
                              <rect x="3" y="3" width="18" height="18" rx="2" />
                              <path d="M9 9h.01" />
                              <path d="M15 9h.01" />
                              <path d="M9 15h.01" />
                              <path d="M15 15h.01" />
                            </svg>
                            Панель администратора
                            <ChevronRight className="h-4 w-4 ml-auto" />
                          </motion.a>
                        </Link>
                      )}
                      
                      <motion.button 
                        className="flex items-center w-full px-4 py-3 text-base font-medium hover:bg-white/10 rounded-lg transition-all"
                        onClick={() => {
                          logout();
                          setIsMenuOpen(false);
                        }}
                        whileHover={{ x: 5 }}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Выйти
                      </motion.button>
                    </div>
                  ) : (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button 
                        asChild
                        className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white rounded-lg relative overflow-hidden group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <Link href="/login">
                          <span className="relative z-10">Войти в аккаунт</span>
                          {/* Анимированный блик */}
                          <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out"></span>
                        </Link>
                      </Button>
                    </motion.div>
                  )}
                  
                  <div className="flex items-center justify-between mt-6 px-4 py-3 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <Globe className="h-5 w-5 mr-2 text-white/70" />
                      <span className="text-sm">Язык</span>
                    </div>
                    <div className="flex space-x-2">
                      <button className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition font-medium text-xs">
                        RU
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition font-medium text-xs text-white/70">
                        EN
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
};

export default Header;