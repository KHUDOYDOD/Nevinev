import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserBalanceCard from "./UserBalanceCard";
import UserDeposits from "./UserDeposits";
import UserTransactions from "./UserTransactions";
import UserReferrals from "./UserReferrals";
import UserSettings from "./UserSettings";
import { useToast } from "@/hooks/use-toast";
import LanguageSwitcher from "../layout/LanguageSwitcher";

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const NavItem = ({ icon, label, isActive, onClick }: NavItemProps) => (
  <li>
    <Button
      variant={isActive ? "secondary" : "ghost"}
      className={`w-full justify-start ${
        isActive ? "bg-primary bg-opacity-10 text-primary" : "text-gray-600"
      }`}
      onClick={onClick}
    >
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </Button>
  </li>
);

const UserDashboard = () => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { user, logout } = useAuth();
  const { toast } = useToast();
  const [activePage, setActivePage] = useState<string>("overview");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
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
    {
      id: "security",
      icon: <ShieldCheck size={18} />,
      label: t("dashboard.security"),
    },
  ];

  const renderContent = () => {
    switch (activePage) {
      case "overview":
        return (
          <>
            <UserBalanceCard />
            <UserDeposits limit={5} />
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
      case "security":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">{t("dashboard.security")}</h2>
            <p className="text-gray-500">
              Security settings will be available in the next update.
            </p>
          </div>
        );
      case "calculator":
        return (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {t("dashboard.calculator")}
            </h2>
            <p className="text-gray-500">
              Investment calculator will be available in the next update.
            </p>
          </div>
        );
      default:
        return <UserBalanceCard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="flex items-center justify-between p-4 border-b">
          <div className="text-xl font-bold text-primary">TRADEPO</div>
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
              />
            ))}

            {user?.role === "admin" && (
              <li className="mt-4">
                <Button
                  variant="outline"
                  className="w-full justify-start border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
                  onClick={() => navigate("/admin")}
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
                className="w-full justify-start"
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
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Mobile header */}
        <header className="bg-white shadow-sm p-4 flex justify-between items-center md:hidden">
          <div className="text-xl font-bold text-primary">TRADEPO</div>
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72">
                <div className="flex items-center justify-between mb-6">
                  <div className="text-xl font-bold text-primary">TRADEPO</div>
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
                      />
                    ))}

                    {user?.role === "admin" && (
                      <li className="mt-4">
                        <Button
                          variant="outline"
                          className="w-full justify-start border-gray-800 text-gray-800 hover:bg-gray-800 hover:text-white"
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
                        className="w-full justify-start"
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
        </header>

        {/* User info bar */}
        <div className="bg-white shadow-sm p-4 border-b flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {user?.username?.charAt(0) || "U"}
            </div>
            <div className="ml-3">
              <p className="font-medium">{user?.username}</p>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-2xl font-bold mb-6">
              {navItems.find((item) => item.id === activePage)?.label}
            </h1>
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UserDashboard;
