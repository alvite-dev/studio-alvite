import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface Corretor {
  id: string
  nome: string
  telefone: string
  imobiliaria?: string
}

interface CorretoresState {
  corretores: Corretor[]
  isLoading: boolean
  carregarCorretores: () => Promise<void>
  obterCorretorPorId: (id: string) => Corretor | undefined
  adicionarCorretor: (corretor: Omit<Corretor, 'id'>) => Promise<void>
  editarCorretor: (id: string, corretor: Partial<Corretor>) => Promise<void>
  removerCorretor: (id: string) => Promise<void>
}

// Função para carregar corretores do Supabase
const carregarCorretoresDoSupabase = async (): Promise<Corretor[]> => {
  const { data, error } = await supabase
    .from('corretores')
    .select('id, nome, telefone, imobiliaria')
    .order('nome')

  if (error) {
    console.error('Erro ao carregar corretores:', error)
    throw error
  }

  return data || []
}

export const useCorretoresStore = create<CorretoresState>((set, get) => ({
  corretores: [],
  isLoading: false,

  carregarCorretores: async () => {
    set({ isLoading: true })
    try {
      const corretores = await carregarCorretoresDoSupabase()
      set({ corretores, isLoading: false })
    } catch (error) {
      console.error('Erro ao carregar corretores:', error)
      set({ isLoading: false })
    }
  },

  obterCorretorPorId: (id: string) => {
    const { corretores } = get()
    return corretores.find(corretor => corretor.id === id)
  },

  adicionarCorretor: async (novoCorretor: Omit<Corretor, 'id'>) => {
    const { data, error } = await supabase
      .from('corretores')
      .insert([novoCorretor])
      .select()
      .single()

    if (error) {
      console.error('Erro ao adicionar corretor:', error)
      throw error
    }

    const { corretores } = get()
    set({ corretores: [...corretores, data] })
  },

  editarCorretor: async (id: string, corretor: Partial<Corretor>) => {
    const { data, error } = await supabase
      .from('corretores')
      .update(corretor)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao editar corretor:', error)
      throw error
    }

    const { corretores } = get()
    set({ 
      corretores: corretores.map(c => c.id === id ? data : c)
    })
  },

  removerCorretor: async (id: string) => {
    const { error } = await supabase
      .from('corretores')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Erro ao remover corretor:', error)
      throw error
    }

    const { corretores } = get()
    set({ 
      corretores: corretores.filter(c => c.id !== id)
    })
  }
}))