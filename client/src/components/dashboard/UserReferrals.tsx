import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { 
  UserPlus, 
  DollarSign, 
  Users, 
  Copy, 
  CheckCircle2, 
  Share2,
  CalendarDays,
  PieChart,
  ArrowUpRight,
  HelpCircle
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

// Анимации для карточек
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  })
};

interface UserReferralsProps {
  referrals: any[];
  user: any;
}

export default function UserReferrals({ referrals = [], user }: UserReferralsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [isCopied, setIsCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("info");

  // Реферальный код пользователя
  const referralCode = user?.referralCode || "ABC123";
  const referralLink = `${window.location.origin}/?ref=${referralCode}`;

  // Форматирование валюты
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Форматирование даты
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Обработчик копирования реферальной ссылки
  const handleCopyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    toast({
      title: t('referrals.copied'),
      description: t('referrals.linkCopied'),
    });
  };

  // Обработчик поделиться в социальных сетях
  const handleShare = (platform: string) => {
    let shareUrl = '';
    const message = t('referrals.shareMessage');
    
    switch (platform) {
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(message + ' ' + referralLink)}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}&quote=${encodeURIComponent(message)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}&url=${encodeURIComponent(referralLink)}`;
        break;
      default:
        return;
    }
    
    window.open(shareUrl, '_blank');
  };

  // Расчет общего заработка с рефералов
  const totalEarnings = referrals.reduce((sum, referral) => sum + (referral.earnings || 0), 0);

  // Компонент статистики
  const ReferralStats = () => {
    // Примеры данных для визуализации
    const referralsCount = referrals.length;
    const activeReferrals = referrals.filter(ref => ref.hasDeposits).length;
    const activePercentage = referralsCount > 0 ? (activeReferrals / referralsCount) * 100 : 0;
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-500" />
              {t('referrals.totalReferrals')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{referralsCount}</div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('referrals.peopleJoined')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-500" />
              {t('referrals.totalEarnings')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">
              {formatCurrency(totalEarnings)}
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('referrals.earnings')}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <PieChart className="h-5 w-5 text-purple-500" />
              {t('referrals.activeReferrals')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-baseline mb-1">
              <div className="text-3xl font-bold">{activeReferrals}/{referralsCount}</div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {Math.round(activePercentage)}%
              </div>
            </div>
            <Progress value={activePercentage} className="h-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              {t('referrals.activeDescription')}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Компонент для информации о реферальной программе
  const ReferralInfo = () => (
    <div className="space-y-6">
      <Card className="border-none shadow-xl bg-gradient-to-br from-purple-500 to-indigo-600 text-white overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl">{t('referrals.referralProgram')}</CardTitle>
          <CardDescription className="text-white/80">
            {t('referrals.inviteFriends')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <p className="text-sm text-white/80 mb-2">{t('referrals.yourReferralLink')}:</p>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Input
                    value={referralLink}
                    readOnly
                    className="pr-10 bg-white/10 border-white/20 text-white"
                  />
                </div>
                <Button 
                  variant="secondary" 
                  className="shrink-0 bg-white text-indigo-600 hover:bg-white/90 hover:text-indigo-700"
                  onClick={handleCopyReferralLink}
                >
                  {isCopied ? (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {isCopied ? t('common.copied') : t('common.copy')}
                </Button>
              </div>
            </div>
            
            <div>
              <p className="text-sm text-white/80 mb-2">{t('referrals.shareWith')}:</p>
              <div className="flex gap-2">
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="bg-[#229ED9] hover:bg-[#229ED9]/90 text-white"
                  onClick={() => handleShare('telegram')}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm5.568 8.16c-.18 1.896-.96 6.504-1.356 8.628-.168.9-.504 1.2-.816 1.236-.696.06-1.224-.42-1.896-.9-1.056-.72-1.656-1.176-2.676-1.896-1.188-.84-.42-1.296.264-2.04.18-.2 3.252-2.976 3.312-3.228a.24.24 0 0 0-.06-.216c-.072-.06-.168-.036-.252-.024-.108.024-1.788 1.14-5.064 3.348-.48.324-.912.492-1.296.48-.432-.012-1.248-.24-1.86-.444-.756-.24-1.344-.372-1.296-.792.024-.216.324-.432.888-.66 3.504-1.524 5.832-2.532 6.996-3.012 3.336-1.392 4.02-1.632 4.476-1.632.108 0 .324.024.468.144.12.096.156.228.168.324-.012.072.012.288 0 .456z" />
                  </svg>
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="bg-[#25D366] hover:bg-[#25D366]/90 text-white"
                  onClick={() => handleShare('whatsapp')}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="bg-[#1877F2] hover:bg-[#1877F2]/90 text-white"
                  onClick={() => handleShare('facebook')}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </Button>
                <Button 
                  variant="secondary" 
                  size="icon"
                  className="bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white"
                  onClick={() => handleShare('twitter')}
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </Button>
                <Button 
                  variant="secondary" 
                  className="flex-1 bg-white text-indigo-600 hover:bg-white/90 hover:text-indigo-700"
                  onClick={() => handleShare('telegram')}
                >
                  <Share2 className="h-4 w-4 mr-2" />
                  {t('referrals.share')}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/3 -translate-y-1/2 z-0"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 z-0"></div>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-purple-500" />
                {t('referrals.howItWorks')}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
                  1
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t('referrals.step1Title')}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('referrals.step1Description')}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
                  2
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t('referrals.step2Title')}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('referrals.step2Description')}</p>
                </div>
              </div>
              
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center">
                  3
                </div>
                <div>
                  <h3 className="font-medium mb-1">{t('referrals.step3Title')}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('referrals.step3Description')}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          custom={2}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-500" />
                {t('referrals.rewardRates')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{t('referrals.level')} 1</h3>
                    <Badge variant="outline" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      7%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('referrals.level1Description')}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{t('referrals.level')} 2</h3>
                    <Badge variant="outline" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">
                      3%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('referrals.level2Description')}
                  </p>
                </div>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-medium">{t('referrals.level')} 3</h3>
                    <Badge variant="outline" className="bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400">
                      1%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('referrals.level3Description')}
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-4 flex justify-center">
              <Button variant="outline" className="text-sm">
                <HelpCircle className="h-4 w-4 mr-2" />
                {t('referrals.learnMore')}
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    </div>
  );

  // Компонент для списка рефералов
  const ReferralsList = () => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      custom={0}
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-500" />
            {t('referrals.yourReferrals')}
          </CardTitle>
          <CardDescription>
            {t('referrals.yourReferralsDescription')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {referrals.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('common.user')}</TableHead>
                  <TableHead>{t('referrals.date')}</TableHead>
                  <TableHead>{t('referrals.status')}</TableHead>
                  <TableHead className="text-right">{t('referrals.earnings')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {referrals.map((referral, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      {referral.username || `User-${referral.id}`}
                    </TableCell>
                    <TableCell>
                      {formatDate(referral.createdAt || new Date().toISOString())}
                    </TableCell>
                    <TableCell>
                      {referral.hasDeposits ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                          {t('referrals.active')}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-500 dark:text-gray-400">
                          {t('referrals.registered')}
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className="font-medium text-green-600 dark:text-green-400">
                        {formatCurrency(referral.earnings || 0)}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8">
              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-3">
                <Users className="h-6 w-6 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">{t('referrals.noReferralsYet')}</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4 max-w-md mx-auto">
                {t('referrals.noReferralsDescription')}
              </p>
              <Button
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                onClick={() => setActiveTab("info")}
              >
                <Share2 className="h-4 w-4 mr-2" />
                {t('referrals.startInviting')}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('dashboard.referrals')}</h2>
        <Button
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
          onClick={handleCopyReferralLink}
        >
          {isCopied ? (
            <CheckCircle2 className="h-4 w-4 mr-2" />
          ) : (
            <Copy className="h-4 w-4 mr-2" />
          )}
          {t('referrals.copyLink')}
        </Button>
      </div>

      {/* Статистика */}
      <ReferralStats />

      {/* Вкладки */}
      <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="info">
            {t('referrals.information')}
          </TabsTrigger>
          <TabsTrigger value="list">
            {t('referrals.list')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <ReferralInfo />
        </TabsContent>

        <TabsContent value="list">
          <ReferralsList />
        </TabsContent>
      </Tabs>
    </div>
  );
}