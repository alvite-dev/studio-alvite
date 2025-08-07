'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Sidebar from './Sidebar';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Rotas que não precisam de autenticação
  const publicRoutes = ['/login'];
  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!user && !isPublicRoute) {
        // Se não está logado e não é rota pública, redirecionar para login
        router.push('/login');
      } else if (user && isPublicRoute) {
        // Se está logado e está na página de login, redirecionar para home
        router.push('/');
      }
    }
  }, [user, isLoading, isPublicRoute, router]);

  // Mostrar loading enquanto verifica autenticação
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-slate-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se é rota pública, mostrar sem sidebar
  if (isPublicRoute) {
    return <>{children}</>;
  }

  // Se não está logado, não mostrar nada (vai redirecionar)
  if (!user) {
    return null;
  }

  // Se está logado, mostrar com sidebar
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 ml-72 min-h-screen">
        {children}
      </main>
    </div>
  );
}