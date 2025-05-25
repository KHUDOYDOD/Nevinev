import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
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
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterClick: () => void;
}

const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  remember: z.boolean().optional()
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginModal = ({ isOpen, onClose, onRegisterClick }: LoginModalProps) => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false
    }
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiRequest("POST", "/api/auth/login", {
        username: data.username,
        password: data.password
      });
      
      const userData = await response.json();
      login(userData.user);
      
      toast({
        title: "Login successful",
        description: "Welcome back to TRADEPO!",
      });
      
      navigate("/dashboard");
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
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
            {t('login.title')}
          </DialogTitle>
          <DialogDescription className="text-center">
            {t('login.subtitle')}
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
                      placeholder={t('login.emailPlaceholder')} 
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
                      placeholder={t('login.passwordPlaceholder')} 
                      {...field} 
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="flex items-center justify-between">
              <FormField
                control={form.control}
                name="remember"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox 
                        checked={field.value} 
                        onCheckedChange={field.onChange} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel className="!m-0">{t('login.rememberMe')}</FormLabel>
                  </FormItem>
                )}
              />
              <Link href="#" className="text-sm font-medium text-primary hover:text-primary-dark">
                {t('login.forgotPassword')}
              </Link>
            </div>
            
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {t('login.button')}
            </Button>
            
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {t('login.noAccount')}{' '}
                <Button 
                  variant="link" 
                  className="p-0 h-auto font-medium" 
                  onClick={onRegisterClick}
                  disabled={isLoading}
                >
                  {t('login.register')}
                </Button>
              </p>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default LoginModal;
