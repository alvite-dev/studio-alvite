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
import { Edit, MessageCircle, Trash2, ArrowUpDown, Phone } from 'lucide-react'
import { CorretorCompleto } from '../types/corretor'
import { cn } from '@/lib/utils'

interface CorretoresTableProps {
  corretores: CorretorCompleto[]
  onEdit: (corretor: CorretorCompleto) => void
  onDelete: (id: string) => void
  onWhatsApp: (telefone: string) => void
}

type SortField = keyof CorretorCompleto
type SortDirection = 'asc' | 'desc'

export function CorretoresTable({ 
  corretores, 
  onEdit, 
  onDelete, 
  onWhatsApp 
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

  const formatWhatsAppUrl = (telefone: string) => {
    const cleanPhone = telefone.replace(/\D/g, '')
    return `https://wa.me/55${cleanPhone}`
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
      <div className="h-full overflow-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-slate-50/80 backdrop-blur-sm border-b border-slate-200">
            <TableRow>
              <SortableHeader field="nome">Corretor</SortableHeader>
              <SortableHeader field="telefone" className="hidden sm:table-cell">
                Telefone
              </SortableHeader>
              <SortableHeader field="imobiliaria" className="hidden md:table-cell">
                Imobiliária
              </SortableHeader>
              <TableHead className="text-left">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedCorretores.map((corretor) => (
              <TableRow key={corretor.id}>
                <TableCell>
                  <div className="min-w-0">
                    <div className="font-medium text-slate-900">{corretor.nome}</div>
                    {/* Mobile: mostrar telefone abaixo do nome */}
                    <div className="sm:hidden text-sm text-slate-500">
                      {formatTelefone(corretor.telefone)}
                    </div>
                  </div>
                </TableCell>
                
                <TableCell className="hidden sm:table-cell">
                  <div className="text-sm text-slate-900">{formatTelefone(corretor.telefone)}</div>
                </TableCell>
                
                <TableCell className="hidden md:table-cell">
                  <div className="text-sm text-slate-900">{corretor.imobiliaria}</div>
                </TableCell>
                
                <TableCell className="text-left">
                  <div className="flex items-center justify-start space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(corretor)}
                      className="h-10 w-10 p-0"
                      title="Editar corretor"
                    >
                      <Edit className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onWhatsApp(corretor.telefone)}
                      className="h-10 w-10 p-0 text-green-600 hover:text-green-700 hover:bg-green-50"
                      title="Abrir WhatsApp"
                    >
                      <MessageCircle className="h-5 w-5" />
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(corretor.id)}
                      className="h-10 w-10 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                      title="Excluir corretor"
                    >
                      <Trash2 className="h-5 w-5" />
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