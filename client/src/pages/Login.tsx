import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { LogIn, User, Lock, Eye, EyeOff, ChevronRight, AlertCircle } from "lucide-react";

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

// Define schema for login form
const loginSchema = z.object({
  username: z.string().min(1, { message: "Имя пользователя обязательно" }),
  password: z.string().min(1, { message: "Пароль обязателен" }),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
  const { login } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");
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
    setLoginError("");
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
      setLoginError("Неверное имя пользователя или пароль");
    } finally {
      setIsLoading(false);
    }
  };

  // Функция для быстрого входа
  const handleQuickLogin = () => {
    form.setValue('username', 'Пользователь');
    form.setValue('password', 'demo123');
    form.handleSubmit(onSubmit)();
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center">
      {/* Динамический фон с эффектом движения */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Анимированные круги */}
        <motion.div 
          className="absolute w-[60vw] h-[60vw] rounded-full bg-gradient-to-r from-fuchsia-500/20 to-purple-600/20 blur-3xl"
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
          style={{ top: "-20%", left: "-10%" }}
        />
        
        <motion.div 
          className="absolute w-[40vw] h-[40vw] rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-600/20 blur-3xl"
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
          style={{ bottom: "-10%", right: "-5%" }}
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
      <div className="container relative z-10 mx-auto px-4 py-12 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Левая часть - информация */}
        <motion.div 
          className="lg:w-1/2 max-w-lg text-white text-center lg:text-left"
          initial={{ opacity: 0, x: -50 }}
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
                <span className="font-bold bg-gradient-to-r from-fuchsia-400 to-violet-400 bg-clip-text text-transparent">TRADEPO</span>
                <span className="text-white/90 ml-2 text-lg">| Smart Profit System</span>
              </Link>
            </motion.div>
            <motion.p 
              className="text-xl text-white/90 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              Инвестируйте с уверенностью и получайте стабильный доход с нашей надежной платформой.
            </motion.p>
          </motion.div>
          
          {/* Карточки с преимуществами */}
          <div className="space-y-4">
            {[
              { icon: <motion.div animate={{ rotate: [0, 5, -5, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-fuchsia-400"><span className="text-2xl">💰</span></motion.div>, title: "Высокая доходность", desc: "До 15% ежедневного дохода" },
              { icon: <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-blue-400"><span className="text-2xl">🔒</span></motion.div>, title: "Безопасность", desc: "Защита ваших инвестиций" },
              { icon: <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-purple-400"><span className="text-2xl">⚡</span></motion.div>, title: "Быстрые выплаты", desc: "Вывод средств в течение 24 часов" }
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-center bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/10"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.2, duration: 0.5 }}
                whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.15)" }}
              >
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mr-4">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-bold">{item.title}</h3>
                  <p className="text-sm text-white/80">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Правая часть - форма входа */}
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
            <div className="bg-gradient-to-r from-fuchsia-800/50 to-violet-800/50 p-6">
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
                  <LogIn className="h-6 w-6 text-fuchsia-300" />
                </motion.div>
                Вход в систему
              </motion.h2>
              <motion.p 
                className="text-white/80 mt-1"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Войдите в свой аккаунт для доступа к панели управления
              </motion.p>
            </div>
            
            {/* Форма входа */}
            <div className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  {/* Ошибка входа */}
                  <AnimatePresence>
                    {loginError && (
                      <motion.div 
                        className="bg-red-500/20 backdrop-blur-sm text-white rounded-lg p-3 flex items-start"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                      >
                        <AlertCircle className="h-5 w-5 text-red-300 mr-2 mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="font-medium">Ошибка входа</p>
                          <p className="text-sm text-white/80">{loginError}</p>
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
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 h-12 focus:border-fuchsia-400 focus:ring-fuchsia-400/30"
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
                              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 pl-10 pr-10 h-12 focus:border-fuchsia-400 focus:ring-fuchsia-400/30"
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
                  
                  {/* Дополнительные опции */}
                  <div className="flex items-center justify-between py-2">
                    <FormField
                      control={form.control}
                      name="rememberMe"
                      render={({ field }) => (
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="rememberMe"
                            className="border-white/30 bg-white/10 data-[state=checked]:bg-fuchsia-600 data-[state=checked]:border-fuchsia-600"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isLoading}
                          />
                          <label
                            htmlFor="rememberMe"
                            className="text-sm font-medium text-white/80 cursor-pointer"
                          >
                            Запомнить меня
                          </label>
                        </div>
                      )}
                    />
                    
                    <Link
                      href="#"
                      className="text-sm font-medium text-fuchsia-300 hover:text-fuchsia-200 transition-colors"
                    >
                      Забыли пароль?
                    </Link>
                  </div>
                  
                  {/* Кнопка входа */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:from-fuchsia-500 hover:to-violet-500 text-white font-bold h-12 rounded-lg shadow-lg shadow-fuchsia-900/30 relative overflow-hidden group"
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
                          Вход...
                        </div>
                      ) : (
                        <div className="flex items-center justify-center">
                          Войти
                          <ChevronRight className="h-5 w-5 ml-1 transition-transform group-hover:translate-x-1" />
                        </div>
                      )}
                      
                      {/* Эффект блика */}
                      <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform translate-x-[-100%] group-hover:translate-x-[100%] ease-in-out"></span>
                    </Button>
                  </motion.div>
                  
                  {/* Разделитель */}
                  <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-white/20"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-violet-900/30 backdrop-blur-sm px-2 text-white/60 rounded-md">или</span>
                    </div>
                  </div>
                  
                  {/* Быстрые опции входа */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white flex items-center justify-center"
                        onClick={() => navigate("/register")}
                      >
                        Регистрация
                      </Button>
                    </motion.div>
                    
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        type="button"
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white"
                        onClick={handleQuickLogin}
                      >
                        Демо-аккаунт
                      </Button>
                    </motion.div>
                  </div>
                  
                  {/* Демо-вход */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="mt-2"
                  >
                    <Button
                      type="button"
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white flex items-center justify-center"
                      onClick={handleQuickLogin}
                    >
                      <span className="mr-2">👤</span> Быстрый демо-вход
                    </Button>
                  </motion.div>
                </form>
              </Form>
              
              {/* Нижняя информация */}
              <div className="mt-6 text-center">
                <p className="text-xs text-white/60">
                  Входя в систему, вы соглашаетесь с нашими
                  <Link href="#" className="text-fuchsia-300 hover:text-fuchsia-200 mx-1">
                    Условиями использования
                  </Link>
                  и
                  <Link href="#" className="text-fuchsia-300 hover:text-fuchsia-200 mx-1">
                    Политикой конфиденциальности
                  </Link>
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}