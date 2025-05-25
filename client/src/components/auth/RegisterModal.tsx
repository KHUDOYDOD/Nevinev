import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "wouter";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { apiRequest } from "@/lib/queryClient";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginClick: () => void;
  referralCode?: string;
}

const registerSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string(),
  referralCode: z.string().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterModal = ({ isOpen, onClose, onLoginClick, referralCode }: RegisterModalProps) => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      referralCode: referralCode || ""
    }
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/register", {
        username: data.username,
        email: data.email,
        password: data.password,
        referrerCode: data.referralCode || undefined
      });
      
      const userData = await response.json();
      login(userData.user);
      
      toast({
        title: "Registration successful",
        description: "Welcome to TRADEPO!",
      });
      
      navigate("/dashboard");
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please check your information and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">
            {t('register.title')}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t('register.subtitle')}
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('register.username')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('register.usernamePlaceholder')} 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.email')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="email" 
                      placeholder={t('register.emailPlaceholder')} 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('common.password')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={t('register.passwordPlaceholder')} 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('register.confirmPassword')}</FormLabel>
                  <FormControl>
                    <Input 
                      type="password" 
                      placeholder={t('register.confirmPasswordPlaceholder')} 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="referralCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('register.referralCode')}</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={t('register.referralCodePlaceholder')} 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t('register.button')}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('register.hasAccount')}{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-medium" 
                  onClick={onLoginClick}
                  disabled={isLoading}
                >
                  {t('register.login')}
                </Button>
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RegisterModal;
