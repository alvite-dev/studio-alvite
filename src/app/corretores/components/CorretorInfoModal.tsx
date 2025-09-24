'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Phone, MessageCircle, Edit, Trash2, Building2, MapPin, User } from 'lucide-react'
import { CorretorCompleto } from '../types/corretor'
import { useIsMobile } from '@/hooks/useIsMobile'
import { BairroTags } from './BairroTags'

interface CorretorInfoModalProps {
  corretor: CorretorCompleto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (corretor: CorretorCompleto) => void
  onWhatsApp: (telefone: string) => void
  onDelete?: (id: string) => void
}

export function CorretorInfoModal({ 
  corretor, 
  open, 
  onOpenChange, 
  onEdit, 
  onWhatsApp,
  onDelete
}: CorretorInfoModalProps) {
  const isMobile = useIsMobile()

  if (!corretor) return null

  const formatTelefone = (telefone: string) => {
    return telefone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
        variant={isMobile ? "bottom-sheet" : "default"}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="w-10 h-10 bg-slate-400 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            Informações do Corretor
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Nome */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900">{corretor.nome}</h3>
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Phone className="w-4 h-4" />
              <span>Telefone</span>
            </div>
            <div className="text-slate-900">{formatTelefone(corretor.telefone)}</div>
          </div>

          {/* Imobiliária */}
          {corretor.imobiliaria && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Building2 className="w-4 h-4" />
                <span>Imobiliária</span>
              </div>
              <div className="text-slate-900">{corretor.imobiliaria}</div>
            </div>
          )}

          {/* Bairros */}
          {corretor.bairros && corretor.bairros.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <MapPin className="w-4 h-4" />
                <span>Áreas de Atuação</span>
              </div>
              <BairroTags bairros={corretor.bairros} />
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-3 pt-4 border-t border-slate-200">
            <Button
              onClick={() => onWhatsApp(corretor.telefone)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp
            </Button>
            
            <div className="flex gap-3 flex-1">
              <Button
                onClick={() => {
                  onEdit(corretor)
                  onOpenChange(false)
                }}
                variant="outline"
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              
              {onDelete && (
                <Button
                  onClick={() => {
                    if (confirm(`Tem certeza que deseja excluir ${corretor.nome}?`)) {
                      onDelete(corretor.id)
                      onOpenChange(false)
                    }
                  }}
                  variant="outline"
                  className="flex-1 text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Excluir
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}