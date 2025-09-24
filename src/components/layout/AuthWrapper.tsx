'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

interface AuthWrapperProps {
  children: React.ReactNode
}

export default function AuthWrapper({ children }: AuthWrapperProps) {
  const { user } = useAuthStore()
  const router = useRouter()
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Aguardar a hidratação do Zustand
    const timer = setTimeout(() => {
      setIsLoading(false)
      
      // Se não estiver logado e não estiver na página de login, redirecionar
      if (!user && pathname !== '/login') {
        router.push('/login')
      }
      // Se estiver logado e estiver na página de login, redirecionar para home
      else if (user && pathname === '/login') {
        router.push('/')
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, pathname, router])

  // Loading state durante a verificação inicial
  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-slate-600">Verificando acesso...</p>
        </div>
      </div>
    )
  }

  // Se não estiver logado e não estiver na página de login, não renderizar
  if (!user && pathname !== '/login') {
    return null
  }

  return <>{children}</>
}