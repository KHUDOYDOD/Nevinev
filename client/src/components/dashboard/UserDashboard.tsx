import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  WalletCards,
  BarChart3,
  Calculator,
  Users,
  Settings,
  ShieldCheck,
  Menu,
  X,
  LogOut,
  Bell,
  HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import UserBalanceCard from "./UserBalanceCard";
import UserDeposits from "./UserDeposits";
import UserTransactions from "./UserTransactions";
import UserReferrals from "./UserReferrals";
import UserSettings from "./UserSettings";
import { useToast } from "@/hooks/use-toast";
import { User } from "@/contexts/AuthContext";
import LanguageSwitcher from "../layout/LanguageSwitcher";
import { useTheme } from "@/components/ThemeProvider";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
  badge?: number;
}

const NavItem = ({ icon, label, isActive, onClick, badge }: NavItemProps) => (
  <motion.li whileHover={{ x: 3 }} whileTap={{ scale: 0.97 }}>
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant={isActive ? "default" : "ghost"}
            className={`w-full justify-start ${
              isActive 
                ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
                : "text-gray-600 dark:text-gray-300"
            }`}
            onClick={onClick}
          >
            <span className="mr-2">{icon}</span>
            <span>{label}</span>
            {badge && badge > 0 && (
              <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {badge}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>{label}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </motion.li>
);

const UserDashboard = () => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const { theme } = useTheme();
  const [activePage, setActivePage] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationCount] = useState(3); // Пример уведомлений
  
  // Эффект анимации при смене страницы
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activePage]);

  const handleLogout = () => {
    logout();
    toast({
      title: t('common.loggedOut'),
      description: t('common.loggedOutSuccessfully'),
    });
    navigate("/");
  };

  const navItems = [
    {
      id: "overview",
      icon: <Home size={18} />,
      label: t("dashboard.overview"),
    },
    {
      id: "deposits",
      icon: <WalletCards size={18} />,
      label: t("dashboard.deposits"),
    },
    {
      id: "transactions",
      icon: <BarChart3 size={18} />,
      label: t("dashboard.transactions"),
    },
    {
      id: "calculator",
      icon: <Calculator size={18} />,
      label: t("dashboard.calculator"),
    },
    {
      id: "referrals",
      icon: <Users size={18} />,
      label: t("dashboard.referrals"),
    },
    {
      id: "settings",
      icon: <Settings size={18} />,
      label: t("dashboard.settings"),
    },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return (
          <>
            <UserBalanceCard />
            <UserDeposits limit={3} />
            <UserTransactions limit={5} />
          </>
        );
      case "deposits":
        return <UserDeposits />;
      case "transactions":
        return <UserTransactions />;
      case "referrals":
        return <UserReferrals />;
      case "settings":
        return <UserSettings />;
      case "calculator":
        return (
          <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl shadow-xl p-8 mb-8">
            <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              {t("dashboard.calculator")}
            </h2>
            <p className="text-gray-600 dark:text-gray-300">
              {t("dashboard.calculatorComingSoon")}
            </p>
          </div>
        );
      default:
        return <UserBalanceCard />;
    }
  };

  // Анимации для контента
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  return (
    <div className={`flex min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Декоративные элементы для фона */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-b from-purple-500/10 to-transparent rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-gradient-to-t from-blue-500/10 to-transparent rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Desktop Sidebar */}
      <motion.aside 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className={`w-64 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-xl hidden md:block relative z-10`}
      >
        <div className="h-1 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600"></div>
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <motion.div 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
          >
            TRADEPO
          </motion.div>
          <LanguageSwitcher />
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <NavItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                isActive={activePage === item.id}
                onClick={() => setActivePage(item.id)}
                badge={item.id === "overview" ? notificationCount : 0}
              />
            ))}

            <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center px-3 mb-2 text-xs uppercase font-semibold text-gray-400 dark:text-gray-500">
                {t("dashboard.support")}
              </div>
              
              <NavItem
                icon={<HelpCircle size={18} />}
                label={t("dashboard.help")}
                isActive={false}
                onClick={() => {}}
              />
              
              <NavItem
                icon={<Bell size={18} />}
                label={t("dashboard.notifications")}
                isActive={false}
                onClick={() => {}}
                badge={notificationCount}
              />
            </div>

            {user?.isAdmin && (
              <motion.li 
                className="mt-4"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  variant="outline"
                  className="w-full justify-start border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                  onClick={() => navigate("/admin")}
                >
                  <span className="mr-2">
                    <ShieldCheck size={18} />
                  </span>
                  <span>{t("common.admin")}</span>
                </Button>
              </motion.li>
            )}

            <motion.li 
              className="mt-4"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="destructive"
                className="w-full justify-start bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                onClick={handleLogout}
              >
                <span className="mr-2">
                  <LogOut size={18} />
                </span>
                <span>{t("common.logout")}</span>
              </Button>
            </motion.li>
          </ul>
        </nav>
      </motion.aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <motion.header 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow-md p-4 flex justify-between items-center md:hidden relative z-10`}
        >
          <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">TRADEPO</div>
          <div className="flex items-center space-x-2">
            <Button
              size="sm"
              variant="outline"
              className="relative"
              onClick={() => {}}
            >
              <Bell size={18} />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {notificationCount}
                </span>
              )}
            </Button>
            <LanguageSwitcher />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent 
                side="left" 
                className={`w-72 ${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'}`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">TRADEPO</div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <X size={20} />
                  </Button>
                </div>
                <nav>
                  <ul className="space-y-2">
                    {navItems.map((item) => (
                      <NavItem
                        key={item.id}
                        icon={item.icon}
                        label={item.label}
                        isActive={activePage === item.id}
                        onClick={() => {
                          setActivePage(item.id);
                          setMobileMenuOpen(false);
                        }}
                        badge={item.id === "overview" ? notificationCount : 0}
                      />
                    ))}

                    <div className="pt-4 mt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center px-3 mb-2 text-xs uppercase font-semibold text-gray-400 dark:text-gray-500">
                        {t("dashboard.support")}
                      </div>
                      
                      <NavItem
                        icon={<HelpCircle size={18} />}
                        label={t("dashboard.help")}
                        isActive={false}
                        onClick={() => setMobileMenuOpen(false)}
                      />
                      
                      <NavItem
                        icon={<Bell size={18} />}
                        label={t("dashboard.notifications")}
                        isActive={false}
                        onClick={() => setMobileMenuOpen(false)}
                        badge={notificationCount}
                      />
                    </div>

                    {user?.isAdmin && (
                      <li className="mt-4">
                        <Button
                          variant="outline"
                          className="w-full justify-start border-indigo-200 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-800 dark:text-indigo-400 dark:hover:bg-indigo-900/30"
                          onClick={() => {
                            navigate("/admin");
                            setMobileMenuOpen(false);
                          }}
                        >
                          <span className="mr-2">
                            <ShieldCheck size={18} />
                          </span>
                          <span>{t("common.admin")}</span>
                        </Button>
                      </li>
                    )}

                    <li className="mt-4">
                      <Button
                        variant="destructive"
                        className="w-full justify-start bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
                        onClick={handleLogout}
                      >
                        <span className="mr-2">
                          <LogOut size={18} />
                        </span>
                        <span>{t("common.logout")}</span>
                      </Button>
                    </li>
                  </ul>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </motion.header>

        {/* User info bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`${theme === 'dark' ? 'bg-gray-800/70 backdrop-blur-sm' : 'bg-white/80 backdrop-blur-sm'} shadow-sm p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center sticky top-0 z-10`}
        >
          <div className="flex items-center">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0) || "U"}
            </div>
            <div className="ml-3">
              <p className="font-medium text-gray-900 dark:text-white">{user?.username}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || "user@example.com"}</p>
            </div>
          </div>
          <div className="hidden md:flex items-center space-x-2">
            <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs rounded-full px-3 py-1 flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-1.5"></span>
              {t("dashboard.online")}
            </div>
          </div>
        </motion.div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto relative z-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activePage}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              transition={{ duration: 0.3 }}
              className="container mx-auto max-w-6xl"
            >
              <h1 className="text-2xl md:text-3xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {navItems.find((item) => item.id === activePage)?.label}
              </h1>
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
