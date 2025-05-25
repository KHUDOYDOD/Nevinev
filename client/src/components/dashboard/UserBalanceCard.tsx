import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  CreditCard, 
  ArrowDown, 
  ArrowUp, 
  ChevronUp, 
  Wallet, 
  RefreshCw 
} from "lucide-react";
import { motion } from "framer-motion";

interface UserBalanceCardProps {
  balance: number;
  onDeposit: () => void;
  onWithdraw: () => void;
}

export default function UserBalanceCard({ 
  balance, 
  onDeposit, 
  onWithdraw 
}: UserBalanceCardProps) {
  const { t } = useTranslation();

  // Анимированная карточка с балансом
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full"
    >
      <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-blue-600 to-purple-700 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Wallet className="h-5 w-5" />
            <span>{t('dashboard.yourBalance')}</span>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="grid gap-4">
            <div className="flex items-center justify-center my-4">
              <div className="text-center">
                <div className="relative">
                  <motion.div 
                    className="text-4xl font-bold"
                    key={balance}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  >
                    ${balance.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </motion.div>
                  
                  <motion.div 
                    className="absolute -top-1 -right-6 flex items-center text-sm text-green-300"
                    animate={{ 
                      y: [0, -10, 0],
                      opacity: [1, 0.8, 1]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "loop" 
                    }}
                  >
                    <ChevronUp className="h-4 w-4 mr-0.5" />
                    <span>2.5%</span>
                  </motion.div>
                </div>
                
                <div className="mt-2 text-xs text-blue-100 flex items-center justify-center space-x-1">
                  <RefreshCw className="h-3 w-3" />
                  <span>{t('dashboard.lastUpdated')}: 2 {t('dashboard.minAgo')}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-2">
              <Button 
                onClick={onDeposit}
                className="bg-green-500/90 hover:bg-green-600 text-white rounded-lg transition-all hover:shadow-lg"
              >
                <ArrowDown className="h-4 w-4 mr-2" />
                {t('dashboard.deposit')}
              </Button>
              
              <Button 
                onClick={onWithdraw}
                className="bg-blue-500/90 hover:bg-blue-600 text-white rounded-lg transition-all hover:shadow-lg"
              >
                <ArrowUp className="h-4 w-4 mr-2" />
                {t('dashboard.withdraw')}
              </Button>
            </div>
            
            <div className="p-3 bg-blue-800/30 rounded-lg mt-2">
              <div className="flex items-center text-xs text-blue-100">
                <CreditCard className="h-4 w-4 mr-2 text-blue-200" />
                <div className="flex flex-col">
                  <span className="font-medium">{t('dashboard.paymentMethods')}</span>
                  <span className="text-xs opacity-75">{t('dashboard.multipleMethodsAvailable')}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}