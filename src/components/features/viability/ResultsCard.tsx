'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart3, DollarSign, Wallet, Wrench } from 'lucide-react'
import { ViabilityResults } from '@/hooks/useViabilityCalculator'
import { ROIIndicator } from './ROIIndicator'

interface ResultsCardProps {
  results: ViabilityResults
  onOpenAdvanced: () => void
}

export function ResultsCard({ results, onOpenAdvanced }: ResultsCardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card className="w-full border-2 border-slate-200 shadow-lg">
      <CardContent className="px-8 py-8 pt-8 space-y-6">
        {/* ROI Principal */}
        <div className="text-center">
          <ROIIndicator roi={results.roi} size="lg" />
        </div>

        {/* Métricas Principais */}
        <div className="space-y-4">
          {/* Lucro */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start">
              <div className="flex items-center gap-3 max-sm:mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Lucro Líquido</p>
                  <p className="text-xs text-slate-500">Em 6 meses</p>
                </div>
              </div>
              <div className="text-right max-sm:text-center max-sm:w-full">
                <p className={`text-xl font-bold max-sm:text-2xl ${results.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(results.lucro)}
                </p>
              </div>
            </div>
          </div>

          {/* Investimento Total */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start">
              <div className="flex items-center gap-3 max-sm:mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Wallet className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Investimento Total</p>
                  <p className="text-xs text-slate-500">Capital necessário</p>
                </div>
              </div>
              <div className="text-right max-sm:text-center max-sm:w-full">
                <p className="text-xl font-bold text-slate-900 max-sm:text-2xl">
                  {formatCurrency(results.investimentoTotal)}
                </p>
              </div>
            </div>
          </div>

          {/* Reforma */}
          <div className="p-4 bg-slate-50 rounded-lg">
            <div className="flex items-center justify-between max-sm:flex-col max-sm:items-start">
              <div className="flex items-center gap-3 max-sm:mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Wrench className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Valor da Reforma</p>
                  <p className="text-xs text-slate-500">Estimativa de obras</p>
                </div>
              </div>
              <div className="text-right max-sm:text-center max-sm:w-full">
                <p className="text-xl font-bold text-orange-600 max-sm:text-2xl">
                  {formatCurrency(results.reforma)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resumo Rápido */}
        <div className="pt-4 border-t border-slate-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-slate-500">Aquisição</p>
              <p className="text-sm font-semibold text-blue-700">
                {formatCurrency(results.totalAquisicao)}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Operacional</p>
              <p className="text-sm font-semibold text-green-700">
                {formatCurrency(results.totalOperacional)}
              </p>
            </div>
          </div>
        </div>

        {/* Botão Ver Extrato */}
        <Button 
          variant="outline" 
          onClick={onOpenAdvanced}
          className="w-full gap-2 mt-6"
        >
          <BarChart3 className="w-4 h-4" />
          Ver Extrato Completo
        </Button>
      </CardContent>
    </Card>
  )
}