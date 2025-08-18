'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ImovelCompleto, ImovelFormData } from '../types/imovel'
import { useCorretoresStore } from '@/stores/corretoresStore'
import { CurrencyInput } from '@/components/ui/currency-input'

interface ImovelFormProps {
  imovel: ImovelCompleto | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (imovel: ImovelFormData) => void
}

export function ImovelForm({ imovel, open, onOpenChange, onSave }: ImovelFormProps) {
  const { corretores, carregarCorretores } = useCorretoresStore()
  const [formData, setFormData] = useState<ImovelFormData>({
    titulo: '',
    endereco: '',
    bairro: '',
    cidade: 'Rio de Janeiro',
    quartos: 1,
    banheiros: 1,
    vagas: 0,
    valor_anuncio: null,
    m2: null,
    valor_condominio: null,
    valor_iptu: null,
    link: '',
    status_processo: 'prospectando',
    corretor_id: undefined
  })

  useEffect(() => {
    carregarCorretores()
  }, [carregarCorretores])

  useEffect(() => {
    if (imovel) {
      setFormData({
        titulo: imovel.titulo || '',
        endereco: imovel.endereco || '',
        bairro: imovel.bairro || '',
        cidade: imovel.cidade || 'Rio de Janeiro',
        quartos: imovel.quartos || 1,
        banheiros: imovel.banheiros || 1,
        vagas: imovel.vagas || 0,
        valor_anuncio: imovel.valor_anuncio || null,
        m2: imovel.m2 || null,
        valor_condominio: imovel.valor_condominio || null,
        valor_iptu: imovel.valor_iptu || null,
        link: imovel.link || '',
        status_processo: imovel.status_processo || 'prospectando',
        corretor_id: imovel.corretor_id || undefined
      })
    } else {
      setFormData({
        titulo: '',
        endereco: '',
        bairro: '',
        cidade: 'Rio de Janeiro',
        quartos: 1,
        banheiros: 1,
        vagas: 0,
        valor_anuncio: null,
        m2: null,
        valor_condominio: null,
        valor_iptu: null,
        link: '',
        status_processo: 'prospectando',
        corretor_id: undefined
      })
    }
  }, [imovel, open])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  const updateField = <K extends keyof ImovelFormData>(field: K, value: ImovelFormData[K]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {imovel ? 'Editar Imóvel' : 'Adicionar Imóvel'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Informações Básicas */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 border-b pb-2">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  id="titulo"
                  value={formData.titulo}
                  onChange={(e) => updateField('titulo', e.target.value)}
                  placeholder="Ex: Apartamento 2Q Copacabana"
                />
              </div>

              <div>
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => updateField('endereco', e.target.value)}
                  placeholder="Rua, número, complemento"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="bairro">Bairro *</Label>
                  <Input
                    id="bairro"
                    value={formData.bairro}
                    onChange={(e) => updateField('bairro', e.target.value)}
                    placeholder="Ex: Copacabana"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Select value={formData.cidade} onValueChange={(value) => updateField('cidade', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rio de Janeiro">Rio de Janeiro</SelectItem>
                      <SelectItem value="São Paulo">São Paulo</SelectItem>
                      <SelectItem value="Belo Horizonte">Belo Horizonte</SelectItem>
                      <SelectItem value="Brasília">Brasília</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="link">Link do Anúncio</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => updateField('link', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
          </div>

          {/* Características do Imóvel */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 border-b pb-2">Características</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quartos">Quartos *</Label>
                <Input
                  id="quartos"
                  type="number"
                  min="0"
                  value={formData.quartos}
                  onChange={(e) => updateField('quartos', Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="banheiros">Banheiros *</Label>
                <Input
                  id="banheiros"
                  type="number"
                  min="1"
                  value={formData.banheiros}
                  onChange={(e) => updateField('banheiros', Number(e.target.value))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="vagas">Vagas</Label>
                <Input
                  id="vagas"
                  type="number"
                  min="0"
                  value={formData.vagas}
                  onChange={(e) => updateField('vagas', Number(e.target.value))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="m2">Área (m²)</Label>
              <Input
                id="m2"
                type="number"
                min="1"
                value={formData.m2 || ''}
                onChange={(e) => updateField('m2', e.target.value ? Number(e.target.value) : null)}
                placeholder="Ex: 85"
              />
            </div>
          </div>

          {/* Valores Financeiros */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 border-b pb-2">Valores</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="valor_anuncio">Valor de Anúncio</Label>
                <CurrencyInput
                  id="valor_anuncio"
                  value={formData.valor_anuncio}
                  onChange={(value) => updateField('valor_anuncio', value)}
                  placeholder="950.000"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="valor_condominio">Condomínio</Label>
                  <CurrencyInput
                    id="valor_condominio"
                    value={formData.valor_condominio}
                    onChange={(value) => updateField('valor_condominio', value)}
                    placeholder="1.200"
                  />
                </div>

                <div>
                  <Label htmlFor="valor_iptu">IPTU</Label>
                  <CurrencyInput
                    id="valor_iptu"
                    value={formData.valor_iptu}
                    onChange={(value) => updateField('valor_iptu', value)}
                    placeholder="300"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status e Corretor */}
          <div className="space-y-4">
            <h3 className="font-medium text-slate-900 border-b pb-2">Status e Responsável</h3>
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="status_processo">Status *</Label>
                <Select value={formData.status_processo} onValueChange={(value) => updateField('status_processo', value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="prospectando">Prospectando</SelectItem>
                    <SelectItem value="analisando">Analisando</SelectItem>
                    <SelectItem value="negociando">Negociando</SelectItem>
                    <SelectItem value="finalizado">Finalizado</SelectItem>
                    <SelectItem value="cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="corretor_id">Corretor Responsável</Label>
                <Select value={formData.corretor_id || 'sem-corretor'} onValueChange={(value) => updateField('corretor_id', value === 'sem-corretor' ? undefined : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecionar corretor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sem-corretor">Nenhum corretor</SelectItem>
                    {corretores.map((corretor) => (
                      <SelectItem key={corretor.id} value={corretor.id}>
                        {corretor.nome}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {imovel ? 'Salvar Alterações' : 'Adicionar Imóvel'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}