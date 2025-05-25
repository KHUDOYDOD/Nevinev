import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home, 
  Users, 
  PiggyBank, 
  ArrowRightLeft, 
  Wallet, 
  Settings, 
  LogOut, 
  BarChart3, 
  FileText, 
  Menu, 
  X,
  ChevronRight,
  Bell,
  Moon,
  Sun
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "@/components/ThemeProvider";

// Анимации для элементов меню
const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1, 
    x: 0,
    transition: { 
      delay: i * 0.05,
      duration: 0.3,
      ease: "easeOut"
    }
  })
};

// Анимация для индикатора активного пункта
const activeIndicatorVariants = {
  initial: { height: 0 },
  animate: { 
    height: "1.5rem", 
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20
    } 
  }
};

// Анимация для логотипа
const logoVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  }
};

export default function AdminSidebar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState(3); // Число уведомлений

  // Проверка размера экрана при монтировании и изменении размера окна
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    
    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  // Закрываем мобильный сайдбар при изменении маршрута
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location]);

  // Управление выходом из системы
  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Переход в режим пользователя
  const handleSwitchToUserMode = () => {
    navigate("/dashboard");
  };

  // Переключение темы
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Навигационные пункты меню
  const navItems = [
    { 
      path: "/admin", 
      icon: <Home className="w-5 h-5" />, 
      label: t('admin.dashboard'), 
      exact: true,
      badge: null
    },
    { 
      path: "/admin/users", 
      icon: <Users className="w-5 h-5" />, 
      label: t('admin.users'),
      badge: 5 // Новых пользователей
    },
    { 
      path: "/admin/deposits", 
      icon: <PiggyBank className="w-5 h-5" />, 
      label: t('admin.deposits'),
      badge: null
    },
    { 
      path: "/admin/transactions", 
      icon: <ArrowRightLeft className="w-5 h-5" />, 
      label: t('admin.transactions'),
      badge: null 
    },
    { 
      path: "/admin/withdrawals", 
      icon: <Wallet className="w-5 h-5" />, 
      label: t('admin.withdrawals'),
      badge: 2 // Ожидающих вывода
    },
    { 
      path: "/admin/tariffs", 
      icon: <BarChart3 className="w-5 h-5" />, 
      label: t('admin.tariffs'),
      badge: null
    },
    { 
      path: "/admin/content", 
      icon: <FileText className="w-5 h-5" />, 
      label: t('admin.content'),
      badge: null 
    },
    { 
      path: "/admin/settings", 
      icon: <Settings className="w-5 h-5" />, 
      label: t('admin.settings'),
      badge: null
    }
  ];

  // Проверка активного пути
  const isActivePath = (path: string, exact: boolean = false) => {
    if (exact) {
      return location === path;
    }
    return location.startsWith(path);
  };

  // Мобильная кнопка переключения сайдбара
  const MobileSidebarToggle = () => (
    <div className="lg:hidden fixed top-4 left-4 z-50">
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm shadow-lg rounded-xl"
        >
          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: isMobileSidebarOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.div>
        </Button>
      </motion.div>
    </div>
  );

  // Содержимое сайдбара
  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-r border-gray-200 dark:border-gray-800 shadow-xl">
      {/* Логотип и заголовок */}
      <motion.div 
        className="flex items-center justify-center mb-8"
        variants={logoVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent drop-shadow-sm">
            TRADEPO
          </h1>
          <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1">
            <span>Admin</span>
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
          </div>
        </div>
      </motion.div>
      
      {/* Быстрые действия */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            variant="outline" 
            className="w-full gap-2 group relative overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-900/50 shadow-sm"
            onClick={toggleTheme}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/5 group-hover:via-indigo-400/5 group-hover:to-purple-400/5 transition-all duration-500"></div>
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-600" />
            )}
            <span>{theme === 'dark' ? t('common.light') : t('common.dark')}</span>
          </Button>
        </motion.div>
        
        <motion.div
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Button 
            variant="outline" 
            className="w-full gap-2 group relative overflow-hidden bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-indigo-100 dark:border-indigo-900/50 shadow-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/5 group-hover:via-indigo-400/5 group-hover:to-purple-400/5 transition-all duration-500"></div>
            <Bell className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span>{t('common.alerts')}</span>
            {notifications > 0 && (
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {notifications}
              </div>
            )}
          </Button>
        </motion.div>
      </div>
      
      {/* Навигационные ссылки */}
      <div className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
        <motion.div
          initial="hidden"
          animate="visible"
          className="space-y-1"
        >
          {navItems.map((item, i) => (
            <motion.div 
              key={item.path}
              custom={i}
              variants={itemVariants}
            >
              <Link href={item.path}>
                <motion.a
                  className={`flex items-center p-3 rounded-xl text-sm font-medium transition-all relative group ${
                    isActivePath(item.path, item.exact) 
                      ? "bg-gradient-to-r from-indigo-500/10 to-purple-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm" 
                      : "text-gray-600 hover:bg-indigo-50/50 dark:text-gray-300 dark:hover:bg-indigo-950/20"
                  }`}
                  whileHover={{ 
                    x: 5,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.97 }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/0 via-indigo-400/0 to-purple-400/0 group-hover:from-indigo-400/5 group-hover:via-indigo-400/5 group-hover:to-purple-400/5 transition-all duration-500 rounded-xl"></div>
                  
                  <span className={`flex items-center justify-center w-8 h-8 rounded-lg mr-3 ${
                    isActivePath(item.path, item.exact) 
                      ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20" 
                      : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400"
                  }`}>
                    {item.icon}
                  </span>
                  
                  <span>{item.label}</span>
                  
                  {item.badge && (
                    <div className="ml-auto mr-2 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </div>
                  )}
                  
                  <motion.div
                    className="ml-auto"
                    initial={{ opacity: 0 }}
                    animate={{ 
                      opacity: isActivePath(item.path, item.exact) ? 1 : 0,
                      x: isActivePath(item.path, item.exact) ? 0 : 5
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  </motion.div>
                  
                  {isActivePath(item.path, item.exact) && (
                    <motion.div 
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"
                      variants={activeIndicatorVariants}
                      initial="initial"
                      animate="animate"
                    />
                  )}
                </motion.a>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Separator className="my-4 bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-700 to-transparent opacity-70" />
      
      {/* Профиль пользователя и выход */}
      <motion.div 
        className="mt-auto space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            variant="outline"
            className="w-full justify-start text-left font-normal gap-2 group relative overflow-hidden bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-950/30 dark:to-sky-950/30 border-blue-100 dark:border-blue-900/50 shadow-sm rounded-xl"
            onClick={handleSwitchToUserMode}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400/0 via-blue-400/0 to-sky-400/0 group-hover:from-blue-400/5 group-hover:via-blue-400/5 group-hover:to-sky-400/5 transition-all duration-500"></div>
            <Users className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-blue-700 dark:text-blue-400">{t('admin.userMode')}</span>
          </Button>
        </motion.div>
        
        <motion.div 
          className="p-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 border border-gray-200 dark:border-gray-700/50 shadow-sm"
          whileHover={{ y: -3, boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex items-center">
            <div className="relative">
              <Avatar className="h-10 w-10 ring-2 ring-indigo-500/10 dark:ring-indigo-400/20">
                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'A'}`} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                  {user?.username?.substring(0, 2).toUpperCase() || 'A'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-gray-800"></div>
            </div>
            
            <div className="ml-3 overflow-hidden">
              <p className="text-sm font-medium truncate">{user?.username || 'Admin'}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'admin@example.com'}</p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.1, rotate: 15 }}
              whileTap={{ scale: 0.9 }}
            >
              <Button 
                variant="ghost" 
                size="icon" 
                className="ml-auto text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );

  return (
    <>
      <MobileSidebarToggle />
      
      {/* Десктопный сайдбар */}
      <div className="hidden lg:flex lg:w-72 lg:flex-col lg:fixed lg:inset-y-0 z-40">
        <SidebarContent />
      </div>
      
      {/* Мобильный сайдбар с анимацией */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 30 
              }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}