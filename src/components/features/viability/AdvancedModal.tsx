'use client'

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ViabilityInputs, ViabilityResults } from '@/hooks/useViabilityCalculator'
import { useIsMobile } from '@/hooks/useIsMobile'
import { useSwipeToDismiss } from '@/hooks/useSwipeToDismiss'
import { Settings, FileBarChart, CreditCard, Calculator } from 'lucide-react'

interface AdvancedModalProps {
  isOpen: boolean
  onClose: () => void
  inputs: ViabilityInputs
  results: ViabilityResults
  onUpdate: <K extends keyof ViabilityInputs>(key: K, value: ViabilityInputs[K]) => void
}

export function AdvancedModal({ isOpen, onClose, inputs, results, onUpdate }: AdvancedModalProps) {
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

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        variant={isMobile ? "bottom-sheet" : "default"} 
        size={isMobile ? "bottom-sheet" : "default"} 
        ref={swipeRef}
        className="max-h-[90vh] overflow-y-auto max-w-4xl"
      >
        <DialogHeader className={isMobile ? "pt-4" : ""}>
          <DialogTitle className={`flex items-center text-lg font-semibold ${isMobile ? "justify-center" : "justify-start"}`}>
            Configurações Avançadas e Extrato
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="extract" className="w-full mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="extract" className="gap-2">
              <FileBarChart className="w-4 h-4" />
              Extrato Completo
            </TabsTrigger>
            <TabsTrigger value="settings" className="gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Extrato Completo */}
          <TabsContent value="extract" className="space-y-4 mt-6">
            {/* Custos de Aquisição */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-blue-600 flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Custos de Aquisição
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-3 pt-3 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Entrada ({formatPercentage(inputs.percentualEntrada)})</span>
                  <span className="font-medium">{formatCurrency(results.entrada)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">ITBI ({formatPercentage(inputs.percentualITBI)})</span>
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
                <CardTitle className="text-lg text-green-600 flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Custos Operacionais
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-3 pt-3 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Financiamento (1% a.m. x {inputs.mesesFinanciamento} meses)</span>
                  <span className="font-medium">{formatCurrency(results.financiamento6m)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Condomínio ({inputs.mesesFinanciamento} meses)</span>
                  <span className="font-medium">{formatCurrency(results.condominio6m)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Contas básicas ({inputs.mesesFinanciamento} meses)</span>
                  <span className="font-medium">{formatCurrency(results.contas6m)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Reforma ({formatPercentage(inputs.percentualReforma)} do valor)</span>
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
              <CardContent className="px-6 py-3 pt-3 space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-slate-600">Quitação do financiamento</span>
                  <span className="font-medium">{formatCurrency(results.quitacaoFinanciamento)}</span>
                </div>
                {results.corretagem > 0 && (
                  <div className="flex justify-between">
                    <span className="text-sm text-slate-600">Corretagem ({formatPercentage(inputs.percentualCorretagem)} do valor de venda)</span>
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
              <CardContent className="px-6 py-6 pt-6">
                <div className="space-y-3">
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
                  <div className="flex justify-between pt-3 border-t-2 border-slate-300 font-bold text-lg">
                    <span className="text-slate-900">Investimento Total:</span>
                    <span className="text-slate-900">{formatCurrency(results.investimentoTotal)}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-lg">
                    <span className="text-green-600">Lucro Líquido:</span>
                    <span className={results.lucro >= 0 ? 'text-green-600' : 'text-red-600'}>
                      {formatCurrency(results.lucro)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Configurações */}
          <TabsContent value="settings" className="space-y-6 mt-6">
            {/* Financiamento */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Configurações de Financiamento</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 pt-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="percentualEntrada">Percentual de Entrada</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="percentualEntrada"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={inputs.percentualEntrada}
                        onChange={(e) => onUpdate('percentualEntrada', Number(e.target.value))}
                      />
                      <Badge variant="outline">{formatPercentage(inputs.percentualEntrada)}</Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="percentualITBI">ITBI (%)</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="percentualITBI"
                        type="number"
                        step="0.01"
                        min="0"
                        max="1"
                        value={inputs.percentualITBI}
                        onChange={(e) => onUpdate('percentualITBI', Number(e.target.value))}
                      />
                      <Badge variant="outline">{formatPercentage(inputs.percentualITBI)}</Badge>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="mesesFinanciamento">Período (meses)</Label>
                  <Input
                    id="mesesFinanciamento"
                    type="number"
                    min="1"
                    max="24"
                    value={inputs.mesesFinanciamento}
                    onChange={(e) => onUpdate('mesesFinanciamento', Number(e.target.value))}
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Opcionais */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Custos Opcionais</CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-4 pt-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Incluir Corretagem</Label>
                    <p className="text-sm text-slate-500">Taxa sobre valor de venda</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={inputs.incluirCorretagem}
                      onChange={(e) => onUpdate('incluirCorretagem', e.target.checked)}
                      className="rounded"
                    />
                    {inputs.incluirCorretagem && (
                      <div className="flex items-center gap-1">
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          max="1"
                          value={inputs.percentualCorretagem}
                          onChange={(e) => onUpdate('percentualCorretagem', Number(e.target.value))}
                          className="w-20"
                        />
                        <Badge variant="outline">{formatPercentage(inputs.percentualCorretagem)}</Badge>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Incluir Imposto de Renda</Label>
                    <p className="text-sm text-slate-500">15% sobre lucro líquido</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={inputs.incluirIR}
                    onChange={(e) => onUpdate('incluirIR', e.target.checked)}
                    className="rounded"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}