import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { User, Mail, Key, Shield, Globe, Moon, Sun, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/components/ThemeProvider";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function UserSettings() {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();
  
  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email, setEmail] = useState(user?.email || "");
  const [language, setLanguage] = useState(i18n.language || "ru");
  const [notifications, setNotifications] = useState({
    email: true,
    profit: true,
    news: false,
    security: true
  });
  
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('dashboard.profileUpdated'),
      description: t('dashboard.profileUpdateSuccess'),
    });
  };
  
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: t('dashboard.passwordChanged'),
      description: t('dashboard.passwordChangeSuccess'),
    });
  };
  
  const handleChangeLanguage = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    toast({
      title: t('dashboard.languageChanged'),
      description: t('dashboard.languageChangeSuccess'),
    });
  };
  
  const handleToggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
    toast({
      title: t('dashboard.themeChanged'),
      description: theme === "dark" 
        ? t('dashboard.lightModeEnabled') 
        : t('dashboard.darkModeEnabled'),
    });
  };
  
  const handleToggleNotification = (key: string) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key as keyof typeof prev]
    }));
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid grid-cols-4 max-w-lg mb-8">
          <TabsTrigger value="profile" className="flex items-center">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('dashboard.profile')}</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('dashboard.security')}</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center">
            <Globe className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('dashboard.preferences')}</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center">
            <Smartphone className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">{t('dashboard.notifications')}</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.profileSettings')}</CardTitle>
              <CardDescription>{t('dashboard.profileSettingsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSaveProfile} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="username">{t('dashboard.username')}</Label>
                    <Input 
                      id="username" 
                      value={user?.username} 
                      disabled 
                      className="bg-gray-50 dark:bg-gray-800"
                    />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {t('dashboard.usernameCannotBeChanged')}
                    </p>
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="fullName">{t('dashboard.fullName')}</Label>
                    <Input 
                      id="fullName" 
                      value={fullName} 
                      onChange={e => setFullName(e.target.value)}
                      placeholder={t('dashboard.enterFullName')}
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">{t('dashboard.email')}</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      value={email} 
                      onChange={e => setEmail(e.target.value)}
                      placeholder={t('dashboard.enterEmail')}
                    />
                  </div>
                </div>
                
                <div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {t('dashboard.saveChanges')}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.securitySettings')}</CardTitle>
              <CardDescription>{t('dashboard.securitySettingsDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleChangePassword} className="space-y-6">
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="currentPassword">{t('dashboard.currentPassword')}</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="newPassword">{t('dashboard.newPassword')}</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="confirmPassword">{t('dashboard.confirmPassword')}</Label>
                    <Input 
                      id="confirmPassword" 
                      type="password" 
                      placeholder="••••••••"
                    />
                  </div>
                </div>
                
                <div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                    >
                      {t('dashboard.changePassword')}
                    </Button>
                  </motion.div>
                </div>
              </form>
            </CardContent>
            <CardHeader className="border-t border-gray-200 dark:border-gray-700 mt-6">
              <CardTitle>{t('dashboard.twoFactorAuthentication')}</CardTitle>
              <CardDescription>{t('dashboard.twoFactorAuthDesc')}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-medium">{t('dashboard.enable2FA')}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t('dashboard.enable2FADesc')}
                  </p>
                </div>
                <Button variant="outline">
                  {t('dashboard.setup')}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.preferencesSettings')}</CardTitle>
              <CardDescription>{t('dashboard.preferencesSettingsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('dashboard.language')}</h3>
                  <Select value={language} onValueChange={handleChangeLanguage}>
                    <SelectTrigger className="w-full md:w-72">
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
                
                <div>
                  <h3 className="text-lg font-medium mb-3">{t('dashboard.appearance')}</h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {theme === "dark" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                      <span>{theme === "dark" ? t('dashboard.darkMode') : t('dashboard.lightMode')}</span>
                    </div>
                    <Switch 
                      checked={theme === "dark"} 
                      onCheckedChange={handleToggleTheme}
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>{t('dashboard.notificationSettings')}</CardTitle>
              <CardDescription>{t('dashboard.notificationSettingsDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">{t('dashboard.emailNotifications')}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.emailNotificationsDesc')}</div>
                  </div>
                  <Switch 
                    checked={notifications.email} 
                    onCheckedChange={() => handleToggleNotification('email')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">{t('dashboard.profitAlerts')}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.profitAlertsDesc')}</div>
                  </div>
                  <Switch 
                    checked={notifications.profit} 
                    onCheckedChange={() => handleToggleNotification('profit')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">{t('dashboard.newsUpdates')}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.newsUpdatesDesc')}</div>
                  </div>
                  <Switch 
                    checked={notifications.news} 
                    onCheckedChange={() => handleToggleNotification('news')}
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="font-medium">{t('dashboard.securityAlerts')}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{t('dashboard.securityAlertsDesc')}</div>
                  </div>
                  <Switch 
                    checked={notifications.security} 
                    onCheckedChange={() => handleToggleNotification('security')}
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-6 flex justify-between">
              <Button variant="outline">
                {t('dashboard.disableAll')}
              </Button>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white">
                {t('dashboard.savePreferences')}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}