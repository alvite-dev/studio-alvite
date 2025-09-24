'use client'

import { useAuthStore } from '@/stores/authStore'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, Mail, Building2, Calendar } from 'lucide-react'
import PageHeader from '@/components/features/PageHeader'

export default function ProfilePage() {
  const { user } = useAuthStore()

  if (!user) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-slate-500">Carregando informações do usuário...</p>
      </div>
    )
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="h-[calc(100dvh-72px)] md:h-[calc(100vh-56px)] flex flex-col bg-white overflow-hidden">
      <PageHeader
        title="Minha Conta"
        description="Visualize e gerencie suas informações pessoais"
      />

      <div className="flex-1 overflow-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="max-w-4xl mx-auto space-y-6">
          
          {/* Profile Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-lg">
                  {getInitials(user.username)}
                </div>
                Informações Pessoais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <User className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Nome Completo</p>
                      <p className="text-slate-900">{user.username}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Mail className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Email</p>
                      <p className="text-slate-900">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Building2 className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Empresa</p>
                      <p className="text-slate-900">Alvite</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-slate-400" />
                    <div>
                      <p className="text-sm font-medium text-slate-700">Último Acesso</p>
                      <p className="text-slate-900">Hoje</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions Card */}
          <Card>
            <CardHeader>
              <CardTitle>Ações da Conta</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="outline" disabled>
                  Alterar Senha
                </Button>
                <Button variant="outline" disabled>
                  Configurações de Notificação
                </Button>
              </div>
              <p className="text-sm text-slate-500 mt-4">
                * Funcionalidades em desenvolvimento
              </p>
            </CardContent>
          </Card>

          {/* Security Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informações de Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800">
                  ✓ Sua conta está protegida e o acesso é restrito aos usuários autorizados da Alvite.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}