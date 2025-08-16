'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ViabilityResults } from '@/hooks/useViabilityCalculator'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useSwipeToDismiss } from '@/hooks/useSwipeToDismiss'

interface CostBreakdownModalProps {
  isOpen: boolean
  onClose: () => void
  results: ViabilityResults
}

export function CostBreakdownModal({ isOpen, onClose, results }: CostBreakdownModalProps) {
  const isMobile = useIsMobile()
  
  const swipeRef = useSwipeToDismiss({
    onDismiss: onClose,
    threshold: 80,
    enabled: isOpen && isMobile
  })

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        variant={isMobile ? "bottom-sheet" : "default"} 
        size={isMobile ? "bottom-sheet" : "default"} 
        ref={swipeRef}
        className="max-h-[90vh] overflow-y-auto max-w-2xl"
      >
        <DialogHeader className={isMobile ? "pt-4" : ""}>
          <DialogTitle className={`flex items-center text-lg font-semibold ${isMobile ? "justify-center" : "justify-start"}`}>
            Detalhamento Completo de Custos
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-6 pb-4">
          {/* Custos de Aquisição */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-blue-600">Custos de Aquisição</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Entrada ({(results.entrada / (results.entrada + results.quitacaoFinanciamento) * 100).toFixed(0)}%)</span>
                <span className="font-medium">{formatCurrency(results.entrada)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">ITBI (3%)</span>
                <span className="font-medium">{formatCurrency(results.itbi)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Avaliação bancária/Escritura</span>
                <span className="font-medium">{formatCurrency(results.avaliacaoEscritura)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Registro em cartório (1,5%)</span>
                <span className="font-medium">{formatCurrency(results.registroCartorio)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-blue-600">
                <span>Subtotal Aquisição</span>
                <span>{formatCurrency(results.totalAquisicao)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Custos Operacionais */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-green-600">Custos Operacionais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Financiamento (1% a.m. x 6 meses)</span>
                <span className="font-medium">{formatCurrency(results.financiamento6m)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Condomínio (6 meses)</span>
                <span className="font-medium">{formatCurrency(results.condominio6m)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Contas básicas (6 meses)</span>
                <span className="font-medium">{formatCurrency(results.contas6m)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Reforma (12% do valor)</span>
                <span className="font-medium">{formatCurrency(results.reforma)}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-green-600">
                <span>Subtotal Operacionais</span>
                <span>{formatCurrency(results.totalOperacional)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Custos de Saída */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg text-purple-600">Custos de Saída</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-slate-600">Quitação do financiamento</span>
                <span className="font-medium">{formatCurrency(results.quitacaoFinanciamento)}</span>
              </div>
              {results.corretagem > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Corretagem (5% do valor de venda)</span>
                  <span className="font-medium">{formatCurrency(results.corretagem)}</span>
                </div>
              )}
              {results.impostoRenda > 0 && (
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Imposto de Renda (15% do lucro)</span>
                  <span className="font-medium">{formatCurrency(results.impostoRenda)}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-slate-200 font-semibold text-purple-600">
                <span>Subtotal Saída</span>
                <span>{formatCurrency(results.quitacaoFinanciamento + results.corretagem + results.impostoRenda)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Resumo Final */}
          <Card className="border-2 border-slate-300">
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-600">Custos de Aquisição:</span>
                  <span className="font-medium">{formatCurrency(results.totalAquisicao)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Custos Operacionais:</span>
                  <span className="font-medium">{formatCurrency(results.totalOperacional)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-purple-600">Custos de Saída:</span>
                  <span className="font-medium">{formatCurrency(results.quitacaoFinanciamento + results.corretagem + results.impostoRenda)}</span>
                </div>
                <div className="flex justify-between pt-2 border-t-2 border-slate-300 font-bold text-lg">
                  <span className="text-slate-900">Investimento Total:</span>
                  <span className="text-slate-900">{formatCurrency(results.investimentoTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}