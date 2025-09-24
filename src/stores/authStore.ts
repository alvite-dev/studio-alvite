import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

// Usuários autorizados da Alvite
const AUTHORIZED_USERS = [
  { id: '1', email: 'bernardo@alvite.com.br', password: 'alvite2024', name: 'Bernardo Fernandes' },
  { id: '2', email: 'julia@alvite.com.br', password: 'alvite2024', name: 'Julia Alvite' },
  { id: '3', email: 'admin@alvite.com.br', password: 'admin123', name: 'Administrador' }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      login: (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        const foundUser = AUTHORIZED_USERS.find(
          u => u.email === email && u.password === password
        );
        
        // Simular delay de rede
        setTimeout(() => {
          if (foundUser) {
            const userData: User = { 
              id: foundUser.id, 
              username: foundUser.name,
              email: foundUser.email
            };
            set({ user: userData, isLoading: false, error: null });
          } else {
            set({ 
              isLoading: false, 
              error: 'Email ou senha incorretos. Apenas usuários da Alvite podem acessar.' 
            });
          }
        }, 800);
        
        return !!foundUser;
      },

      logout: () => {
        set({ user: null, error: null });
      },
    }),
    {
      name: 'studio-alvite-auth',
      partialize: (state) => ({ user: state.user }),
    }
  )
);