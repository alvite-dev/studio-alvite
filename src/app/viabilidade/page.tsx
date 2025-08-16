'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import PageHeader from '@/components/features/PageHeader'
import { ViabilityInputs } from '@/components/features/viability/ViabilityInputs'
import { ViabilityResults } from '@/components/features/viability/ViabilityResults'
import { useViabilityCalculator } from '@/hooks/useViabilityCalculator'
import { useIsMobile } from '@/hooks/useIsMobile'
import { Calculator, FileBarChart, RotateCcw, TrendingUp } from 'lucide-react'

export default function ViabilidadePage() {
  const { inputs, results, updateInput, resetToDefaults } = useViabilityCalculator()
  const isMobile = useIsMobile()
  const [activeTab, setActiveTab] = useState<'inputs' | 'results'>('inputs')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  const getROIColor = (roi: number) => {
    if (roi >= 0.3) return 'text-green-600'
    if (roi >= 0.15) return 'text-yellow-600'
    return 'text-red-600'
  }

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
          
          {/* Resumo Rápido */}
          <div className="px-4 pb-4">
            <Card className="p-4 bg-gradient-to-r from-blue-50 to-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">ROI Projetado</p>
                  <p className={`text-xl font-bold ${getROIColor(results.roi)}`}>
                    {formatPercentage(results.roi)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-600">Lucro</p>
                  <p className={`text-xl font-bold ${results.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(results.lucro)}
                  </p>
                </div>
              </div>
            </Card>
          </div>

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
          <div className="flex items-center gap-3">
            {/* Resumo Rápido Desktop */}
            <div className="flex items-center gap-6 px-4 py-2 bg-white rounded-lg border border-slate-200">
              <div className="flex items-center gap-2">
                <TrendingUp className={`w-4 h-4 ${getROIColor(results.roi)}`} />
                <div>
                  <p className="text-xs text-slate-500">ROI</p>
                  <p className={`text-sm font-semibold ${getROIColor(results.roi)}`}>
                    {formatPercentage(results.roi)}
                  </p>
                </div>
              </div>
              <div className="border-l border-slate-200 pl-4">
                <p className="text-xs text-slate-500">Lucro</p>
                <p className={`text-sm font-semibold ${results.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(results.lucro)}
                </p>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={resetToDefaults}
              className="gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </Button>
          </div>
        }
      />

      {/* Content Desktop - Two Column Layout */}
      <div className="px-4 md:px-6 py-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Inputs Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
              <Calculator className="w-5 h-5 text-blue-600" />
              <h2 className="text-lg font-semibold text-slate-900">Parâmetros do Investimento</h2>
            </div>
            <ViabilityInputs inputs={inputs} onUpdate={updateInput} />
          </div>

          {/* Results Column */}
          <div className="space-y-6">
            <div className="flex items-center gap-2 mb-4">
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