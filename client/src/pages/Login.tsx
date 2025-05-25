import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import LanguageSwitcher from "@/components/LanguageSwitcher";

// Define schema for login form
const loginSchema = z.object({
  username: z.string().min(1, { message: "Username is required" }),
  password: z.string().min(1, { message: "Password is required" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [, navigate] = useLocation();

  // Initialize form with react-hook-form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
      rememberMe: false,
    },
  });

  // Handle form submission
  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      console.log("Submitting login form with:", values);
      await login({
        username: values.username,
        password: values.password,
      });
      // Навигация и тост обрабатываются в хуке useAuth
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen relative overflow-hidden">
      {/* Декоративные элементы фона */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-bl from-primary/10 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-tr from-secondary/10 to-transparent"></div>
        
        <div className="absolute top-20 left-10 w-24 h-24 rounded-full bg-primary/5 blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 rounded-full bg-secondary/5 blur-3xl"></div>
        
        <div className="absolute -left-10 top-1/4 w-40 h-40 rounded-full bg-blue-500/5 animate-float animate-delay-300 blur-2xl"></div>
        <div className="absolute -right-10 top-3/4 w-40 h-40 rounded-full bg-purple-500/5 animate-float animate-delay-200 blur-2xl"></div>
      </div>
      
      {/* Левая часть с иллюстрацией (показывается только на больших экранах) */}
      <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center bg-gradient-to-br from-primary/90 to-accent/90">
        <div className="relative z-10 p-12 text-white max-w-lg animate-fade-in">
          <div className="mb-8">
            <h2 className="text-4xl font-extrabold mb-4">TRADEPO | Smart Profit System</h2>
            <p className="text-xl text-white/80">Инвестируйте с уверенностью и получайте стабильный доход с нашей надежной платформой.</p>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 mb-8">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <span className="text-2xl">💰</span>
              </div>
              <div>
                <h3 className="font-bold">Высокая доходность</h3>
                <p className="text-sm text-white/80">До 15% ежедневного дохода</p>
              </div>
            </div>
            
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <span className="text-2xl">🔒</span>
              </div>
              <div>
                <h3 className="font-bold">Безопасность</h3>
                <p className="text-sm text-white/80">Защита ваших инвестиций</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center mr-4">
                <span className="text-2xl">⚡</span>
              </div>
              <div>
                <h3 className="font-bold">Быстрые выплаты</h3>
                <p className="text-sm text-white/80">Вывод средств в течение 24 часов</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Декоративные элементы */}
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute top-0 left-0 w-full h-20 bg-gradient-to-b from-black/20 to-transparent"></div>
      </div>
      
      {/* Правая часть с формой */}
      <div className="w-full lg:w-1/2 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col items-center w-full max-w-md">
          <div className="absolute top-4 right-4">
            <LanguageSwitcher />
          </div>
          
          <Link href="/" className="flex items-center mb-8 animate-fade-in">
            <span className="font-bold text-3xl text-primary">TRADEPO</span>
            <span className="text-sm text-muted-foreground ml-2">
              | Smart Profit System
            </span>
          </Link>
          
          <Card className="w-full glassmorphism animate-scale-in">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">
                Вход в систему
              </CardTitle>
              <CardDescription className="text-center text-muted-foreground">
                Войдите в свой аккаунт для доступа к панели управления
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem className="animate-fade-in animate-delay-100">
                        <FormLabel>Имя пользователя</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Введите имя пользователя"
                            className="rounded-lg border-muted"
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
                      <FormItem className="animate-fade-in animate-delay-200">
                        <FormLabel>Пароль</FormLabel>
                        <FormControl>
                          <Input
                            type="password"
                            placeholder="••••••••"
                            className="rounded-lg border-muted"
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex items-center justify-between animate-fade-in animate-delay-300">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rememberMe"
                            className="border-muted"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                          <label
                            htmlFor="rememberMe"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Запомнить меня
                          </label>
                        </div>
                      )}
                    />
                    <Link
                      href="#"
                      className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  <Button
                    type="submit"
                    className="w-full modern-button bg-primary hover:bg-primary/90 text-white font-bold rounded-full py-6 shadow-lg shadow-primary/30 animate-fade-in animate-delay-400"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Загрузка...
                      </>
                    ) : (
                      "Войти"
                    )}
                  </Button>
                </form>
              </Form>
              
              <div className="relative my-6 animate-fade-in animate-delay-500">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-muted"></div>
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">или</span>
                </div>
              </div>
              
              <Button
                variant="outline"
                className="w-full border-muted text-muted-foreground hover:text-foreground font-medium animate-fade-in animate-delay-500 mb-3"
                onClick={() => window.location.href = "/register"}
              >
                Зарегистрироваться
              </Button>
              
              <Button
                variant="secondary"
                className="w-full font-medium animate-fade-in animate-delay-600 bg-gradient-to-r from-blue-500 to-purple-500 text-white"
                onClick={() => {
                  form.setValue('username', 'Admin');
                  form.setValue('password', 'X12345x');
                  form.handleSubmit(onSubmit)();
                }}
              >
                Войти как администратор (демо)
              </Button>
            </CardContent>
            <CardFooter>
              <p className="text-center text-xs text-muted-foreground mt-2 w-full animate-fade-in animate-delay-600">
                Входя в систему, вы соглашаетесь с нашими
                <Link href="#" className="underline underline-offset-4 ml-1 hover:text-primary">
                  Условиями использования
                </Link>
                <span className="mx-1">и</span>
                <Link href="#" className="underline underline-offset-4 hover:text-primary">
                  Политикой конфиденциальности
                </Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
