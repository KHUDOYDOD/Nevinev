import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  BarChart3,
  Users,
  Settings,
  LogOut,
  DollarSign,
  Layers,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

export default function AdminSidebar() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { logout } = useAuth();
  const { toast } = useToast();
  const [activePage, setActivePage] = useState<string>("dashboard");

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
      id: "dashboard",
      icon: <BarChart3 size={18} />,
      label: t("admin.dashboard"),
    },
    {
      id: "users",
      icon: <Users size={18} />,
      label: t("admin.users"),
    },
    {
      id: "tariffs",
      icon: <Layers size={18} />,
      label: t("admin.tariffs"),
    },
    {
      id: "withdrawals",
      icon: <DollarSign size={18} />,
      label: t("admin.withdrawals"),
    },
    {
      id: "content",
      icon: <FileText size={18} />,
      label: t("admin.content"),
    },
    {
      id: "settings",
      icon: <Settings size={18} />,
      label: t("admin.settings"),
    },
  ];

  return (
    <div className="h-screen flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 p-4">
      <div className="text-xl font-bold mb-6 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
        TRADEPO Admin
      </div>
      
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <Button
                variant={activePage === item.id ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activePage === item.id 
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white" 
                    : "text-gray-600 dark:text-gray-300"
                }`}
                onClick={() => {
                  setActivePage(item.id);
                  // Обработка клика для изменения активной страницы в админке
                }}
              >
                <span className="mr-2">{item.icon}</span>
                <span>{item.label}</span>
              </Button>
            </li>
          ))}
        </ul>
      </nav>
      
      <Separator className="my-4" />
      
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-start"
          onClick={() => navigate("/dashboard")}
        >
          <span className="mr-2">👤</span>
          <span>{t("common.userPanel")}</span>
        </Button>
        
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
      </div>
    </div>
  );
}