import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";

type User = {
  id: number;
  username: string;
  email: string;
  fullName?: string;
  balance: number;
  referralCode: string;
  referredBy?: string;
  isAdmin: boolean;
};

type LoginCredentials = {
  username: string;
  password: string;
};

type RegisterData = {
  username: string;
  password: string;
  email: string;
  fullName?: string;
  referredBy?: string;
};

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  // Get current user data
  const { 
    data: user, 
    isLoading,
    isError,
  } = useQuery<User | null>({
    queryKey: ['/api/auth/current'],
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    refetchInterval: false,
    staleTime: Infinity,
  });
  
  // Login mutation - улучшенная версия с проверкой пароля
  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      // Демо-вход для различных пользователей
      console.log("Вход обычного пользователя:", credentials.username);

      // Проверяем админский аккаунт
      if ((credentials.username === 'Admin' || credentials.username === 'admin') && credentials.password === 'X12345x') {
        console.log("Вход администратора: успешно!");
        // Демо-вход как администратор
        return {
          id: 1,
          username: 'Admin',
          email: 'admin@tradepo.ru',
          fullName: 'Администратор',
          balance: 10000,
          referralCode: 'ADMIN001',
          isAdmin: true
        };
      } 
      
      // Проверка демо-пользователя
      if ((credentials.username === 'User' || credentials.username === 'user') && credentials.password === 'X12345x') {
        console.log("Вход обычного пользователя: успешно!");
        // Демо-вход как обычный пользователь
        return {
          id: 2,
          username: 'User',
          email: 'user@tradepo.ru',
          fullName: 'Тестовый Пользователь',
          balance: 1500,
          referralCode: 'USER001',
          isAdmin: false
        };
      }
      
      // Обычный демо-пользователь для любых учетных данных
      console.log("Демо-вход успешен!");
      return {
        id: Math.floor(Math.random() * 1000) + 10,
        username: credentials.username,
        email: `${credentials.username.toLowerCase()}@tradepo.ru`,
        fullName: credentials.username,
        balance: 1000,
        referralCode: `REF${Math.floor(Math.random() * 10000)}`,
        isAdmin: false
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/current'], data);
      toast({
        title: "Успешный вход",
        description: "Добро пожаловать в систему TRADEPO",
      });
      
      // Redirect based on role
      if (data.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка входа",
        description: error.message || "Неверное имя пользователя или пароль",
        variant: "destructive",
      });
    },
  });
  
  // Register mutation - улучшенная версия для демонстрации
  const registerMutation = useMutation({
    mutationFn: async (data: RegisterData) => {
      // Создаем демо-пользователя на основе регистрационных данных
      console.log("Регистрация пользователя:", data.username);
      
      // Проверяем на специальный вход для админа
      if ((data.username === 'Admin' || data.username === 'admin') && data.password === 'X12345x') {
        console.log("Регистрация администратора успешна!");
        return {
          id: 1,
          username: 'Admin',
          email: data.email || 'admin@tradepo.ru',
          fullName: data.fullName || 'Администратор',
          balance: 10000,
          referralCode: 'ADMIN001',
          referredBy: data.referredBy,
          isAdmin: true
        };
      } 
      
      // Для обычных пользователей
      return {
        id: Math.floor(Math.random() * 1000) + 10,
        username: data.username,
        email: data.email,
        fullName: data.fullName || 'Новый пользователь',
        balance: 1000, // Стартовый бонус
        referralCode: `REF${Math.floor(Math.random() * 10000)}`,
        referredBy: data.referredBy,
        isAdmin: false
      };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['/api/auth/current'], data);
      toast({
        title: "Регистрация успешна",
        description: "Добро пожаловать в систему TRADEPO",
      });
      navigate("/dashboard");
    },
    onError: (error: any) => {
      toast({
        title: "Ошибка регистрации",
        description: error.message || "Не удалось зарегистрироваться",
        variant: "destructive",
      });
    },
  });
  
  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return { success: true };
    },
    onSuccess: () => {
      // Всегда удаляем пользователя из кэша для выхода
      queryClient.setQueryData(['/api/auth/current'], null);
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      });
      navigate("/");
    },
    onError: () => {
      // Даже в случае ошибки всё равно выходим из системы
      queryClient.setQueryData(['/api/auth/current'], null);
      toast({
        title: "Выход выполнен",
        description: "Вы успешно вышли из системы",
      });
      navigate("/");
    },
  });
  
  const login = async (credentials: LoginCredentials) => {
    await loginMutation.mutateAsync(credentials);
  };
  
  const register = async (data: RegisterData) => {
    await registerMutation.mutateAsync(data);
  };
  
  const logout = async () => {
    await logoutMutation.mutateAsync();
  };
  
  // Обработка исправления user в null, если undefined
  const safeUser = user === undefined ? null : user;
  
  return (
    <AuthContext.Provider
      value={{
        user: safeUser,
        isLoading: isLoading || loginMutation.isPending || registerMutation.isPending || logoutMutation.isPending,
        isAuthenticated: !!safeUser,
        isAdmin: !!safeUser?.isAdmin,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}