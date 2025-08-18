'use client'

import { useState } from 'react'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  ExternalLink, 
  Edit, 
  Trash2, 
  ArrowUpDown, 
  Home, 
  Info
} from 'lucide-react'
import { ImovelCompleto } from '../types/imovel'

interface ImoveisTableProps {
  imoveis: ImovelCompleto[]
  onEdit: (imovel: ImovelCompleto) => void
  onDelete: (id: string) => void
  onInfo: (imovel: ImovelCompleto) => void
}

type SortField = 'titulo' | 'endereco' | 'cidade' | 'quartos' | 'valor_anuncio' | 'status_processo'
type SortDirection = 'asc' | 'desc'

export function ImoveisTable({ 
  imoveis, 
  onEdit, 
  onDelete, 
  onInfo
}: ImoveisTableProps) {
  const [sortField, setSortField] = useState<SortField>('titulo')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedImoveis = [...imoveis].sort((a, b) => {
    let aValue: string | number = a[sortField] || ''
    let bValue: string | number = b[sortField] || ''
    
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = bValue.toLowerCase()
    }
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return '-'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
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

  const SortableHeader = ({ 
    field, 
    children, 
    className 
  }: { 
    field: SortField
    children: React.ReactNode
    className?: string 
  }) => (
    <TableHead className={className}>
      <Button
        variant="ghost"
        onClick={() => handleSort(field)}
        className="-ml-4 h-auto px-4 py-0 font-medium text-slate-500 hover:text-slate-900 justify-start"
      >
        {children}
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    </TableHead>
  )

  if (imoveis.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Home className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Nenhum imóvel encontrado
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Comece adicionando seu primeiro imóvel.
        </p>
      </div>
    )
  }

  return (
    <div className="h-full border border-slate-200 rounded-lg overflow-hidden">
      <div className="h-full overflow-auto overscroll-contain">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
            <TableRow>
              <SortableHeader field="titulo">Imóvel</SortableHeader>
              <SortableHeader field="cidade" className="hidden md:table-cell">
                Localização
              </SortableHeader>
              <SortableHeader field="quartos" className="hidden sm:table-cell">
                Quartos
              </SortableHeader>
              <SortableHeader field="valor_anuncio" className="hidden lg:table-cell">
                Valor
              </SortableHeader>
              <SortableHeader field="status_processo" className="hidden xl:table-cell">
                Status
              </SortableHeader>
              <TableHead className="text-left">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedImoveis.map((imovel) => (
              <TableRow key={imovel.id}>
                <TableCell className="min-w-0">
                  <div className="min-w-0 pr-2">
                    <div className="font-medium text-slate-900 truncate">
                      {imovel.titulo || `${imovel.quartos}Q ${imovel.banheiros}B`}
                    </div>
                    <div className="text-sm text-slate-500 truncate">
                      {imovel.endereco}
                    </div>
                    {/* Mobile: mostrar informações extras */}
                    <div className="md:hidden mt-1 flex flex-wrap gap-2">
                      {imovel.valor_anuncio && (
                        <span className="text-xs font-medium text-green-600">
                          {formatCurrency(imovel.valor_anuncio)}
                        </span>
                      )}
                      <Badge className={`text-xs ${getStatusColor(imovel.status_processo)}`}>
                        {getStatusLabel(imovel.status_processo)}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="hidden md:table-cell">
                  <div className="text-sm font-medium text-slate-900">
                    {imovel.bairro}
                  </div>
                </TableCell>
                
                <TableCell className="hidden sm:table-cell">
                  <div className="text-sm">
                    <div className="font-medium">{imovel.quartos}Q</div>
                    <div className="text-slate-500">{imovel.banheiros}B • {imovel.vagas}V</div>
                  </div>
                </TableCell>
                
                <TableCell className="hidden lg:table-cell">
                  <div className="text-sm font-medium text-slate-900">
                    {formatCurrency(imovel.valor_anuncio)}
                  </div>
                  {imovel.m2 && (
                    <div className="text-xs text-slate-500">{imovel.m2}m²</div>
                  )}
                </TableCell>

                <TableCell className="hidden xl:table-cell">
                  <Badge className={getStatusColor(imovel.status_processo)}>
                    {getStatusLabel(imovel.status_processo)}
                  </Badge>
                </TableCell>
                
                <TableCell className="text-left w-[180px] sm:w-auto">
                  <div className="flex items-center justify-start space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onInfo(imovel)}
                      className="h-9 w-9 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 shrink-0"
                      title="Ver informações"
                    >
                      <Info className="h-4 w-4" />
                    </Button>
                    
                    {imovel.link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => window.open(imovel.link, '_blank')}
                        className="h-9 w-9 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50 shrink-0"
                        title="Abrir link externo"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(imovel)}
                      className="h-9 w-9 p-0 text-orange-600 hover:text-orange-700 hover:bg-orange-50 shrink-0"
                      title="Editar imóvel"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(imovel.id)}
                      className="h-9 w-9 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                      title="Excluir imóvel"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}