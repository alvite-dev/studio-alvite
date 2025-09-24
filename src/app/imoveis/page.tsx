'use client'

import { useState, useEffect, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import PageHeader from '@/components/features/PageHeader'
import { ImoveisTable } from './components/ImoveisTable'
import { ImoveisFilters } from './components/ImoveisFilters'
import { ImovelForm } from './components/ImovelForm'
import { ImovelInfoModal } from './components/ImovelInfoModal'
import { ImovelCompleto, ImovelFiltros, ImovelFormData } from './types/imovel'
import { useImoveisStore } from '@/stores/imoveisStore'
import { useCorretoresStore } from '@/stores/corretoresStore'

export default function ImoveisPage() {
  const { 
    imoveis, 
    isLoading, 
    carregarImoveis, 
    adicionarImovel, 
    editarImovel, 
    removerImovel 
  } = useImoveisStore()
  
  const { corretores, carregarCorretores } = useCorretoresStore()
  
  const [filtros, setFiltros] = useState<ImovelFiltros>({
    busca: '',
    bairro: '',
    quartos_min: null,
    quartos_max: null,
    banheiros_min: null,
    vagas_min: null,
    valor_min: null,
    valor_max: null,
    corretor_id: ''
  })
  
  const [formOpen, setFormOpen] = useState(false)
  const [imovelEditando, setImovelEditando] = useState<ImovelCompleto | null>(null)
  const [infoModalOpen, setInfoModalOpen] = useState(false)
  const [imovelVisualizando, setImovelVisualizando] = useState<ImovelCompleto | null>(null)

  // Carregar dados ao montar o componente
  useEffect(() => {
    carregarImoveis()
    carregarCorretores()
  }, [carregarImoveis, carregarCorretores])

  // Criar lista completa com nomes dos corretores
  const imoveisCompletos: ImovelCompleto[] = useMemo(() => {
    return imoveis.map(imovel => ({
      ...imovel,
      corretor_nome: imovel.corretor_id 
        ? corretores.find(c => c.id === imovel.corretor_id)?.nome 
        : undefined
    }))
  }, [imoveis, corretores])

  // Filtrar imóveis
  const imoveisFiltrados = useMemo(() => {
    return imoveisCompletos.filter(imovel => {
      // Busca textual
      const matchBusca = !filtros.busca || 
        imovel.titulo?.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        imovel.endereco.toLowerCase().includes(filtros.busca.toLowerCase()) ||
        imovel.bairro?.toLowerCase().includes(filtros.busca.toLowerCase())

      // Filtro de bairro
      const matchBairro = !filtros.bairro || 
        imovel.bairro?.toLowerCase().includes(filtros.bairro.toLowerCase())

      // Filtro de corretor
      const matchCorretor = !filtros.corretor_id || imovel.corretor_id === filtros.corretor_id

      // Filtro de quartos
      const matchQuartos = (!filtros.quartos_min || imovel.quartos >= filtros.quartos_min) &&
                          (!filtros.quartos_max || imovel.quartos <= filtros.quartos_max)

      // Filtro de banheiros
      const matchBanheiros = !filtros.banheiros_min || imovel.banheiros >= filtros.banheiros_min

      // Filtro de vagas
      const matchVagas = !filtros.vagas_min || imovel.vagas >= filtros.vagas_min

      // Filtro de valor
      const matchValor = (!filtros.valor_min || !imovel.valor_anuncio || imovel.valor_anuncio >= filtros.valor_min) &&
                        (!filtros.valor_max || !imovel.valor_anuncio || imovel.valor_anuncio <= filtros.valor_max)

      return matchBusca && matchBairro && matchCorretor && matchQuartos && matchBanheiros && matchVagas && matchValor
    })
  }, [imoveisCompletos, filtros])

  const handleEdit = (imovel: ImovelCompleto) => {
    setImovelEditando(imovel)
    setFormOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este imóvel?')) {
      try {
        await removerImovel(id)
      } catch (error) {
        alert('Erro ao excluir imóvel')
      }
    }
  }

  const handleInfo = (imovel: ImovelCompleto) => {
    setImovelVisualizando(imovel)
    setInfoModalOpen(true)
  }


  const handleAddImovel = () => {
    setImovelEditando(null)
    setFormOpen(true)
  }

  const handleSaveImovel = async (imovelData: ImovelFormData) => {
    try {
      // Converter null para undefined para compatibilidade com Supabase
      const processedData = {
        ...imovelData,
        valor_anuncio: imovelData.valor_anuncio || undefined,
        m2: imovelData.m2 || undefined,
        valor_condominio: imovelData.valor_condominio || undefined,
        valor_iptu: imovelData.valor_iptu || undefined,
      }

      if (imovelEditando) {
        // Editar imóvel existente
        await editarImovel(imovelEditando.id, processedData)
      } else {
        // Adicionar novo imóvel
        await adicionarImovel(processedData)
      }
      setFormOpen(false)
      setImovelEditando(null)
    } catch (error) {
      alert('Erro ao salvar imóvel')
    }
  }

  return (
    <div className="h-[calc(100dvh-72px)] md:h-[calc(100vh-56px)] flex flex-col bg-white overflow-hidden">
      
      <PageHeader
        title="Imóveis"
        description="Gerencie os imóveis cadastrados"
        action={
          <Button onClick={handleAddImovel} size="sm" className="shrink-0">
            <Plus className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Adicionar Imóvel</span>
          </Button>
        }
      />

      <ImoveisFilters 
        filtros={filtros}
        onFiltrosChange={setFiltros}
      />

      <div className="flex-1 min-h-0 overflow-hidden px-4 sm:px-6 md:px-8 py-4 sm:py-6">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-slate-600">Carregando imóveis...</p>
          </div>
        ) : (
          <ImoveisTable
            imoveis={imoveisFiltrados}
            onInfo={handleInfo}
          />
        )}
      </div>

      <ImovelForm
        imovel={imovelEditando}
        open={formOpen}
        onOpenChange={setFormOpen}
        onSave={handleSaveImovel}
      />

      <ImovelInfoModal
        imovel={imovelVisualizando}
        open={infoModalOpen}
        onOpenChange={setInfoModalOpen}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  )
}