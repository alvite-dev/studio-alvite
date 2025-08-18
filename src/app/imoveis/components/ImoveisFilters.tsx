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

  const handleValorMinChange = (value: string) => {
    const numValue = value.replace(/\D/g, '')
    onFiltrosChange({ ...filtros, valor_min: numValue ? Number(numValue) : null })
  }

  const handleValorMaxChange = (value: string) => {
    const numValue = value.replace(/\D/g, '')
    onFiltrosChange({ ...filtros, valor_max: numValue ? Number(numValue) : null })
  }

  const formatCurrency = (value: number | null) => {
    if (!value) return ''
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
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

      {/* Desktop: Layout original com filtros organizados */}
      <div className="hidden md:flex md:flex-col gap-4 px-6 sm:px-8 py-4 bg-white">
        {/* Primeira linha - Busca */}
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

        {/* Segunda linha - Filtros específicos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-7 gap-3">
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

          {/* Corretor */}
          <Select value={filtros.corretor_id || 'todos-corretores'} onValueChange={handleCorretorChange}>
            <SelectTrigger>
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
            <SelectTrigger>
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
            <SelectTrigger>
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
            <SelectTrigger>
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

          {/* Valor Mín */}
          <Input
            type="text"
            placeholder="Valor mín"
            value={filtros.valor_min ? formatCurrency(filtros.valor_min) : ''}
            onChange={(e) => handleValorMinChange(e.target.value)}
          />

          {/* Valor Máx */}
          <Input
            type="text"
            placeholder="Valor máx"
            value={filtros.valor_max ? formatCurrency(filtros.valor_max) : ''}
            onChange={(e) => handleValorMaxChange(e.target.value)}
          />
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