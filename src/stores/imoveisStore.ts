import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { PropertyData } from '../lib/types'
import { ViabilityInputs } from '../hooks/useViabilityCalculator'
import { ImovelCompleto } from '../app/imoveis/types/imovel'

// Usando o tipo correto da página de imóveis
export type Imovel = ImovelCompleto

// Helper para criar dados de exibição com fallbacks
export interface ImovelParaCalculadora {
  id: string
  titulo: string
  endereco_completo: string
  bairro: string
  cidade: string
  valor_anuncio: number | null
  m2_util_original: number | null
  valor_condominio: number | null
  valor_iptu: number | null
  quartos: number
  banheiros: number
  vagas: number
}

interface ImoveisState {
  imoveis: Imovel[]
  imoveisParaCalculadora: ImovelParaCalculadora[]
  isLoading: boolean
  carregarImoveis: () => Promise<void>
  obterImovelPorId: (id: string) => Imovel | undefined
  adicionarImovel: (imovel: Omit<Imovel, 'id' | 'created_at' | 'updated_at' | 'corretor_nome'>) => Promise<void>
  editarImovel: (id: string, imovel: Partial<Omit<Imovel, 'id' | 'created_at' | 'updated_at' | 'corretor_nome'>>) => Promise<void>
  removerImovel: (id: string) => Promise<void>
  mapearPropertyDataParaViabilityInputs: (property: PropertyData) => Partial<ViabilityInputs>
  mapearImovelParaViabilityInputs: (imovel: ImovelParaCalculadora) => Partial<ViabilityInputs>
}

// Dados mock para teste (caso não haja dados no Supabase)
const imoveisMock: Imovel[] = [
  {
    id: '1',
    link: 'https://example.com/imovel1',
    endereco: 'Rua das Flores, 123, Vila Madalena, São Paulo',
    quartos: 3,
    banheiros: 2,
    vagas: 1,
    corretor_id: '1'
  },
  {
    id: '2',
    link: 'https://example.com/imovel2',
    endereco: 'Av. Paulista, 456, Bela Vista, São Paulo',
    quartos: 2,
    banheiros: 1,
    vagas: 1,
    corretor_id: '2'
  },
  {
    id: '3',
    link: 'https://example.com/imovel3',
    endereco: 'Rua Augusta, 789, Consolação, São Paulo',
    quartos: 4,
    banheiros: 3,
    vagas: 2,
    corretor_id: '1'
  }
]

// Função para carregar imóveis do Supabase
const carregarImoveisDoSupabase = async (): Promise<Imovel[]> => {
  try {
    const { data, error } = await supabase
      .from('imoveis')
      .select('id, link, endereco, quartos, banheiros, vagas, corretor_id, titulo, bairro, cidade, valor_anuncio, m2, valor_condominio, valor_iptu, status_processo, created_at, updated_at')
      .order('endereco')

    if (error) {
      console.error('Erro ao carregar imóveis do Supabase:', error)
      console.log('Usando dados mock para teste')
      return imoveisMock
    }

    // Se não há dados, usar mock
    if (!data || data.length === 0) {
      console.log('Nenhum dado encontrado no Supabase, usando dados mock')
      return imoveisMock
    }

    return data
  } catch (err) {
    console.error('Erro de conexão com Supabase:', err)
    console.log('Usando dados mock para teste')
    return imoveisMock
  }
}

// Função para criar dados de exibição com fallbacks para campos faltantes
const criarDadosParaCalculadora = (imovel: Imovel): ImovelParaCalculadora => {
  // Extrair bairro e cidade do endereço se não estiverem preenchidos
  const enderecoParts = imovel.endereco.split(',')
  const bairroFallback = enderecoParts[enderecoParts.length - 2]?.trim() || 'Centro'
  const cidadeFallback = enderecoParts[enderecoParts.length - 1]?.trim() || 'Rio de Janeiro'
  
  return {
    id: imovel.id,
    titulo: imovel.titulo || `${imovel.quartos}Q ${imovel.banheiros}B - ${imovel.bairro || bairroFallback}`,
    endereco_completo: imovel.endereco,
    bairro: imovel.bairro || bairroFallback,
    cidade: imovel.cidade || cidadeFallback,
    valor_anuncio: imovel.valor_anuncio || null,
    m2_util_original: imovel.m2 || null,
    valor_condominio: imovel.valor_condominio || null,
    valor_iptu: imovel.valor_iptu || null,
    quartos: imovel.quartos,
    banheiros: imovel.banheiros,
    vagas: imovel.vagas
  }
}

// Função para converter string monetária em número
const parseCurrency = (currency: string): number | null => {
  if (!currency) return null
  const cleaned = currency.replace(/[^\d]/g, '')
  return cleaned ? parseInt(cleaned, 10) : null
}

// Função para converter área string em número
const parseArea = (area: string): number | null => {
  if (!area) return null
  const cleaned = area.replace(/[^\d]/g, '')
  return cleaned ? parseInt(cleaned, 10) : null
}

export const useImoveisStore = create<ImoveisState>((set, get) => ({
  imoveis: [],
  imoveisParaCalculadora: [],
  isLoading: false,

  carregarImoveis: async () => {
    set({ isLoading: true })
    try {
      const imoveis = await carregarImoveisDoSupabase()
      // Criar dados para calculadora com fallbacks
      const imoveisParaCalculadora = imoveis.map(criarDadosParaCalculadora)
      set({ imoveis, imoveisParaCalculadora, isLoading: false })
    } catch (error: unknown) {
      console.error('Erro ao carregar imóveis:', error)
      set({ isLoading: false })
    }
  },

  obterImovelPorId: (id: string) => {
    const { imoveis } = get()
    return imoveis.find(imovel => imovel.id === id)
  },

  mapearPropertyDataParaViabilityInputs: (property: PropertyData): Partial<ViabilityInputs> => {
    return {
      valorAnuncio: parseCurrency(property.price),
      areaUtil: parseArea(property.area),
      valorCondominio: parseCurrency(property.condominiumFee),
      valorIPTU: parseCurrency(property.iptu),
      valorContasGerais: null // Será calculado depois ou inserido manualmente
    }
  },

  adicionarImovel: async (imovelData) => {
    set({ isLoading: true })
    try {
      const { error } = await supabase
        .from('imoveis')
        .insert([imovelData])
        .select()
        .single()

      if (error) throw error

      // Recarregar a lista completa
      const state = get()
      await state.carregarImoveis()
    } catch (error) {
      console.error('Erro ao adicionar imóvel:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  editarImovel: async (id, imovelData) => {
    set({ isLoading: true })
    try {
      const { error } = await supabase
        .from('imoveis')
        .update({ ...imovelData, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) throw error

      // Recarregar a lista completa
      const state = get()
      await state.carregarImoveis()
    } catch (error) {
      console.error('Erro ao editar imóvel:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  removerImovel: async (id) => {
    set({ isLoading: true })
    try {
      const { error } = await supabase
        .from('imoveis')
        .delete()
        .eq('id', id)

      if (error) throw error

      // Atualizar estado local removendo o imóvel
      const { imoveis, imoveisParaCalculadora } = get()
      const novosImoveis = imoveis.filter(imovel => imovel.id !== id)
      const novosImoveisParaCalculadora = imoveisParaCalculadora.filter(imovel => imovel.id !== id)
      
      set({ 
        imoveis: novosImoveis, 
        imoveisParaCalculadora: novosImoveisParaCalculadora 
      })
    } catch (error) {
      console.error('Erro ao remover imóvel:', error)
      throw error
    } finally {
      set({ isLoading: false })
    }
  },

  mapearImovelParaViabilityInputs: (imovel: ImovelParaCalculadora): Partial<ViabilityInputs> => {
    return {
      valorAnuncio: imovel.valor_anuncio,
      areaUtil: imovel.m2_util_original,
      valorCondominio: imovel.valor_condominio,
      valorIPTU: imovel.valor_iptu,
      valorContasGerais: 200 // Valor fixo de R$ 200
    }
  }
}))