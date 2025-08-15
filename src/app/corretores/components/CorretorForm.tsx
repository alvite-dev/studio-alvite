'use client'

import { useState } from 'react'
import * as React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CorretorCompleto } from '../types/corretor'
import { useIsMobile } from '@/hooks/useIsMobile'

interface CorretorFormProps {
  corretor?: CorretorCompleto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (corretor: Partial<CorretorCompleto>) => void
}

export function CorretorForm({ 
  corretor, 
  open, 
  onOpenChange, 
  onSave 
}: CorretorFormProps) {
  const isMobile = useIsMobile()
  const [formData, setFormData] = useState<Partial<CorretorCompleto>>({
    nome: '',
    telefone: '',
    imobiliaria: ''
  })

  // Atualizar formData quando corretor mudar
  React.useEffect(() => {
    if (corretor) {
      setFormData({
        nome: corretor.nome || '',
        telefone: corretor.telefone || '',
        imobiliaria: corretor.imobiliaria || ''
      })
    } else {
      // Limpar formulário para novo corretor
      setFormData({
        nome: '',
        telefone: '',
        imobiliaria: ''
      })
    }
  }, [corretor])

  const isEdit = !!corretor

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validação básica
    if (!formData.nome || !formData.telefone) {
      alert('Nome e telefone são obrigatórios')
      return
    }

    onSave(formData)
    onOpenChange(false)
  }

  const handleInputChange = (field: keyof CorretorCompleto, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto"
        variant={isMobile ? "bottom-sheet" : "default"}
      >
        <DialogHeader>
          <DialogTitle>
            {isEdit ? 'Editar Corretor' : 'Adicionar Corretor'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              value={formData.nome}
              onChange={(e) => handleInputChange('nome', e.target.value)}
              required
            />
          </div>

          {/* Telefone */}
          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              value={formData.telefone}
              onChange={(e) => handleInputChange('telefone', e.target.value)}
              placeholder="11999999999"
              required
            />
          </div>

          {/* Imobiliária */}
          <div className="space-y-2">
            <Label htmlFor="imobiliaria">Imobiliária</Label>
            <Input
              id="imobiliaria"
              value={formData.imobiliaria}
              onChange={(e) => handleInputChange('imobiliaria', e.target.value)}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {isEdit ? 'Salvar' : 'Adicionar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}