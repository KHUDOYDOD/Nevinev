import { useQuery } from '@tanstack/react-query';
import { useTranslation } from '@/i18n';
import { formatCurrency, formatTimeAgo, getInitials, generateRandomColor } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowUpIcon, ArrowDownIcon, UserPlusIcon } from 'lucide-react';

interface ActivityFeedProps {
  type: 'users' | 'deposits' | 'withdrawals';
}

interface User {
  username: string;
  fullName: string;
  createdAt: string;
}

interface Deposit {
  username: string;
  amount: number;
  tariffName: string;
  createdAt: string;
}

interface Withdrawal {
  username: string;
  amount: number;
  createdAt: string;
}

interface PlatformStats {
  totalUsers: number;
  totalInvested: number;
  totalPaid: number;
  newUsers: User[];
  newDeposits: Deposit[];
  newWithdrawals: Withdrawal[];
}

export function ActivityFeed({ type }: ActivityFeedProps) {
  const { t } = useTranslation();
  
  const { data } = useQuery<PlatformStats>({
    queryKey: ['/api/statistics'],
  });
  
  if (!data) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  let items: React.ReactNode[] = [];
  let title = '';
  
  switch(type) {
    case 'users':
      title = t('home.stats.newUsers');
      items = data.newUsers.map((user, index) => (
        <div key={index} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition">
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-3"
            style={{ backgroundColor: generateRandomColor(user.username) }}
          >
            {getInitials(user.fullName)}
          </div>
          <div className="flex-1">
            <p className="font-medium">{user.username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatTimeAgo(new Date(user.createdAt))}</p>
          </div>
        </div>
      ));
      break;
    
    case 'deposits':
      title = t('home.stats.newDeposits');
      items = data.newDeposits.map((deposit, index) => (
        <div key={index} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-full bg-green-500 dark:bg-green-600 flex items-center justify-center text-white mr-3">
            <ArrowUpIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{deposit.username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{deposit.tariffName}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-green-600 dark:text-green-400">{formatCurrency(deposit.amount)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(new Date(deposit.createdAt))}</p>
          </div>
        </div>
      ));
      break;
    
    case 'withdrawals':
      title = t('home.stats.newWithdrawals');
      items = data.newWithdrawals.map((withdrawal, index) => (
        <div key={index} className="flex items-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm hover:shadow-md transition">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white mr-3">
            <ArrowDownIcon className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-medium">{withdrawal.username}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.transactions.withdrawal')}</p>
          </div>
          <div className="text-right">
            <p className="font-bold text-primary">{formatCurrency(withdrawal.amount)}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{formatTimeAgo(new Date(withdrawal.createdAt))}</p>
          </div>
        </div>
      ));
      break;
  }
  
  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-xl p-6 h-full">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ScrollArea className="h-80">
        <div className="space-y-4">
          {items.length > 0 ? items : (
            <div className="flex flex-col items-center justify-center h-40 text-gray-500 dark:text-gray-400">
              <UserPlusIcon className="h-8 w-8 mb-2 opacity-50" />
              <p>No data available</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
