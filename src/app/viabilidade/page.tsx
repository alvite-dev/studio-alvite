'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/features/PageHeader'
import { MainInputs } from '@/components/features/viability/MainInputs'
import { ResultsCard } from '@/components/features/viability/ResultsCard'
import { AdvancedModal } from '@/components/features/viability/AdvancedModal'
import { PropertySelector } from '@/components/features/viability/PropertySelector'
import { PropertySelectionCard } from '@/components/features/viability/PropertySelectionCard'
import { useViabilityCalculator, ViabilityInputs } from '@/hooks/useViabilityCalculator'
import { useIsMobile } from '@/hooks/useIsMobile'
import { RotateCcw } from 'lucide-react'

export default function ViabilidadePage() {
  const { inputs, results, updateInput, resetToDefaults } = useViabilityCalculator()
  const isMobile = useIsMobile()
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isPropertySelectorOpen, setIsPropertySelectorOpen] = useState(false)
  const [hasSelectedProperty, setHasSelectedProperty] = useState(false)
  const [showInputs, setShowInputs] = useState(false) // Controla se mostra inputs ou card de seleção

  const handlePropertySelection = (propertyInputs: Partial<ViabilityInputs>) => {
    // Aplicar os valores do imóvel selecionado
    Object.entries(propertyInputs).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        updateInput(key as keyof ViabilityInputs, value)
      }
    })
    setHasSelectedProperty(true)
    setShowInputs(true)
    setIsPropertySelectorOpen(false)
  }

  const handleManualEntry = () => {
    setHasSelectedProperty(false)
    setShowInputs(true)
    resetToDefaults()
  }

  const handleReset = () => {
    setHasSelectedProperty(false)
    setShowInputs(false)
    resetToDefaults()
  }

  if (isMobile) {
    return (
      <div className="min-h-full bg-slate-50">
        {/* Header Mobile */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <PageHeader
            title="Calculadora de Viabilidade"
            description=""
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                {showInputs ? 'Nova Análise' : 'Reset'}
              </Button>
            }
          />
        </div>

        {/* Content Mobile */}
        <div className="px-4 pt-12 pb-20 space-y-8">
          {!showInputs ? (
            <PropertySelectionCard
              onSelectProperty={() => setIsPropertySelectorOpen(true)}
              onManualEntry={handleManualEntry}
              hasSelectedProperty={hasSelectedProperty}
            />
          ) : (
            <>
              <MainInputs 
                inputs={inputs} 
                results={results} 
                onUpdate={updateInput} 
              />
              <ResultsCard 
                results={results} 
                onOpenAdvanced={() => setIsAdvancedOpen(true)} 
              />
            </>
          )}
        </div>

        {/* Advanced Modal */}
        <AdvancedModal
          isOpen={isAdvancedOpen}
          onClose={() => setIsAdvancedOpen(false)}
          inputs={inputs}
          results={results}
          onUpdate={updateInput}
        />

        {/* Property Selector Modal */}
        <PropertySelector
          isOpen={isPropertySelectorOpen}
          onClose={() => setIsPropertySelectorOpen(false)}
          onSelectProperty={handlePropertySelection}
        />
      </div>
    )
  }

  // Layout Desktop
  return (
    <div className="min-h-full bg-slate-50">
      {/* Header Desktop */}
      <PageHeader
        title="Calculadora de Viabilidade Imobiliária"
        description=""
        action={
          <Button
            variant="outline"
            size="sm"
            onClick={handleReset}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            {showInputs ? 'Nova Análise' : 'Reset'}
          </Button>
        }
      />

      {/* Content Desktop - New Layout with Left Column Toggle */}
      <div className="px-4 md:px-6 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Left Column - Selection Card OR Inputs */}
          <div className="pt-6">
            {!showInputs ? (
              <PropertySelectionCard
                onSelectProperty={() => setIsPropertySelectorOpen(true)}
                onManualEntry={handleManualEntry}
                hasSelectedProperty={hasSelectedProperty}
              />
            ) : (
              <MainInputs 
                inputs={inputs} 
                results={results} 
                onUpdate={updateInput} 
              />
            )}
          </div>

          {/* Right Column - Results */}
          <div className="pt-6">
            <ResultsCard 
              results={results} 
              onOpenAdvanced={() => setIsAdvancedOpen(true)} 
            />
          </div>
        </div>
      </div>

      {/* Advanced Modal */}
      <AdvancedModal
        isOpen={isAdvancedOpen}
        onClose={() => setIsAdvancedOpen(false)}
        inputs={inputs}
        results={results}
        onUpdate={updateInput}
      />

      {/* Property Selector Modal */}
      <PropertySelector
        isOpen={isPropertySelectorOpen}
        onClose={() => setIsPropertySelectorOpen(false)}
        onSelectProperty={handlePropertySelection}
      />
    </div>
  )
}