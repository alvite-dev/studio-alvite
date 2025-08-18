'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, Filter } from 'lucide-react'
import { ImovelFiltros } from '../types/imovel'
import { useCorretoresStore } from '@/stores/corretoresStore'
import { useImoveisStore } from '@/stores/imoveisStore'
import { useEffect, useMemo } from 'react'
import { FiltrosModal } from './FiltrosModal'

interface ImoveisFiltersProps {
  filtros: ImovelFiltros
  onFiltrosChange: (filtros: ImovelFiltros) => void
}

export function ImoveisFilters({ 
  filtros, 
  onFiltrosChange
}: ImoveisFiltersProps) {
  const { corretores, carregarCorretores } = useCorretoresStore()
  const { imoveis } = useImoveisStore()
  const [filtrosModalOpen, setFiltrosModalOpen] = useState(false)
  
  useEffect(() => {
    carregarCorretores()
  }, [carregarCorretores])

  // Extrair bairros únicos dos imóveis
  const bairrosDisponiveis = useMemo(() => {
    const bairros = imoveis
      .map(imovel => imovel.bairro)
      .filter((bairro): bairro is string => !!bairro)
      .filter((bairro, index, array) => array.indexOf(bairro) === index)
      .sort()
    return bairros
  }, [imoveis])

  // Contar filtros ativos (excluindo busca)
  const filtrosAtivos = [
    filtros.bairro,
    filtros.corretor_id,
    filtros.quartos_min,
    filtros.quartos_max,
    filtros.banheiros_min,
    filtros.vagas_min,
    filtros.valor_min,
    filtros.valor_max
  ].filter(Boolean).length
  
  const handleBuscaChange = (value: string) => {
    onFiltrosChange({ ...filtros, busca: value })
  }

  const handleBairroChange = (value: string) => {
    onFiltrosChange({ ...filtros, bairro: value === 'todos-bairros' ? '' : value })
  }

  const handleCorretorChange = (value: string) => {
    onFiltrosChange({ ...filtros, corretor_id: value === 'todos-corretores' ? '' : value })
  }

  const handleQuartosMinChange = (value: string) => {
    onFiltrosChange({ ...filtros, quartos_min: value && value !== 'sem-min' ? Number(value) : null })
  }

  const handleBanheirosMinChange = (value: string) => {
    onFiltrosChange({ ...filtros, banheiros_min: value && value !== 'sem-min-banh' ? Number(value) : null })
  }

  const handleVagasMinChange = (value: string) => {
    onFiltrosChange({ ...filtros, vagas_min: value && value !== 'sem-min-vagas' ? Number(value) : null })
  }

  return (
    <>
      <div className="flex gap-3 px-6 sm:px-8 py-4 bg-white">
        {/* Barra de pesquisa */}
        <div className="flex-1 min-w-0">
          <div className="relative">
            <Input
              type="text"
              placeholder="Buscar por título, endereço, bairro..."
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
          onClick={() => setFiltrosModalOpen(true)}
          className="shrink-0 md:hidden relative"
        >
          <Filter className="w-4 h-4" />
          {filtrosAtivos > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {filtrosAtivos}
            </span>
          )}
        </Button>

        {/* Filtros inline no desktop */}
        <div className="hidden md:flex gap-3">
          {/* Bairro */}
          <Select value={filtros.bairro || 'todos-bairros'} onValueChange={handleBairroChange}>
            <SelectTrigger className="w-[150px]">
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

          {/* Corretor */}
          <Select value={filtros.corretor_id || 'todos-corretores'} onValueChange={handleCorretorChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Corretor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos-corretores">Todos os corretores</SelectItem>
              {corretores.map((corretor) => (
                <SelectItem key={corretor.id} value={corretor.id}>
                  {corretor.nome}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Quartos Mín */}
          <Select value={filtros.quartos_min?.toString() || 'sem-min'} onValueChange={handleQuartosMinChange}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Quartos mín" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sem-min">Todos os quartos</SelectItem>
              <SelectItem value="1">1+ quarto</SelectItem>
              <SelectItem value="2">2+ quartos</SelectItem>
              <SelectItem value="3">3+ quartos</SelectItem>
              <SelectItem value="4">4+ quartos</SelectItem>
            </SelectContent>
          </Select>

          {/* Banheiros Mín */}
          <Select value={filtros.banheiros_min?.toString() || 'sem-min-banh'} onValueChange={handleBanheirosMinChange}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Banheiros mín" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sem-min-banh">Todos os banheiros</SelectItem>
              <SelectItem value="1">1+ banheiro</SelectItem>
              <SelectItem value="2">2+ banheiros</SelectItem>
              <SelectItem value="3">3+ banheiros</SelectItem>
              <SelectItem value="4">4+ banheiros</SelectItem>
            </SelectContent>
          </Select>

          {/* Vagas Mín */}
          <Select value={filtros.vagas_min?.toString() || 'sem-min-vagas'} onValueChange={handleVagasMinChange}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Vagas mín" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sem-min-vagas">Todas as vagas</SelectItem>
              <SelectItem value="1">1+ vaga</SelectItem>
              <SelectItem value="2">2+ vagas</SelectItem>
              <SelectItem value="3">3+ vagas</SelectItem>
              <SelectItem value="4">4+ vagas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Modal de filtros para mobile */}
      <FiltrosModal
        filtros={filtros}
        onFiltrosChange={onFiltrosChange}
        open={filtrosModalOpen}
        onOpenChange={setFiltrosModalOpen}
      />
    </>
  )
}