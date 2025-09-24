'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/features/PageHeader'
import { TerceirosTable } from './components/TerceirosTable'
import { TerceirosFilters } from './components/TerceirosFilters'
import { TerceiroForm } from './components/TerceiroForm'
import { TerceiroInfoModal } from './components/TerceiroInfoModal'
import { TerceiroCompleto, TerceiroFiltros, TerceiroFormData } from './types/terceiro'
import { useTerceirosStore } from '@/stores/terceirosStore'

export default function TerceirosPage() {
  const { 
    terceiros, 
    isLoading, 
    carregarTerceiros, 
    adicionarTerceiro, 
    editarTerceiro, 
    removerTerceiro 
  } = useTerceirosStore()
  
  const [filtros, setFiltros] = useState<TerceiroFiltros>({
    busca: '',
    especialidade: '',
    nota_minima: null
  })
  const [formOpen, setFormOpen] = useState(false)
  const [terceiroEditando, setTerceiroEditando] = useState<TerceiroCompleto | null>(null)
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [terceiroVisualizando, setTerceiroVisualizando] = useState<TerceiroCompleto | null>(null)

  // Carregar terceiros ao montar o componente
  useEffect(() => {
    carregarTerceiros()
  }, [carregarTerceiros])

  // Filtrar terceiros
  const terceirosFiltrados = useMemo(() => {
    return terceiros.filter(terceiro => {
      // Busca textual
      const matchBusca = !filtros.busca || 
        terceiro.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        terceiro.especialidade.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        terceiro.contato.toLowerCase().includes(filtros.busca.toLowerCase())

      // Filtro de especialidade
      const matchEspecialidade = !filtros.especialidade || 
        terceiro.especialidade === filtros.especialidade

      // Filtro de nota mínima
      const matchNota = filtros.nota_minima === null || 
        (terceiro.nota !== null && terceiro.nota !== undefined && terceiro.nota >= filtros.nota_minima)

      return matchBusca && matchEspecialidade && matchNota
    })
  }, [terceiros, filtros])

  const handleEdit = (terceiro: TerceiroCompleto) => {
    setTerceiroEditando(terceiro)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este terceiro?')) {
      try {
        await removerTerceiro(id)
      } catch (error) {
        alert('Erro ao excluir terceiro')
      }
    }
  }

  const handleWhatsApp = (contato: string) => {
    const cleanPhone = contato.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${cleanPhone}`
    window.open(whatsappUrl, '_blank')
  }

  const handleInfo = (terceiro: TerceiroCompleto) => {
    setTerceiroVisualizando(terceiro)
    setInfoModalOpen(true)
  }

  const handleAddTerceiro = () => {
    setTerceiroEditando(null)
    setFormOpen(true)
  }

  const handleSaveTerceiro = async (terceiroData: TerceiroFormData) => {
    try {
      if (terceiroEditando) {
        // Editar terceiro existente
        await editarTerceiro(terceiroEditando.id, terceiroData)
      } else {
        // Adicionar novo terceiro
        await adicionarTerceiro(terceiroData)
      }
      setFormOpen(false)
      setTerceiroEditando(null)
    } catch (error) {
      alert('Erro ao salvar terceiro')
      throw error
    }
  }

  return (
    <div className="h-[calc(100dvh-72px)] md:h-[calc(100vh-56px)] flex flex-col bg-white overflow-hidden">
      
      <PageHeader
        title="Terceiros"
        description="Gerencie os terceiros cadastrados"
        action={
          <Button onClick={handleAddTerceiro} size="sm" className="shrink-0">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Adicionar Terceiro</span>
          </Button>
        }
      />

      <TerceirosFilters 
        filtros={filtros}
        onFiltrosChange={setFiltros}
      />

      <div className="flex-1 min-h-0 overflow-hidden px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600">Carregando terceiros...</p>
          </div>
        ) : (
          <TerceirosTable
            terceiros={terceirosFiltrados}
            onInfo={handleInfo}
            onWhatsApp={handleWhatsApp}
          />
        )}
      </div>

      <TerceiroForm
        terceiro={terceiroEditando}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSaveTerceiro}
      />

      <TerceiroInfoModal
        terceiro={terceiroVisualizando}
        open={infoModalOpen}
        onOpenChange={setInfoModalOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onWhatsApp={handleWhatsApp}
      />
    </div>
  )
}