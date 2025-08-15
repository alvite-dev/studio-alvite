import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface Imovel {
  id: string
  link: string
  endereco: string
  quartos: number
  banheiros: number
  vagas: number
  corretor_id?: string
}

interface ImoveisState {
  imoveis: Imovel[]
  isLoading: boolean
  carregarImoveis: () => Promise<void>
  obterImovelPorId: (id: string) => Imovel | undefined
}

// Função para carregar imóveis do Supabase
const carregarImoveisDoSupabase = async (): Promise<Imovel[]> => {
  const { data, error } = await supabase
    .from('imoveis')
    .select('id, link, endereco, quartos, banheiros, vagas, corretor_id')
    .order('endereco')

  if (error) {
    console.error('Erro ao carregar imóveis:', error)
    throw error
  }

  return data || []
}

export const useImoveisStore = create<ImoveisState>((set, get) => ({
  imoveis: [],
  isLoading: false,

  carregarImoveis: async () => {
    set({ isLoading: true })
    try {
      const imoveis = await carregarImoveisDoSupabase()
      set({ imoveis, isLoading: false })
    } catch (error) {
      console.error('Erro ao carregar imóveis:', error)
      set({ isLoading: false })
    }
  },

  obterImovelPorId: (id: string) => {
    const { imoveis } = get()
    return imoveis.find(imovel => imovel.id === id)
  }
}))