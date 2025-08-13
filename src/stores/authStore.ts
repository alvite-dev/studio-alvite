import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// Usuários hardcoded por enquanto - depois migrar para Supabase
const USERS = [
  { id: '1', username: 'admin', password: 'admin' },
  { id: '2', username: 'studio', password: 'alvite2024' }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,

      login: (username: string, password: string) => {
        const foundUser = USERS.find(
          u => u.username === username && u.password === password
        );
        
        if (foundUser) {
          const userData: User = { 
            id: foundUser.id, 
            username: foundUser.username 
          };
          set({ user: userData });
          return true;
        }
        
        return false;
      },

      logout: () => {
        set({ user: null });
      },
    }),
    {
      name: 'studio-alvite-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);