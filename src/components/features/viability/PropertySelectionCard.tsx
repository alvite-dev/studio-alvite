'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Building2, Edit3, RotateCcw } from 'lucide-react'

interface PropertySelectionCardProps {
  onSelectProperty: () => void
  onManualEntry: () => void
  onReset?: () => void
  hasSelectedProperty?: boolean
}

export function PropertySelectionCard({ 
  onSelectProperty, 
  onManualEntry, 
  onReset,
  hasSelectedProperty = false 
}: PropertySelectionCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-lg">Como deseja começar?</CardTitle>
        <p className="text-sm text-slate-600">
          Escolha uma opção para iniciar a análise de viabilidade
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Botões de Seleção */}
        <div className="space-y-3">
          <Button
            onClick={onSelectProperty}
            variant="outline"
            className="w-full h-14 justify-start gap-3"
          >
            <Building2 className="w-5 h-5 text-blue-600" />
            <div className="text-left">
              <div className="font-medium">Selecionar Imóvel</div>
              <div className="text-xs text-slate-500">Da base de dados</div>
            </div>
          </Button>
          
          <Button
            onClick={onManualEntry}
            variant="outline"
            className="w-full h-14 justify-start gap-3"
          >
            <Edit3 className="w-5 h-5 text-green-600" />
            <div className="text-left">
              <div className="font-medium">Entrada Manual</div>
              <div className="text-xs text-slate-500">Digitar valores</div>
            </div>
          </Button>
        </div>
        
        {/* Feedback de Seleção */}
        {hasSelectedProperty && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-800 font-medium text-center">
              ✓ Imóvel selecionado! Você pode editar os valores abaixo.
            </p>
          </div>
        )}

        {/* Botão Reset */}
        {onReset && (
          <div className="pt-4 border-t border-slate-200">
            <Button
              onClick={onReset}
              variant="ghost"
              size="sm"
              className="w-full gap-2 text-slate-600"
            >
              <RotateCcw className="w-4 h-4" />
              Recomeçar
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}