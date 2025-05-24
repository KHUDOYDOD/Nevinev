import { useLanguage } from "@/hooks/use-language";
import { Container } from "@/components/ui/container";
import { CurrencyFormatter } from "@/components/ui/currency-formatter";

export function ActivitySection() {
  const { t } = useLanguage();

  // Sample data for demonstration - this would be replaced with real data from API
  const newUsers = Array.from({ length: 5 }, (_, i) => ({
    initials: t(`activity.users.${i}.initials`),
    name: t(`activity.users.${i}.name`),
    time: t(`activity.users.${i}.time`),
    bgColor: i % 5 === 0 ? "bg-primary" : 
             i % 5 === 1 ? "bg-secondary" : 
             i % 5 === 2 ? "bg-accent" : 
             i % 5 === 3 ? "bg-success" : "bg-primary"
  }));

  const newDeposits = Array.from({ length: 5 }, (_, i) => ({
    name: t(`activity.deposits.${i}.name`),
    tariff: t(`activity.deposits.${i}.tariff`),
    amount: [1450, 750, 250, 2100, 800][i],
    time: t(`activity.deposits.${i}.time`)
  }));

  const newWithdrawals = Array.from({ length: 5 }, (_, i) => ({
    name: t(`activity.withdrawals.${i}.name`),
    type: t(`activity.withdrawals.${i}.type`),
    amount: [380, 125, 1750, 430, 290][i],
    time: t(`activity.withdrawals.${i}.time`)
  }));

  return (
    <section className="py-16 bg-white">
      <Container>
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{t('activity.title')}</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">{t('activity.subtitle')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* New Users */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">{t('activity.new_users')}</h3>
            <ul className="space-y-4 max-h-80 overflow-y-auto">
              {newUsers.map((user, index) => (
                <li key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className={`w-10 h-10 rounded-full ${user.bgColor} flex items-center justify-center text-white font-bold`}>
                    {user.initials}
                  </div>
                  <div className="ml-3">
                    <p className="font-medium">{user.name}</p>
                    <p className="text-sm text-gray-500">{user.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* New Deposits */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">{t('activity.new_deposits')}</h3>
            <ul className="space-y-4 max-h-80 overflow-y-auto">
              {newDeposits.map((deposit, index) => (
                <li key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-success flex items-center justify-center text-white">
                    <i className="fas fa-arrow-up"></i>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium">{deposit.name}</p>
                    <p className="text-sm text-gray-500">{deposit.tariff}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-success">
                      <CurrencyFormatter value={deposit.amount} />
                    </p>
                    <p className="text-xs text-gray-500">{deposit.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* New Withdrawals */}
          <div className="bg-gray-50 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4">{t('activity.latest_withdrawals')}</h3>
            <ul className="space-y-4 max-h-80 overflow-y-auto">
              {newWithdrawals.map((withdrawal, index) => (
                <li key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white">
                    <i className="fas fa-arrow-down"></i>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="font-medium">{withdrawal.name}</p>
                    <p className="text-sm text-gray-500">{withdrawal.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">
                      <CurrencyFormatter value={withdrawal.amount} />
                    </p>
                    <p className="text-xs text-gray-500">{withdrawal.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
