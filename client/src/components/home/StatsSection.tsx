import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

const StatsSection = () => {
  const { t } = useTranslation();
  
  const { data: statistics, isLoading } = useQuery({
    queryKey: ['/api/statistics'],
    staleTime: 60000, // 1 minute
  });

  return (
    <section className="bg-white py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-center text-center">
          <div className="w-full md:w-1/3 p-4">
            <motion.div
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-gray-500 uppercase text-sm font-semibold tracking-wider">
                {t("stats.invested")}
              </p>
              {isLoading ? (
                <Skeleton className="h-10 w-36 mx-auto mt-2" />
              ) : (
                <p className="text-4xl font-bold text-primary mt-2">
                  $
                  {statistics?.totalDeposits?.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  }) || "0"}
                </p>
              )}
            </motion.div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <motion.div
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <p className="text-gray-500 uppercase text-sm font-semibold tracking-wider">
                {t("stats.paid")}
              </p>
              {isLoading ? (
                <Skeleton className="h-10 w-36 mx-auto mt-2" />
              ) : (
                <p className="text-4xl font-bold text-success mt-2">
                  $
                  {statistics?.totalWithdrawals?.toLocaleString(undefined, {
                    maximumFractionDigits: 0,
                  }) || "0"}
                </p>
              )}
            </motion.div>
          </div>
          <div className="w-full md:w-1/3 p-4">
            <motion.div
              className="p-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <p className="text-gray-500 uppercase text-sm font-semibold tracking-wider">
                {t("stats.users")}
              </p>
              {isLoading ? (
                <Skeleton className="h-10 w-36 mx-auto mt-2" />
              ) : (
                <p className="text-4xl font-bold text-secondary mt-2">
                  {statistics?.totalUsers?.toLocaleString() || "0"}
                </p>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
