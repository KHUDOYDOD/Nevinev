import { ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, Users, Wallet, BarChart2, 
  Settings, LogOut, Menu, Ban, Percent, FileText,
  ChevronDown, Shield, UserCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/ui/logo';
import { LanguageSelector } from '@/components/ui/language-selector';
import { AvatarPlaceholder } from '@/components/ui/avatar-placeholder';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { t } = useTranslation();
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
  const navItems = [
    { href: '/admin', icon: LayoutDashboard, label: t('admin.dashboard') },
    { href: '/admin/users', icon: Users, label: t('admin.users') },
    { href: '/admin/deposits', icon: Wallet, label: t('admin.deposits') },
    { href: '/admin/withdrawals', icon: Ban, label: t('admin.withdrawals') },
    { href: '/admin/tariffs', icon: Percent, label: t('admin.tariffs') },
    { href: '/admin/content', icon: FileText, label: t('admin.content') },
    { href: '/admin/settings', icon: Settings, label: t('admin.settings') },
  ];

  const isActive = (path: string) => {
    return location === path;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-gray-900 text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center">
            <Logo variant="white" className="mr-2" />
            <span className="text-sm text-gray-400 ml-2 hidden sm:inline">
              | {t('dashboard.adminPanel')}
            </span>
          </div>
          
          <div className="flex items-center space-x-6">
            <LanguageSelector variant="subtle" />
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <AvatarPlaceholder 
                    name={user?.fullName || user?.username || 'Admin'} 
                    size="md" 
                  />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {user?.fullName && (
                      <p className="font-medium">{user.fullName}</p>
                    )}
                    <p className="w-[200px] truncate text-sm text-gray-500">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">
                    <a className="cursor-pointer">
                      <UserCircle className="mr-2 h-4 w-4" />
                      <span>{t('admin.userMode')}</span>
                    </a>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600"
                  onClick={logout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>{t('common.logout')}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5 text-white" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col h-full">
                  <div className="py-6">
                    <Logo className="mb-6" />
                    <nav className="flex flex-col space-y-1">
                      {navItems.map((item) => (
                        <Link key={item.href} href={item.href}>
                          <a className={cn(
                            "flex items-center py-3 px-4 rounded-lg font-medium",
                            isActive(item.href)
                              ? "bg-primary/10 text-primary"
                              : "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                          )}>
                            <item.icon className="mr-3 h-5 w-5" />
                            <span>{item.label}</span>
                          </a>
                        </Link>
                      ))}
                      
                      <Link href="/dashboard">
                        <a className="flex items-center py-3 px-4 rounded-lg font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
                          <UserCircle className="mr-3 h-5 w-5" />
                          <span>{t('admin.userMode')}</span>
                        </a>
                      </Link>
                    </nav>
                  </div>
                  <div className="mt-auto pb-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <Button 
                      variant="destructive" 
                      className="w-full"
                      onClick={logout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>{t('common.logout')}</span>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="flex-1 flex flex-col md:flex-row bg-gray-100 dark:bg-gray-900">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white shadow-md hidden md:block">
          <nav className="px-4 py-6">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a className={cn(
                      "flex items-center space-x-2 px-4 py-3 rounded-lg font-medium",
                      isActive(item.href)
                        ? "bg-gray-700 text-white"
                        : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    )}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.label}</span>
                    </a>
                  </Link>
                </li>
              ))}
              
              <li>
                <Link href="/dashboard">
                  <a className="flex items-center space-x-2 px-4 py-3 mt-4 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white font-medium">
                    <UserCircle className="h-5 w-5" />
                    <span>{t('admin.userMode')}</span>
                  </a>
                </Link>
              </li>
            </ul>
          </nav>
        </aside>
        
        {/* Main Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
