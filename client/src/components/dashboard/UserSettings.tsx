import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  User, 
  Lock, 
  Bell, 
  Languages, 
  Mail, 
  LogOut, 
  Check,
  Shield,
  Eye,
  EyeOff,
  Save,
  AlertCircle,
  Globe,
  UserCheck
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// Анимации
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
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

// Типы пользователя
interface UserSettingsProps {
  user: {
    id?: number;
    username?: string;
    email?: string;
    fullName?: string;
    balance?: number;
    referralCode?: string;
    createdAt?: Date | string;
  };
}

// Компонент настроек пользователя
const UserSettings = ({ user = {} }: UserSettingsProps) => {
  const { t, i18n } = useTranslation();
  const { toast } = useToast();
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Состояния для профиля
  const [email, setEmail] = useState(user?.email || "");
  const [username, setUsername] = useState(user?.username || "");
  const [fullName, setFullName] = useState(user?.fullName || "");
  
  // Состояния для смены пароля
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  
  // Состояния для уведомлений
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [promotionalEmails, setPromotionalEmails] = useState(false);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  
  // Состояние для языка
  const [language, setLanguage] = useState(i18n.language || "ru");
  
  // Мутация для обновления профиля
  const updateProfileMutation = useMutation({
    mutationFn: async (data: { email: string; username: string; fullName?: string }) => {
      return fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(response => {
        if (!response.ok) {
          throw new Error("Ошибка обновления профиля");
        }
        return response.json();
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/current"] });
      toast({
        title: t('success'),
        description: t('settings.profileUpdated'),
        variant: "default"
      });
    },
    onError: () => {
      toast({
        title: t('error'),
        description: t('settings.errorUpdatingProfile'),
        variant: "destructive"
      });
    }
  });

  // Мутация для смены пароля
  const changePasswordMutation = useMutation({
    mutationFn: async (data: { currentPassword: string; newPassword: string }) => {
      return fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(response => {
        if (!response.ok) {
          throw new Error("Ошибка смены пароля");
        }
        return response.json();
      });
    },
    onSuccess: () => {
      toast({
        title: t('success'),
        description: t('settings.passwordChanged'),
        variant: "default"
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: () => {
      toast({
        title: t('error'),
        description: t('settings.errorChangingPassword'),
        variant: "destructive"
      });
    }
  });

  // Мутация для настроек уведомлений
  const updateNotificationsMutation = useMutation({
    mutationFn: async (data: { emailNotifications: boolean; promotionalEmails: boolean; smsNotifications: boolean; securityAlerts: boolean }) => {
      return fetch("/api/user/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(response => {
        if (!response.ok) {
          throw new Error("Ошибка обновления настроек уведомлений");
        }
        return response.json();
      });
    },
    onSuccess: () => {
      toast({
        title: t('success'),
        description: t('settings.notificationsUpdated'),
        variant: "default"
      });
    },
    onError: () => {
      toast({
        title: t('error'),
        description: t('settings.errorUpdatingNotifications'),
        variant: "destructive"
      });
    }
  });

  // Мутация для смены языка
  const changeLanguageMutation = useMutation({
    mutationFn: async (data: { language: string }) => {
      return fetch("/api/user/language", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(response => {
        if (!response.ok) {
          throw new Error("Ошибка смены языка");
        }
        return response.json();
      });
    },
    onSuccess: (_, variables) => {
      i18n.changeLanguage(variables.language);
      toast({
        title: t('success'),
        description: t('settings.languageChanged'),
        variant: "default"
      });
    },
    onError: () => {
      toast({
        title: t('error'),
        description: t('settings.errorChangingLanguage'),
        variant: "destructive"
      });
    }
  });

  // Мутация для удаления аккаунта
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      return fetch("/api/user/account", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      }).then(response => {
        if (!response.ok) {
          throw new Error("Ошибка удаления аккаунта");
        }
        return response.json();
      });
    },
    onSuccess: () => {
      toast({
        title: t('success'),
        description: t('settings.accountDeleted'),
        variant: "default"
      });
      // Выход из системы после удаления аккаунта
      logout();
    },
    onError: () => {
      toast({
        title: t('error'),
        description: t('settings.errorDeletingAccount'),
        variant: "destructive"
      });
    }
  });

  // Обработчик обновления профиля
  const handleUpdateProfile = () => {
    if (!email || !username) {
      toast({
        title: t('error'),
        description: t('settings.fillRequiredFields'),
        variant: "destructive"
      });
      return;
    }
    
    // Проверка формата email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: t('error'),
        description: t('settings.invalidEmail'),
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    updateProfileMutation.mutate({ email, username, fullName });
    setTimeout(() => setIsProcessing(false), 1000);
  };

  // Обработчик смены пароля
  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast({
        title: t('error'),
        description: t('settings.fillAllPasswordFields'),
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast({
        title: t('error'),
        description: t('settings.passwordsDoNotMatch'),
        variant: "destructive"
      });
      return;
    }
    
    if (newPassword.length < 8) {
      toast({
        title: t('error'),
        description: t('settings.passwordTooShort'),
        variant: "destructive"
      });
      return;
    }
    
    setIsProcessing(true);
    changePasswordMutation.mutate({ currentPassword, newPassword });
    setTimeout(() => setIsProcessing(false), 1000);
  };

  // Обработчик обновления настроек уведомлений
  const handleUpdateNotifications = () => {
    setIsProcessing(true);
    updateNotificationsMutation.mutate({
      emailNotifications,
      promotionalEmails,
      smsNotifications,
      securityAlerts
    });
    setTimeout(() => setIsProcessing(false), 1000);
  };

  // Обработчик смены языка
  const handleChangeLanguage = (newLanguage: string) => {
    if (newLanguage === language) return;
    
    setIsProcessing(true);
    setLanguage(newLanguage);
    changeLanguageMutation.mutate({ language: newLanguage });
    setTimeout(() => setIsProcessing(false), 1000);
  };

  // Обработчик удаления аккаунта
  const handleDeleteAccount = () => {
    if (window.confirm(t('settings.confirmDeleteAccount'))) {
      setIsProcessing(true);
      deleteAccountMutation.mutate();
      setTimeout(() => setIsProcessing(false), 1000);
    }
  };

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
            {t('dashboard.settings')}
          </motion.h2>
          
          <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 rounded-lg">
            <TabsTrigger
              value="profile"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <User className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
              <span className="hidden md:inline">{t('settings.profile')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <Lock className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
              <span className="hidden md:inline">{t('settings.security')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <Bell className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
              <span className="hidden md:inline">{t('settings.notifications')}</span>
            </TabsTrigger>
            <TabsTrigger
              value="language"
              className="rounded-md data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
            >
              <Globe className="h-4 w-4 mr-2 md:mr-0 lg:mr-2" />
              <span className="hidden md:inline">{t('settings.language')}</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <AnimatePresence mode="wait">
          <TabsContent value="profile" className="mt-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-6">
                  <div className="relative group">
                    <Avatar className="h-20 w-20 border-2 border-indigo-500/20 ring-4 ring-indigo-100 dark:ring-indigo-900/30">
                      <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${username || 'avatar'}`} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-xl">
                        {username?.substring(0, 2).toUpperCase() || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                      <span className="text-white text-xs font-medium">{t('settings.changeAvatar')}</span>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-xl font-bold mb-1">{fullName || username || 'User'}</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{email || 'user@example.com'}</p>
                    <div className="flex items-center mt-2 text-sm">
                      <div className="flex items-center px-2 py-1 rounded-md bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400 hover:bg-indigo-100 text-xs">
                        <UserCheck className="h-3 w-3 mr-1" />
                        {t('settings.accountVerified')}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">{t('settings.email')} *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="username">{t('settings.username')} *</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="yourusername"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">{t('settings.fullName')}</Label>
                      <Input
                        id="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label>{t('settings.memberSince')}</Label>
                      <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-md border border-gray-200 dark:border-gray-700">
                        {new Date(user?.createdAt || new Date()).toLocaleDateString('ru-RU', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric'
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end">
                  <Button
                    variant="default"
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    disabled={isProcessing}
                    onClick={handleUpdateProfile}
                  >
                    {isProcessing ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        {t('common.processing')}
                      </div>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {t('settings.saveChanges')}
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm p-6"
              >
                <h3 className="text-lg font-bold mb-4">{t('settings.dangerZone')}</h3>
                <Alert variant="destructive" className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>{t('settings.deleteAccountTitle')}</AlertTitle>
                  <AlertDescription>
                    {t('settings.deleteAccountWarning')}
                  </AlertDescription>
                </Alert>
                
                <Button
                  variant="destructive"
                  onClick={handleDeleteAccount}
                  disabled={isProcessing}
                >
                  {t('settings.deleteAccount')}
                </Button>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="security" className="mt-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm p-6"
              >
                <h3 className="text-lg font-bold mb-4">{t('settings.changePassword')}</h3>
                
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t('settings.currentPassword')} *</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? "text" : "password"}
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                      >
                        {showCurrentPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">{t('settings.newPassword')} *</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4 text-gray-400" />
                        ) : (
                          <Eye className="h-4 w-4 text-gray-400" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.passwordRequirements')}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">{t('settings.confirmPassword')} *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                  
                  <div className="pt-2">
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      disabled={isProcessing}
                      onClick={handleChangePassword}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          {t('common.processing')}
                        </div>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          {t('settings.updatePassword')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm p-6"
              >
                <h3 className="text-lg font-bold mb-4">{t('settings.securitySettings')}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="font-medium">{t('settings.twoFactorAuth')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('settings.twoFactorAuthDesc')}
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      {t('settings.enable')}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                    <div>
                      <h4 className="font-medium">{t('settings.activeDevices')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('settings.activeDevicesDesc')}
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      {t('settings.manage')}
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="font-medium">{t('settings.accountActivity')}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {t('settings.accountActivityDesc')}
                      </p>
                    </div>
                    <Button variant="outline" disabled>
                      {t('settings.view')}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="notifications" className="mt-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm p-6"
              >
                <h3 className="text-lg font-bold mb-4">{t('settings.notificationsPreferences')}</h3>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h4 className="font-medium">{t('settings.emailNotifications')}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('settings.emailNotificationsDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={emailNotifications}
                        onCheckedChange={setEmailNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h4 className="font-medium">{t('settings.promotionalEmails')}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('settings.promotionalEmailsDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={promotionalEmails}
                        onCheckedChange={setPromotionalEmails}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
                      <div>
                        <h4 className="font-medium">{t('settings.smsNotifications')}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('settings.smsNotificationsDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={smsNotifications}
                        onCheckedChange={setSmsNotifications}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="font-medium">{t('settings.securityAlerts')}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {t('settings.securityAlertsDesc')}
                        </p>
                      </div>
                      <Switch
                        checked={securityAlerts}
                        onCheckedChange={setSecurityAlerts}
                      />
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button
                      variant="default"
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                      disabled={isProcessing}
                      onClick={handleUpdateNotifications}
                    >
                      {isProcessing ? (
                        <div className="flex items-center">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                          {t('common.processing')}
                        </div>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          {t('settings.savePreferences')}
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
          
          <TabsContent value="language" className="mt-0">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.div
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm p-6"
              >
                <h3 className="text-lg font-bold mb-4">{t('settings.languageSettings')}</h3>
                
                <div className="space-y-4 max-w-md">
                  <div className="space-y-2">
                    <Label htmlFor="language">{t('settings.preferredLanguage')}</Label>
                    <Select value={language} onValueChange={handleChangeLanguage}>
                      <SelectTrigger id="language" className="w-full">
                        <SelectValue placeholder={t('settings.selectLanguage')} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ru">Русский</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="tj">Тоҷикӣ</SelectItem>
                        <SelectItem value="kz">Қазақша</SelectItem>
                        <SelectItem value="uz">O'zbekcha</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {t('settings.languageChangeInfo')}
                    </p>
                  </div>
                  
                  <div className="pt-2">
                    <Alert>
                      <Languages className="h-4 w-4" />
                      <AlertTitle>{t('settings.translationHelp')}</AlertTitle>
                      <AlertDescription>
                        {t('settings.translationHelpDesc')}
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
        </AnimatePresence>
      </Tabs>
    </div>
  );
};

export default UserSettings;