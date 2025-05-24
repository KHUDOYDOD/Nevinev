import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiRequest } from './queryClient';

export type UserRole = 'user' | 'admin';

export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  balance: number;
  role: UserRole;
  language: string;
  referralCode: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  clearError: () => void;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  fullName: string;
  language: string;
  referredBy?: string;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: false,
      error: null,

      login: async (username: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiRequest('POST', '/api/auth/login', { username, password });
          const user = await res.json();
          set({ user, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to login', 
            isLoading: false 
          });
        }
      },

      register: async (userData: RegisterData) => {
        set({ isLoading: true, error: null });
        try {
          const res = await apiRequest('POST', '/api/auth/register', userData);
          const user = await res.json();
          set({ user, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to register', 
            isLoading: false 
          });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          await apiRequest('POST', '/api/auth/logout', {});
          set({ user: null, isLoading: false });
        } catch (error) {
          set({ 
            error: error instanceof Error ? error.message : 'Failed to logout', 
            isLoading: false 
          });
        }
      },

      checkAuth: async () => {
        set({ isLoading: true });
        try {
          const res = await apiRequest('GET', '/api/auth/me', undefined);
          const user = await res.json();
          set({ user, isLoading: false });
        } catch (error) {
          set({ user: null, isLoading: false });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: 'tradepo-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
