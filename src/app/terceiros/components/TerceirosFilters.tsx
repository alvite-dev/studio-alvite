'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import { TerceiroFiltros } from '../types/terceiro'
import { useTerceirosStore } from '@/stores/terceirosStore'

interface TerceirosFiltersProps {
  filtros: TerceiroFiltros
  onFiltrosChange: (filtros: TerceiroFiltros) => void
}

export function TerceirosFilters({ 
  filtros, 
  onFiltrosChange
}: TerceirosFiltersProps) {
  const { terceiros } = useTerceirosStore()
  const [filtrosDesktopVisivel, setFiltrosDesktopVisivel] = useState(false)

  // Extrair especialidades únicas dos terceiros
  const especialidadesDisponiveis = useMemo(() => {
    const especialidades = terceiros
      .map(terceiro => terceiro.especialidade)
      .filter((especialidade, index, array) => array.indexOf(especialidade) === index)
      .sort()
    return especialidades
  }, [terceiros])

  // Contar filtros ativos (excluindo busca)
  const filtrosAtivos = [
    filtros.especialidade,
    filtros.nota_minima
  ].filter(Boolean).length
  
  const handleBuscaChange = (value: string) => {
    onFiltrosChange({ ...filtros, busca: value })
  }

  const handleEspecialidadeChange = (value: string) => {
    onFiltrosChange({ ...filtros, especialidade: value === 'todas-especialidades' ? '' : value })
  }

  const handleNotaMinimaChange = (value: string) => {
    onFiltrosChange({ ...filtros, nota_minima: value === 'todas-notas' ? null : Number(value) })
  }

  return (
    <>
      {/* Mobile: Barra de pesquisa + Botão de filtros */}
      <div className="md:hidden flex gap-3 px-6 sm:px-8 py-4 bg-white">
        {/* Barra de pesquisa */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar por nome, especialidade ou contato..."
              value={filtros.busca}
              onChange={(e) => handleBuscaChange(e.target.value)}
              className="pl-10"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        {/* Botão de filtros no mobile */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setFiltrosDesktopVisivel(!filtrosDesktopVisivel)}
          className="shrink-0 relative"
        >
          <Filter className="w-4 h-4" />
          {filtrosAtivos > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {filtrosAtivos}
            </span>
          )}
        </Button>
      </div>

      {/* Desktop: Layout com toggle de filtros */}
      <div className="hidden md:flex md:flex-col gap-4 px-6 sm:px-8 py-4 bg-white">
        {/* Primeira linha - Busca + Botão de filtros */}
        <div className="flex gap-3 items-center">
          <div className="flex-1 min-w-0">
            <div className="relative">
              <Input
                type="text"
                placeholder="Buscar por nome, especialidade ou contato..."
                value={filtros.busca}
                onChange={(e) => handleBuscaChange(e.target.value)}
                className="pl-10"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setFiltrosDesktopVisivel(!filtrosDesktopVisivel)}
            className="shrink-0 relative"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
            {filtrosAtivos > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {filtrosAtivos}
              </span>
            )}
          </Button>
        </div>

        {/* Segunda linha - Filtros específicos (colapsível) */}
        {filtrosDesktopVisivel && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 animate-in slide-in-from-top-2 duration-200">
            {/* Especialidade */}
            <Select value={filtros.especialidade || 'todas-especialidades'} onValueChange={handleEspecialidadeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas-especialidades">Todas as especialidades</SelectItem>
                {especialidadesDisponiveis.map((especialidade) => (
                  <SelectItem key={especialidade} value={especialidade}>
                    {especialidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Nota Mínima */}
            <Select value={filtros.nota_minima?.toString() || 'todas-notas'} onValueChange={handleNotaMinimaChange}>
              <SelectTrigger>
                <SelectValue placeholder="Nota mínima" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas-notas">Todas as notas</SelectItem>
                <SelectItem value="5">5 estrelas</SelectItem>
                <SelectItem value="4">4+ estrelas</SelectItem>
                <SelectItem value="3">3+ estrelas</SelectItem>
                <SelectItem value="2">2+ estrelas</SelectItem>
                <SelectItem value="1">1+ estrela</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Mobile: Filtros expandidos */}
      {filtrosDesktopVisivel && (
        <div className="md:hidden px-6 sm:px-8 pb-4 bg-white">
          <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-top-2 duration-200">
            {/* Especialidade */}
            <Select value={filtros.especialidade || 'todas-especialidades'} onValueChange={handleEspecialidadeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Especialidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas-especialidades">Todas as especialidades</SelectItem>
                {especialidadesDisponiveis.map((especialidade) => (
                  <SelectItem key={especialidade} value={especialidade}>
                    {especialidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Nota Mínima */}
            <Select value={filtros.nota_minima?.toString() || 'todas-notas'} onValueChange={handleNotaMinimaChange}>
              <SelectTrigger>
                <SelectValue placeholder="Nota mínima" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas-notas">Todas as notas</SelectItem>
                <SelectItem value="5">5 estrelas</SelectItem>
                <SelectItem value="4">4+ estrelas</SelectItem>
                <SelectItem value="3">3+ estrelas</SelectItem>
                <SelectItem value="2">2+ estrelas</SelectItem>
                <SelectItem value="1">1+ estrela</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </>
  )
}