'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { VisitaCompleta, useVisitasStore } from '@/stores/visitasStore'
import { useCorretoresStore } from '@/stores/corretoresStore'
import { useImoveisStore } from '@/stores/imoveisStore'

interface VisitFormProps {
  trigger: React.ReactNode
  visitaParaEditar?: VisitaCompleta
  onSuccess?: () => void
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

export function VisitForm({ trigger, visitaParaEditar, onSuccess, open: controlledOpen, onOpenChange }: VisitFormProps) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  const setOpen = onOpenChange || setInternalOpen
  const { adicionarVisita, editarVisita } = useVisitasStore()
  const { corretores, carregarCorretores, isLoading: isLoadingCorretores, obterCorretorPorId } = useCorretoresStore()
  const { imoveis, carregarImoveis, isLoading: isLoadingImoveis, obterImovelPorId } = useImoveisStore()

  // Carregar dados quando o componente monta
  useEffect(() => {
    if (corretores.length === 0) {
      carregarCorretores()
    }
    if (imoveis.length === 0) {
      carregarImoveis()
    }
  }, [carregarCorretores, carregarImoveis, corretores.length, imoveis.length])

  // Dados do formulário
  const [formData, setFormData] = useState({
    imovel_id: '',
    imovel_link_manual: '',
    imovel_endereco_manual: '',
    corretor_id: '',
    corretor_nome_manual: '',
    corretor_telefone_manual: '',
    horario_visita: '',
    observacoes_pre: '',
  })

  const [errors, setErrors] = useState<Partial<typeof formData>>({})
  const [modoManualCorretor, setModoManualCorretor] = useState(false)
  const [modoManualImovel, setModoManualImovel] = useState(false)

  // Preencher dados quando editando
  useEffect(() => {
    if (visitaParaEditar && open) {
      const visitaDate = new Date(visitaParaEditar.data_hora)
      const temDadosManuaisCorretor = visitaParaEditar.corretor_nome_manual || visitaParaEditar.corretor_telefone_manual
      const temDadosManuaisImovel = visitaParaEditar.imovel_link_manual || visitaParaEditar.imovel_endereco_manual
      
      setModoManualCorretor(!!temDadosManuaisCorretor)
      setModoManualImovel(!!temDadosManuaisImovel)
      setFormData({
        imovel_id: visitaParaEditar.imovel_id || '',
        imovel_link_manual: visitaParaEditar.imovel_link_manual || '',
        imovel_endereco_manual: visitaParaEditar.imovel_endereco_manual || '',
        corretor_id: visitaParaEditar.corretor_id || '',
        corretor_nome_manual: visitaParaEditar.corretor_nome_manual || '',
        corretor_telefone_manual: visitaParaEditar.corretor_telefone_manual || '',
        horario_visita: visitaDate.toTimeString().slice(0, 5), // HH:MM
        observacoes_pre: visitaParaEditar.observacoes_pre || '',
      })
    } else if (!visitaParaEditar && open) {
      // Resetar formulário ao abrir para criar nova visita
      setModoManualCorretor(false)
      setModoManualImovel(false)
      setFormData({
        imovel_id: '',
        imovel_link_manual: '',
        imovel_endereco_manual: '',
        corretor_id: '',
        corretor_nome_manual: '',
        corretor_telefone_manual: '',
        horario_visita: '',
        observacoes_pre: '',
      })
    }
    setErrors({})
  }, [visitaParaEditar, open])

  const handleChange = (field: keyof typeof formData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }))
    
    // Limpar erro do campo ao digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateForm = () => {
    const newErrors: Partial<typeof formData> = {}

    // Validação de imóvel
    if (modoManualImovel) {
      if (formData.imovel_link_manual.trim() && !isValidUrl(formData.imovel_link_manual.trim())) {
        newErrors.imovel_link_manual = 'Link deve ser uma URL válida'
      }
      if (!formData.imovel_endereco_manual.trim()) {
        newErrors.imovel_endereco_manual = 'Endereço é obrigatório'
      }
    } else {
      if (!formData.imovel_id) {
        newErrors.imovel_id = 'Seleção do imóvel é obrigatória'
      }
    }

    // Validação de corretor
    if (modoManualCorretor) {
      if (!formData.corretor_nome_manual.trim()) {
        newErrors.corretor_nome_manual = 'Nome do corretor é obrigatório'
      }
      if (!formData.corretor_telefone_manual.trim()) {
        newErrors.corretor_telefone_manual = 'Telefone do corretor é obrigatório'
      }
    } else {
      if (!formData.corretor_id) {
        newErrors.corretor_id = 'Seleção do corretor é obrigatória'
      }
    }

    if (!formData.horario_visita) {
      newErrors.horario_visita = 'Horário é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (url: string) => {
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    // Usar data atual com o horário informado
    const hoje = new Date()
    const [horas, minutos] = formData.horario_visita.split(':')
    const dataHora = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate(), parseInt(horas), parseInt(minutos))
    
    const visitaData = {
      // Dados do imóvel
      ...(modoManualImovel 
        ? {
            imovel_link_manual: formData.imovel_link_manual.trim() || undefined,
            imovel_endereco_manual: formData.imovel_endereco_manual.trim(),
          }
        : {
            imovel_id: formData.imovel_id,
          }
      ),
      // Dados do corretor
      ...(modoManualCorretor 
        ? {
            corretor_nome_manual: formData.corretor_nome_manual.trim(),
            corretor_telefone_manual: formData.corretor_telefone_manual.trim(),
          }
        : {
            corretor_id: formData.corretor_id,
          }
      ),
      data_hora: dataHora,
      observacoes_pre: formData.observacoes_pre.trim() || undefined,
    }

    if (visitaParaEditar) {
      editarVisita(visitaParaEditar.id, visitaData)
    } else {
      adicionarVisita(visitaData)
    }

    setOpen(false)
    onSuccess?.()
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {visitaParaEditar ? 'Editar Visita' : 'Nova Visita'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          {/* Seletor de Imóvel */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Imóvel *
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setModoManualImovel(!modoManualImovel)
                  // Limpar dados do outro modo
                  if (!modoManualImovel) {
                    setFormData(prev => ({ ...prev, imovel_id: '' }))
                  } else {
                    setFormData(prev => ({ 
                      ...prev, 
                      imovel_link_manual: '', 
                      imovel_endereco_manual: '' 
                    }))
                  }
                  setErrors({})
                }}
                className="h-7 px-2 text-xs"
              >
                {modoManualImovel ? 'Usar Lista' : 'Inserir Manual'}
              </Button>
            </div>
            
            {!modoManualImovel ? (
              <>
                <select
                  value={formData.imovel_id}
                  onChange={handleChange('imovel_id')}
                  className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.imovel_id ? 'border-red-300' : 'border-slate-300'
                  }`}
                  disabled={isLoadingImoveis}
                >
                  <option value="">
                    {isLoadingImoveis ? 'Carregando...' : 'Selecione um imóvel'}
                  </option>
                  {imoveis.map((imovel) => (
                    <option key={imovel.id} value={imovel.id}>
                      {imovel.endereco.length > 80 
                        ? `${imovel.endereco.substring(0, 80)}...` 
                        : imovel.endereco}
                    </option>
                  ))}
                </select>
                {errors.imovel_id && (
                  <p className="text-xs text-red-600">{errors.imovel_id}</p>
                )}
                {formData.imovel_id && (
                  <div className="text-xs text-slate-600 mt-1">
                    {(() => {
                      const imovel = obterImovelPorId(formData.imovel_id)
                      return imovel ? `${imovel.quartos}Q ${imovel.banheiros}B ${imovel.vagas}V` : ''
                    })()}
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-slate-500 bg-blue-50 p-2 rounded">
                Insira os dados do imóvel manualmente
              </div>
            )}
          </div>

          {/* Campos manuais de imóvel quando modo manual ativado */}
          {modoManualImovel && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Link do Imóvel
                </label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={formData.imovel_link_manual}
                  onChange={handleChange('imovel_link_manual')}
                  className={errors.imovel_link_manual ? 'border-red-300' : ''}
                />
                {errors.imovel_link_manual && (
                  <p className="text-xs text-red-600">{errors.imovel_link_manual}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Endereço *
                </label>
                <Input
                  type="text"
                  placeholder="Rua, número, bairro, cidade"
                  value={formData.imovel_endereco_manual}
                  onChange={handleChange('imovel_endereco_manual')}
                  className={errors.imovel_endereco_manual ? 'border-red-300' : ''}
                />
                {errors.imovel_endereco_manual && (
                  <p className="text-xs text-red-600">{errors.imovel_endereco_manual}</p>
                )}
              </div>
            </>
          )}

          {/* Seletor de Corretor */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                Corretor *
              </label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => {
                  setModoManualCorretor(!modoManualCorretor)
                  // Limpar dados do outro modo
                  if (!modoManualCorretor) {
                    setFormData(prev => ({ ...prev, corretor_id: '' }))
                  } else {
                    setFormData(prev => ({ 
                      ...prev, 
                      corretor_nome_manual: '', 
                      corretor_telefone_manual: '' 
                    }))
                  }
                  setErrors({})
                }}
                className="h-7 px-2 text-xs"
              >
                {modoManualCorretor ? 'Usar Lista' : 'Inserir Manual'}
              </Button>
            </div>
            
            {!modoManualCorretor ? (
              <>
                <select
                  value={formData.corretor_id}
                  onChange={handleChange('corretor_id')}
                  className={`flex h-10 w-full rounded-lg border bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.corretor_id ? 'border-red-300' : 'border-slate-300'
                  }`}
                  disabled={isLoadingCorretores}
                >
                  <option value="">
                    {isLoadingCorretores ? 'Carregando...' : 'Selecione um corretor'}
                  </option>
                  {corretores.map((corretor) => (
                    <option key={corretor.id} value={corretor.id}>
                      {corretor.nome} {corretor.imobiliaria ? `- ${corretor.imobiliaria}` : ''}
                    </option>
                  ))}
                </select>
                {errors.corretor_id && (
                  <p className="text-xs text-red-600">{errors.corretor_id}</p>
                )}
                {formData.corretor_id && (
                  <div className="text-xs text-slate-600 mt-1">
                    {(() => {
                      const corretor = obterCorretorPorId(formData.corretor_id)
                      return corretor ? `Telefone: ${corretor.telefone}` : ''
                    })()}
                  </div>
                )}
              </>
            ) : (
              <div className="text-xs text-slate-500 bg-blue-50 p-2 rounded">
                Insira os dados do corretor manualmente
              </div>
            )}
          </div>

          {/* Campos manuais quando modo manual ativado */}
          {modoManualCorretor && (
            <>
              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Nome do Corretor *
                </label>
                <Input
                  type="text"
                  placeholder="Nome completo"
                  value={formData.corretor_nome_manual}
                  onChange={handleChange('corretor_nome_manual')}
                  className={errors.corretor_nome_manual ? 'border-red-300' : ''}
                />
                {errors.corretor_nome_manual && (
                  <p className="text-xs text-red-600">{errors.corretor_nome_manual}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-slate-700">
                  Telefone do Corretor *
                </label>
                <Input
                  type="tel"
                  placeholder="(11) 99999-9999"
                  value={formData.corretor_telefone_manual}
                  onChange={handleChange('corretor_telefone_manual')}
                  className={errors.corretor_telefone_manual ? 'border-red-300' : ''}
                />
                {errors.corretor_telefone_manual && (
                  <p className="text-xs text-red-600">{errors.corretor_telefone_manual}</p>
                )}
              </div>
            </>
          )}

          {/* Horário */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Horário *
            </label>
            <Input
              type="time"
              value={formData.horario_visita}
              onChange={handleChange('horario_visita')}
              className={errors.horario_visita ? 'border-red-300' : ''}
            />
            {errors.horario_visita && (
              <p className="text-xs text-red-600">{errors.horario_visita}</p>
            )}
          </div>

          {/* Observações */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Observações
            </label>
            <textarea
              placeholder="Observações sobre a visita..."
              value={formData.observacoes_pre}
              onChange={handleChange('observacoes_pre')}
              className="flex min-h-[60px] w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              rows={3}
            />
          </div>

          {/* Botões */}
          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="flex-1"
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1">
              {visitaParaEditar ? 'Salvar' : 'Criar Visita'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}