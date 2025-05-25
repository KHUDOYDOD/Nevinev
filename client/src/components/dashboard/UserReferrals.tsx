import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  Copy, 
  Check, 
  Share2, 
  UserPlus, 
  BadgeDollarSign, 
  Users,
  TrendingUp,
  Award,
  Sparkles,
  Facebook,
  Twitter,
  Mail,
  Telegram,
  Link
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

// Анимации
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Компонент для реферальной программы
const UserReferrals = ({ referrals = [], user = {} }) => {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  
  // Генерируем реферальную ссылку на основе данных пользователя
  const referralLink = user?.referralCode 
    ? `${window.location.origin}/?ref=${user.referralCode}` 
    : `${window.location.origin}/?ref=sample`;
  
  // Мок-данные рефералов, если они не переданы
  const mockReferrals = [
    {
      id: 1,
      username: "user1",
      registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
      hasDeposits: true,
      depositsAmount: 1000,
      earned: 50
    },
    {
      id: 2,
      username: "investor365",
      registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
      hasDeposits: true,
      depositsAmount: 500,
      earned: 25
    },
    {
      id: 3,
      username: "trader2025",
      registeredAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
      hasDeposits: false,
      depositsAmount: 0,
      earned: 0
    }
  ];
  
  // Используем переданные рефералы или мок-данные
  const allReferrals = referrals.length > 0 ? referrals : mockReferrals;
  
  // Получаем активных рефералов (с депозитами)
  const activeReferrals = allReferrals.filter(ref => ref.hasDeposits);
  
  // Рассчитываем общую сумму заработка
  const totalEarned = allReferrals.reduce((total, ref) => total + (ref.earned || 0), 0);
  
  // Общая сумма депозитов рефералов
  const totalDeposits = allReferrals.reduce((total, ref) => total + (ref.depositsAmount || 0), 0);
  
  // Копирование реферальной ссылки
  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast({
      title: t('success'),
      description: t('referral.linkCopied'),
      variant: "default"
    });
    
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Форматирование валюты
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Форматирование даты
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric'
    });
  };
  
  // Обработчик для шаринга в соцсети
  const handleShare = (platform) => {
    let shareUrl = '';
    const text = t('referral.shareText');
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(text)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(t('referral.emailSubject'))}&body=${encodeURIComponent(text + ' ' + referralLink)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };
  
  // Компонент для статистики
  const StatsCards = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
    >
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('referral.totalReferrals')}</p>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-blue-600 text-white flex items-center justify-center shadow-lg">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{allReferrals.length}</p>
        <div className="flex items-center mt-1 text-indigo-600 dark:text-indigo-400 text-sm">
          <UserPlus className="w-4 h-4 mr-1" />
          <span>{activeReferrals.length} {t('referral.active')}</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-950/30 dark:to-fuchsia-950/30 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('referral.totalEarned')}</p>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-fuchsia-600 text-white flex items-center justify-center shadow-lg">
            <BadgeDollarSign className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalEarned)}</p>
        <div className="flex items-center mt-1 text-purple-600 dark:text-purple-400 text-sm">
          <TrendingUp className="w-4 h-4 mr-1" />
          <span>+{formatCurrency(totalEarned * 0.1)} {t('common.thisWeek')}</span>
        </div>
      </motion.div>
      
      <motion.div variants={itemVariants} className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 p-4 rounded-xl">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm text-gray-600 dark:text-gray-300">{t('referral.totalInvested')}</p>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center shadow-lg">
            <Award className="w-4 h-4" />
          </div>
        </div>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{formatCurrency(totalDeposits)}</p>
        <div className="flex items-center mt-1 text-amber-600 dark:text-amber-400 text-sm">
          <Sparkles className="w-4 h-4 mr-1" />
          <span>{t('referral.byFriends')}</span>
        </div>
      </motion.div>
    </motion.div>
  );
  
  // Компонент для пустого состояния
  const EmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-10"
    >
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
        <UserPlus className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold mb-1">
        {t('referral.noReferrals')}
      </h3>
      <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-sm mx-auto">
        {t('referral.noReferralsDesc')}
      </p>
      <Button 
        variant="default" 
        onClick={() => setActiveTab("invite")}
        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
      >
        <Share2 className="h-4 w-4 mr-2" />
        {t('referral.inviteFriends')}
      </Button>
    </motion.div>
  );
  
  return (
    <div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="flex justify-between items-center mb-6">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-2xl font-bold text-gray-900 dark:text-white"
          >
            {t('dashboard.referrals')}
          </motion.h2>
          
          <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger
              value="overview"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              {t('common.overview')}
            </TabsTrigger>
            <TabsTrigger
              value="invite"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              {t('referral.invite')}
            </TabsTrigger>
          </TabsList>
        </div>
        
        <AnimatePresence mode="wait">
          <TabsContent value="overview" className="mt-0">
            {allReferrals.length > 0 ? (
              <>
                <StatsCards />
                
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  <motion.div 
                    variants={itemVariants}
                    className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
                  >
                    <div className="p-4 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/30 dark:to-blue-950/30 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                      <div>
                        <h3 className="font-semibold text-lg">{t('referral.yourReferrals')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('referral.earnFrom')}</p>
                      </div>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => setActiveTab("invite")}
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        <span className="hidden sm:inline">{t('referral.invite')}</span>
                      </Button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="hover:bg-transparent">
                            <TableHead>{t('common.user')}</TableHead>
                            <TableHead>{t('referral.registered')}</TableHead>
                            <TableHead>{t('referral.status')}</TableHead>
                            <TableHead>{t('referral.investments')}</TableHead>
                            <TableHead className="text-right">{t('referral.earnings')}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {allReferrals.map((referral, index) => (
                            <motion.tr
                              key={referral.id || index}
                              variants={itemVariants}
                              className="hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            >
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${referral.username}`} />
                                    <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white">
                                      {referral.username.substring(0, 2).toUpperCase()}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-medium">{referral.username}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatDate(referral.registeredAt)}
                              </TableCell>
                              <TableCell>
                                {referral.hasDeposits ? (
                                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 hover:bg-green-100">
                                    <Check className="h-3 w-3 mr-1" />
                                    {t('referral.active')}
                                  </Badge>
                                ) : (
                                  <Badge variant="outline">
                                    {t('referral.noDeposits')}
                                  </Badge>
                                )}
                              </TableCell>
                              <TableCell>
                                {referral.hasDeposits ? (
                                  <span className="font-medium">{formatCurrency(referral.depositsAmount || 0)}</span>
                                ) : (
                                  <span className="text-gray-500 dark:text-gray-400">-</span>
                                )}
                              </TableCell>
                              <TableCell className="text-right">
                                {referral.hasDeposits ? (
                                  <span className="font-medium text-green-600 dark:text-green-400">
                                    +{formatCurrency(referral.earned || 0)}
                                  </span>
                                ) : (
                                  <span className="text-gray-500 dark:text-gray-400">-</span>
                                )}
                              </TableCell>
                            </motion.tr>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                    
                    {allReferrals.length < 5 && (
                      <div className="p-5 text-center border-t border-gray-200 dark:border-gray-700">
                        <p className="text-gray-500 dark:text-gray-400 mb-3">{t('referral.inviteMore')}</p>
                        <Button
                          variant="outline"
                          onClick={() => setActiveTab("invite")}
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          {t('referral.inviteFriends')}
                        </Button>
                      </div>
                    )}
                  </motion.div>
                  
                  <motion.div
                    variants={itemVariants}
                    className="mt-6 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm p-5"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{t('referral.programDetails')}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{t('referral.earnPercentage')}</p>
                      </div>
                      <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 px-3 py-1 rounded-full text-sm font-medium">
                        5% {t('referral.cashback')}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center shrink-0">
                          <UserPlus className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{t('referral.step1')}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('referral.step1Desc')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                          <BadgeDollarSign className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{t('referral.step2')}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('referral.step2Desc')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4">
                        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                          <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                        <div>
                          <h4 className="font-medium">{t('referral.step3')}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {t('referral.step3Desc')}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-5 pt-5 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-center">
                        <Button
                          variant="default"
                          onClick={() => setActiveTab("invite")}
                          className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                        >
                          <Share2 className="h-4 w-4 mr-2" />
                          {t('referral.startInviting')}
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </>
            ) : (
              <EmptyState />
            )}
          </TabsContent>
          
          <TabsContent value="invite" className="mt-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
              >
                <div className="p-6 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 opacity-10">
                    <svg width="200" height="200" viewBox="0 0 200 200">
                      <path d="M40,60 Q60,10 100,50 Q140,90 160,60" stroke="currentColor" strokeWidth="8" fill="none" />
                      <path d="M160,60 Q180,30 190,80" stroke="currentColor" strokeWidth="8" fill="none" />
                      <circle cx="40" cy="60" r="10" fill="currentColor" />
                      <circle cx="160" cy="60" r="10" fill="currentColor" />
                      <circle cx="190" cy="80" r="10" fill="currentColor" />
                    </svg>
                  </div>
                  
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-2">{t('referral.yourReferralLink')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{t('referral.shareLink')}</p>
                    
                    <div className="flex gap-2 flex-col sm:flex-row">
                      <div className="relative flex-1">
                        <Input
                          value={referralLink}
                          readOnly
                          className="pr-20 font-mono text-sm bg-white dark:bg-gray-900"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyReferralLink}
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-8"
                        >
                          {copied ? (
                            <Check className="h-4 w-4 text-green-600 dark:text-green-400" />
                          ) : (
                            <Copy className="h-4 w-4" />
                          )}
                          <span className="ml-1.5">{copied ? t('common.copied') : t('common.copy')}</span>
                        </Button>
                      </div>
                      <Button
                        variant="default"
                        className="bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700"
                        onClick={() => setIsShareModalOpen(true)}
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        {t('referral.share')}
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-6">
                  <h4 className="font-semibold mb-4">{t('referral.shareOn')}</h4>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Button 
                      variant="outline" 
                      className="justify-start h-12 border-blue-100 dark:border-blue-900/30 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      onClick={() => handleShare('facebook')}
                    >
                      <Facebook className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                      Facebook
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-12 border-sky-100 dark:border-sky-900/30 hover:bg-sky-50 dark:hover:bg-sky-900/20"
                      onClick={() => handleShare('twitter')}
                    >
                      <Twitter className="h-5 w-5 text-sky-500 dark:text-sky-400 mr-2" />
                      Twitter
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-12 border-cyan-100 dark:border-cyan-900/30 hover:bg-cyan-50 dark:hover:bg-cyan-900/20"
                      onClick={() => handleShare('telegram')}
                    >
                      <Telegram className="h-5 w-5 text-cyan-500 dark:text-cyan-400 mr-2" />
                      Telegram
                    </Button>
                    <Button 
                      variant="outline" 
                      className="justify-start h-12 border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20"
                      onClick={() => handleShare('email')}
                    >
                      <Mail className="h-5 w-5 text-red-500 dark:text-red-400 mr-2" />
                      Email
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <h4 className="font-semibold mb-4">{t('referral.orShareText')}</h4>
                  
                  <div className="bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-4">
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {t('referral.shareTextTemplate')}
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mt-2 font-medium">
                      {referralLink}
                    </p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => {
                      const text = t('referral.shareTextTemplate') + ' ' + referralLink;
                      navigator.clipboard.writeText(text);
                      toast({
                        title: t('success'),
                        description: t('referral.textCopied'),
                        variant: "default"
                      });
                    }}
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {t('referral.copyText')}
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm p-6"
              >
                <h3 className="text-xl font-bold mb-4">{t('referral.benefits')}</h3>
                
                <div className="space-y-5">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center shrink-0">
                      <BadgeDollarSign className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{t('referral.benefit1')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('referral.benefit1Desc')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center shrink-0">
                      <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{t('referral.benefit2')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('referral.benefit2Desc')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center shrink-0">
                      <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">{t('referral.benefit3')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('referral.benefit3Desc')}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 p-4 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h5 className="font-medium">{t('referral.progress')}</h5>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('referral.nextTier')}: {allReferrals.length}/5
                      </p>
                    </div>
                    <Badge className="bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-100">
                      {t('referral.tier')} 1
                    </Badge>
                  </div>
                  
                  <Progress value={Math.min((allReferrals.length / 5) * 100, 100)} className="h-2" />
                  
                  <div className="mt-3 text-xs text-gray-500 dark:text-gray-400 flex justify-between">
                    <span>0</span>
                    <span>5 {t('referral.friends')}</span>
                    <span>10</span>
                    <span>20+</span>
                  </div>
                </div>
              </motion.div>
              
              {allReferrals.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="mt-6 flex justify-center"
                >
                  <Button 
                    variant="outline" 
                    onClick={() => setActiveTab("overview")}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    {t('referral.viewReferrals')}
                  </Button>
                </motion.div>
              )}
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default UserReferrals;