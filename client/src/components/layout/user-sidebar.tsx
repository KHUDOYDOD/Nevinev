import { Link, useLocation } from 'wouter';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Wallet,
  History,
  Users,
  Settings,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function UserSidebar() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  
  if (!user) return null;

  const navItems = [
    {
      href: '/dashboard',
      label: t('dashboard.overview.title'),
      icon: LayoutDashboard,
      exact: true
    },
    {
      href: '/dashboard/deposits',
      label: t('dashboard.deposits.title'),
      icon: Wallet
    },
    {
      href: '/dashboard/transactions',
      label: t('dashboard.transactions.title'),
      icon: History
    },
    {
      href: '/dashboard/referrals',
      label: t('dashboard.referrals.title'),
      icon: Users
    },
    {
      href: '/dashboard/settings',
      label: t('dashboard.settings.title'),
      icon: Settings
    }
  ];

  const isActive = (path: string, exact = false) => {
    if (exact) return location === path;
    return location.startsWith(path);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 h-full border-r dark:border-gray-800 flex flex-col">
      <div className="p-6">
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl text-primary">TRADEPO</span>
          <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">| Smart Profit System</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
              isActive(item.href, item.exact) 
                ? "bg-primary text-white" 
                : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
            )}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
        
        {user.role === 'admin' && (
          <Link href="/admin">
            <a className="flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
              <ShieldCheck className="h-5 w-5" />
              <span>Админ панель</span>
            </a>
          </Link>
        )}
      </nav>
      
      <div className="p-4 mt-auto">
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('common.logout')}
        </Button>
      </div>
    </aside>
  );
}
