import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Loader2, Copy, Users, ArrowUpCircle } from 'lucide-react';
import { AvatarPlaceholder } from '@/components/ui/avatar-placeholder';

export default function ReferralPage() {
  const { t } = useTranslation();
  const { toast } = useToast();
  
  // Fetch user referral data
  const { data: referralData, isLoading } = useQuery({
    queryKey: ['/api/referrals'],
  });

  const copyToClipboard = async () => {
    if (!referralData?.referralLink) return;

    try {
      await navigator.clipboard.writeText(referralData.referralLink);
      toast({
        title: t('common.success'),
        description: t('dashboard.referralLinkCopied'),
      });
    } catch (err) {
      toast({
        title: t('common.error'),
        description: t('dashboard.copyFailed'),
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">{t('common.loading')}</span>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">{t('dashboard.referral')}</h1>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.referralProgram')}</CardTitle>
            <CardDescription>
              {t('dashboard.referralDescription')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{t('dashboard.yourReferralLink')}:</p>
              <div className="flex">
                <Input 
                  value={referralData?.referralLink || ''}
                  readOnly
                  className="flex-1 border-gray-300 dark:border-gray-700 rounded-l-lg"
                />
                <Button 
                  onClick={copyToClipboard}
                  className="rounded-l-none"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  {t('dashboard.copy')}
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card>
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-primary mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.referrals')}</p>
                  <p className="text-2xl font-bold">{referralData?.totalReferrals || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <Users className="h-8 w-8 text-success mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.activeReferrals')}</p>
                  <p className="text-2xl font-bold">{referralData?.activeReferrals || 0}</p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <ArrowUpCircle className="h-8 w-8 text-success mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.earned')}</p>
                  <p className="text-2xl font-bold text-success">{formatCurrency(referralData?.totalEarnings || 0)}</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">{t('dashboard.howReferralWorks')}</h3>
              <ul className="space-y-2 list-disc pl-5">
                <li>{t('dashboard.referralExplanation1')}</li>
                <li>{t('dashboard.referralExplanation2')}</li>
                <li>{t('dashboard.referralExplanation3')}</li>
              </ul>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('dashboard.yourReferrals')}</CardTitle>
          </CardHeader>
          <CardContent>
            {referralData?.referrals?.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4 font-medium">{t('dashboard.user')}</th>
                      <th className="text-left p-4 font-medium">{t('dashboard.joinDate')}</th>
                      <th className="text-left p-4 font-medium">{t('dashboard.depositsCount')}</th>
                      <th className="text-left p-4 font-medium">{t('dashboard.earned')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {referralData.referrals.map((referral: any) => (
                      <tr key={referral.id} className="border-b hover:bg-gray-50 dark:hover:bg-gray-800">
                        <td className="p-4">
                          <div className="flex items-center">
                            <AvatarPlaceholder name={referral.username} className="mr-3" />
                            <div>
                              <div className="font-medium">{referral.username}</div>
                              {referral.fullName && (
                                <div className="text-sm text-gray-500">{referral.fullName}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 text-gray-500">{formatDate(referral.createdAt)}</td>
                        <td className="p-4">{referral.depositsCount}</td>
                        <td className="p-4 text-success font-medium">{formatCurrency(referral.earnings)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <p>{t('dashboard.noReferralsYet')}</p>
                <p className="mt-2">{t('dashboard.shareYourLink')}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
