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
  Phone, 
  Star, 
  Info, 
  MessageCircle, 
  ArrowUpDown,
  User
} from 'lucide-react'
import { TerceiroCompleto } from '../types/terceiro'

interface TerceirosTableProps {
  terceiros: TerceiroCompleto[]
  onInfo: (terceiro: TerceiroCompleto) => void
  onWhatsApp: (contato: string) => void
}

type SortField = 'nome' | 'especialidade' | 'contato' | 'nota'
type SortDirection = 'asc' | 'desc'

export function TerceirosTable({ 
  terceiros, 
  onInfo, 
  onWhatsApp 
}: TerceirosTableProps) {
  const [sortField, setSortField] = useState<SortField>('nome')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const sortedTerceiros = [...terceiros].sort((a, b) => {
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

  const getEspecialidadeColor = (especialidade: string) => {
    const colors: { [key: string]: string } = {
      'marceneiro': 'bg-amber-100 text-amber-800',
      'encanador': 'bg-blue-100 text-blue-800', 
      'pintor': 'bg-green-100 text-green-800',
      'eletricista': 'bg-yellow-100 text-yellow-800',
      'pedreiro': 'bg-stone-100 text-stone-800',
      'jardineiro': 'bg-emerald-100 text-emerald-800',
      'limpeza': 'bg-cyan-100 text-cyan-800'
    }
    return colors[especialidade.toLowerCase()] || 'bg-slate-100 text-slate-800'
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

  if (terceiros.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Nenhum terceiro encontrado
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Comece adicionando seu primeiro terceiro parceiro.
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
              <SortableHeader field="nome">Terceiro</SortableHeader>
              <SortableHeader field="especialidade" className="hidden sm:table-cell">
                Especialidade
              </SortableHeader>
              <SortableHeader field="nota" className="hidden md:table-cell">
                Avaliação
              </SortableHeader>
              <SortableHeader field="contato" className="hidden lg:table-cell">
                Contato
              </SortableHeader>
              <TableHead className="text-left">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedTerceiros.map((terceiro) => (
              <TableRow key={terceiro.id}>
                <TableCell className="min-w-0">
                  <div className="min-w-0 pr-2">
                    <div className="font-medium text-slate-900 truncate">{terceiro.nome}</div>
                    {/* Mobile: mostrar especialidade e avaliação abaixo do nome */}
                    <div className="sm:hidden text-sm text-slate-500 truncate">
                      {terceiro.especialidade}
                    </div>
                    <div className="md:hidden mt-1 flex flex-wrap gap-2">
                      {renderStars(terceiro.nota)}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="hidden sm:table-cell">
                  <Badge className={getEspecialidadeColor(terceiro.especialidade)}>
                    {terceiro.especialidade}
                  </Badge>
                </TableCell>
                
                <TableCell className="hidden md:table-cell">
                  {renderStars(terceiro.nota)}
                </TableCell>

                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-slate-400" />
                    <span className="text-sm text-slate-600">{formatPhone(terceiro.contato)}</span>
                  </div>
                </TableCell>
                
                <TableCell className="text-left w-[140px] sm:w-auto">
                  <div className="flex items-center justify-start space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onInfo(terceiro)}
                      className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 shrink-0"
                      title="Ver informações"
                    >
                      <Info className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onWhatsApp(terceiro.contato)}
                      className="h-10 w-10 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 shrink-0"
                      title="WhatsApp"
                    >
                      <MessageCircle className="h-5 w-5" />
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