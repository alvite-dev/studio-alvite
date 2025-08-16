'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/features/PageHeader'
import { CorretoresTable } from './components/CorretoresTable'
import { CorretoresFilters } from './components/CorretoresFilters'
import { CorretorForm } from './components/CorretorForm'
import { CorretorInfoModal } from './components/CorretorInfoModal'
import { CorretorCompleto, CorretorFiltros } from './types/corretor'
import { useCorretoresStore } from '@/stores/corretoresStore'

export default function CorretoresPage() {
  const { 
    corretores, 
    isLoading, 
    carregarCorretores, 
    adicionarCorretor, 
    editarCorretor, 
    removerCorretor 
  } = useCorretoresStore()
  
  const [filtros, setFiltros] = useState<CorretorFiltros>({
    busca: '',
    regiao: ''
  })
  const [formOpen, setFormOpen] = useState(false)
  const [corretorEditando, setCorretorEditando] = useState<CorretorCompleto | null>(null)
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [corretorVisualizando, setCorretorVisualizando] = useState<CorretorCompleto | null>(null)

  // Carregar corretores ao montar o componente
  useEffect(() => {
    carregarCorretores()
  }, [carregarCorretores])

  // Filtrar corretores
  const corretoresFiltrados = useMemo(() => {
    return corretores.filter(corretor => {
      const matchBusca = !filtros.busca || 
        corretor.nome.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        corretor.telefone.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        corretor.imobiliaria?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        corretor.bairros?.some(bairro => bairro.toLowerCase().includes(filtros.busca.toLowerCase()))

      return matchBusca
    })
  }, [corretores, filtros])


  const handleEdit = (corretor: CorretorCompleto) => {
    setCorretorEditando(corretor)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este corretor?')) {
      try {
        await removerCorretor(id)
      } catch (error) {
        alert('Erro ao excluir corretor')
      }
    }
  }

  const handleWhatsApp = (telefone: string) => {
    const cleanPhone = telefone.replace(/\D/g, '')
    const whatsappUrl = `https://wa.me/55${cleanPhone}`
    window.open(whatsappUrl, '_blank')
  }

  const handleInfo = (corretor: CorretorCompleto) => {
    setCorretorVisualizando(corretor)
    setInfoModalOpen(true)
  }

  const handleAddCorretor = () => {
    setCorretorEditando(null)
    setFormOpen(true)
  }

  const handleSaveCorretor = async (corretorData: Partial<CorretorCompleto>) => {
    try {
      if (corretorEditando) {
        // Editar corretor existente
        await editarCorretor(corretorEditando.id, corretorData)
      } else {
        // Adicionar novo corretor
        await adicionarCorretor({
          nome: corretorData.nome || '',
          telefone: corretorData.telefone || '',
          imobiliaria: corretorData.imobiliaria,
          bairros: corretorData.bairros
        })
      }
      setFormOpen(false)
      setCorretorEditando(null)
    } catch (error) {
      alert('Erro ao salvar corretor')
    }
  }

  return (
    <div className="h-[calc(100dvh-72px)] md:h-screen flex flex-col bg-white overflow-hidden">
      
      <PageHeader
        title="Corretores"
        description={`${corretoresFiltrados.length} ${corretoresFiltrados.length === 1 ? 'corretor' : 'corretores'} encontrado${corretoresFiltrados.length === 1 ? '' : 's'}`}
        action={
          <Button onClick={handleAddCorretor} size="sm" className="shrink-0">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Adicionar Corretor</span>
          </Button>
        }
      />

      <CorretoresFilters 
        filtros={filtros}
        onFiltrosChange={setFiltros}
      />

      <div className="flex-1 min-h-0 overflow-hidden px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600">Carregando corretores...</p>
          </div>
        ) : (
          <CorretoresTable
            corretores={corretoresFiltrados}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onWhatsApp={handleWhatsApp}
            onInfo={handleInfo}
          />
        )}
      </div>

      <CorretorForm
        corretor={corretorEditando}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSaveCorretor}
      />

      <CorretorInfoModal
        corretor={corretorVisualizando}
        open={infoModalOpen}
        onOpenChange={setInfoModalOpen}
        onEdit={handleEdit}
        onWhatsApp={handleWhatsApp}
      />
    </div>
  )
}