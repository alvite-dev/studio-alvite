'use client'

import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { 
  ExternalLink, 
  Edit, 
  MapPin, 
  Ruler, 
  Bed, 
  Bath, 
  Car,
  User,
  DollarSign,
  Home
} from 'lucide-react'
import { ImovelCompleto } from '../types/imovel'

interface ImovelInfoModalProps {
  imovel: ImovelCompleto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit: (imovel: ImovelCompleto) => void
}

export function ImovelInfoModal({ 
  imovel, 
  open, 
  onOpenChange, 
  onEdit
}: ImovelInfoModalProps) {
  if (!imovel) return null

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return '-'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatDate = (date: string | undefined) => {
    if (!date) return '-'
    return new Date(date).toLocaleDateString('pt-BR')
  }

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'prospectando':
        return 'bg-blue-100 text-blue-800'
      case 'analisando':
        return 'bg-yellow-100 text-yellow-800'
      case 'negociando':
        return 'bg-orange-100 text-orange-800'
      case 'finalizado':
        return 'bg-green-100 text-green-800'
      case 'cancelado':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-slate-100 text-slate-800'
    }
  }

  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'prospectando':
        return 'Prospectando'
      case 'analisando':
        return 'Analisando'
      case 'negociando':
        return 'Negociando'
      case 'finalizado':
        return 'Finalizado'
      case 'cancelado':
        return 'Cancelado'
      default:
        return 'Indefinido'
    }
  }

  const valorPorM2 = imovel.valor_anuncio && imovel.m2 
    ? imovel.valor_anuncio / imovel.m2 
    : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Home className="w-5 h-5" />
            {imovel.titulo || `${imovel.quartos}Q ${imovel.banheiros}B`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status e Ações */}
          <div className="flex items-center justify-between">
            <Badge className={getStatusColor(imovel.status_processo)}>
              {getStatusLabel(imovel.status_processo)}
            </Badge>
            
            <div className="flex items-center space-x-2">
              {imovel.link && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(imovel.link, '_blank')}
                  className="gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver Anúncio
                </Button>
              )}
              
              <Button
                size="sm"
                onClick={() => onEdit(imovel)}
                className="gap-2"
              >
                <Edit className="w-4 h-4" />
                Editar
              </Button>
            </div>
          </div>

          {/* Localização */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Localização
            </h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="text-sm space-y-1">
                <div className="font-medium text-slate-900">{imovel.endereco}</div>
                <div className="text-slate-600">{imovel.bairro} • {imovel.cidade}</div>
              </div>
            </div>
          </div>

          {/* Características */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900">Características</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 text-center">
                <Ruler className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                <div className="text-sm text-slate-600">Área</div>
                <div className="text-lg font-semibold text-slate-900">
                  {imovel.m2 ? `${imovel.m2}m²` : '-'}
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4 text-center">
                <Bed className="w-6 h-6 text-green-600 mx-auto mb-2" />
                <div className="text-sm text-slate-600">Quartos</div>
                <div className="text-lg font-semibold text-slate-900">{imovel.quartos}</div>
              </div>
              
              <div className="bg-purple-50 rounded-lg p-4 text-center">
                <Bath className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                <div className="text-sm text-slate-600">Banheiros</div>
                <div className="text-lg font-semibold text-slate-900">{imovel.banheiros}</div>
              </div>
              
              <div className="bg-orange-50 rounded-lg p-4 text-center">
                <Car className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                <div className="text-sm text-slate-600">Vagas</div>
                <div className="text-lg font-semibold text-slate-900">{imovel.vagas}</div>
              </div>
            </div>
          </div>

          {/* Valores Financeiros */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4" />
              Informações Financeiras
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-slate-600">Valor de Anúncio</div>
                  <div className="text-lg font-semibold text-green-600">
                    {formatCurrency(imovel.valor_anuncio)}
                  </div>
                  {valorPorM2 && (
                    <div className="text-xs text-slate-500">
                      {formatCurrency(valorPorM2)}/m²
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-slate-600">Condomínio</div>
                    <div className="text-sm font-medium text-slate-900">
                      {formatCurrency(imovel.valor_condominio)}
                    </div>
                  </div>
                  
                  <div>
                    <div className="text-sm text-slate-600">IPTU</div>
                    <div className="text-sm font-medium text-slate-900">
                      {formatCurrency(imovel.valor_iptu)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Corretor e Datas */}
          <div className="space-y-3">
            <h3 className="font-medium text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4" />
              Informações Adicionais
            </h3>
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <div className="text-slate-600">Corretor Responsável</div>
                  <div className="font-medium text-slate-900">
                    {imovel.corretor_nome || 'Não atribuído'}
                  </div>
                </div>
                
                <div>
                  <div className="text-slate-600">Data de Criação</div>
                  <div className="font-medium text-slate-900">
                    {formatDate(imovel.created_at)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}