'use client'

import { Card, CardContent } from '@/components/ui/card'
import { VisitaForm } from '@/stores/visitasStore'
import { useCorretoresStore } from '@/stores/corretoresStore'
import { useImoveisStore } from '@/stores/imoveisStore'
import { MapPin, Phone, Clock, ExternalLink, User } from 'lucide-react'

interface VisitCardProps {
  visita: VisitaForm
  isDragging?: boolean
}

export function VisitCard({ visita, isDragging }: VisitCardProps) {
  const { obterCorretorPorId } = useCorretoresStore()
  const { obterImovelPorId } = useImoveisStore()
  
  const corretor = visita.corretor_id ? obterCorretorPorId(visita.corretor_id) : null
  const imovel = visita.imovel_id ? obterImovelPorId(visita.imovel_id) : null
  
  // Usar dados manuais se existirem, senão usar dados da base
  const corretorNome = visita.corretor_nome_manual || corretor?.nome || 'Corretor não encontrado'
  const corretorTelefone = visita.corretor_telefone_manual || corretor?.telefone || ''
  const corretorImobiliaria = corretor?.imobiliaria
  
  const imovelEndereco = visita.imovel_endereco_manual || imovel?.endereco || 'Endereço não encontrado'
  const imovelLink = visita.imovel_link_manual || imovel?.link || ''

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  }

  const formatPhone = (phone: string) => {
    // Remove caracteres não numéricos
    const cleaned = phone.replace(/\D/g, '')
    
    // Formatar telefone brasileiro
    if (cleaned.length === 11) {
      return cleaned.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    } else if (cleaned.length === 10) {
      return cleaned.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    }
    
    return phone
  }

  return (
    <Card 
      className={`transition-all duration-200 ${
        isDragging 
          ? 'shadow-lg rotate-1 opacity-90' 
          : 'hover:shadow-md'
      }`}
    >
      <CardContent className="p-4 pt-6">
        {/* Informações principais */}
        <div className="space-y-3 pr-28">
          {/* Endereço - primeiro */}
          <div className="flex items-start space-x-3">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-slate-700 line-clamp-2 leading-relaxed">
              {imovelEndereco}
              {imovel && (
                <span className="text-slate-500 text-xs ml-2">
                  ({imovel.quartos}Q {imovel.banheiros}B {imovel.vagas}V)
                </span>
              )}
            </span>
          </div>

          {/* Link do imóvel - segundo */}
          {imovelLink && (
            <div className="flex items-center space-x-3">
              <ExternalLink className="w-4 h-4 text-slate-400 flex-shrink-0" />
              <a
                href={imovelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-hover font-medium text-sm transition-colors cursor-pointer"
                onClick={(e) => e.stopPropagation()}
              >
                Ver Imóvel
              </a>
            </div>
          )}

          {/* Corretor - terceiro */}
          {(corretorNome && corretorTelefone) && (
            <>
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <span className="text-sm font-medium text-slate-900">
                  {corretorNome}
                  {corretorImobiliaria && (
                    <span className="text-slate-500 font-normal"> - {corretorImobiliaria}</span>
                  )}
                </span>
              </div>

              {/* Telefone do corretor */}
              <div className="flex items-center space-x-3">
                <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                <a
                  href={`tel:${corretorTelefone}`}
                  className="text-primary hover:text-primary-hover text-sm font-medium transition-colors cursor-pointer"
                  title="Ligar para o corretor"
                  onClick={(e) => e.stopPropagation()}
                >
                  {formatPhone(corretorTelefone)}
                </a>
              </div>
            </>
          )}

          {/* Horário */}
          <div className="flex items-center space-x-3">
            <Clock className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-sm font-medium text-slate-900">
              {formatTime(visita.data_hora)}
            </span>
          </div>

        </div>
      </CardContent>
    </Card>
  )
}