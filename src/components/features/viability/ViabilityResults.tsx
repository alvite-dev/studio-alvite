'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, DollarSign, PieChart, BarChart3, AlertCircle } from 'lucide-react'
import { ViabilityResults as IViabilityResults } from '@/hooks/useViabilityCalculator'

interface ViabilityResultsProps {
  results: IViabilityResults
}

export function ViabilityResults({ results }: ViabilityResultsProps) {
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

      {/* Detalhamento de Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-slate-600" />
            Detalhamento de Custos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Custos de Aquisição */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-700 text-sm uppercase tracking-wide">Aquisição</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Entrada</span>
                  <span className="text-sm font-medium">{formatCurrency(results.entrada)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">ITBI</span>
                  <span className="text-sm font-medium">{formatCurrency(results.itbi)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Avaliação/Escritura</span>
                  <span className="text-sm font-medium">{formatCurrency(results.avaliacaoEscritura)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Registro Cartório</span>
                  <span className="text-sm font-medium">{formatCurrency(results.registroCartorio)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-blue-600">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">{formatCurrency(results.totalAquisicao)}</span>
                </div>
              </div>
            </div>

            {/* Custos Operacionais */}
            <div className="space-y-3">
              <h4 className="font-medium text-slate-700 text-sm uppercase tracking-wide">Operacionais</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Financiamento (6m)</span>
                  <span className="text-sm font-medium">{formatCurrency(results.financiamento6m)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Condomínio (6m)</span>
                  <span className="text-sm font-medium">{formatCurrency(results.condominio6m)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Contas (6m)</span>
                  <span className="text-sm font-medium">{formatCurrency(results.contas6m)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Reforma</span>
                  <span className="text-sm font-medium">{formatCurrency(results.reforma)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-green-600">
                  <span className="text-sm">Subtotal</span>
                  <span className="text-sm">{formatCurrency(results.totalOperacional)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Custos de Saída */}
          <div className="mt-6 pt-4 border-t border-slate-200">
            <h4 className="font-medium text-slate-700 text-sm uppercase tracking-wide mb-3">Custos de Saída</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Quitação</span>
                <span className="text-sm font-medium">{formatCurrency(results.quitacaoFinanciamento)}</span>
              </div>
              {results.corretagem > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Corretagem</span>
                  <span className="text-sm font-medium">{formatCurrency(results.corretagem)}</span>
                </div>
              )}
              {results.impostoRenda > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Imp. Renda</span>
                  <span className="text-sm font-medium">{formatCurrency(results.impostoRenda)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Total Geral */}
          <div className="mt-4 pt-4 border-t-2 border-slate-300">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-900">Investimento Total</span>
              <span className="text-lg font-bold text-slate-900">{formatCurrency(results.investimentoTotal)}</span>
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
    </div>
  )
}