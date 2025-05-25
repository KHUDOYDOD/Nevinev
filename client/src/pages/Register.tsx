import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, Mail, User, Lock, Eye, EyeOff, ChevronRight, AlertCircle, Gift } from "lucide-react";

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

// Define schema for registration form
const registerSchema = z
  .object({
    username: z.string().min(3, { message: "Имя пользователя должно содержать не менее 3 символов" }),
    email: z.string().email({ message: "Пожалуйста, введите корректный email" }),
    fullName: z.string().min(2, { message: "Введите ваше полное имя" }),
    password: z.string().min(6, { message: "Пароль должен содержать не менее 6 символов" }),
    confirmPassword: z.string(),
    referredBy: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Пароли не совпадают",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function Register() {
  const { t } = useTranslation();
  const { register } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState("");
  const [, navigate] = useLocation();

  // Анимированный фон
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Get referral code from URL if any
  const searchParams = new URLSearchParams(window.location.search);
  const referralCode = searchParams.get("ref") || "";

  // Initialize form with react-hook-form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      fullName: "",
      password: "",
      confirmPassword: "",
      referredBy: referralCode,
    },
  });

  // Handle form submission
  const onSubmit = async (values: RegisterFormValues) => {
    setRegisterError("");
    setIsLoading(true);
    try {
      await register({
        username: values.username,
        email: values.email,
        fullName: values.fullName,
        password: values.password,
        referredBy: values.referredBy,
      });
      // Навигация и тост обрабатываются в хуке useAuth
    } catch (error) {
      console.error("Registration error:", error);
      setRegisterError("Ошибка при регистрации. Пожалуйста, попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-purple-900 via-violet-900 to-indigo-900 flex items-center justify-center">
      {/* Динамический фон с эффектом движения */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Анимированные круги */}
        <motion.div 
          className="absolute w-[50vw] h-[50vw] rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-600/20 blur-3xl"
          animate={{ 
            x: mousePosition.x * 0.02,
            y: mousePosition.y * 0.02,
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ top: "-10%", right: "-10%" }}
        />
        
        <motion.div 
          className="absolute w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-blue-500/20 to-indigo-600/20 blur-3xl"
          animate={{ 
            x: mousePosition.x * -0.01,
            y: mousePosition.y * -0.01,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse"
          }}
          style={{ bottom: "-5%", left: "-10%" }}
        />
        
        {/* Графический эффект сетки */}
        <div className="absolute inset-0 perspective-[1000px]">
          <motion.div
            className="absolute inset-0"
            animate={{
              rotateX: [0, 5, 0, -5, 0],
              rotateY: [0, -5, 0, 5, 0]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            style={{
              backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), 
                                linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
              transformStyle: 'preserve-3d'
            }}
          />
        </div>
        
        {/* Плавающие частицы */}
        {Array.from({ length: 30 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.5 + 0.1,
            }}
            animate={{
              y: [0, -30, 0],
              x: [0, Math.random() * 20 - 10, 0],
              opacity: [0, 0.5, 0],
              scale: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 5,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>
      
      {/* Основное содержимое */}
      <div className="container relative z-10 mx-auto px-4 py-8 flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Левая часть - форма регистрации */}
        <motion.div 
          className="w-full lg:w-1/2 max-w-md"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 overflow-hidden shadow-2xl"
            whileHover={{ boxShadow: "0 25px 50px -12px rgba(79, 70, 229, 0.4)" }}
            transition={{ duration: 0.3 }}
          >
            {/* Заголовок формы */}
            <div className="bg-gradient-to-r from-indigo-800/50 to-violet-800/50 p-6">
              <div className="flex justify-between items-start">
                <div>
                  <motion.h2 
                    className="text-2xl font-bold text-white flex items-center"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <motion.div 
                      animate={{ 
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="mr-2"
                    >
                      <UserPlus className="h-6 w-6 text-indigo-300" />
                    </motion.div>
                    Регистрация
                  </motion.h2>
                  <motion.p 
                    className="text-white/80 mt-1"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    Создайте аккаунт для доступа к инвестиционной платформе
                  </motion.p>
                </div>
                
                <Link href="/" className="text-white/80 hover:text-white transition-colors">
                  <motion.div 
                    className="bg-white/10 hover:bg-white/20 p-2 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <span className="text-2xl">🏠</span>
                  </motion.div>
                </Link>
              </div>
            </div>
            
            {/* Форма регистрации */}
            <div className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Ошибка регистрации */}
                  <AnimatePresence>
                    {registerError && (
                      <motion.div 
                        className="bg-red-500/20 backdrop-blur-sm text-white rounded-lg p-3 flex items-start"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <AlertCircle className="h-5 w-5 text-red-300 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Ошибка регистрации</p>
                          <p className="text-sm text-white/80">{registerError}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Имя пользователя */}
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/90 font-medium">
                          Имя пользователя
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Введите имя пользователя"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 h-12 focus:border-indigo-400 focus:ring-indigo-400/30"
                              {...field}
                              disabled={isLoading}
                            />
                            <User className="h-5 w-5 text-white/50 absolute left-3 top-3.5" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/90 font-medium">
                          Email
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type="email"
                              placeholder="email@example.com"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 h-12 focus:border-indigo-400 focus:ring-indigo-400/30"
                              {...field}
                              disabled={isLoading}
                            />
                            <Mail className="h-5 w-5 text-white/50 absolute left-3 top-3.5" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Полное имя */}
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/90 font-medium">
                          Полное имя
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Иван Иванов"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 h-12 focus:border-indigo-400 focus:ring-indigo-400/30"
                              {...field}
                              disabled={isLoading}
                            />
                            <User className="h-5 w-5 text-white/50 absolute left-3 top-3.5" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Пароль */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/90 font-medium">
                          Пароль
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 pr-10 h-12 focus:border-indigo-400 focus:ring-indigo-400/30"
                              {...field}
                              disabled={isLoading}
                            />
                            <Lock className="h-5 w-5 text-white/50 absolute left-3 top-3.5" />
                            <motion.button
                              type="button"
                              className="absolute right-3 top-3.5 text-white/50 hover:text-white"
                              onClick={() => setShowPassword(!showPassword)}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </motion.button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Подтверждение пароля */}
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/90 font-medium">
                          Подтверждение пароля
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="••••••••"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 pr-10 h-12 focus:border-indigo-400 focus:ring-indigo-400/30"
                              {...field}
                              disabled={isLoading}
                            />
                            <Lock className="h-5 w-5 text-white/50 absolute left-3 top-3.5" />
                            <motion.button
                              type="button"
                              className="absolute right-3 top-3.5 text-white/50 hover:text-white"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                              whileTap={{ scale: 0.9 }}
                            >
                              {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </motion.button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Реферальный код */}
                  <FormField
                    control={form.control}
                    name="referredBy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/90 font-medium">
                          Реферальный код (если есть)
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              placeholder="Введите реферальный код"
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 h-12 focus:border-indigo-400 focus:ring-indigo-400/30"
                              {...field}
                              disabled={isLoading || !!referralCode}
                            />
                            <Gift className="h-5 w-5 text-white/50 absolute left-3 top-3.5" />
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-300" />
                      </FormItem>
                    )}
                  />
                  
                  {/* Кнопка регистрации */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-6"
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold h-12 rounded-lg shadow-lg shadow-indigo-900/30 relative overflow-hidden group"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                          Регистрация...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          Создать аккаунт
                          <ChevronRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      )}
                      
                      {/* Эффект блика */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out"></span>
                    </Button>
                  </motion.div>
                  
                  {/* Ссылка на вход */}
                  <div className="mt-4 text-center">
                    <p className="text-white/70">
                      Уже есть аккаунт?{" "}
                      <Link
                        href="/login"
                        className="text-indigo-300 hover:text-indigo-200 font-medium transition-colors"
                      >
                        Войти
                      </Link>
                    </p>
                  </div>
                </form>
              </Form>
              
              {/* Нижняя информация */}
              <div className="mt-6 text-center">
                <p className="text-xs text-white/60">
                  Регистрируясь, вы соглашаетесь с нашими
                  <Link href="#" className="text-indigo-300 hover:text-indigo-200 mx-1">
                    Условиями использования
                  </Link>
                  и
                  <Link href="#" className="text-indigo-300 hover:text-indigo-200 mx-1">
                    Политикой конфиденциальности
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Правая часть - информация */}
        <motion.div 
          className="lg:w-1/2 max-w-lg text-white text-center lg:text-left hidden lg:block"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <motion.div 
              className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white"
              animate={{ 
                textShadow: [
                  "0 0 10px rgba(255, 255, 255, 0.3)",
                  "0 0 20px rgba(255, 255, 255, 0.5)",
                  "0 0 10px rgba(255, 255, 255, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Link href="/" className="flex items-center justify-center lg:justify-start">
                <span className="font-bold bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">TRADEPO</span>
                <span className="text-white/90 ml-2 text-lg">| Smart Profit System</span>
              </Link>
            </motion.div>
            <motion.p 
              className="text-xl text-white/90 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Присоединяйтесь к тысячам инвесторов, которые уже увеличивают свой капитал с нашей платформой
            </motion.p>
          </motion.div>
          
          {/* Преимущества регистрации */}
          <div className="space-y-6">
            <motion.h3 
              className="text-2xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              Преимущества регистрации
            </motion.h3>
            
            {[
              { icon: "💼", title: "Мгновенный доступ", desc: "Начните инвестировать сразу после регистрации" },
              { icon: "📊", title: "Прозрачная статистика", desc: "Отслеживайте рост своих инвестиций в реальном времени" },
              { icon: "🔄", title: "Автоматические выплаты", desc: "Получайте прибыль ежедневно без задержек" },
              { icon: "👥", title: "Реферальная система", desc: "Приглашайте друзей и получайте дополнительный доход" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-start bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + index * 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4 flex-shrink-0">
                  <motion.span 
                    className="text-2xl"
                    animate={{ 
                      y: [0, -3, 0],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{ 
                      duration: 2, 
                      repeat: Infinity,
                      repeatType: "mirror" 
                    }}
                  >
                    {item.icon}
                  </motion.span>
                </div>
                <div className="text-left">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}