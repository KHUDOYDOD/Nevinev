import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layouts/admin-layout';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/lib/utils';
import { 
  Users, Wallet, ArrowUpCircle, 
  ArrowDownCircle, Clock, Loader2 
} from 'lucide-react';
import { AvatarPlaceholder } from '@/components/ui/avatar-placeholder';
import { Button } from '@/components/ui/button';
import { Link } from 'wouter';

export default function AdminIndex() {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [statsProgress, setStatsProgress] = useState({
    totalUsers: 0,
    totalInvested: 0,
    totalPaid: 0,
    newUsers24h: 0,
  });

  // Fetch admin dashboard data
  const { data: dashboardData, isLoading } = useQuery({
    queryKey: ['/api/admin/dashboard'],
  });

  // Animation for counters
  useEffect(() => {
    if (dashboardData) {
      const animateValue = (start: number, end: number, duration: number, setter: (value: number) => void) => {
        let startTimestamp: number | null = null;
        const step = (timestamp: number) => {
          if (!startTimestamp) startTimestamp = timestamp;
          const progress = Math.min((timestamp - startTimestamp) / duration, 1);
          setter(Math.floor(progress * (end - start) + start));
          if (progress < 1) {
            window.requestAnimationFrame(step);
          }
        };
        window.requestAnimationFrame(step);
      };

      animateValue(0, dashboardData.totalUsers, 2000, (value) => 
        setStatsProgress(prev => ({...prev, totalUsers: value})));
      animateValue(0, dashboardData.totalInvested, 2000, (value) => 
        setStatsProgress(prev => ({...prev, totalInvested: value})));
      animateValue(0, dashboardData.totalPaid, 2000, (value) => 
        setStatsProgress(prev => ({...prev, totalPaid: value})));
      animateValue(0, dashboardData.newUsers24h, 2000, (value) => 
        setStatsProgress(prev => ({...prev, newUsers24h: value})));
    }
  }, [dashboardData]);

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">{t('common.loading')}</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold mb-6">{t('admin.dashboard')}</h1>
      
      {/* Admin Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('stats.users')}</p>
                <p className="text-3xl font-bold">{statsProgress.totalUsers.toLocaleString()}</p>
              </div>
              <div className="w-10 h-10 bg-primary bg-opacity-10 rounded-full flex items-center justify-center text-primary">
                <Users className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-success flex items-center">
                <ArrowUpCircle className="h-4 w-4 mr-1" />
                {dashboardData?.userGrowthRate}% {t('dashboard.last7Days')}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('stats.invested')}</p>
                <p className="text-3xl font-bold">{formatCurrency(statsProgress.totalInvested)}</p>
              </div>
              <div className="w-10 h-10 bg-success bg-opacity-10 rounded-full flex items-center justify-center text-success">
                <Wallet className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-success flex items-center">
                <ArrowUpCircle className="h-4 w-4 mr-1" />
                {dashboardData?.investmentGrowthRate}% {t('dashboard.last7Days')}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('stats.paid')}</p>
                <p className="text-3xl font-bold">{formatCurrency(statsProgress.totalPaid)}</p>
              </div>
              <div className="w-10 h-10 bg-secondary bg-opacity-10 rounded-full flex items-center justify-center text-secondary">
                <ArrowUpCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-sm text-success flex items-center">
                <ArrowUpCircle className="h-4 w-4 mr-1" />
                {dashboardData?.payoutGrowthRate}% {t('dashboard.last7Days')}
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{t('admin.pendingWithdrawals')}</p>
                <p className="text-3xl font-bold">{formatCurrency(dashboardData?.pendingWithdrawalsTotal || 0)}</p>
              </div>
              <div className="w-10 h-10 bg-amber-500 bg-opacity-10 rounded-full flex items-center justify-center text-amber-500">
                <Clock className="h-5 w-5" />
              </div>
            </div>
            <div className="flex items-center">
              <p className="text-sm flex items-center">
                <ArrowDownCircle className="h-4 w-4 mr-1" />
                {dashboardData?.pendingWithdrawalsCount} {t('admin.requests')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Users and Withdrawals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Users */}
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t('admin.newUsers')}</h2>
              <Button variant="link" asChild>
                <Link href="/admin/users">
                  <a>{t('admin.allUsers')}</a>
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.recentUsers?.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <AvatarPlaceholder 
                      name={user.fullName || user.username} 
                      className="mr-3"
                    />
                    <div>
                      <p className="font-medium">{user.fullName || user.username}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{t('dashboard.balance')}: {formatCurrency(user.balance)}</p>
                    <p className="text-xs text-gray-500">{user.timeAgo}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Pending Withdrawals */}
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold">{t('admin.pendingWithdrawals')}</h2>
              <Button variant="link" asChild>
                <Link href="/admin/withdrawals">
                  <a>{t('admin.allWithdrawals')}</a>
                </Link>
              </Button>
            </div>
            
            <div className="space-y-4">
              {dashboardData?.pendingWithdrawals?.map((withdrawal: any) => (
                <div key={withdrawal.id} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex justify-between mb-2">
                    <p className="font-medium">{withdrawal.user.username}</p>
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                      {t('common.pending')}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500 mb-2">
                    <p>ID: W-{withdrawal.id}</p>
                    <p>{withdrawal.timeAgo}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{formatCurrency(withdrawal.amount)}</p>
                    <div className="space-x-2">
                      <Button size="sm" variant="success" onClick={() => window.location.href = `/admin/withdrawals?action=approve&id=${withdrawal.id}`}>
                        {t('admin.approve')}
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => window.location.href = `/admin/withdrawals?action=reject&id=${withdrawal.id}`}>
                        {t('admin.reject')}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {!dashboardData?.pendingWithdrawals?.length && (
                <div className="text-center py-6 text-gray-500">
                  <p>{t('admin.noPendingWithdrawals')}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* User Activity Progress */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4">{t('stats.newUsers')}</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 dark:text-gray-400">{t('stats.progress')}</span>
              <span className="text-blue-500">{dashboardData?.newUsersProgress}/10</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
              <div 
                className="bg-blue-500 h-2.5 rounded-full progress-bar" 
                style={{ width: `${(dashboardData?.newUsersProgress / 10) * 100}%` }}
                data-width={`${(dashboardData?.newUsersProgress / 10) * 100}%`}
              ></div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i}
                  className={`aspect-square rounded-full ${i < (dashboardData?.newUsersProgress || 0) ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4">{t('stats.newDeposits')}</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 dark:text-gray-400">{t('stats.progress')}</span>
              <span className="text-green-500">{dashboardData?.newDepositsProgress}/10</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
              <div 
                className="bg-green-500 h-2.5 rounded-full progress-bar" 
                style={{ width: `${(dashboardData?.newDepositsProgress / 10) * 100}%` }}
                data-width={`${(dashboardData?.newDepositsProgress / 10) * 100}%`}
              ></div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i}
                  className={`aspect-square rounded-full ${i < (dashboardData?.newDepositsProgress || 0) ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white dark:bg-gray-800 rounded-xl shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-xl font-medium mb-4">{t('stats.newWithdrawals')}</h3>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 dark:text-gray-400">{t('stats.progress')}</span>
              <span className="text-amber-500">{dashboardData?.newWithdrawalsProgress}/10</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
              <div 
                className="bg-amber-500 h-2.5 rounded-full progress-bar" 
                style={{ width: `${(dashboardData?.newWithdrawalsProgress / 10) * 100}%` }}
                data-width={`${(dashboardData?.newWithdrawalsProgress / 10) * 100}%`}
              ></div>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i}
                  className={`aspect-square rounded-full ${i < (dashboardData?.newWithdrawalsProgress || 0) ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                ></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
