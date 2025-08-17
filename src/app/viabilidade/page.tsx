'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/features/PageHeader'
import { MainInputs } from '@/components/features/viability/MainInputs'
import { ResultsCard } from '@/components/features/viability/ResultsCard'
import { AdvancedModal } from '@/components/features/viability/AdvancedModal'
import { useViabilityCalculator } from '@/hooks/useViabilityCalculator'
import { useIsMobile } from '@/hooks/useIsMobile'
import { RotateCcw } from 'lucide-react'

export default function ViabilidadePage() {
  const { inputs, results, updateInput, resetToDefaults } = useViabilityCalculator()
  const isMobile = useIsMobile()
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)

  if (isMobile) {
    return (
      <div className="min-h-full bg-slate-50">
        {/* Header Mobile */}
        <div className="sticky top-0 z-10 bg-white border-b border-slate-200">
          <PageHeader
            title="Calculadora de Viabilidade"
            description="Análise financeira para investimentos imobiliários"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={resetToDefaults}
                className="gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Reset
              </Button>
            }
          />
        </div>

        {/* Content Mobile */}
        <div className="px-4 pt-12 pb-20 space-y-8">
          <MainInputs 
            inputs={inputs} 
            results={results} 
            onUpdate={updateInput} 
          />
          <ResultsCard 
            results={results} 
            onOpenAdvanced={() => setIsAdvancedOpen(true)} 
          />
        </div>

        {/* Advanced Modal */}
        <AdvancedModal
          isOpen={isAdvancedOpen}
          onClose={() => setIsAdvancedOpen(false)}
          inputs={inputs}
          results={results}
          onUpdate={updateInput}
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
            onClick={resetToDefaults}
            className="gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset
          </Button>
        }
      />

      {/* Content Desktop - New Minimal Layout */}
      <div className="px-4 md:px-6 py-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Inputs Column */}
          <div className="pt-6">
            <MainInputs 
              inputs={inputs} 
              results={results} 
              onUpdate={updateInput} 
            />
          </div>

          {/* Results Column */}
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
    </div>
  )
}