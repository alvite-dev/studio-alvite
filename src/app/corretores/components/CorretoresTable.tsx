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
import { MessageCircle, ArrowUpDown, Phone, Info } from 'lucide-react'
import { CorretorCompleto } from '../types/corretor'
import { BairroTags } from './BairroTags'

interface CorretoresTableProps {
  corretores: CorretorCompleto[]
  onWhatsApp: (telefone: string) => void
  onInfo: (corretor: CorretorCompleto) => void
}

type SortField = keyof CorretorCompleto
type SortDirection = 'asc' | 'desc'

export function CorretoresTable({ 
  corretores, 
  onWhatsApp,
  onInfo
}: CorretoresTableProps) {
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

  const sortedCorretores = [...corretores].sort((a, b) => {
    const aValue = a[sortField] || ''
    const bValue = b[sortField] || ''
    
    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
    }
  })

  const formatTelefone = (telefone: string) => {
    return telefone.replace(/\D/g, '').replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
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

  if (corretores.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
          <Phone className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          Nenhum corretor encontrado
        </h3>
        <p className="text-sm text-slate-500 mb-4">
          Comece adicionando seu primeiro corretor parceiro.
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
              <SortableHeader field="nome">Corretor</SortableHeader>
              <SortableHeader field="telefone" className="hidden sm:table-cell">
                Telefone
              </SortableHeader>
              <SortableHeader field="imobiliaria" className="hidden lg:table-cell">
                Imobiliária
              </SortableHeader>
              <TableHead className="hidden md:table-cell">Bairros</TableHead>
              <TableHead className="text-left">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCorretores.map((corretor) => (
              <TableRow key={corretor.id}>
                <TableCell className="min-w-0">
                  <div className="min-w-0 pr-2">
                    <div className="font-medium text-slate-900 truncate">{corretor.nome}</div>
                    {/* Mobile: mostrar telefone abaixo do nome */}
                    <div className="sm:hidden text-sm text-slate-500 truncate">
                      {formatTelefone(corretor.telefone)}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="hidden sm:table-cell">
                  <div className="text-sm text-slate-900">{formatTelefone(corretor.telefone)}</div>
                </TableCell>
                
                <TableCell className="hidden lg:table-cell">
                  <div className="text-sm text-slate-900">{corretor.imobiliaria}</div>
                </TableCell>

                <TableCell className="hidden md:table-cell">
                  <BairroTags bairros={corretor.bairros} maxTags={3} />
                </TableCell>
                
                <TableCell className="text-left w-[140px] sm:w-auto">
                  <div className="flex items-center justify-start space-x-1 sm:space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onInfo(corretor)}
                      className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50 shrink-0"
                      title="Ver informações"
                    >
                      <Info className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onWhatsApp(corretor.telefone)}
                      className="h-10 w-10 p-0 text-green-600 hover:text-green-700 hover:bg-green-50 shrink-0"
                      title="Abrir WhatsApp"
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