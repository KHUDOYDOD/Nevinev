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
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function AdminSidebar() {
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Навигационные пункты меню
  const navItems = [
    { 
      path: "/admin", 
      icon: <Home className="w-5 h-5" />, 
      label: t('admin.dashboard'), 
      exact: true 
    },
    { 
      path: "/admin/users", 
      icon: <Users className="w-5 h-5" />, 
      label: t('admin.users') 
    },
    { 
      path: "/admin/deposits", 
      icon: <PiggyBank className="w-5 h-5" />, 
      label: t('admin.deposits') 
    },
    { 
      path: "/admin/transactions", 
      icon: <ArrowRightLeft className="w-5 h-5" />, 
      label: t('admin.transactions') 
    },
    { 
      path: "/admin/withdrawals", 
      icon: <Wallet className="w-5 h-5" />, 
      label: t('admin.withdrawals') 
    },
    { 
      path: "/admin/tariffs", 
      icon: <BarChart3 className="w-5 h-5" />, 
      label: t('admin.tariffs') 
    },
    { 
      path: "/admin/content", 
      icon: <FileText className="w-5 h-5" />, 
      label: t('admin.content') 
    },
    { 
      path: "/admin/settings", 
      icon: <Settings className="w-5 h-5" />, 
      label: t('admin.settings') 
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
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm"
      >
        {isMobileSidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>
    </div>
  );

  // Содержимое сайдбара
  const SidebarContent = () => (
    <div className="flex flex-col h-full py-6 px-4 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Логотип и заголовок */}
      <div className="flex items-center justify-center mb-8">
        <div className="text-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            TRADEPO
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Admin Panel</p>
        </div>
      </div>
      
      {/* Навигационные ссылки */}
      <div className="flex-1 space-y-1">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <a 
              className={`flex items-center p-3 rounded-lg text-sm font-medium transition-colors ${
                isActivePath(item.path, item.exact) 
                  ? "bg-gradient-to-r from-indigo-50 to-purple-50 text-indigo-700 dark:from-indigo-950/40 dark:to-purple-950/40 dark:text-indigo-400" 
                  : "text-gray-600 hover:text-indigo-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:text-indigo-400 dark:hover:bg-gray-800/50"
              }`}
            >
              <span className={`mr-3 ${isActivePath(item.path, item.exact) ? "text-indigo-600 dark:text-indigo-400" : "text-gray-500 dark:text-gray-400"}`}>
                {item.icon}
              </span>
              {item.label}
              {isActivePath(item.path, item.exact) && (
                <div className="ml-auto w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full" />
              )}
            </a>
          </Link>
        ))}
      </div>

      <Separator className="my-4" />
      
      {/* Профиль пользователя и выход */}
      <div className="mt-auto space-y-4">
        <Button
          variant="outline"
          className="w-full justify-start text-left font-normal"
          onClick={handleSwitchToUserMode}
        >
          <Users className="mr-2 h-4 w-4" />
          {t('admin.userMode')}
        </Button>
        
        <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
          <Avatar className="h-8 w-8">
            <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username || 'A'}`} />
            <AvatarFallback>{user?.username?.substring(0, 2).toUpperCase() || 'A'}</AvatarFallback>
          </Avatar>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium truncate">{user?.username || 'Admin'}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email || 'admin@example.com'}</p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="ml-auto text-gray-500 hover:text-red-500"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <MobileSidebarToggle />
      
      {/* Десктопный сайдбар */}
      <div className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-40">
        <SidebarContent />
      </div>
      
      {/* Мобильный сайдбар с анимацией */}
      <AnimatePresence>
        {isMobileSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileSidebarOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed inset-y-0 left-0 z-50 w-64 lg:hidden"
            >
              <SidebarContent />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}