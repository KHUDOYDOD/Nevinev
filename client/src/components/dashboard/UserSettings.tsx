import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Bell, 
  Globe, 
  Key, 
  Lock, 
  LogOut, 
  Moon, 
  Settings, 
  Shield, 
  Sun, 
  User
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/components/ThemeProvider";

// Схемы валидации для форм
const profileFormSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  username: z.string().min(3, {
    message: "Username must be at least 3 characters.",
  }),
});

const passwordFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Current password is required",
  }),
  newPassword: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface UserSettingsProps {
  user: {
    id: number;
    username: string;
    email: string;
    fullName?: string;
    balance: number;
    referralCode: string;
    isAdmin?: boolean;
  };
}

export default function UserSettings({ user }: UserSettingsProps) {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Настройки уведомлений
  const [notifyDeposit, setNotifyDeposit] = useState(true);
  const [notifyWithdraw, setNotifyWithdraw] = useState(true);
  const [notifyProfit, setNotifyProfit] = useState(true);
  const [notifyReferral, setNotifyReferral] = useState(true);
  
  // Форма профиля
  const profileForm = useForm<z.infer<typeof profileFormSchema>>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fullName: user.fullName || "",
      email: user.email,
      username: user.username,
    },
  });
  
  // Форма изменения пароля
  const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Обработчик отправки формы профиля
  function onProfileSubmit(values: z.infer<typeof profileFormSchema>) {
    setIsLoading(true);
    
    // Имитация запроса API
    setTimeout(() => {
      toast({
        title: t('dashboard.profileUpdated'),
        description: t('dashboard.profileUpdatedDesc'),
      });
      setIsLoading(false);
    }, 1000);
  }
  
  // Обработчик отправки формы пароля
  function onPasswordSubmit(values: z.infer<typeof passwordFormSchema>) {
    setIsLoading(true);
    
    // Имитация запроса API
    setTimeout(() => {
      toast({
        title: t('dashboard.passwordChanged'),
        description: t('dashboard.passwordChangedDesc'),
      });
      setIsLoading(false);
      passwordForm.reset();
    }, 1000);
  }
  
  // Обработчик смены языка
  function handleLanguageChange(value: string) {
    i18n.changeLanguage(value);
    toast({
      title: t('dashboard.languageChanged'),
      description: t('dashboard.languageChangedDesc'),
    });
  }
  
  // Обработчик выхода
  function handleLogout() {
    logout();
    toast({
      title: t('common.loggedOut'),
      description: t('common.loggedOutSuccessfully'),
    });
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="shadow-md border dark:border-gray-700">
        <CardHeader>
          <CardTitle className="text-xl flex items-center">
            <Settings className="h-5 w-5 mr-2 text-indigo-500" />
            {t('dashboard.settings')}
          </CardTitle>
          <CardDescription>
            {t('dashboard.settingsDesc')}
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="profile" className="flex items-center">
                <User className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('dashboard.profile')}</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('dashboard.security')}</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center">
                <Bell className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('dashboard.notifications')}</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">{t('dashboard.appearance')}</span>
              </TabsTrigger>
            </TabsList>
            
            {/* Вкладка профиля */}
            <TabsContent value="profile">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={profileForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.fullName')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            {t('dashboard.fullNameDesc')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.username')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            {t('dashboard.usernameDesc')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.email')}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            {t('dashboard.emailDesc')}
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    disabled={isLoading}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                  >
                    {isLoading ? t('common.saving') : t('common.saveChanges')}
                  </Button>
                </form>
              </Form>
            </TabsContent>
            
            {/* Вкладка безопасности */}
            <TabsContent value="security">
              <div className="space-y-6">
                <Form {...passwordForm}>
                  <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-6">
                    <h3 className="text-lg font-medium flex items-center">
                      <Key className="h-5 w-5 mr-2 text-indigo-500" />
                      {t('dashboard.changePassword')}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t('dashboard.currentPassword')}</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t('dashboard.newPassword')}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
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
                              <FormLabel>{t('dashboard.confirmPassword')}</FormLabel>
                              <FormControl>
                                <Input type="password" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                    >
                      {isLoading ? t('common.updating') : t('dashboard.updatePassword')}
                    </Button>
                  </form>
                </Form>
                
                <Separator />
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium flex items-center">
                    <Lock className="h-5 w-5 mr-2 text-indigo-500" />
                    {t('dashboard.securitySettings')}
                  </h3>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t('dashboard.twoFactorAuth')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('dashboard.twoFactorAuthDesc')}
                      </p>
                    </div>
                    <Button variant="outline">{t('dashboard.setup')}</Button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{t('dashboard.sessionHistory')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('dashboard.sessionHistoryDesc')}
                      </p>
                    </div>
                    <Button variant="outline">{t('dashboard.view')}</Button>
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Вкладка уведомлений */}
            <TabsContent value="notifications">
              <div className="space-y-6">
                <h3 className="text-lg font-medium flex items-center">
                  <Bell className="h-5 w-5 mr-2 text-indigo-500" />
                  {t('dashboard.notificationPreferences')}
                </h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">{t('dashboard.depositNotifications')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('dashboard.depositNotificationsDesc')}
                      </p>
                    </div>
                    <Switch 
                      checked={notifyDeposit} 
                      onCheckedChange={setNotifyDeposit} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">{t('dashboard.withdrawalNotifications')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('dashboard.withdrawalNotificationsDesc')}
                      </p>
                    </div>
                    <Switch 
                      checked={notifyWithdraw} 
                      onCheckedChange={setNotifyWithdraw} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">{t('dashboard.profitNotifications')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('dashboard.profitNotificationsDesc')}
                      </p>
                    </div>
                    <Switch 
                      checked={notifyProfit} 
                      onCheckedChange={setNotifyProfit} 
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <h4 className="font-medium">{t('dashboard.referralNotifications')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('dashboard.referralNotificationsDesc')}
                      </p>
                    </div>
                    <Switch 
                      checked={notifyReferral} 
                      onCheckedChange={setNotifyReferral} 
                    />
                  </div>
                </div>
              </div>
            </TabsContent>
            
            {/* Вкладка внешнего вида */}
            <TabsContent value="appearance">
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    <Globe className="h-5 w-5 mr-2 text-indigo-500" />
                    {t('dashboard.language')}
                  </h3>
                  
                  <Select
                    defaultValue={i18n.language}
                    onValueChange={handleLanguageChange}
                  >
                    <SelectTrigger className="w-full sm:w-[240px]">
                      <SelectValue placeholder={t('dashboard.selectLanguage')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ru">Русский</SelectItem>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="tj">Тоҷикӣ</SelectItem>
                      <SelectItem value="kz">Қазақша</SelectItem>
                      <SelectItem value="uz">O'zbekcha</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-lg font-medium flex items-center mb-4">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 mr-2 text-indigo-500" />
                    ) : (
                      <Sun className="h-5 w-5 mr-2 text-indigo-500" />
                    )}
                    {t('dashboard.theme')}
                  </h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Button
                      variant={theme === "light" ? "default" : "outline"}
                      className={
                        theme === "light"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : ""
                      }
                      onClick={() => setTheme("light")}
                    >
                      <Sun className="h-4 w-4 mr-2" />
                      {t('dashboard.lightTheme')}
                    </Button>
                    
                    <Button
                      variant={theme === "dark" ? "default" : "outline"}
                      className={
                        theme === "dark"
                          ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white"
                          : ""
                      }
                      onClick={() => setTheme("dark")}
                    >
                      <Moon className="h-4 w-4 mr-2" />
                      {t('dashboard.darkTheme')}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        
        <CardFooter className="border-t px-6 py-4 flex justify-between items-center">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {t('dashboard.accountSince')}: {new Date().toLocaleDateString()}
          </div>
          
          <Button 
            variant="destructive" 
            className="flex items-center"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            {t('common.logout')}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}