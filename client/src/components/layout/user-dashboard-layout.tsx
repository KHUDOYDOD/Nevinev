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
  Home,
  Wallet,
  BarChart2,
  Calculator,
  Users,
  Settings,
  Shield,
  Menu,
  X,
  LogOut,
  ChevronDown
} from "lucide-react";

interface UserDashboardLayoutProps {
  children: ReactNode;
}

export function UserDashboardLayout({ children }: UserDashboardLayoutProps) {
  const { t } = useLanguage();
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const getInitials = () => {
    if (!user || !user.fullName) return "U";
    return user.fullName.split(" ").map(name => name[0]).join("").toUpperCase().substring(0, 2);
  };
  
  const navigationItems = [
    { 
      href: "/dashboard", 
      label: t('dashboard.overview'), 
      icon: <Home className="w-5 h-5 mr-3" /> 
    },
    { 
      href: "/dashboard/deposits", 
      label: t('dashboard.deposits'), 
      icon: <Wallet className="w-5 h-5 mr-3" /> 
    },
    { 
      href: "/dashboard/transactions", 
      label: t('dashboard.transactions'), 
      icon: <BarChart2 className="w-5 h-5 mr-3" /> 
    },
    { 
      href: "/dashboard/calculator", 
      label: t('dashboard.calculator'), 
      icon: <Calculator className="w-5 h-5 mr-3" /> 
    },
    { 
      href: "/dashboard/referrals", 
      label: t('dashboard.referrals'), 
      icon: <Users className="w-5 h-5 mr-3" /> 
    },
    { 
      href: "/dashboard/settings", 
      label: t('dashboard.settings'), 
      icon: <Settings className="w-5 h-5 mr-3" /> 
    }
  ];
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden mr-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </Button>
            
            <Link href="/" className="flex items-center">
              <span className="font-bold text-2xl text-primary">TRADEPO</span>
              <span className="text-sm text-gray-500 ml-2 hidden sm:inline">
                | Smart Profit System
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="p-1.5">
                  <div className="flex items-center space-x-2">
                    <Avatar>
                      <AvatarFallback className="bg-primary text-white">
                        {getInitials()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="hidden md:block text-left">
                      <p className="font-medium text-sm">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings">{t('dashboard.profile_settings')}</Link>
                </DropdownMenuItem>
                {user?.isAdmin && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">{t('dashboard.admin_panel')}</Link>
                  </DropdownMenuItem>
                )}
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
        <aside className="w-64 bg-white shadow-md hidden md:block">
          <nav className="px-4 py-6">
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a
                      className={`flex items-center px-4 py-3 rounded-lg font-medium ${
                        location === item.href
                          ? "bg-primary bg-opacity-10 text-primary"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
              
              {/* Admin Panel Link (for admins only) */}
              {user?.isAdmin && (
                <li>
                  <Link href="/admin">
                    <a className="flex items-center space-x-2 px-4 py-3 mt-4 rounded-lg bg-gray-800 text-white font-medium">
                      <Shield className="w-5 h-5 mr-3" />
                      <span>{t('dashboard.admin_panel')}</span>
                    </a>
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </aside>
        
        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-xl p-4">
              <div className="flex justify-end mb-4">
                <Button 
                  variant="ghost" 
                  size="icon"
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
                              ? "bg-primary bg-opacity-10 text-primary"
                              : "text-gray-600 hover:bg-gray-100"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.icon}
                          <span>{item.label}</span>
                        </a>
                      </Link>
                    </li>
                  ))}
                  
                  {/* Admin Panel Link (for admins only) */}
                  {user?.isAdmin && (
                    <li>
                      <Link href="/admin">
                        <a 
                          className="flex items-center space-x-2 px-4 py-3 mt-4 rounded-lg bg-gray-800 text-white font-medium"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <Shield className="w-5 h-5 mr-3" />
                          <span>{t('dashboard.admin_panel')}</span>
                        </a>
                      </Link>
                    </li>
                  )}
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
