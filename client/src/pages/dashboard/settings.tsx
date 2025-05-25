import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { getLanguageName } from '@/lib/utils';
import { Loader2, Save } from 'lucide-react';

const profileSchema = z.object({
  fullName: z.string().optional(),
  email: z.string().email({
    message: 'Please enter a valid email address',
  }),
  language: z.string(),
});

const securitySchema = z.object({
  currentPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  newPassword: z.string().min(6, {
    message: 'Password must be at least 6 characters',
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type SecurityFormValues = z.infer<typeof securitySchema>;

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('profile');

  // Fetch user data
  const { data: userData, isLoading } = useQuery({
    queryKey: ['/api/users/current'],
  });

  // Profile form
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: '',
      email: '',
      language: 'ru',
    },
  });

  // Security form
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Update profile mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (data: ProfileFormValues) => {
      return await apiRequest('PATCH', '/api/users/profile', data);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/current'] });
      
      // Update language if changed
      if (data.language && data.language !== i18n.language) {
        i18n.changeLanguage(data.language);
      }
      
      toast({
        title: t('common.success'),
        description: t('settings.profileUpdated'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('settings.updateFailed'),
        variant: 'destructive',
      });
    },
  });

  // Change password mutation
  const changePasswordMutation = useMutation({
    mutationFn: async (data: SecurityFormValues) => {
      return await apiRequest('POST', '/api/users/change-password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
    },
    onSuccess: () => {
      securityForm.reset();
      toast({
        title: t('common.success'),
        description: t('settings.passwordChanged'),
      });
    },
    onError: (error: any) => {
      toast({
        title: t('common.error'),
        description: error.message || t('settings.passwordChangeFailed'),
        variant: 'destructive',
      });
    },
  });

  // Set form values when user data is loaded
  useEffect(() => {
    if (userData) {
      profileForm.reset({
        fullName: userData.fullName || '',
        email: userData.email,
        language: userData.language || 'ru',
      });
    }
  }, [userData, profileForm]);

  const handleProfileSubmit = (data: ProfileFormValues) => {
    updateProfileMutation.mutate(data);
  };

  const handleSecuritySubmit = (data: SecurityFormValues) => {
    changePasswordMutation.mutate(data);
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
      <h1 className="text-2xl font-bold mb-6">{t('dashboard.settings')}</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile">{t('settings.profile')}</TabsTrigger>
          <TabsTrigger value="security">{t('settings.security')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.profileSettings')}</CardTitle>
              <CardDescription>{t('settings.profileDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username">{t('auth.username')}</Label>
                  <Input 
                    id="username" 
                    value={userData?.username || ''} 
                    disabled 
                    className="bg-gray-50 dark:bg-gray-800"
                  />
                  <p className="text-sm text-gray-500">{t('settings.usernameCannotChange')}</p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="fullName">{t('auth.fullName')}</Label>
                  <Input 
                    id="fullName" 
                    {...profileForm.register('fullName')} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    {...profileForm.register('email')} 
                  />
                  {profileForm.formState.errors.email && (
                    <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">{t('common.language')}</Label>
                  <Select
                    defaultValue={userData?.language || 'ru'}
                    onValueChange={(value) => profileForm.setValue('language', value)}
                  >
                    <SelectTrigger id="language">
                      <SelectValue placeholder={t('settings.selectLanguage')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">{getLanguageName('ru')}</SelectItem>
                      <SelectItem value="en">{getLanguageName('en')}</SelectItem>
                      <SelectItem value="tj">{getLanguageName('tj')}</SelectItem>
                      <SelectItem value="kz">{getLanguageName('kz')}</SelectItem>
                      <SelectItem value="uz">{getLanguageName('uz')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="pt-4">
                  <Button type="submit" disabled={updateProfileMutation.isPending}>
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.loading')}
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        {t('common.save')}
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.securitySettings')}</CardTitle>
              <CardDescription>{t('settings.securityDescription')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t('settings.currentPassword')}</Label>
                  <Input 
                    id="currentPassword" 
                    type="password" 
                    {...securityForm.register('currentPassword')} 
                  />
                  {securityForm.formState.errors.currentPassword && (
                    <p className="text-sm text-red-500">{securityForm.formState.errors.currentPassword.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('settings.newPassword')}</Label>
                  <Input 
                    id="newPassword" 
                    type="password" 
                    {...securityForm.register('newPassword')} 
                  />
                  {securityForm.formState.errors.newPassword && (
                    <p className="text-sm text-red-500">{securityForm.formState.errors.newPassword.message}</p>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('settings.confirmPassword')}</Label>
                  <Input 
                    id="confirmPassword" 
                    type="password" 
                    {...securityForm.register('confirmPassword')} 
                  />
                  {securityForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-red-500">{securityForm.formState.errors.confirmPassword.message}</p>
                  )}
                </div>
                
                <div className="pt-4">
                  <Button type="submit" disabled={changePasswordMutation.isPending}>
                    {changePasswordMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('common.loading')}
                      </>
                    ) : (
                      t('settings.changePassword')
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}
