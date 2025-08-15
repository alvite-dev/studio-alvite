import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface VisitaForm {
  id: string
  // Imóvel da base ou manual
  imovel_id?: string // ID do imóvel da base (opcional)
  imovel_link_manual?: string // Link manual quando não está na base
  imovel_endereco_manual?: string // Endereço manual quando não está na base
  // Corretor da base ou manual
  corretor_id?: string // ID do corretor da base (opcional)
  corretor_nome_manual?: string // Nome manual quando não está na base
  corretor_telefone_manual?: string // Telefone manual quando não está na base
  data_hora: Date
  observacoes_pre?: string
  ordem?: number
}

// Interface estendida para dados das visitas com JOINs
export interface VisitaCompleta extends VisitaForm {
  // Dados do imóvel (da base)
  imovel_endereco?: string
  imovel_link?: string
  quartos?: number
  banheiros?: number
  vagas?: number
  // Dados do corretor (da base)
  corretor_nome?: string
  corretor_telefone?: string
  imobiliaria?: string
}

interface VisitasState {
  visitas: VisitaCompleta[]
  isLoading: boolean
  
  // Actions
  carregarVisitas: () => Promise<void>
  adicionarVisita: (visita: Omit<VisitaForm, 'id'>) => Promise<void>
  editarVisita: (id: string, visita: Partial<VisitaForm>) => Promise<void>
  removerVisita: (id: string) => Promise<void>
  reordenarVisitas: (visitasReordenadas: VisitaCompleta[]) => Promise<void>
  obterVisitaPorId: (id: string) => VisitaCompleta | undefined
}

// Função para carregar visitas com JOINs do Supabase
const carregarVisitasDoSupabase = async (): Promise<VisitaCompleta[]> => {
  const { data, error } = await supabase
    .from('visitas')
    .select(`
      id,
      imovel_id,
      imovel_link_manual,
      imovel_endereco_manual,
      corretor_id,
      corretor_nome_manual,
      corretor_telefone_manual,
      data_hora,
      observacoes_pre,
      ordem,
      imoveis (
        endereco,
        link,
        quartos,
        banheiros,
        vagas
      ),
      corretores (
        nome,
        telefone,
        imobiliaria
      )
    `)
    .order('ordem')
    .order('data_hora')

  if (error) {
    console.error('Erro ao carregar visitas:', error)
    throw error
  }

  // Transformar dados usando COALESCE manual
  return (data || []).map((item: Record<string, unknown>) => ({
    id: item.id as string,
    imovel_id: item.imovel_id as string | undefined,
    imovel_link_manual: item.imovel_link_manual as string | undefined,
    imovel_endereco_manual: item.imovel_endereco_manual as string | undefined,
    corretor_id: item.corretor_id as string | undefined,
    corretor_nome_manual: item.corretor_nome_manual as string | undefined,
    corretor_telefone_manual: item.corretor_telefone_manual as string | undefined,
    data_hora: new Date(item.data_hora as string),
    observacoes_pre: item.observacoes_pre as string | undefined,
    ordem: item.ordem as number | undefined,
    // Dados do imóvel (COALESCE)
    imovel_endereco: (item.imoveis as { endereco?: string } | null)?.endereco,
    imovel_link: (item.imoveis as { link?: string } | null)?.link,
    quartos: (item.imoveis as { quartos?: number } | null)?.quartos,
    banheiros: (item.imoveis as { banheiros?: number } | null)?.banheiros,
    vagas: (item.imoveis as { vagas?: number } | null)?.vagas,
    // Dados do corretor (COALESCE)
    corretor_nome: (item.corretores as { nome?: string } | null)?.nome,
    corretor_telefone: (item.corretores as { telefone?: string } | null)?.telefone,
    imobiliaria: (item.corretores as { imobiliaria?: string } | null)?.imobiliaria,
  }))
}

export const useVisitasStore = create<VisitasState>((set, get) => ({
  visitas: [],
  isLoading: false,

  carregarVisitas: async () => {
    set({ isLoading: true })
    try {
      const visitas = await carregarVisitasDoSupabase()
      set({ visitas, isLoading: false })
    } catch (error) {
      console.error('Erro ao carregar visitas:', error)
      set({ isLoading: false })
    }
  },

  adicionarVisita: async (novaVisita) => {
    try {
      const { error } = await supabase
        .from('visitas')
        .insert([{
          ...novaVisita,
          data_hora: novaVisita.data_hora.toISOString(),
        }])

      if (error) throw error

      // Recarregar visitas para pegar dados com JOINs
      const { carregarVisitas } = get()
      await carregarVisitas()
    } catch (error) {
      console.error('Erro ao adicionar visita:', error)
      throw error
    }
  },

  editarVisita: async (id, visitaAtualizada) => {
    try {
      const updates: Record<string, unknown> = { ...visitaAtualizada }
      if (updates.data_hora && updates.data_hora instanceof Date) {
        updates.data_hora = updates.data_hora.toISOString()
      }

      const { error } = await supabase
        .from('visitas')
        .update(updates)
        .eq('id', id)

      if (error) throw error

      // Recarregar visitas para pegar dados atualizados
      const { carregarVisitas } = get()
      await carregarVisitas()
    } catch (error) {
      console.error('Erro ao editar visita:', error)
      throw error
    }
  },

  removerVisita: async (id) => {
    try {
      const { error } = await supabase
        .from('visitas')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        visitas: state.visitas.filter((visita) => visita.id !== id),
      }))
    } catch (error) {
      console.error('Erro ao remover visita:', error)
      throw error
    }
  },

  reordenarVisitas: async (visitasReordenadas) => {
    try {
      // Atualizar ordem no banco de dados
      const updates = visitasReordenadas.map((visita, index) => ({
        id: visita.id,
        ordem: index + 1
      }))

      for (const update of updates) {
        const { error } = await supabase
          .from('visitas')
          .update({ ordem: update.ordem })
          .eq('id', update.id)
        
        if (error) throw error
      }

      set({ visitas: visitasReordenadas })
    } catch (error) {
      console.error('Erro ao reordenar visitas:', error)
      throw error
    }
  },

  obterVisitaPorId: (id) => {
    const { visitas } = get()
    return visitas.find((visita) => visita.id === id)
  },
}))