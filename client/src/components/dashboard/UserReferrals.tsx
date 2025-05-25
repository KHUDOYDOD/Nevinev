import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { Copy, Users, Link, Share2, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

// Временные данные для рефералов
const mockReferrals = [
  {
    id: 1,
    username: "aleksey87",
    registeredAt: new Date("2025-05-10"),
    hasDeposits: true,
    earnings: 100,
  },
  {
    id: 2,
    username: "svetlana123",
    registeredAt: new Date("2025-05-15"),
    hasDeposits: false,
    earnings: 0,
  }
];

export default function UserReferrals() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const referrals = mockReferrals;
  const referralCode = user?.referralCode || "YOUR_REF_CODE";
  const referralUrl = `https://tradepo.ru/register?ref=${referralCode}`;
  
  const totalEarnings = referrals.reduce((sum, ref) => sum + ref.earnings, 0);
  const activeReferrals = referrals.filter(ref => ref.hasDeposits).length;
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(referralCode);
    toast({
      title: t('dashboard.codeCopied'),
      description: t('dashboard.referralCodeCopied'),
    });
  };
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralUrl);
    toast({
      title: t('dashboard.linkCopied'),
      description: t('dashboard.referralLinkCopied'),
    });
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: t('dashboard.shareReferralTitle'),
        text: t('dashboard.shareReferralText'),
        url: referralUrl,
      });
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-indigo-600 to-purple-600"></div>
          <CardHeader className="pb-2">
            <CardTitle>{t('dashboard.yourReferralProgram')}</CardTitle>
            <CardDescription>{t('dashboard.referralProgramDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.totalReferrals')}</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{referrals.length}</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.activeReferrals')}</div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white">{activeReferrals}</div>
              </div>
              
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
                <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{t('dashboard.totalEarnings')}</div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {new Intl.NumberFormat('ru-RU', { 
                    style: 'currency', 
                    currency: 'USD',
                    maximumFractionDigits: 2
                  }).format(totalEarnings)}
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  {t('dashboard.yourReferralCode')}
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <Input 
                      value={referralCode}
                      readOnly
                      className="pr-10 bg-gray-50 dark:bg-gray-800 font-medium text-center"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={handleCopyCode}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Copy className="mr-2 h-4 w-4" /> {t('dashboard.copy')}
                    </Button>
                  </motion.div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 block">
                  {t('dashboard.yourReferralLink')}
                </label>
                <div className="flex space-x-2">
                  <div className="relative flex-grow">
                    <Input 
                      value={referralUrl}
                      readOnly
                      className="pr-10 bg-gray-50 dark:bg-gray-800 font-mono text-xs sm:text-sm truncate"
                    />
                  </div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={handleCopyLink}
                      variant="outline"
                      className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
                    >
                      <Link className="mr-2 h-4 w-4" /> {t('dashboard.copyLink')}
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button 
                      onClick={handleShare}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white"
                    >
                      <Share2 className="mr-2 h-4 w-4" /> {t('dashboard.share')}
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.yourReferrals')}</CardTitle>
            <CardDescription>{t('dashboard.referralsDescription')}</CardDescription>
          </CardHeader>
          <CardContent>
            {referrals.length === 0 ? (
              <div className="text-center py-8">
                <div className="mx-auto w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mb-4">
                  <Users className="h-8 w-8 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.noReferralsYet')}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">{t('dashboard.shareYourLink')}</p>
                <Button 
                  onClick={handleShare}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  <Share2 className="mr-2 h-4 w-4" /> {t('dashboard.inviteFriends')}
                </Button>
              </div>
            ) : (
              <div className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.user')}</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.registrationDate')}</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.status')}</th>
                        <th className="px-4 py-3 text-right text-sm font-medium text-gray-500 dark:text-gray-400">{t('dashboard.earnings')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {referrals.map((referral) => (
                        <motion.tr 
                          key={referral.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                          className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                        >
                          <td className="px-4 py-4 text-sm text-gray-900 dark:text-gray-100 font-medium">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center mr-3">
                                <span className="font-bold text-indigo-700 dark:text-indigo-400">
                                  {referral.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              {referral.username}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Intl.DateTimeFormat('ru-RU', {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric'
                            }).format(referral.registeredAt)}
                          </td>
                          <td className="px-4 py-4 text-sm">
                            {referral.hasDeposits ? (
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></div>
                                {t('dashboard.active')}
                              </div>
                            ) : (
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                                <div className="w-1.5 h-1.5 rounded-full bg-gray-500 mr-1.5"></div>
                                {t('dashboard.inactive')}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-4 text-sm text-right">
                            {referral.hasDeposits ? (
                              <div className="font-medium text-green-600 dark:text-green-400">
                                {new Intl.NumberFormat('ru-RU', { 
                                  style: 'currency', 
                                  currency: 'USD',
                                  maximumFractionDigits: 2
                                }).format(referral.earnings)}
                              </div>
                            ) : (
                              <div className="text-gray-500 dark:text-gray-400">
                                {t('dashboard.noDeposit')}
                              </div>
                            )}
                          </td>
                        </motion.tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.howReferralWorks')}</CardTitle>
            <CardDescription>{t('dashboard.referralExplanation')}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                  <Share2 className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.shareYourReferralLink')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('dashboard.shareYourReferralLinkDesc')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.friendsJoin')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('dashboard.friendsJoinDesc')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center mx-auto mb-4">
                  <Gift className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">{t('dashboard.earnRewards')}</h3>
                <p className="text-gray-500 dark:text-gray-400">{t('dashboard.earnRewardsDesc')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}