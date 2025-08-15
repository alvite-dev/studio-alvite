'use client'

import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { CorretorFiltros } from '../types/corretor'

interface CorretoresFiltersProps {
  filtros: CorretorFiltros
  onFiltrosChange: (filtros: CorretorFiltros) => void
}

export function CorretoresFilters({ 
  filtros, 
  onFiltrosChange
}: CorretoresFiltersProps) {
  
  const handleBuscaChange = (value: string) => {
    onFiltrosChange({ ...filtros, busca: value })
  }



  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap gap-4 sm:items-center px-6 sm:px-8 py-4 bg-white">
      {/* Busca */}
      <div className="flex-1 min-w-0 sm:min-w-64">
        <div className="relative">
          <Input
            type="text"
            placeholder="Buscar por nome, telefone ou imobiliária..."
            value={filtros.busca}
            onChange={(e) => handleBuscaChange(e.target.value)}
            className="pl-10"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

    </div>
  )
}