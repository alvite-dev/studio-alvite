'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CurrencyInput } from '@/components/ui/currency-input'
import { ViabilityInputs, ViabilityResults } from '@/hooks/useViabilityCalculator'

interface MainInputsProps {
  inputs: ViabilityInputs
  results: ViabilityResults
  onUpdate: <K extends keyof ViabilityInputs>(key: K, value: ViabilityInputs[K]) => void
}

export function MainInputs({ inputs, results, onUpdate }: MainInputsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0
    }).format(value)
  }

  return (
    <Card className="w-full">
      <CardContent className="px-8 py-8 pt-8 space-y-8">
        {/* Valores Principais */}
        <div className="space-y-6">
          {/* Valor de Anúncio */}
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="valorAnuncio" className="text-base font-medium">
                Valor de Anúncio
              </Label>
              <CurrencyInput
                id="valorAnuncio"
                value={inputs.valorAnuncio}
                onChange={(value) => onUpdate('valorAnuncio', value)}
                className="text-lg h-12"
                placeholder="950.000"
              />
            </div>
            <div className="text-right text-sm text-slate-500 pb-2">
              {inputs.valorAnuncio && inputs.valorCompra && (
                <div className="text-blue-600 font-medium">
                  {(results.descontoAnuncio * 100).toFixed(1)}% desconto
                </div>
              )}
            </div>
          </div>

          {/* Valor de Compra */}
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="valorCompra" className="text-base font-medium">
                Valor de Compra
              </Label>
              <CurrencyInput
                id="valorCompra"
                value={inputs.valorCompra}
                onChange={(value) => onUpdate('valorCompra', value)}
                className="text-lg h-12"
                placeholder="830.000"
              />
            </div>
            <div className="text-right text-sm text-slate-500 pb-2">
              {inputs.valorCompra && inputs.areaUtil && (
                <div>{formatCurrency(results.valorM2Compra)}/m²</div>
              )}
            </div>
          </div>

          {/* Valor de Venda */}
          <div className="flex items-end gap-4">
            <div className="flex-1 space-y-2">
              <Label htmlFor="valorVenda" className="text-base font-medium">
                Valor de Venda
              </Label>
              <CurrencyInput
                id="valorVenda"
                value={inputs.valorVenda}
                onChange={(value) => onUpdate('valorVenda', value)}
                className="text-lg h-12"
                placeholder="1.220.000"
              />
            </div>
            <div className="text-right text-sm text-slate-500 pb-2">
              {inputs.valorVenda && inputs.areaUtil && (
                <div>{formatCurrency(results.valorM2Venda)}/m²</div>
              )}
            </div>
          </div>
        </div>

        {/* Área */}
        <div className="flex items-end gap-4">
          <div className="space-y-2">
            <Label htmlFor="areaUtil" className="text-base font-medium">
              Área Útil
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="areaUtil"
                type="number"
                value={inputs.areaUtil || ''}
                onChange={(e) => onUpdate('areaUtil', e.target.value ? Number(e.target.value) : null)}
                className="text-lg h-12 w-32"
                placeholder="105"
              />
              <span className="text-slate-600 text-lg">m²</span>
            </div>
          </div>
        </div>

        {/* Reforma */}
        <div className="flex items-end gap-4">
          <div className="space-y-2">
            <Label htmlFor="percentualReforma" className="text-base font-medium">
              Percentual da Reforma
            </Label>
            <div className="flex items-center gap-2">
              <Input
                id="percentualReforma"
                type="number"
                step="1"
                min="0"
                max="100"
                value={(inputs.percentualReforma * 100).toFixed(0)}
                onChange={(e) => onUpdate('percentualReforma', Number(e.target.value || 0) / 100)}
                className="text-lg h-12 w-20"
                placeholder="12"
              />
              <span className="text-lg text-slate-600">%</span>
            </div>
          </div>
          <div className="text-right text-sm text-slate-500 pb-2">
            {inputs.valorCompra && (
              <div>{formatCurrency(results.reforma)}</div>
            )}
          </div>
        </div>

        {/* Custos Mensais */}
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 max-sm:grid-cols-1 max-sm:gap-3">
            <div className="space-y-2">
              <Label htmlFor="valorCondominio" className="text-sm">
                Condomínio
              </Label>
              <CurrencyInput
                id="valorCondominio"
                value={inputs.valorCondominio}
                onChange={(value) => onUpdate('valorCondominio', value)}
                className="h-10"
                placeholder="1.700"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorIPTU" className="text-sm">
                IPTU
              </Label>
              <CurrencyInput
                id="valorIPTU"
                value={inputs.valorIPTU}
                onChange={(value) => onUpdate('valorIPTU', value)}
                className="h-10"
                placeholder="144"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorContasGerais" className="text-sm">
                Contas Gerais
              </Label>
              <CurrencyInput
                id="valorContasGerais"
                value={inputs.valorContasGerais}
                onChange={(value) => onUpdate('valorContasGerais', value)}
                className="h-10"
                placeholder="200"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}