import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ActivityItem {
  id: number;
  name: string;
  timeAgo: string;
  initial?: string;
}

interface DepositItem extends ActivityItem {
  plan: string;
  amount: number;
}

interface WithdrawalItem extends ActivityItem {
  type: string;
  amount: number;
}

interface ActivityData {
  newUsers: ActivityItem[];
  newDeposits: DepositItem[];
  newWithdrawals: WithdrawalItem[];
}

const getRandomColor = (index: number) => {
  const colors = ["bg-primary", "bg-secondary", "bg-accent", "bg-success"];
  return colors[index % colors.length];
};

const ActivitySection = () => {
  const { t } = useTranslation();
  const [activityData, setActivityData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/fake-activity");
        const data = await response.json();
        setActivityData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching activity data:", error);
        setLoading(false);
      }
    };

    fetchData();

    // Auto-refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const renderActivityItems = (
    items: ActivityItem[] | DepositItem[] | WithdrawalItem[],
    renderItem: (item: any, index: number) => JSX.Element
  ) => {
    if (loading) {
      return Array(5)
        .fill(0)
        .map((_, index) => (
          <motion.li
            key={`skeleton-${index}`}
            className="flex items-center p-3 bg-white rounded-lg shadow-sm animate-pulse"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
          >
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div className="ml-3 flex-1">
              <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
              <div className="h-3 bg-gray-100 rounded w-16"></div>
            </div>
          </motion.li>
        ));
    }

    if (!activityData) {
      return (
        <li className="p-4 text-center text-gray-500">
          {t("common.loading")}
        </li>
      );
    }

    return items.map((item, index) => renderItem(item, index));
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Активность платформы
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Следите за ростом нашей платформы в режиме реального времени.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Новые пользователи</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[320px]">
                  <ul className="space-y-4 p-4">
                    {renderActivityItems(
                      activityData?.newUsers || [],
                      (user, index) => (
                        <motion.li
                          key={user.id}
                          className="flex items-center p-3 bg-white rounded-lg shadow-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div
                            className={`w-10 h-10 rounded-full ${getRandomColor(
                              index
                            )} flex items-center justify-center text-white font-bold`}
                          >
                            {user.initial || user.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-500">
                              {user.timeAgo}
                            </p>
                          </div>
                        </motion.li>
                      )
                    )}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Новые депозиты</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[320px]">
                  <ul className="space-y-4 p-4">
                    {renderActivityItems(
                      activityData?.newDeposits || [],
                      (deposit, index) => (
                        <motion.li
                          key={deposit.id}
                          className="flex items-center p-3 bg-white rounded-lg shadow-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-white">
                            <i className="fas fa-arrow-up"></i>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="font-medium">{deposit.name}</p>
                            <p className="text-sm text-gray-500">
                              Тариф: {deposit.plan}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-success">
                              ${deposit.amount}
                            </p>
                            <p className="text-xs text-gray-500">
                              {deposit.timeAgo}
                            </p>
                          </div>
                        </motion.li>
                      )
                    )}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Последние выводы</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[320px]">
                  <ul className="space-y-4 p-4">
                    {renderActivityItems(
                      activityData?.newWithdrawals || [],
                      (withdrawal, index) => (
                        <motion.li
                          key={withdrawal.id}
                          className="flex items-center p-3 bg-white rounded-lg shadow-sm"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                            <i className="fas fa-arrow-down"></i>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="font-medium">{withdrawal.name}</p>
                            <p className="text-sm text-gray-500">
                              {withdrawal.type}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-primary">
                              ${withdrawal.amount}
                            </p>
                            <p className="text-xs text-gray-500">
                              {withdrawal.timeAgo}
                            </p>
                          </div>
                        </motion.li>
                      )
                    )}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ActivitySection;
