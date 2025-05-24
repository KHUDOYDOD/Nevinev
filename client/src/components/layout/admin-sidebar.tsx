import { Link, useLocation } from 'wouter';
import { useTranslation } from '@/i18n';
import { useAuth } from '@/lib/auth';
import {
  LayoutDashboard,
  Users,
  Wallet,
  CreditCard,
  Settings,
  FileText,
  MessageSquare,
  ArrowLeft,
  LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AdminSidebar() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const { user, logout } = useAuth();
  
  if (!user || user.role !== 'admin') return null;

  const navItems = [
    {
      href: '/admin',
      label: t('admin.dashboard.title'),
      icon: LayoutDashboard,
      exact: true
    },
    {
      href: '/admin/users',
      label: t('admin.users.title'),
      icon: Users
    },
    {
      href: '/admin/deposits',
      label: t('admin.deposits.title'),
      icon: Wallet
    },
    {
      href: '/admin/withdrawals',
      label: t('admin.withdrawals.title'),
      icon: CreditCard
    },
    {
      href: '/admin/tariffs',
      label: t('admin.tariffs.title'),
      icon: Settings
    },
    {
      href: '/admin/content',
      label: t('admin.content.title'),
      icon: FileText
    },
    {
      href: '/admin/testimonials',
      label: t('admin.testimonials.title'),
      icon: MessageSquare
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
    <aside className="w-64 bg-gray-900 h-full flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <Link href="/" className="flex items-center">
          <span className="font-bold text-xl text-white">TRADEPO</span>
          <span className="text-xs text-gray-400 ml-2">| Admin</span>
        </Link>
      </div>
      
      <nav className="flex-1 px-4 py-2 space-y-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <a className={cn(
              "flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors",
              isActive(item.href, item.exact) 
                ? "bg-primary text-white" 
                : "text-gray-300 hover:bg-gray-800"
            )}>
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </a>
          </Link>
        ))}
      </nav>
      
      <div className="p-4 space-y-2 border-t border-gray-800">
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          asChild
        >
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t('dashboard.overview.title')}
          </Link>
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full justify-start bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          {t('common.logout')}
        </Button>
      </div>
    </aside>
  );
}
