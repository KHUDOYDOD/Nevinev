import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, 
  Key, 
  Globe, 
  Shield, 
  Bell, 
  CheckCircle2, 
  AlertCircle,
  Eye,
  EyeOff,
  Save
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Switch
} from "@/components/ui/switch";
import { apiRequest } from "@/lib/queryClient";
import { useLanguage } from "@/contexts/LanguageContext";

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

// Схема формы личных данных
const profileFormSchema = z.object({
  fullName: z
    .string()
    .min(2, {
      message: "Имя должно содержать минимум 2 символа",
    })
    .optional(),
  email: z
    .string()
    .email({
      message: "Пожалуйста, введите корректный email",
    }),
  username: z
    .string()
    .min(2, {
      message: "Имя пользователя должно содержать минимум 2 символа",
    })
    .max(30, {
      message: "Имя пользователя не должно превышать 30 символов",
    }),
});

// Схема формы смены пароля
const passwordFormSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, {
        message: "Пароль должен содержать минимум 8 символов",
      }),
    newPassword: z
      .string()
      .min(8, {
        message: "Пароль должен содержать минимум 8 символов",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

// Схема формы уведомлений
const notificationsFormSchema = z.object({
  emailNotifications: z.boolean().default(true),
  promotionalEmails: z.boolean().default(false),
  smsNotifications: z.boolean().default(false),
  securityAlerts: z.boolean().default(true),
});

interface UserSettingsProps {
  user: any;
}

export default function UserSettings({ user }: UserSettingsProps) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { currentLanguage, changeLanguage, languageNames } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteAccountDialogOpen, setDeleteAccountDialogOpen] = useState(false);

  // Форма профиля
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      email: user?.email || "",
      username: user?.username || "",
    },
  });

  // Форма пароля
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Форма уведомлений
  const notificationsForm = useForm<z.infer<typeof notificationsFormSchema>>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues: {
      emailNotifications: true,
      promotionalEmails: false,
      smsNotifications: false,
      securityAlerts: true,
    },
  });

  // Мутация для обновления профиля
  const updateProfileMutation = useMutation({
    mutationFn: async (data: z.infer<typeof profileFormSchema>) => {
      return apiRequest("/api/user/update-profile", {
        method: "POST",
        data
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current"] });
      toast({
        title: t('settings.profileUpdated'),
        description: t('settings.profileUpdatedDescription'),
      });
    },
    onError: (error) => {
      toast({
        title: t('settings.profileUpdateError'),
        description: t('settings.profileUpdateErrorDescription'),
        variant: "destructive",
      });
    }
  });

  // Мутация для обновления пароля
  const updatePasswordMutation = useMutation({
    mutationFn: async (data: z.infer<typeof passwordFormSchema>) => {
      return apiRequest("/api/user/update-password", {
        method: "POST",
        data: {
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }
      });
    },
    onSuccess: () => {
      passwordForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      toast({
        title: t('settings.passwordUpdated'),
        description: t('settings.passwordUpdatedDescription'),
      });
    },
    onError: (error) => {
      toast({
        title: t('settings.passwordUpdateError'),
        description: t('settings.passwordUpdateErrorDescription'),
        variant: "destructive",
      });
    }
  });

  // Мутация для обновления настроек уведомлений
  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: z.infer<typeof notificationsFormSchema>) => {
      return apiRequest("/api/user/update-notifications", {
        method: "POST",
        data
      });
    },
    onSuccess: () => {
      toast({
        title: t('settings.notificationsUpdated'),
        description: t('settings.notificationsUpdatedDescription'),
      });
    }
  });

  // Мутация для обновления языка
  const updateLanguageMutation = useMutation({
    mutationFn: async (language: string) => {
      return apiRequest("/api/user/update-language", {
        method: "POST",
        data: { language }
      });
    },
    onSuccess: () => {
      toast({
        title: t('settings.languageUpdated'),
        description: t('settings.languageUpdatedDescription'),
      });
    }
  });

  // Мутация для удаления аккаунта
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("/api/user/delete-account", {
        method: "POST"
      });
    },
    onSuccess: () => {
      window.location.href = "/";
    }
  });

  // Обработчик отправки формы профиля
  const onProfileSubmit = (data: z.infer<typeof profileFormSchema>) => {
    updateProfileMutation.mutate(data);
  };

  // Обработчик отправки формы пароля
  const onPasswordSubmit = (data: z.infer<typeof passwordFormSchema>) => {
    updatePasswordMutation.mutate(data);
  };

  // Обработчик отправки формы уведомлений
  const onNotificationsSubmit = (data: z.infer<typeof notificationsFormSchema>) => {
    updateNotificationsMutation.mutate(data);
  };

  // Обработчик изменения языка
  const handleLanguageChange = (language: string) => {
    changeLanguage(language as any);
    updateLanguageMutation.mutate(language);
  };

  // Обработчик удаления аккаунта
  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t('dashboard.settings')}</h2>
      </div>

      <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            {t('settings.profile')}
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            {t('settings.security')}
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            {t('settings.notifications')}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-blue-500" />
                    {t('settings.personalInfo')}
                  </CardTitle>
                  <CardDescription>
                    {t('settings.personalInfoDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                      <FormField
                        control={profileForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('settings.username')}</FormLabel>
                            <FormControl>
                              <Input placeholder="username" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('settings.fullName')}</FormLabel>
                            <FormControl>
                              <Input placeholder="Иван Иванов" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={profileForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('settings.email')}</FormLabel>
                            <FormControl>
                              <Input placeholder="email@example.com" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        disabled={updateProfileMutation.isPending}
                      >
                        {updateProfileMutation.isPending ? (
                          <>{t('common.saving')}...</>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            {t('common.save')}
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Globe className="h-5 w-5 text-green-500" />
                    {t('settings.language')}
                  </CardTitle>
                  <CardDescription>
                    {t('settings.languageDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-1">
                    <FormLabel>{t('settings.selectLanguage')}</FormLabel>
                    <Select defaultValue={currentLanguage} onValueChange={handleLanguageChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите язык" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(languageNames).map(([code, name]) => (
                          <SelectItem key={code} value={code}>
                            {name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="security">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="md:col-span-2"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Key className="h-5 w-5 text-amber-500" />
                    {t('settings.changePassword')}
                  </CardTitle>
                  <CardDescription>
                    {t('settings.changePasswordDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('settings.currentPassword')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showCurrentPassword ? "text" : "password"} 
                                  placeholder="********" 
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                >
                                  {showCurrentPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('settings.newPassword')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showNewPassword ? "text" : "password"} 
                                  placeholder="********" 
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowNewPassword(!showNewPassword)}
                                >
                                  {showNewPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="confirmPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('settings.confirmPassword')}</FormLabel>
                            <FormControl>
                              <div className="relative">
                                <Input 
                                  type={showConfirmPassword ? "text" : "password"} 
                                  placeholder="********" 
                                  {...field} 
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="absolute right-0 top-0 h-full px-3"
                                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                >
                                  {showConfirmPassword ? (
                                    <EyeOff className="h-4 w-4 text-gray-500" />
                                  ) : (
                                    <Eye className="h-4 w-4 text-gray-500" />
                                  )}
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button 
                        type="submit" 
                        className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                        disabled={updatePasswordMutation.isPending}
                      >
                        {updatePasswordMutation.isPending ? (
                          <>{t('common.updating')}...</>
                        ) : (
                          <>
                            <Key className="mr-2 h-4 w-4" />
                            {t('settings.updatePassword')}
                          </>
                        )}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              custom={1}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2 text-red-500">
                    <AlertCircle className="h-5 w-5" />
                    {t('settings.dangerZone')}
                  </CardTitle>
                  <CardDescription>
                    {t('settings.dangerZoneDescription')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog open={deleteAccountDialogOpen} onOpenChange={setDeleteAccountDialogOpen}>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" className="w-full">
                        {t('settings.deleteAccount')}
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>{t('settings.deleteAccountConfirm')}</AlertDialogTitle>
                        <AlertDialogDescription>
                          {t('settings.deleteAccountWarning')}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>{t('common.cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteAccount} className="bg-red-500 hover:bg-red-600">
                          {t('settings.confirmDelete')}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            custom={0}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-purple-500" />
                  {t('settings.notificationPreferences')}
                </CardTitle>
                <CardDescription>
                  {t('settings.notificationPreferencesDescription')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...notificationsForm}>
                  <form onSubmit={notificationsForm.handleSubmit(onNotificationsSubmit)} className="space-y-6">
                    <div className="space-y-4">
                      <FormField
                        control={notificationsForm.control}
                        name="emailNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t('settings.emailNotifications')}
                              </FormLabel>
                              <FormDescription>
                                {t('settings.emailNotificationsDescription')}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationsForm.control}
                        name="promotionalEmails"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t('settings.promotionalEmails')}
                              </FormLabel>
                              <FormDescription>
                                {t('settings.promotionalEmailsDescription')}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationsForm.control}
                        name="smsNotifications"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t('settings.smsNotifications')}
                              </FormLabel>
                              <FormDescription>
                                {t('settings.smsNotificationsDescription')}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={notificationsForm.control}
                        name="securityAlerts"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                {t('settings.securityAlerts')}
                              </FormLabel>
                              <FormDescription>
                                {t('settings.securityAlertsDescription')}
                              </FormDescription>
                            </div>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      disabled={updateNotificationsMutation.isPending}
                    >
                      {updateNotificationsMutation.isPending ? (
                        <>{t('common.saving')}...</>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          {t('common.savePreferences')}
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}