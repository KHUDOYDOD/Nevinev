import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Users, DollarSign, ArrowUpRight, ArrowDownRight } from "lucide-react";

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

  const stats = [
    {
      title: t("statistics.totalUsers"),
      value: totalUsers,
      icon: <Users className="h-5 w-5 text-blue-500" />,
      change: newUsers24h,
      isPositive: true,
      description: t("statistics.for24Hours")
    },
    {
      title: t("statistics.totalInvested"),
      value: `$${totalInvested.toLocaleString()}`,
      icon: <DollarSign className="h-5 w-5 text-green-500" />,
      change: newDeposits24h,
      isPositive: true,
      description: t("statistics.for24Hours")
    },
    {
      title: t("statistics.totalPaid"),
      value: `$${totalPaid.toLocaleString()}`,
      icon: <DollarSign className="h-5 w-5 text-purple-500" />,
      change: newWithdrawals24h,
      isPositive: false,
      description: t("statistics.for24Hours")
    }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat, index) => (
        <Card key={index} className="animate-fade-in animate-duration-normal" style={{ animationDelay: `${index * 100}ms` }}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className="p-2 bg-muted rounded-full">
              {stat.icon}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <div className="flex items-center pt-1 text-xs text-muted-foreground">
              {stat.isPositive ? (
                <ArrowUpRight className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownRight className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span className={stat.isPositive ? "text-green-500" : "text-red-500"}>
                {stat.change}
              </span>
              <span className="ml-1">{stat.description}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}