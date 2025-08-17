'use client'

import { useState, useEffect } from 'react'
import { useImoveisStore, ImovelParaCalculadora } from '@/stores/imoveisStore'
import { PropertyData } from '@/lib/types'
import { ViabilityInputs } from './useViabilityCalculator'

interface UsePropertySelectionReturn {
  imoveis: ImovelParaCalculadora[]
  isLoading: boolean
  searchTerm: string
  filteredImoveis: ImovelParaCalculadora[]
  selectedProperty: ImovelParaCalculadora | null
  setSearchTerm: (term: string) => void
  selectProperty: (imovel: ImovelParaCalculadora) => void
  clearSelection: () => void
  mapToViabilityInputs: (imovel: ImovelParaCalculadora) => Partial<ViabilityInputs>
  mapPropertyDataToViabilityInputs: (property: PropertyData) => Partial<ViabilityInputs>
}

export function usePropertySelection(): UsePropertySelectionReturn {
  const {
    imoveisParaCalculadora: imoveis,
    isLoading,
    carregarImoveis,
    mapearImovelParaViabilityInputs,
    mapearPropertyDataParaViabilityInputs
  } = useImoveisStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedProperty, setSelectedProperty] = useState<ImovelParaCalculadora | null>(null)

  // Carregar imóveis ao inicializar
  useEffect(() => {
    if (imoveis.length === 0) {
      carregarImoveis()
    }
  }, [imoveis.length, carregarImoveis])

  // Filtrar imóveis baseado no termo de busca
  const filteredImoveis = imoveis.filter(imovel => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      imovel.titulo?.toLowerCase().includes(searchLower) ||
      imovel.endereco_completo?.toLowerCase().includes(searchLower) ||
      imovel.bairro?.toLowerCase().includes(searchLower) ||
      imovel.cidade?.toLowerCase().includes(searchLower) ||
      imovel.fonte_prospeccao?.toLowerCase().includes(searchLower)
    )
  })

  const selectProperty = (imovel: ImovelParaCalculadora) => {
    setSelectedProperty(imovel)
  }

  const clearSelection = () => {
    setSelectedProperty(null)
  }

  const mapToViabilityInputs = (imovel: ImovelParaCalculadora): Partial<ViabilityInputs> => {
    return mapearImovelParaViabilityInputs(imovel)
  }

  const mapPropertyDataToViabilityInputs = (property: PropertyData): Partial<ViabilityInputs> => {
    return mapearPropertyDataParaViabilityInputs(property)
  }

  return {
    imoveis,
    isLoading,
    searchTerm,
    filteredImoveis,
    selectedProperty,
    setSearchTerm,
    selectProperty,
    clearSelection,
    mapToViabilityInputs,
    mapPropertyDataToViabilityInputs
  }
}