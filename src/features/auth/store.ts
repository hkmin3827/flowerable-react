import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserInfo } from './types';

interface AuthState {
  isAuthenticated: boolean;
  user: UserInfo | null;
  setAuth: (data: { isAuthenticated: boolean; user: UserInfo | null }) => void;
  
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      setAuth: (data) => set(data),
      clearAuth: () => set({ isAuthenticated: false, user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
