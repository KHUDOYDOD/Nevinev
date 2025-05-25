import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Copy, Users, TrendingUp, UserPlus, Link as LinkIcon } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

interface Referral {
  id: number;
  username: string;
  email: string;
  joinDate: Date;
  isActive: boolean;
  earned: number;
}

interface UserReferralsProps {
  referralCode: string;
  referrals: Referral[];
  totalEarned?: number;
}

export default function UserReferrals({ 
  referralCode, 
  referrals = [],
  totalEarned = 0
}: UserReferralsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  
  // Формирование реферальной ссылки
  const referralLink = `https://tradepo.ru/register?ref=${referralCode}`;
  
  // Форматирование чисел для отображения с 2 знаками после запятой
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };
  
  // Функция для форматирования даты
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }).format(date);
  };
  
  // Функция копирования реферальной ссылки
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setCopied(true);
      toast({
        title: t('dashboard.linkCopied'),
        description: t('dashboard.linkCopiedDesc')
      });
      
      setTimeout(() => setCopied(false), 2000);
    }).catch(err => {
      toast({
        title: t('common.error'),
        description: t('dashboard.copyError'),
        variant: "destructive"
      });
    });
  };
  
  // Функция создания приглашения
  const shareReferral = () => {
    try {
      if (navigator.share) {
        navigator.share({
          title: t('dashboard.inviteTitle'),
          text: t('dashboard.inviteText'),
          url: referralLink,
        });
      } else {
        copyReferralLink();
      }
    } catch (error) {
      copyReferralLink();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <Card className="border dark:border-gray-700">
        <CardHeader className="relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-indigo-500/10 to-blue-500/10" />
          <div className="relative">
            <CardTitle className="text-xl flex items-center">
              <Users className="h-5 w-5 mr-2 text-indigo-500" />
              {t('dashboard.referralProgram')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.referralProgramDescription')}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Реферальная ссылка */}
          <div className="rounded-lg border bg-card p-4 dark:border-gray-700">
            <h3 className="mb-2 text-sm font-medium">{t('dashboard.yourReferralLink')} </h3>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <LinkIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                <Input
                  value={referralLink}
                  readOnly
                  className="pl-8 pr-24 text-sm font-mono bg-white dark:bg-gray-800"
                />
              </div>
              <Button
                onClick={copyReferralLink}
                variant="outline"
                className={copied ? "bg-green-50 text-green-600 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800" : "border-indigo-500 text-indigo-600 hover:bg-indigo-50 dark:text-indigo-400 dark:hover:bg-gray-800"}
              >
                {copied ? (
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M5 12L10 17L20 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {t('dashboard.copied')}
                  </span>
                ) : (
                  <span className="flex items-center">
                    <Copy className="w-4 h-4 mr-1" />
                    {t('dashboard.copy')}
                  </span>
                )}
              </Button>
              <Button
                onClick={shareReferral}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <UserPlus className="w-4 h-4 mr-1" />
                {t('dashboard.invite')}
              </Button>
            </div>
          </div>
          
          {/* Статистика */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/40 border-indigo-100 dark:border-indigo-900">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mb-2">
                  <UserPlus className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.refList')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">{referrals.length}</p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/40 dark:to-emerald-950/40 border-green-100 dark:border-green-900">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/50 flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.active')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {referrals.filter(r => r.isActive).length}
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gradient-to-br from-purple-50 to-fuchsia-50 dark:from-purple-950/40 dark:to-fuchsia-950/40 border-purple-100 dark:border-purple-900">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center mb-2">
                  <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.earned')}</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-gray-50">
                  {formatCurrency(totalEarned)}
                </p>
              </CardContent>
            </Card>
          </div>
          
          {/* Список рефералов */}
          {referrals.length > 0 ? (
            <div className="rounded-md border dark:border-gray-700 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50 dark:bg-gray-800">
                    <TableHead>{t('dashboard.username')}</TableHead>
                    <TableHead className="hidden md:table-cell">{t('dashboard.email')}</TableHead>
                    <TableHead className="hidden sm:table-cell">{t('dashboard.joinDate')}</TableHead>
                    <TableHead>{t('dashboard.status')}</TableHead>
                    <TableHead className="text-right">{t('dashboard.earned')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {/* Демонстрационные данные для отображения */}
                  {[
                    {
                      id: 1,
                      username: 'invest2025',
                      email: 'invest2025@example.com',
                      joinDate: new Date(2025, 4, 10),
                      isActive: true,
                      earned: 75.25
                    },
                    {
                      id: 2,
                      username: 'trader555',
                      email: 'trader555@example.com',
                      joinDate: new Date(2025, 4, 15),
                      isActive: true,
                      earned: 120.50
                    },
                    {
                      id: 3,
                      username: 'moneymaker',
                      email: 'moneymaker@example.com',
                      joinDate: new Date(2025, 4, 20),
                      isActive: false,
                      earned: 0
                    }
                  ].map((referral) => (
                    <TableRow key={referral.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                      <TableCell className="font-medium">{referral.username}</TableCell>
                      <TableCell className="hidden md:table-cell">{referral.email}</TableCell>
                      <TableCell className="hidden sm:table-cell">{formatDate(referral.joinDate)}</TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          referral.isActive 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' 
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400'
                        }`}>
                          {referral.isActive ? t('dashboard.active') : t('dashboard.inactive')}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`font-medium ${
                          referral.earned > 0 
                            ? 'text-green-600 dark:text-green-400' 
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {formatCurrency(referral.earned)}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                <Users className="h-6 w-6 text-gray-500 dark:text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t('dashboard.noReferrals')}</h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
                {t('dashboard.noReferralsDesc')}
              </p>
              <Button 
                onClick={shareReferral}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <UserPlus className="h-4 w-4 mr-2" />
                {t('dashboard.inviteFriends')}
              </Button>
            </div>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center border-t p-4">
          <p className="text-sm text-center text-gray-500 dark:text-gray-400">
            {t('dashboard.referralProgramNote')}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}