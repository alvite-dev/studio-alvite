'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Building, CreditCard, Wrench, Settings, Edit3 } from 'lucide-react'
import { ViabilityInputs as IViabilityInputs, ViabilityResults } from '@/hooks/useViabilityCalculator'

interface ViabilityInputsProps {
  inputs: IViabilityInputs
  results: ViabilityResults
  onUpdate: <K extends keyof IViabilityInputs>(key: K, value: IViabilityInputs[K]) => void
}

export function ViabilityInputs({ inputs, results, onUpdate }: ViabilityInputsProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false)
  const [isOptionalOpen, setIsOptionalOpen] = useState(false)

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
    <div className="space-y-4">
      {/* Dados Básicos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Building className="w-5 h-5 text-blue-600" />
            Dados Básicos do Imóvel
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="valorCompra">Valor de Compra</Label>
              <Input
                id="valorCompra"
                type="number"
                value={inputs.valorCompra}
                onChange={(e) => onUpdate('valorCompra', Number(e.target.value))}
                placeholder="830000"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">
                  {formatCurrency(inputs.valorCompra)}
                </p>
                <p className="text-xs text-slate-500">
                  {formatCurrency(results.valorM2Compra)}/m²
                </p>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="areaUtil">Área Útil (m²)</Label>
              <Input
                id="areaUtil"
                type="number"
                value={inputs.areaUtil}
                onChange={(e) => onUpdate('areaUtil', Number(e.target.value))}
                placeholder="105"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorVenda">Valor de Venda Projetado</Label>
              <Input
                id="valorVenda"
                type="number"
                value={inputs.valorVenda}
                onChange={(e) => onUpdate('valorVenda', Number(e.target.value))}
                placeholder="1220000"
              />
              <div className="flex justify-between items-center">
                <p className="text-xs text-slate-500">
                  {formatCurrency(inputs.valorVenda)}
                </p>
                <p className="text-xs text-slate-500">
                  {formatCurrency(results.valorM2Venda)}/m²
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Financiamento */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CreditCard className="w-5 h-5 text-green-600" />
              Financiamento
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
              className="gap-2 text-slate-600 hover:text-slate-900"
            >
              <Edit3 className="w-4 h-4" />
              {isAdvancedOpen ? 'Ocultar' : 'Ajustar'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Valores fixos sempre visíveis */}
          <div className="grid grid-cols-3 gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-slate-500">Entrada</p>
              <p className="font-medium">{formatPercentage(inputs.percentualEntrada)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">ITBI</p>
              <p className="font-medium">{formatPercentage(inputs.percentualITBI)}</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Período</p>
              <p className="font-medium">{inputs.mesesFinanciamento}m</p>
            </div>
          </div>

          {/* Campos editáveis (expandível) */}
          {isAdvancedOpen && (
            <div className="space-y-4 pt-3 border-t border-slate-200">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
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
                <div className="space-y-2">
                  <Label htmlFor="mesesFinanciamento">Período (meses)</Label>
                  <Input
                    id="mesesFinanciamento"
                    type="number"
                    min="1"
                    max="24"
                    value={inputs.mesesFinanciamento}
                    onChange={(e) => onUpdate('mesesFinanciamento', Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Custos Extras */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Wrench className="w-5 h-5 text-orange-600" />
            Custos Operacionais
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="percentualReforma">Reforma (% do valor)</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="percentualReforma"
                  type="number"
                  step="0.01"
                  min="0"
                  max="1"
                  value={inputs.percentualReforma}
                  onChange={(e) => onUpdate('percentualReforma', Number(e.target.value))}
                />
                <Badge variant="outline">{formatPercentage(inputs.percentualReforma)}</Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorCondominio">Condomínio (mensal)</Label>
              <Input
                id="valorCondominio"
                type="number"
                value={inputs.valorCondominio}
                onChange={(e) => onUpdate('valorCondominio', Number(e.target.value))}
              />
              <p className="text-xs text-slate-500">
                {formatCurrency(inputs.valorCondominio)}/mês
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="valorContas">Contas (mensal)</Label>
              <Input
                id="valorContas"
                type="number"
                value={inputs.valorContas}
                onChange={(e) => onUpdate('valorContas', Number(e.target.value))}
              />
              <p className="text-xs text-slate-500">
                {formatCurrency(inputs.valorContas)}/mês
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Opcionais */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Settings className="w-5 h-5 text-purple-600" />
              Opcionais
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOptionalOpen(!isOptionalOpen)}
              className="gap-2 text-slate-600 hover:text-slate-900"
            >
              <Edit3 className="w-4 h-4" />
              {isOptionalOpen ? 'Ocultar' : 'Ajustar'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Valores fixos sempre visíveis */}
          <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded-lg">
            <div className="text-center">
              <p className="text-xs text-slate-500">Corretagem</p>
              <p className="font-medium">
                {inputs.incluirCorretagem ? formatPercentage(inputs.percentualCorretagem) : 'Não'}
              </p>
            </div>
            <div className="text-center">
              <p className="text-xs text-slate-500">Imp. Renda</p>
              <p className="font-medium">{inputs.incluirIR ? 'Sim' : 'Não'}</p>
            </div>
          </div>

          {/* Campos editáveis (expandível) */}
          {isOptionalOpen && (
            <div className="space-y-4 pt-3 border-t border-slate-200">
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}