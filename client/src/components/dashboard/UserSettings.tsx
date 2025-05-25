import { useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { 
  User, 
  Lock, 
  Mail, 
  Languages, 
  MoonStar, 
  Sun, 
  CheckCircle2 
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { useTheme } from "@/components/ThemeProvider";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface UserSettingsProps {
  onSave?: () => void;
}

// Схема валидации формы профиля
const profileFormSchema = z.object({
  username: z.string().min(3, {
    message: "Имя пользователя должно содержать не менее 3 символов",
  }),
  email: z.string().email({
    message: "Введите корректный email адрес",
  }),
  fullName: z.string().optional(),
});

// Схема валидации формы безопасности
const securityFormSchema = z.object({
  currentPassword: z.string().min(6, {
    message: "Пароль должен содержать не менее 6 символов",
  }),
  newPassword: z.string().min(6, {
    message: "Пароль должен содержать не менее 6 символов",
  }),
  confirmPassword: z.string().min(6, {
    message: "Пароль должен содержать не менее 6 символов",
  }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Пароли не совпадают",
  path: ["confirmPassword"],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type SecurityFormValues = z.infer<typeof securityFormSchema>;

export default function UserSettings({ onSave }: UserSettingsProps) {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  const [isUpdating, setIsUpdating] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Форма профиля
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: user?.username || "",
      email: user?.email || "",
      fullName: user?.fullName || "",
    },
  });
  
  // Форма безопасности
  const securityForm = useForm<SecurityFormValues>({
    resolver: zodResolver(securityFormSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  
  // Обработчик сохранения профиля
  const onSubmitProfile = (data: ProfileFormValues) => {
    setIsUpdating(true);
    
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: t('common.success'),
        description: t('dashboard.profileUpdated'),
      });
      
      if (onSave) onSave();
    }, 1000);
  };
  
  // Обработчик сохранения настроек безопасности
  const onSubmitSecurity = (data: SecurityFormValues) => {
    setIsUpdating(true);
    
    setTimeout(() => {
      setIsUpdating(false);
      toast({
        title: t('common.success'),
        description: t('dashboard.passwordUpdated'),
      });
      
      securityForm.reset({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      
      if (onSave) onSave();
    }, 1000);
  };
  
  // Функция изменения языка
  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    
    toast({
      title: t('common.success'),
      description: t('dashboard.languageChanged'),
    });
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
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 via-purple-500/10 to-indigo-500/10" />
          <div className="relative">
            <CardTitle className="text-xl flex items-center">
              <User className="h-5 w-5 mr-2 text-purple-500" />
              {t('dashboard.settings')}
            </CardTitle>
            <CardDescription>
              {t('dashboard.settingsDescription')}
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent>
          <Tabs defaultValue="profile" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{t('dashboard.profile')}</span>
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                <span className="hidden sm:inline">{t('dashboard.security')}</span>
              </TabsTrigger>
              <TabsTrigger value="preferences" className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                <span className="hidden sm:inline">{t('dashboard.preferences')}</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="space-y-4">
              <Form {...profileForm}>
                <form onSubmit={profileForm.handleSubmit(onSubmitProfile)} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={profileForm.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('register.username')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <Input
                                placeholder={t('register.usernamePlaceholder')}
                                className="pl-8 bg-white dark:bg-gray-800"
                                {...field}
                              />
                            </div>
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
                          <FormLabel>{t('common.email')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <Input
                                placeholder={t('register.emailPlaceholder')}
                                className="pl-8 bg-white dark:bg-gray-800"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={profileForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('dashboard.fullName')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <Input
                              placeholder={t('dashboard.fullNamePlaceholder')}
                              className="pl-8 bg-white dark:bg-gray-800"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {isUpdating ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('common.saving')}
                        </span>
                      ) : t('common.save')}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="security" className="space-y-4">
              <Form {...securityForm}>
                <form onSubmit={securityForm.handleSubmit(onSubmitSecurity)} className="space-y-4">
                  <FormField
                    control={securityForm.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('dashboard.currentPassword')}</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                            <Input
                              type="password"
                              placeholder="••••••••"
                              className="pl-8 bg-white dark:bg-gray-800"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid gap-4 md:grid-cols-2">
                    <FormField
                      control={securityForm.control}
                      name="newPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.newPassword')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-8 bg-white dark:bg-gray-800"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={securityForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('dashboard.confirmPassword')}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Lock className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500 dark:text-gray-400" />
                              <Input
                                type="password"
                                placeholder="••••••••"
                                className="pl-8 bg-white dark:bg-gray-800"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                    >
                      {isUpdating ? (
                        <span className="flex items-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t('common.saving')}
                        </span>
                      ) : t('common.save')}
                    </Button>
                  </div>
                </form>
              </Form>
            </TabsContent>
            
            <TabsContent value="preferences" className="space-y-6">
              <div>
                <h3 className="text-lg font-medium mb-4">{t('dashboard.language')}</h3>
                <div className="w-full max-w-xs">
                  <Select 
                    defaultValue={i18n.language} 
                    onValueChange={changeLanguage}
                  >
                    <SelectTrigger className="bg-white dark:bg-gray-800">
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
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">{t('dashboard.theme')}</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={theme === 'light' ? 'default' : 'outline'}
                    onClick={() => setTheme('light')}
                    className={theme === 'light' ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : ""}
                  >
                    <Sun className="h-4 w-4 mr-2" />
                    {t('dashboard.lightTheme')}
                    {theme === 'light' && <CheckCircle2 className="h-4 w-4 ml-2" />}
                  </Button>
                  
                  <Button
                    variant={theme === 'dark' ? 'default' : 'outline'}
                    onClick={() => setTheme('dark')}
                    className={theme === 'dark' ? "bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700" : ""}
                  >
                    <MoonStar className="h-4 w-4 mr-2" />
                    {t('dashboard.darkTheme')}
                    {theme === 'dark' && <CheckCircle2 className="h-4 w-4 ml-2" />}
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  );
}