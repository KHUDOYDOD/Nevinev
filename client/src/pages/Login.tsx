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
      await login({
        username: values.username,
        password: values.password,
      });
      toast({
        title: t("auth.login"),
        description: t("dashboard.completed"),
        variant: "success",
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      // Error toast is handled in the useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 dark:bg-gray-900">
      <div className="flex flex-col items-center w-full max-w-md">
        <div className="absolute top-4 right-4">
          <LanguageSwitcher />
        </div>
        
        <Link href="/" className="flex items-center mb-8">
          <span className="font-bold text-2xl text-primary">TRADEPO</span>
          <span className="text-sm text-gray-500 ml-2 dark:text-gray-400">
            | Smart Profit System
          </span>
        </Link>
        
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold text-center">
              {t("auth.login")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("auth.loginToAccount")}
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
                    <FormItem>
                      <FormLabel>{t("auth.username")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="username"
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
                      <FormLabel>{t("auth.password")}</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="••••••••"
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
                    name="rememberMe"
                    render={({ field }) => (
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="rememberMe"
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          disabled={isLoading}
                        />
                        <label
                          htmlFor="rememberMe"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 dark:text-gray-300"
                        >
                          {t("auth.rememberMe")}
                        </label>
                      </div>
                    )}
                  />
                  <Link
                    href="#"
                    className="text-sm font-medium text-primary hover:underline dark:text-primary"
                  >
                    {t("auth.forgotPassword")}
                  </Link>
                </div>
                <Button
                  type="submit"
                  className="w-full"
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
                      {t("general.loading")}
                    </>
                  ) : (
                    t("auth.login")
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <p className="text-center text-sm text-gray-600 mt-2 w-full dark:text-gray-400">
              {t("auth.dontHaveAccount")}{" "}
              <Link
                href="/register"
                className="font-medium text-primary hover:underline dark:text-primary"
              >
                {t("auth.register")}
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
