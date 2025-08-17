'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ImovelParaCalculadora } from '@/stores/imoveisStore'
import { MapPin, Ruler, Bed, Bath, Car } from 'lucide-react'

interface PropertyCardProps {
  imovel: ImovelParaCalculadora
  onSelect: (imovel: ImovelParaCalculadora) => void
  onUseProperty?: (imovel: ImovelParaCalculadora) => void
  isSelected?: boolean
}

export function PropertyCard({ imovel, onSelect, onUseProperty, isSelected = false }: PropertyCardProps) {
  const formatCurrency = (value: number | null | undefined) => {
    if (!value) return 'N/A'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card className={`cursor-pointer transition-all hover:shadow-md ${
      isSelected ? 'ring-2 ring-blue-500 shadow-md' : ''
    }`}>
      <CardContent className="p-4">
        {/* Header Simplificado */}
        <div className="mb-3">
          <h3 className="text-base font-semibold text-slate-900 truncate">
            {imovel.titulo}
          </h3>
          <div className="flex items-center mt-1 text-slate-600">
            <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
            <span className="text-xs truncate">
              {imovel.endereco_completo}
            </span>
          </div>
        </div>

        {/* Preço */}
        <div className="mb-3">
          <div className="text-lg font-bold text-blue-600">
            {formatCurrency(imovel.valor_anuncio)}
          </div>
        </div>

        {/* Características Compactas */}
        <div className="flex items-center gap-3 mb-3 text-xs text-slate-600">
          <div className="flex items-center">
            <Ruler className="w-3 h-3 mr-1" />
            {imovel.m2_util_original}m²
          </div>
          <div className="flex items-center">
            <Bed className="w-3 h-3 mr-1" />
            {imovel.quartos}Q
          </div>
          <div className="flex items-center">
            <Bath className="w-3 h-3 mr-1" />
            {imovel.banheiros}B
          </div>
          <div className="flex items-center">
            <Car className="w-3 h-3 mr-1" />
            {imovel.vagas}V
          </div>
        </div>

        {/* Botão */}
        <Button
          onClick={() => onUseProperty ? onUseProperty(imovel) : onSelect(imovel)}
          size="sm"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          Usar na Calculadora
        </Button>
      </CardContent>
    </Card>
  )
}