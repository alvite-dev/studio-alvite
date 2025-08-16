'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/features/PageHeader'
import { ViabilityInputs } from '@/components/features/viability/ViabilityInputs'
import { ViabilityResults } from '@/components/features/viability/ViabilityResults'
import { useViabilityCalculator } from '@/hooks/useViabilityCalculator'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Calculator, FileBarChart, RotateCcw } from 'lucide-react'

export default function ViabilidadePage() {
  const { inputs, results, updateInput, resetToDefaults } = useViabilityCalculator()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState<'inputs' | 'results'>('inputs')

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

          {/* Tabs Mobile */}
          <div className="flex bg-slate-100 mx-4 mb-4 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('inputs')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'inputs'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calculator className="w-4 h-4" />
              Parâmetros
            </button>
            <button
              onClick={() => setActiveTab('results')}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'results'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileBarChart className="w-4 h-4" />
              Resultados
            </button>
          </div>
        </div>

        {/* Content Mobile */}
        <div className="px-4 pb-20">
          {activeTab === 'inputs' ? (
            <ViabilityInputs inputs={inputs} onUpdate={updateInput} />
          ) : (
            <ViabilityResults results={results} />
          )}
        </div>
      </div>
    )
  }

  // Layout Desktop
  return (
    <div className="min-h-full bg-slate-50">
      {/* Header Desktop */}
      <PageHeader
        title="Calculadora de Viabilidade Imobiliária"
        description="Análise completa de investimentos em flip imobiliário com cálculos automáticos"
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

      {/* Content Desktop - Two Column Layout */}
      <div className="px-4 md:px-6 py-4 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Inputs Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Parâmetros do Investimento</h2>
            </div>
            <ViabilityInputs inputs={inputs} onUpdate={updateInput} />
          </div>

          {/* Results Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-3">
              <FileBarChart className="w-5 h-5 text-green-600" />
              <h2 className="text-lg font-semibold text-slate-900">Análise de Viabilidade</h2>
            </div>
            <ViabilityResults results={results} />
          </div>
        </div>
      </div>
    </div>
  )
}