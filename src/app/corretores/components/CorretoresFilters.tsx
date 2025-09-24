'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import { CorretorFiltros } from '../types/corretor'
import { useCorretoresStore } from '@/stores/corretoresStore'

interface CorretoresFiltersProps {
  filtros: CorretorFiltros
  onFiltrosChange: (filtros: CorretorFiltros) => void
}

export function CorretoresFilters({ 
  filtros, 
  onFiltrosChange
}: CorretoresFiltersProps) {
  const { corretores } = useCorretoresStore()
  const [filtrosDesktopVisivel, setFiltrosDesktopVisivel] = useState(false)

  // Extrair imobiliárias únicas dos corretores
  const imobiliariasDisponiveis = useMemo(() => {
    const imobiliarias = corretores
      .map(corretor => corretor.imobiliaria)
      .filter((imobiliaria): imobiliaria is string => !!imobiliaria)
      .filter((imobiliaria, index, array) => array.indexOf(imobiliaria) === index)
      .sort()
    return imobiliarias
  }, [corretores])

  // Extrair bairros únicos dos corretores
  const bairrosDisponiveis = useMemo(() => {
    const bairros = corretores
      .flatMap(corretor => corretor.bairros || [])
      .filter((bairro, index, array) => array.indexOf(bairro) === index)
      .sort()
    return bairros
  }, [corretores])

  // Contar filtros ativos (excluindo busca)
  const filtrosAtivos = [
    filtros.imobiliaria,
    filtros.bairro
  ].filter(Boolean).length
  
  const handleBuscaChange = (value: string) => {
    onFiltrosChange({ ...filtros, busca: value })
  }

  const handleImobiliariaChange = (value: string) => {
    onFiltrosChange({ ...filtros, imobiliaria: value === 'todas-imobiliarias' ? '' : value })
  }

  const handleBairroChange = (value: string) => {
    onFiltrosChange({ ...filtros, bairro: value === 'todos-bairros' ? '' : value })
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
              placeholder="Buscar por nome, telefone, imobiliária..."
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
                placeholder="Buscar por nome, telefone, imobiliária..."
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
            {/* Imobiliária */}
            <Select value={filtros.imobiliaria || 'todas-imobiliarias'} onValueChange={handleImobiliariaChange}>
              <SelectTrigger>
                <SelectValue placeholder="Imobiliária" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas-imobiliarias">Todas as imobiliárias</SelectItem>
                {imobiliariasDisponiveis.map((imobiliaria) => (
                  <SelectItem key={imobiliaria} value={imobiliaria}>
                    {imobiliaria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Bairro */}
            <Select value={filtros.bairro || 'todos-bairros'} onValueChange={handleBairroChange}>
              <SelectTrigger>
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos-bairros">Todos os bairros</SelectItem>
                {bairrosDisponiveis.map((bairro) => (
                  <SelectItem key={bairro} value={bairro}>
                    {bairro}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Mobile: Filtros expandidos */}
      {filtrosDesktopVisivel && (
        <div className="md:hidden px-6 sm:px-8 pb-4 bg-white">
          <div className="grid grid-cols-1 gap-3 animate-in slide-in-from-top-2 duration-200">
            {/* Imobiliária */}
            <Select value={filtros.imobiliaria || 'todas-imobiliarias'} onValueChange={handleImobiliariaChange}>
              <SelectTrigger>
                <SelectValue placeholder="Imobiliária" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas-imobiliarias">Todas as imobiliárias</SelectItem>
                {imobiliariasDisponiveis.map((imobiliaria) => (
                  <SelectItem key={imobiliaria} value={imobiliaria}>
                    {imobiliaria}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Bairro */}
            <Select value={filtros.bairro || 'todos-bairros'} onValueChange={handleBairroChange}>
              <SelectTrigger>
                <SelectValue placeholder="Bairro" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos-bairros">Todos os bairros</SelectItem>
                {bairrosDisponiveis.map((bairro) => (
                  <SelectItem key={bairro} value={bairro}>
                    {bairro}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </>
  )
}