'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuthStore } from '@/stores/authStore'
import { Mail, Lock, AlertCircle } from 'lucide-react'
import Image from 'next/image'

export default function LoginPage() {
  const router = useRouter()
  const { user, isLoading, error, login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [validationError, setValidationError] = useState('')

  // Redirecionar se já estiver logado
  useEffect(() => {
    if (user) {
      router.push('/')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setValidationError('')

    // Validação básica
    if (!email || !password) {
      setValidationError('Por favor, preencha todos os campos')
      return
    }

    // Validar se é um dos emails autorizados
    const authorizedEmails = [
      'bernardo@alvite.com.br',
      'julia@alvite.com.br', 
      'admin@alvite.com.br'
    ]

    if (!authorizedEmails.includes(email.toLowerCase())) {
      setValidationError('Apenas usuários autorizados da Alvite podem acessar')
      return
    }

    const success = login(email, password)
    
    if (success) {
      // Aguardar o delay do loading e então redirecionar
      setTimeout(() => {
        router.push('/')
      }, 900)
    }
  }

  if (user) {
    return null // Não renderizar nada enquanto redireciona
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-slate-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto relative">
            <Image 
              src="/new-logo.svg" 
              alt="Alvite Logo" 
              fill
              className="object-contain"
            />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Alvite
          </CardTitle>
          <p className="text-slate-600 text-sm">
            Acesse sua conta para gerenciar investimentos imobiliários
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@alvite.com.br"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4" />
                Senha
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full"
                disabled={isLoading}
              />
            </div>

            {(validationError || error) && (
              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <span className="text-sm text-red-600">
                  {validationError || error}
                </span>
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Entrando...
                </>
              ) : (
                'Entrar'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-xs text-slate-500">
              Acesso restrito aos usuários da Alvite
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}