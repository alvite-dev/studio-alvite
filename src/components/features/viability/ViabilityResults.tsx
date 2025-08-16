'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, DollarSign, PieChart, BarChart3, AlertCircle } from 'lucide-react'
import { ViabilityResults as IViabilityResults } from '@/hooks/useViabilityCalculator'
import { CostBreakdownModal } from './CostBreakdownModal'

interface ViabilityResultsProps {
  results: IViabilityResults
}

export function ViabilityResults({ results }: ViabilityResultsProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

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
    if (roi >= 0.3) return 'text-green-600 bg-green-50'
    if (roi >= 0.15) return 'text-yellow-600 bg-yellow-50'
    return 'text-red-600 bg-red-50'
  }

  const getProfitabilityStatus = (roi: number) => {
    if (roi >= 0.3) return { text: 'Excelente', color: 'bg-green-600' }
    if (roi >= 0.15) return { text: 'Bom', color: 'bg-yellow-600' }
    if (roi >= 0.05) return { text: 'Regular', color: 'bg-orange-600' }
    return { text: 'Baixo', color: 'bg-red-600' }
  }

  const status = getProfitabilityStatus(results.roi)


  return (
    <div className="space-y-4">
      {/* Resumo Principal */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className={`border-2 ${getROIColor(results.roi)} border-opacity-20`}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">ROI</p>
                <p className={`text-xl font-bold ${getROIColor(results.roi).split(' ')[0]}`}>
                  {formatPercentage(results.roi)}
                </p>
                <Badge className={`mt-1 text-xs ${status.color} text-white`}>
                  {status.text}
                </Badge>
              </div>
              <TrendingUp className={`w-6 h-6 ${getROIColor(results.roi).split(' ')[0]}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">Lucro Projetado</p>
                <p className={`text-xl font-bold ${results.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(results.lucro)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Em {6} meses
                </p>
              </div>
              <DollarSign className={`w-6 h-6 ${results.lucro >= 0 ? 'text-green-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium text-slate-600">Valorização</p>
                <p className={`text-xl font-bold ${results.valorizacao >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatPercentage(results.valorizacao)}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  No período
                </p>
              </div>
              <BarChart3 className={`w-6 h-6 ${results.valorizacao >= 0 ? 'text-blue-600' : 'text-red-600'}`} />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resumo de Custos */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5 text-slate-600" />
              Resumo de Custos
            </CardTitle>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              title="Ver detalhamento completo"
            >
              <BarChart3 className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Subtotais */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium">AQUISIÇÃO</p>
                <p className="text-lg font-semibold text-blue-700">{formatCurrency(results.totalAquisicao)}</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-xs text-green-600 font-medium">OPERACIONAIS</p>
                <p className="text-lg font-semibold text-green-700">{formatCurrency(results.totalOperacional)}</p>
              </div>
            </div>

            {/* Custos de Saída */}
            {(results.quitacaoFinanciamento > 0 || results.corretagem > 0 || results.impostoRenda > 0) && (
              <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-200">
                <div className="text-center">
                  <p className="text-xs text-slate-500">Quitação</p>
                  <p className="text-sm font-medium">{formatCurrency(results.quitacaoFinanciamento)}</p>
                </div>
                {results.corretagem > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Corretagem</p>
                    <p className="text-sm font-medium">{formatCurrency(results.corretagem)}</p>
                  </div>
                )}
                {results.impostoRenda > 0 && (
                  <div className="text-center">
                    <p className="text-xs text-slate-500">Imp. Renda</p>
                    <p className="text-sm font-medium">{formatCurrency(results.impostoRenda)}</p>
                  </div>
                )}
              </div>
            )}

            {/* Total Geral */}
            <div className="pt-3 border-t-2 border-slate-300">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-slate-900">Investimento Total</span>
                <span className="text-xl font-bold text-slate-900">{formatCurrency(results.investimentoTotal)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>


      {/* Alerta de Viabilidade */}
      {results.roi < 0.15 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-800">Atenção à Viabilidade</h4>
                <p className="text-sm text-orange-700 mt-1">
                  O ROI projetado está abaixo de 15%. Considere revisar os parâmetros ou avaliar outros investimentos.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Modal de Detalhamento */}
      <CostBreakdownModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        results={results}
      />
    </div>
  )
}