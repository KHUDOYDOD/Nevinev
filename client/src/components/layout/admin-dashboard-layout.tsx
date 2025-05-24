import { useState, ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useLanguage } from "@/hooks/use-language";
import { Button } from "@/components/ui/button";
import { LanguageSelector } from "@/components/ui/language-selector";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  LayoutDashboard,
  Users,
  Wallet,
  Banknote,
  Percent,
  BarChart2,
  FileEdit,
  Settings,
  Menu,
  X,
  LogOut,
  ChevronDown,
  UserCheck
} from "lucide-react";

interface AdminDashboardLayoutProps {
  children: ReactNode;
}

export function AdminDashboardLayout({ children }: AdminDashboardLayoutProps) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const getInitials = () => {
    if (!user || !user.fullName) return "A";
    return user.fullName.split(" ").map(name => name[0]).join("").toUpperCase().substring(0, 2);
  };
  
  const navigationItems = [
    { 
      href: "/admin", 
      label: t('admin.dashboard'), 
      icon: <LayoutDashboard className="w-5 h-5 mr-3" /> 
    },
    { 
      href: "/admin/users", 
      label: t('admin.users'), 
      icon: <Users className="w-5 h-5 mr-3" /> 
    },
    { 
      href: "/admin/deposits", 
      label: t('admin.deposits'), 
      icon: <Wallet className="w-5 h-5 mr-3" /> 
    },
    { 
      href: "/admin/withdrawals", 
      label: t('admin.withdrawals'), 
      icon: <Banknote className="w-5 h-5 mr-3" /> 
    },
    { 
      href: "/admin/tariffs", 
      label: t('admin.tariffs'), 
      icon: <Percent className="w-5 h-5 mr-3" /> 
    },
    { 
      href: "/admin/content", 
      label: t('admin.content'), 
      icon: <FileEdit className="w-5 h-5 mr-3" /> 
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2 text-white"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            
            <Link href="/admin" className="flex items-center">
              <span className="font-bold text-2xl text-white">TRADEPO</span>
              <span className="text-sm text-gray-400 ml-2 hidden sm:inline">
                | {t('admin.panel')}
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector variant="ghost" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1.5 text-white">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="font-medium text-sm">{user?.fullName}</p>
                      <p className="text-xs text-gray-400">{user?.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">{t('admin.user_mode')}</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  {t('auth.logout')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>
      
      <div className="flex flex-1">
        {/* Sidebar - Desktop */}
        <aside className="w-64 bg-gray-800 text-white shadow-md hidden md:block">
          <nav className="px-4 py-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a
                      className={`flex items-center px-4 py-3 rounded-lg font-medium ${
                        location === item.href
                          ? "bg-gray-700"
                          : "text-gray-300 hover:bg-gray-700"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
              
              {/* User Mode Link */}
              <li>
                <Link href="/dashboard">
                  <a className="flex items-center space-x-2 px-4 py-3 mt-4 rounded-lg text-gray-300 hover:bg-gray-700 font-medium">
                    <UserCheck className="w-5 h-5 mr-3" />
                    <span>{t('admin.user_mode')}</span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
            <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 text-white shadow-xl p-4">
              <div className="flex justify-end mb-4">
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>
              
              <nav>
                <ul className="space-y-2">
                  {navigationItems.map((item) => (
                    <li key={item.href}>
                      <Link href={item.href}>
                        <a
                          className={`flex items-center px-4 py-3 rounded-lg font-medium ${
                            location === item.href
                              ? "bg-gray-700"
                              : "text-gray-300 hover:bg-gray-700"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </a>
                      </Link>
                    </li>
                  ))}
                  
                  {/* User Mode Link */}
                  <li>
                    <Link href="/dashboard">
                      <a 
                        className="flex items-center space-x-2 px-4 py-3 mt-4 rounded-lg text-gray-300 hover:bg-gray-700 font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <UserCheck className="w-5 h-5 mr-3" />
                        <span>{t('admin.user_mode')}</span>
                      </a>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        )}
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
