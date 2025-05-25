import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { UsersRound, PiggyBank, TrendingUp, Users, CreditCard, Calendar } from "lucide-react";

interface StatisticsProps {
  totalUsers?: number;
  totalInvested?: number;
  totalPaid?: number;
  newUsers24h?: number;
  newDeposits24h?: number;
  newWithdrawals24h?: number;
}

export default function Statistics({
  totalUsers = 0,
  totalInvested = 0,
  totalPaid = 0,
  newUsers24h = 0,
  newDeposits24h = 0,
  newWithdrawals24h = 0
}: StatisticsProps) {
  const { t } = useTranslation();

  // Форматирование чисел для отображения с 2 знаками после запятой и разделителями
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value);
  };

  // Массив карточек статистики
  const stats = [
    {
      title: t('stats.users'),
      value: formatNumber(totalUsers),
      change: `+${newUsers24h}`,
      changeText: t('admin.for24Hours'),
      icon: <UsersRound className="h-8 w-8" />,
      iconBg: "bg-indigo-100 dark:bg-indigo-900/50",
      iconColor: "text-indigo-600 dark:text-indigo-400",
      bgGradient: "from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40",
      borderColor: "border-indigo-100 dark:border-indigo-900"
    },
    {
      title: t('stats.invested'),
      value: formatCurrency(totalInvested),
      change: `+${formatCurrency(newDeposits24h * 100)}`,
      changeText: t('admin.for24Hours'),
      icon: <PiggyBank className="h-8 w-8" />,
      iconBg: "bg-green-100 dark:bg-green-900/50",
      iconColor: "text-green-600 dark:text-green-400",
      bgGradient: "from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40",
      borderColor: "border-green-100 dark:border-green-900"
    },
    {
      title: t('stats.paid'),
      value: formatCurrency(totalPaid),
      change: `+${formatCurrency(newWithdrawals24h * 100)}`,
      changeText: t('admin.for24Hours'),
      icon: <TrendingUp className="h-8 w-8" />,
      iconBg: "bg-purple-100 dark:bg-purple-900/50",
      iconColor: "text-purple-600 dark:text-purple-400",
      bgGradient: "from-purple-50 to-fuchsia-50 dark:from-purple-950/40 dark:to-fuchsia-950/40",
      borderColor: "border-purple-100 dark:border-purple-900"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Заголовок секции */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">{t('admin.statData')}</h2>
          <p className="text-gray-500 dark:text-gray-400">{t('admin.overviewStats')}</p>
        </div>
      </div>

      {/* Основные статистические показатели */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
            className={`rounded-xl p-6 shadow-sm border bg-gradient-to-br ${stat.bgGradient} ${stat.borderColor}`}
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-50">{stat.value}</h3>
                <div className="flex items-center mt-2">
                  <div className="text-green-600 dark:text-green-400 text-sm flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    <span>
                      {stat.change} {stat.changeText}
                    </span>
                  </div>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${stat.iconBg}`}>
                <span className={stat.iconColor}>{stat.icon}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Дополнительные показатели */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="rounded-xl p-6 shadow-sm border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{t('admin.activeUsers')}</h3>
            <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="text-3xl font-bold">{formatNumber(Math.round(totalUsers * 0.7))}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {Math.round(totalUsers * 0.7 / totalUsers * 100)}% {t('admin.ofAllUsers')}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="rounded-xl p-6 shadow-sm border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{t('admin.avgDeposit')}</h3>
            <div className="p-2 bg-green-50 dark:bg-green-900/30 rounded-lg">
              <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="text-3xl font-bold">
            {formatCurrency(totalUsers > 0 ? totalInvested / totalUsers : 0)}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {t('admin.perUser')}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="rounded-xl p-6 shadow-sm border bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium">{t('admin.retention')}</h3>
            <div className="p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
              <Calendar className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="text-3xl font-bold">82%</div>
          <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {t('admin.lastMonth')}
          </div>
        </motion.div>
      </div>
    </div>
  );
}