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
  }
}))