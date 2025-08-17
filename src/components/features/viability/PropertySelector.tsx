'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { PropertyCard } from './PropertyCard'
import { usePropertySelection } from '@/hooks/usePropertySelection'
import { ViabilityInputs } from '@/hooks/useViabilityCalculator'
import { ImovelParaCalculadora } from '@/stores/imoveisStore'
import { 
  Search, 
  Building2, 
  X, 
  Loader2
} from 'lucide-react'

interface PropertySelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelectProperty: (inputs: Partial<ViabilityInputs>) => void
}

export function PropertySelector({ isOpen, onClose, onSelectProperty }: PropertySelectorProps) {
  const {
    isLoading,
    searchTerm,
    filteredImoveis,
    selectedProperty,
    setSearchTerm,
    selectProperty,
    clearSelection,
    mapToViabilityInputs
  } = usePropertySelection()

  // Usar apenas a lista filtrada por busca
  const finalFilteredImoveis = filteredImoveis

  const handleUseProperty = (imovel: ImovelParaCalculadora) => {
    const mappedInputs = mapToViabilityInputs(imovel)
    onSelectProperty(mappedInputs)
    onClose()
  }

  const handleCancel = () => {
    clearSelection()
    onClose()
  }

  // Reset busca quando modal abre
  useEffect(() => {
    if (isOpen) {
      setSearchTerm('')
      clearSelection()
    }
  }, [isOpen, setSearchTerm, clearSelection])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleCancel}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-900">
                Selecionar Imóvel
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="h-8 w-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="bg-white border-b border-slate-100 px-6 py-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                type="text"
                placeholder="Buscar imóvel..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Content */}
          <div className="p-6 pt-8 overflow-y-auto max-h-[calc(90vh-200px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <span className="ml-3 text-slate-600">Carregando imóveis...</span>
              </div>
            ) : finalFilteredImoveis.length === 0 ? (
              <div className="text-center py-12">
                <Building2 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                <p className="text-slate-600">
                  Nenhum imóvel encontrado
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {finalFilteredImoveis.map((imovel) => (
                  <PropertyCard
                    key={imovel.id}
                    imovel={imovel}
                    onSelect={selectProperty}
                    onUseProperty={handleUseProperty}
                    isSelected={selectedProperty?.id === imovel.id}
                  />
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}