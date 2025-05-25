import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Copy, 
  Users, 
  Link as LinkIcon,
  Award,
  DollarSign,
  BadgeCheck,
  Share2,
  ExternalLink,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface Referral {
  id: number;
  username: string;
  email: string;
  joinDate: string;
  hasDeposits: boolean;
  totalDeposits?: number;
}

interface UserReferralsProps {
  referralCode: string;
  referrals: Referral[];
  totalEarnings: number;
}

export default function UserReferrals({ 
  referralCode = "REF12345", 
  referrals = [], 
  totalEarnings = 0 
}: UserReferralsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [referralLink] = useState(`https://tradepo.ru/?ref=${referralCode}`);
  
  // Расчет количества активных и неактивных рефералов
  const activeReferrals = referrals.filter(ref => ref.hasDeposits).length;
  const pendingReferrals = referrals.length - activeReferrals;

  // Функция копирования в буфер обмена
  const copyToClipboard = (text: string, message: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: t('dashboard.copied'),
      description: message,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Users className="h-5 w-5 mr-2 text-indigo-500" />
            {t('dashboard.referralProgram')}
          </CardTitle>
          <CardDescription>
            {t('dashboard.referralProgramDesc')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          {/* Реферальная ссылка */}
          <div className="bg-gradient-to-r from-violet-100 to-indigo-100 dark:from-violet-900/30 dark:to-indigo-900/30 p-4 rounded-lg mb-6">
            <h3 className="text-md font-medium mb-2 flex items-center">
              <LinkIcon className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
              {t('dashboard.yourReferralLink')}
            </h3>
            
            <div className="flex items-center space-x-2">
              <div className="relative flex-1">
                <Input 
                  readOnly 
                  value={referralLink}
                  className="pr-10 bg-white/80 dark:bg-gray-800/80 border-indigo-200 dark:border-indigo-800"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute right-0 top-0 h-full text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
                  onClick={() => copyToClipboard(referralLink, t('dashboard.referralLinkCopied'))}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              
              <Button 
                variant="default"
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
                onClick={() => {
                  // Поделиться ссылкой
                  if (navigator.share) {
                    navigator.share({
                      title: t('dashboard.inviteToTradepo'),
                      text: t('dashboard.inviteText'),
                      url: referralLink
                    });
                  } else {
                    copyToClipboard(referralLink, t('dashboard.referralLinkCopied'));
                  }
                }}
              >
                <Share2 className="h-4 w-4 mr-1" />
                {t('dashboard.share')}
              </Button>
            </div>
            
            <div className="flex flex-wrap mt-4 gap-2">
              <div className="text-xs text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-gray-800/50 px-3 py-1.5 rounded-full flex items-center">
                <Award className="h-3 w-3 mr-1" />
                <span>{t('dashboard.referralBonus')}: 5%</span>
              </div>
              
              <div className="text-xs text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-gray-800/50 px-3 py-1.5 rounded-full flex items-center">
                <BadgeCheck className="h-3 w-3 mr-1" />
                <span>{t('dashboard.instantPayouts')}</span>
              </div>
              
              <div className="text-xs text-indigo-700 dark:text-indigo-300 bg-white/80 dark:bg-gray-800/50 px-3 py-1.5 rounded-full flex items-center">
                <DollarSign className="h-3 w-3 mr-1" />
                <span>{t('dashboard.unlimitedEarnings')}</span>
              </div>
            </div>
          </div>
          
          {/* Статистика */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {referrals.length}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <Users className="h-4 w-4 mr-1" />
                {t('dashboard.totalReferrals')}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <div className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-1">
                ${totalEarnings.toLocaleString()}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <DollarSign className="h-4 w-4 mr-1" />
                {t('dashboard.totalEarnings')}
              </div>
            </div>
            
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 border border-gray-100 dark:border-gray-700">
              <div className="flex items-center space-x-1">
                <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">{activeReferrals}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">/ {referrals.length}</span>
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <BadgeCheck className="h-4 w-4 mr-1" />
                {t('dashboard.activeReferrals')}
              </div>
            </div>
          </div>
          
          {/* Таблица рефералов */}
          {referrals.length > 0 ? (
            <Table>
              <TableCaption>{t('dashboard.referralsTableCaption')}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('dashboard.user')}</TableHead>
                  <TableHead>{t('dashboard.email')}</TableHead>
                  <TableHead>{t('dashboard.joinDate')}</TableHead>
                  <TableHead>{t('dashboard.status')}</TableHead>
                  <TableHead>{t('dashboard.earnings')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral) => (
                  <TableRow key={referral.id}>
                    <TableCell className="font-medium">{referral.username}</TableCell>
                    <TableCell>{referral.email}</TableCell>
                    <TableCell>
                      {new Date(referral.joinDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {referral.hasDeposits ? (
                        <Badge className="bg-green-500 hover:bg-green-600">
                          <BadgeCheck className="h-3 w-3 mr-1" />
                          {t('dashboard.active')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-amber-600 border-amber-600">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          {t('dashboard.pending')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {referral.hasDeposits && referral.totalDeposits ? (
                        <span className="text-green-600 dark:text-green-400">
                          ${(referral.totalDeposits * 0.05).toLocaleString()}
                        </span>
                      ) : (
                        <span className="text-gray-400">$0</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-10 border border-dashed rounded-lg">
              <div className="flex justify-center mb-2">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t('dashboard.noReferralsYet')}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                {t('dashboard.inviteFriendsToEarn')}
              </p>
              <Button 
                onClick={() => copyToClipboard(referralLink, t('dashboard.referralLinkCopied'))}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
              >
                <Copy className="h-4 w-4 mr-2" />
                {t('dashboard.copyLink')}
              </Button>
            </div>
          )}
          
          {/* Промо-материалы */}
          <div className="mt-6">
            <h3 className="text-md font-medium mb-4 flex items-center">
              <ExternalLink className="h-4 w-4 mr-2 text-indigo-600 dark:text-indigo-400" />
              {t('dashboard.promoMaterials')}
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <Button 
                variant="outline"
                className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                onClick={() => window.open('/promo/banners', '_blank')}
              >
                {t('dashboard.banners')}
              </Button>
              
              <Button 
                variant="outline"
                className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                onClick={() => window.open('/promo/social', '_blank')}
              >
                {t('dashboard.socialMedia')}
              </Button>
              
              <Button 
                variant="outline"
                className="border-indigo-200 dark:border-indigo-800 hover:bg-indigo-50 dark:hover:bg-indigo-900/30"
                onClick={() => window.open('/promo/email', '_blank')}
              >
                {t('dashboard.emailTemplates')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}