import { useEffect, useState } from "react";
import { useLanguage } from "@/hooks/use-language";
import { useQuery } from "@tanstack/react-query";
import { Container } from "@/components/ui/container";
import { CurrencyFormatter } from "@/components/ui/currency-formatter";
import { Stats } from "@/lib/types";

export function StatsSection() {
  const { t } = useLanguage();
  
  const { data: stats } = useQuery<{ stats: Stats }>({
    queryKey: ['/api/stats'],
  });

  const [animated, setAnimated] = useState(false);
  const [displayedUsers, setDisplayedUsers] = useState(0);
  const [displayedInvested, setDisplayedInvested] = useState(0);
  const [displayedPaid, setDisplayedPaid] = useState(0);

  useEffect(() => {
    if (stats && !animated) {
      const totalUsers = stats.stats.totalUsers;
      const totalInvested = parseFloat(stats.stats.totalInvested.toString());
      const totalPaid = parseFloat(stats.stats.totalPaid.toString());
      
      let startTime: number | null = null;
      const duration = 2000; // 2 seconds

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        setDisplayedUsers(Math.floor(progress * totalUsers));
        setDisplayedInvested(progress * totalInvested);
        setDisplayedPaid(progress * totalPaid);

        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setAnimated(true);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [stats, animated]);

  return (
    <section className="bg-white py-8">
      <Container>
        <div className="flex flex-wrap justify-center text-center">
          <div className="w-full md:w-1/3 p-4">
            <div className="p-6">
              <p className="text-gray-500 uppercase text-sm font-semibold tracking-wider">
                {t('stats.invested')}
              </p>
              <p className="text-4xl font-bold text-primary mt-2">
                <CurrencyFormatter value={displayedInvested} />
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="p-6">
              <p className="text-gray-500 uppercase text-sm font-semibold tracking-wider">
                {t('stats.paid')}
              </p>
              <p className="text-4xl font-bold text-success mt-2">
                <CurrencyFormatter value={displayedPaid} />
              </p>
            </div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <div className="p-6">
              <p className="text-gray-500 uppercase text-sm font-semibold tracking-wider">
                {t('stats.users')}
              </p>
              <p className="text-4xl font-bold text-secondary mt-2">
                {displayedUsers.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
