'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { MessageCircle, Edit, Trash2, LucideIcon } from 'lucide-react'
import { useSwipeToDismiss } from '@/hooks/useSwipeToDismiss'
import { useIsMobile } from '@/hooks/useIsMobile'
import { ReactNode } from 'react'

interface InfoField {
  icon: LucideIcon
  label: string
  value: ReactNode
}

interface PersonInfoModalProps {
  // Dados da pessoa
  name: string
  open: boolean
  onOpenChange: (open: boolean) => void
  
  // Configurações visuais
  title: string
  primaryBadge?: {
    text: string
    className?: string
  }
  
  // Campos de informação
  infoFields: InfoField[]
  
  // Seção de métricas (opcional)
  metricsSection?: ReactNode
  
  // Ações
  onWhatsApp: () => void
  onEdit: () => void
  onDelete?: () => void
  
  // Configurações
  hasPhone?: boolean
  deleteConfirmMessage?: string
}

export function PersonInfoModal({
  name,
  open,
  onOpenChange,
  title,
  primaryBadge,
  infoFields,
  metricsSection,
  onWhatsApp,
  onEdit,
  onDelete,
  hasPhone = true,
  deleteConfirmMessage
}: PersonInfoModalProps) {
  const isMobile = useIsMobile()
  
  const swipeRef = useSwipeToDismiss({
    onDismiss: () => onOpenChange(false),
    threshold: 80,
    enabled: open && isMobile
  })

  const handleEdit = () => {
    onEdit()
    onOpenChange(false)
  }

  const handleDelete = () => {
    const message = deleteConfirmMessage || `Tem certeza que deseja excluir ${name}?`
    if (confirm(message)) {
      onDelete?.()
      onOpenChange(false)
    }
  }

  const handleWhatsApp = () => {
    onWhatsApp()
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
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 mt-6 pb-4">
          {/* Nome e Badge Principal */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">{name}</h2>
            {primaryBadge && (
              <Badge className={primaryBadge.className || "bg-blue-100 text-blue-800"}>
                {primaryBadge.text}
              </Badge>
            )}
          </div>

          {/* Seção de Métricas (opcional) */}
          {metricsSection && (
            <div className="flex flex-col items-center space-y-2">
              {metricsSection}
            </div>
          )}

          {/* Campos de Informação */}
          {infoFields.length > 0 && (
            <div className="space-y-4">
              {infoFields.map((field, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <field.icon className="w-5 h-5 text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-700">{field.label}</p>
                    <div className="text-slate-900">{field.value}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-slate-200">
            {hasPhone && (
              <Button
                onClick={handleWhatsApp}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                WhatsApp
              </Button>
            )}
            
            <div className="flex gap-3 flex-1">
              <Button
                onClick={handleEdit}
                variant="outline"
                className="flex-1"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              
              {onDelete && (
                <Button
                  onClick={handleDelete}
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