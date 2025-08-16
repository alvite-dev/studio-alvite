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

  // Dados para breakdown de custos
  const costBreakdown = [
    { label: 'Custos Aquisição', value: results.totalAquisicao, color: 'bg-blue-500' },
    { label: 'Custos Operacionais', value: results.totalOperacional, color: 'bg-green-500' },
    { label: 'Quitação', value: results.quitacaoFinanciamento, color: 'bg-purple-500' },
    { label: 'Corretagem', value: results.corretagem, color: 'bg-yellow-500' },
    { label: 'Imp. Renda', value: results.impostoRenda, color: 'bg-red-500' },
  ].filter(item => item.value > 0)

  const totalCosts = costBreakdown.reduce((sum, item) => sum + item.value, 0)

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

      {/* Breakdown de Custos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="w-5 h-5 text-slate-600" />
            Breakdown de Custos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {costBreakdown.map((item, index) => {
              const percentage = (item.value / totalCosts) * 100
              return (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{item.label}</span>
                    <div className="text-right">
                      <span className="text-sm font-medium">{formatCurrency(item.value)}</span>
                      <span className="text-xs text-slate-500 ml-2">({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="mt-4 pt-4 border-t border-slate-200">
            <div className="flex justify-between items-center font-semibold">
              <span>Investimento Total</span>
              <span className="text-lg">{formatCurrency(results.investimentoTotal)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detalhamento Completo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Custos de Aquisição */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Custos de Aquisição</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Entrada</span>
              <span className="font-medium">{formatCurrency(results.entrada)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">ITBI</span>
              <span className="font-medium">{formatCurrency(results.itbi)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Avaliação/Escritura</span>
              <span className="font-medium">{formatCurrency(results.avaliacaoEscritura)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Registro Cartório</span>
              <span className="font-medium">{formatCurrency(results.registroCartorio)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(results.totalAquisicao)}</span>
            </div>
          </CardContent>
        </Card>

        {/* Custos Operacionais */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Custos Operacionais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">Financiamento (6m)</span>
              <span className="font-medium">{formatCurrency(results.financiamento6m)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Condomínio (6m)</span>
              <span className="font-medium">{formatCurrency(results.condominio6m)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Contas (6m)</span>
              <span className="font-medium">{formatCurrency(results.contas6m)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Reforma</span>
              <span className="font-medium">{formatCurrency(results.reforma)}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold">
              <span>Total</span>
              <span>{formatCurrency(results.totalOperacional)}</span>
            </div>
          </CardContent>
        </Card>
      </div>


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