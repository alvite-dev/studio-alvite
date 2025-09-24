'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TerceiroCompleto, TerceiroFormData } from '../types/terceiro'
import { useSwipeToDismiss } from '@/hooks/useSwipeToDismiss'
import { useIsMobile } from '@/hooks/useIsMobile'

interface TerceiroFormProps {
  terceiro?: TerceiroCompleto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (terceiro: TerceiroFormData) => Promise<void>
}

const especialidadesComuns = [
  'Marceneiro',
  'Pedreiro', 
  'Pintor',
  'Eletricista',
  'Encanador',
  'Bombeiro Hidráulico',
  'Arquiteto',
  'Designer de Interiores',
  'Soldador',
  'Serralheiro',
  'Vidraceiro',
  'Azulejista',
  'Gesseiro',
  'Jardineiro',
  'Limpeza',
  'Outros'
]

export function TerceiroForm({ terceiro, open, onOpenChange, onSave }: TerceiroFormProps) {
  const isMobile = useIsMobile()
  
  const swipeRef = useSwipeToDismiss({
    onDismiss: () => onOpenChange(false),
    threshold: 80,
    enabled: open && isMobile
  })

  const [formData, setFormData] = useState<TerceiroFormData>({
    nome: '',
    especialidade: '',
    nota: null,
    contato: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (terceiro && open) {
      setFormData({
        nome: terceiro.nome,
        especialidade: terceiro.especialidade,
        nota: terceiro.nota,
        contato: terceiro.contato
      })
    } else if (!terceiro && open) {
      setFormData({
        nome: '',
        especialidade: '',
        nota: null,
        contato: ''
      })
    }
    setErrors({})
  }, [terceiro, open])

  const handleChange = (field: keyof TerceiroFormData) => (
    e: React.ChangeEvent<HTMLInputElement> | string
  ) => {
    const value = typeof e === 'string' ? e : e.target.value
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleNotaChange = (value: string) => {
    const nota = value === 'sem-nota' ? null : Number(value)
    setFormData(prev => ({
      ...prev,
      nota
    }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.especialidade) {
      newErrors.especialidade = 'Especialidade é obrigatória'
    }

    if (!formData.contato.trim()) {
      newErrors.contato = 'Contato é obrigatório'
    }

    if (formData.nota !== null && formData.nota !== undefined && (formData.nota < 0 || formData.nota > 5)) {
      newErrors.nota = 'Nota deve estar entre 0 e 5'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao salvar terceiro:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        variant={isMobile ? "bottom-sheet" : "default"} 
        size={isMobile ? "bottom-sheet" : "default"} 
        ref={swipeRef}
      >
        <DialogHeader className={isMobile ? "pt-4" : ""}>
          <DialogTitle className={`flex items-center text-lg font-semibold ${isMobile ? "justify-center" : "justify-start"}`}>
            {terceiro ? 'Editar Terceiro' : 'Novo Terceiro'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6 pb-4">
          {/* Nome */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Nome *
            </label>
            <Input
              type="text"
              placeholder="Nome completo"
              value={formData.nome}
              onChange={handleChange('nome')}
              className={errors.nome ? 'border-red-300' : ''}
              disabled={isLoading}
            />
            {errors.nome && (
              <p className="text-xs text-red-600">{errors.nome}</p>
            )}
          </div>

          {/* Especialidade */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Especialidade *
            </label>
            <Select 
              value={formData.especialidade} 
              onValueChange={handleChange('especialidade')}
              disabled={isLoading}
            >
              <SelectTrigger className={errors.especialidade ? 'border-red-300' : ''}>
                <SelectValue placeholder="Selecione a especialidade" />
              </SelectTrigger>
              <SelectContent>
                {especialidadesComuns.map((especialidade) => (
                  <SelectItem key={especialidade} value={especialidade}>
                    {especialidade}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.especialidade && (
              <p className="text-xs text-red-600">{errors.especialidade}</p>
            )}
          </div>

          {/* Avaliação */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Avaliação
            </label>
            <Select 
              value={formData.nota?.toString() || 'sem-nota'} 
              onValueChange={handleNotaChange}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a avaliação" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sem-nota">Sem avaliação</SelectItem>
                <SelectItem value="5">5 estrelas - Excelente</SelectItem>
                <SelectItem value="4.5">4.5 estrelas - Muito bom</SelectItem>
                <SelectItem value="4">4 estrelas - Bom</SelectItem>
                <SelectItem value="3.5">3.5 estrelas - Regular</SelectItem>
                <SelectItem value="3">3 estrelas - Mediano</SelectItem>
                <SelectItem value="2.5">2.5 estrelas - Abaixo da média</SelectItem>
                <SelectItem value="2">2 estrelas - Ruim</SelectItem>
                <SelectItem value="1.5">1.5 estrelas - Muito ruim</SelectItem>
                <SelectItem value="1">1 estrela - Péssimo</SelectItem>
              </SelectContent>
            </Select>
            {errors.nota && (
              <p className="text-xs text-red-600">{errors.nota}</p>
            )}
          </div>

          {/* Contato */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Contato (WhatsApp/Telefone) *
            </label>
            <Input
              type="tel"
              placeholder="(11) 99999-9999"
              value={formData.contato}
              onChange={handleChange('contato')}
              className={errors.contato ? 'border-red-300' : ''}
              disabled={isLoading}
            />
            {errors.contato && (
              <p className="text-xs text-red-600">{errors.contato}</p>
            )}
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-6 border-t border-slate-200 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 h-12"
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              className="flex-1 h-12"
              disabled={isLoading}
            >
              {isLoading ? 'Salvando...' : terceiro ? 'Salvar' : 'Criar Terceiro'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}