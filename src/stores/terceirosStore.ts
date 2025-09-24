import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { TerceiroCompleto, TerceiroFormData } from '../app/terceiros/types/terceiro'

interface TerceirosState {
  terceiros: TerceiroCompleto[]
  isLoading: boolean
  
  // Actions
  carregarTerceiros: () => Promise<void>
  adicionarTerceiro: (terceiro: TerceiroFormData) => Promise<void>
  editarTerceiro: (id: string, terceiro: Partial<TerceiroFormData>) => Promise<void>
  removerTerceiro: (id: string) => Promise<void>
  obterTerceiroPorId: (id: string) => TerceiroCompleto | undefined
}

export const useTerceirosStore = create<TerceirosState>((set, get) => ({
  terceiros: [],
  isLoading: false,

  carregarTerceiros: async () => {
    set({ isLoading: true })
    try {
      const { data, error } = await supabase
        .from('terceiros')
        .select('*')
        .order('nome')

      if (error) throw error

      set({ terceiros: data || [], isLoading: false })
    } catch (error) {
      console.error('Erro ao carregar terceiros:', error)
      set({ isLoading: false })
    }
  },

  adicionarTerceiro: async (novoTerceiro) => {
    try {
      const { error } = await supabase
        .from('terceiros')
        .insert([novoTerceiro])

      if (error) throw error

      // Recarregar lista
      const { carregarTerceiros } = get()
      await carregarTerceiros()
    } catch (error) {
      console.error('Erro ao adicionar terceiro:', error)
      throw error
    }
  },

  editarTerceiro: async (id, terceiroAtualizado) => {
    try {
      const { error } = await supabase
        .from('terceiros')
        .update(terceiroAtualizado)
        .eq('id', id)

      if (error) throw error

      // Atualizar estado local
      set((state) => ({
        terceiros: state.terceiros.map((terceiro) =>
          terceiro.id === id ? { ...terceiro, ...terceiroAtualizado } : terceiro
        ),
      }))
    } catch (error) {
      console.error('Erro ao editar terceiro:', error)
      throw error
    }
  },

  removerTerceiro: async (id) => {
    try {
      const { error } = await supabase
        .from('terceiros')
        .delete()
        .eq('id', id)

      if (error) throw error

      set((state) => ({
        terceiros: state.terceiros.filter((terceiro) => terceiro.id !== id),
      }))
    } catch (error) {
      console.error('Erro ao remover terceiro:', error)
      throw error
    }
  },

  obterTerceiroPorId: (id) => {
    const { terceiros } = get()
    return terceiros.find((terceiro) => terceiro.id === id)
  },
}))