'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Phone, Star, Edit, Trash2, MessageCircle, Calendar } from 'lucide-react'
import { TerceiroCompleto } from '../types/terceiro'
import { useSwipeToDismiss } from '@/hooks/useSwipeToDismiss'
import { useIsMobile } from '@/hooks/useIsMobile'

interface TerceiroInfoModalProps {
  terceiro: TerceiroCompleto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (terceiro: TerceiroCompleto) => void
  onDelete: (id: string) => void
  onWhatsApp: (contato: string) => void
}

export function TerceiroInfoModal({
  terceiro,
  open,
  onOpenChange,
  onEdit,
  onDelete,
  onWhatsApp
}: TerceiroInfoModalProps) {
  const isMobile = useIsMobile()
  
  const swipeRef = useSwipeToDismiss({
    onDismiss: () => onOpenChange(false),
    threshold: 80,
    enabled: open && isMobile
  })

  if (!terceiro) return null

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    return phone
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const renderStars = (nota?: number | null) => {
    if (!nota) return <span className="text-slate-400 text-sm">Sem avaliação</span>
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-5 h-5 ${
              star <= nota 
                ? 'text-yellow-400 fill-current' 
                : 'text-slate-300'
            }`}
          />
        ))}
        <span className="ml-2 text-lg font-medium">{nota.toFixed(1)}</span>
      </div>
    )
  }

  const handleEdit = () => {
    onEdit(terceiro)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (confirm(`Tem certeza que deseja excluir ${terceiro.nome}?`)) {
      onDelete(terceiro.id)
      onOpenChange(false)
    }
  }

  const handleWhatsApp = () => {
    onWhatsApp(terceiro.contato)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        variant={isMobile ? "bottom-sheet" : "default"} 
        size={isMobile ? "bottom-sheet" : "default"} 
        ref={swipeRef}
      >
        <DialogHeader className={isMobile ? "pt-4" : ""}>
          <DialogTitle className={`flex items-center text-lg font-semibold ${isMobile ? "justify-center" : "justify-start"}`}>
            Informações do Terceiro
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6 pb-4">
          {/* Nome e Especialidade */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{terceiro.nome}</h2>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {terceiro.especialidade}
            </span>
          </div>

          {/* Avaliação */}
          <div className="flex flex-col items-center space-y-2">
            <span className="text-sm font-medium text-slate-700">Avaliação</span>
            {renderStars(terceiro.nota)}
          </div>

          {/* Informações de contato */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
              <Phone className="w-5 h-5 text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700">Contato</p>
                <p className="text-slate-900">{formatPhone(terceiro.contato)}</p>
              </div>
            </div>

            {terceiro.created_at && (
              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-400" />
                <div>
                  <p className="text-sm font-medium text-slate-700">Cadastrado em</p>
                  <p className="text-slate-900">{formatDate(terceiro.created_at)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            <Button
              onClick={handleWhatsApp}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            
            <div className="flex gap-3 flex-1">
              <Button
                onClick={handleEdit}
                variant="outline"
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              
              <Button
                onClick={handleDelete}
                variant="outline"
                className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Excluir
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}