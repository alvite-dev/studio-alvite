'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Phone, Star, Edit, Trash2, Info, MessageCircle } from 'lucide-react'
import { TerceiroCompleto } from '../types/terceiro'

interface TerceirosTableProps {
  terceiros: TerceiroCompleto[]
  onEdit: (terceiro: TerceiroCompleto) => void
  onDelete: (id: string) => void
  onInfo: (terceiro: TerceiroCompleto) => void
  onWhatsApp: (contato: string) => void
}

export function TerceirosTable({ 
  terceiros, 
  onEdit, 
  onDelete, 
  onInfo, 
  onWhatsApp 
}: TerceirosTableProps) {
  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return phone
  }

  const renderStars = (nota?: number | null) => {
    if (!nota) return <span className="text-slate-400 text-sm">Sem avaliação</span>
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= nota 
                ? 'text-yellow-400 fill-current' 
                : 'text-slate-300'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-medium">{nota.toFixed(1)}</span>
      </div>
    )
  }

  return (
    <>
      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 font-medium text-slate-700">Nome</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Especialidade</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Avaliação</th>
              <th className="text-left py-3 px-4 font-medium text-slate-700">Contato</th>
              <th className="text-right py-3 px-4 font-medium text-slate-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {terceiros.map((terceiro) => (
              <tr key={terceiro.id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-3 px-4">
                  <span className="font-medium text-slate-900">{terceiro.nome}</span>
                </td>
                <td className="py-3 px-4">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {terceiro.especialidade}
                  </span>
                </td>
                <td className="py-3 px-4">
                  {renderStars(terceiro.nota)}
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{formatPhone(terceiro.contato)}</span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onInfo(terceiro)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <Info className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onWhatsApp(terceiro.contato)}
                      className="text-green-600 hover:text-green-700"
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(terceiro)}
                      className="text-slate-500 hover:text-slate-700"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(terceiro.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {terceiros.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-2">
              <Phone className="w-12 h-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum terceiro encontrado</h3>
            <p className="text-slate-500">Adicione terceiros para gerenciar sua rede de contatos de obra.</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {terceiros.map((terceiro) => (
          <Card key={terceiro.id} className="relative">
            <CardContent className="p-4">
              {/* Botões de ação no canto superior direito */}
              <div className="absolute top-3 right-3 flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onInfo(terceiro)}
                  className="text-slate-500 hover:text-slate-700 h-8 w-8 p-0"
                >
                  <Info className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onWhatsApp(terceiro.contato)}
                  className="text-green-600 hover:text-green-700 h-8 w-8 p-0"
                >
                  <MessageCircle className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(terceiro)}
                  className="text-slate-500 hover:text-slate-700 h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(terceiro.id)}
                  className="text-red-600 hover:text-red-700 h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="pr-32 space-y-3">
                {/* Nome e especialidade */}
                <div>
                  <h3 className="font-medium text-slate-900 mb-1">{terceiro.nome}</h3>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {terceiro.especialidade}
                  </span>
                </div>

                {/* Avaliação */}
                <div>
                  {renderStars(terceiro.nota)}
                </div>

                {/* Contato */}
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span className="text-sm text-slate-600">{formatPhone(terceiro.contato)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {terceiros.length === 0 && (
          <div className="text-center py-12">
            <div className="text-slate-400 mb-2">
              <Phone className="w-12 h-12 mx-auto mb-4" />
            </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Nenhum terceiro encontrado</h3>
            <p className="text-slate-500">Adicione terceiros para gerenciar sua rede de contatos de obra.</p>
          </div>
        )}
      </div>
    </>
  )
}