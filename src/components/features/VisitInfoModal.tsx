'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { VisitaCompleta } from '@/stores/visitasStore'
import { MapPin, Phone, Clock, ExternalLink, Edit, Trash2, Calendar, User } from 'lucide-react'

interface VisitInfoModalProps {
  visita: VisitaCompleta | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (visita: VisitaCompleta) => void
  onDelete: (id: string) => void
}

export function VisitInfoModal({ 
  visita, 
  open, 
  onOpenChange, 
  onEdit, 
  onDelete 
}: VisitInfoModalProps) {
  if (!visita) return null

  // Usar dados manuais se existirem, senão usar dados da base (COALESCE)
  const corretorNome = visita.corretor_nome_manual || visita.corretor_nome || 'Corretor não encontrado'
  const corretorTelefone = visita.corretor_telefone_manual || visita.corretor_telefone || ''
  const corretorImobiliaria = visita.imobiliaria
  
  const imovelEndereco = visita.imovel_endereco_manual || visita.imovel_endereco || 'Endereço não encontrado'
  const imovelLink = visita.imovel_link_manual || visita.imovel_link || ''

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatPhone = (phone: string) => {
    const cleaned = phone.replace(/\D/g, '')
    
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    
    return phone
  }

  const handleEdit = () => {
    onEdit(visita)
    onOpenChange(false)
  }

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja remover esta visita?')) {
      onDelete(visita.id)
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-primary" />
            <span>Detalhes da Visita</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-4">
          {/* Endereço */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-900 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>Endereço</span>
            </h4>
            <p className="text-sm text-slate-700 pl-6 leading-relaxed">
              {imovelEndereco}
              {(visita.quartos !== undefined && visita.banheiros !== undefined && visita.vagas !== undefined) && (
                <span className="text-slate-500 text-xs block mt-1">
                  {visita.quartos} quartos • {visita.banheiros} banheiros • {visita.vagas} vagas
                </span>
              )}
            </p>
          </div>

          {/* Link do Imóvel */}
          {imovelLink && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-900 flex items-center space-x-2">
                <ExternalLink className="w-4 h-4 text-slate-400" />
                <span>Link do Imóvel</span>
              </h4>
              <div className="pl-6">
                <a
                  href={imovelLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-primary hover:text-primary-hover text-sm transition-colors"
                >
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Ver Anúncio
                </a>
              </div>
            </div>
          )}

          {/* Corretor */}
          {(corretorNome && corretorTelefone) && (
            <>
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-900 flex items-center space-x-2">
                  <User className="w-4 h-4 text-slate-400" />
                  <span>Corretor</span>
                </h4>
                <p className="text-sm text-slate-700 pl-6">
                  {corretorNome}
                  {corretorImobiliaria && (
                    <span className="text-slate-500"> - {corretorImobiliaria}</span>
                  )}
                </p>
              </div>

              {/* Telefone */}
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-slate-900 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-slate-400" />
                  <span>Telefone</span>
                </h4>
                <div className="pl-6">
                  <a
                    href={`tel:${corretorTelefone}`}
                    className="inline-flex items-center text-primary hover:text-primary-hover text-sm transition-colors"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    {formatPhone(corretorTelefone)}
                  </a>
                </div>
              </div>
            </>
          )}

          {/* Data e Horário */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-900 flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Data e Horário</span>
            </h4>
            <p className="text-sm text-slate-700 pl-6">
              {formatDateTime(visita.data_hora)}
            </p>
          </div>

          {/* Observações */}
          {visita.observacoes_pre && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-900">Observações</h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg">
                {visita.observacoes_pre}
              </p>
            </div>
          )}

          {/* Botões de Ação */}
          <div className="flex gap-2 pt-4 border-t border-slate-200">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex-1 flex items-center justify-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="flex-1 flex items-center justify-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            >
              <Trash2 className="w-4 h-4" />
              <span>Excluir</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}