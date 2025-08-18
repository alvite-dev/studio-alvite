'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ImovelFiltros } from '../types/imovel'
import { useCorretoresStore } from '@/stores/corretoresStore'
import { useImoveisStore } from '@/stores/imoveisStore'
import { useEffect, useMemo } from 'react'

interface FiltrosModalProps {
  filtros: ImovelFiltros
  onFiltrosChange: (filtros: ImovelFiltros) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function FiltrosModal({ 
  filtros, 
  onFiltrosChange,
  open,
  onOpenChange
}: FiltrosModalProps) {
  const { corretores, carregarCorretores } = useCorretoresStore()
  const { imoveis } = useImoveisStore()
  
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
  
  const handleBairroChange = (value: string) => {
    onFiltrosChange({ ...filtros, bairro: value === 'todos-bairros' ? '' : value })
  }

  const handleCorretorChange = (value: string) => {
    onFiltrosChange({ ...filtros, corretor_id: value === 'todos-corretores' ? '' : value })
  }

  const handleQuartosMinChange = (value: string) => {
    onFiltrosChange({ ...filtros, quartos_min: value && value !== 'sem-min' ? Number(value) : null })
  }

  const handleQuartosMaxChange = (value: string) => {
    onFiltrosChange({ ...filtros, quartos_max: value && value !== 'sem-max' ? Number(value) : null })
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

  const limparFiltros = () => {
    onFiltrosChange({
      busca: filtros.busca, // Manter busca
      bairro: '',
      quartos_min: null,
      quartos_max: null,
      banheiros_min: null,
      vagas_min: null,
      valor_min: null,
      valor_max: null,
      corretor_id: ''
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Filtros</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Bairro */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Bairro</label>
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

          {/* Corretor */}
          <div>
            <label className="text-sm font-medium text-slate-700 mb-2 block">Corretor</label>
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
          </div>

          {/* Quartos */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Quartos mín</label>
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
            </div>
            
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Quartos máx</label>
              <Select value={filtros.quartos_max?.toString() || 'sem-max'} onValueChange={handleQuartosMaxChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Quartos máx" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sem-max">Sem máx</SelectItem>
                  <SelectItem value="1">Até 1 quarto</SelectItem>
                  <SelectItem value="2">Até 2 quartos</SelectItem>
                  <SelectItem value="3">Até 3 quartos</SelectItem>
                  <SelectItem value="4">Até 4 quartos</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Banheiros e Vagas */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Banheiros mín</label>
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
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Vagas mín</label>
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
            </div>
          </div>

          {/* Valores */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Valor mín</label>
              <Input
                type="text"
                placeholder="Ex: 500.000"
                value={filtros.valor_min ? formatCurrency(filtros.valor_min) : ''}
                onChange={(e) => handleValorMinChange(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-slate-700 mb-2 block">Valor máx</label>
              <Input
                type="text"
                placeholder="Ex: 1.000.000"
                value={filtros.valor_max ? formatCurrency(filtros.valor_max) : ''}
                onChange={(e) => handleValorMaxChange(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" onClick={limparFiltros} className="flex-1">
            Limpar
          </Button>
          <Button onClick={() => onOpenChange(false)} className="flex-1">
            Aplicar Filtros
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}