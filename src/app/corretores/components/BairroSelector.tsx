'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { X, Plus } from 'lucide-react'

const BAIRROS_SUGERIDOS = [
  'Flamengo',
  'Catete', 
  'Botafogo',
  'Copacabana',
  'Ipanema',
  'Leblon',
  'Barra da Tijuca',
  'Tijuca',
  'Centro',
  'Zona Sul',
  'Zona Norte',
  'Zona Oeste',
  'Recreio',
  'Jacarepaguá',
  'Vila Isabel',
  'Grajaú',
  'Maracanã'
]

interface BairroSelectorProps {
  bairros: string[]
  onChange: (bairros: string[]) => void
}

export function BairroSelector({ bairros, onChange }: BairroSelectorProps) {
  const [inputValue, setInputValue] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)

  const filteredSuggestions = BAIRROS_SUGERIDOS.filter(bairro => 
    bairro.toLowerCase().includes(inputValue.toLowerCase()) &&
    !bairros.includes(bairro)
  )

  const addBairro = (bairro: string) => {
    if (bairro.trim() && !bairros.includes(bairro.trim())) {
      onChange([...bairros, bairro.trim()])
      setInputValue('')
      setShowSuggestions(false)
    }
  }

  const removeBairro = (index: number) => {
    const newBairros = bairros.filter((_, i) => i !== index)
    onChange(newBairros)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addBairro(inputValue)
    }
  }

  return (
    <div className="space-y-3">
      {/* Bairros selecionados */}
      {bairros.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {bairros.map((bairro, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="px-2 py-1 flex items-center gap-1"
            >
              {bairro}
              <button
                type="button"
                onClick={() => removeBairro(index)}
                className="ml-1 hover:bg-slate-300 rounded-full p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input para adicionar bairro */}
      <div className="relative">
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              setShowSuggestions(true)
            }}
            onKeyPress={handleKeyPress}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Digite um bairro..."
            className="flex-1"
          />
          <Button
            type="button"
            onClick={() => addBairro(inputValue)}
            size="sm"
            disabled={!inputValue.trim()}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Sugestões */}
        {showSuggestions && filteredSuggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-slate-200 rounded-md shadow-lg max-h-40 overflow-y-auto">
            {filteredSuggestions.slice(0, 8).map((bairro, index) => (
              <button
                key={index}
                type="button"
                onClick={() => addBairro(bairro)}
                className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 border-b border-slate-100 last:border-b-0"
              >
                {bairro}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}