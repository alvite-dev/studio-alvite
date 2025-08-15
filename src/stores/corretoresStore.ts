import { create } from 'zustand'

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

// Função para carregar dados do CSV mockado
const carregarCorretoresDoCSV = async (): Promise<Corretor[]> => {
  // Por enquanto vamos usar dados mockados diretamente
  // Mais tarde isso será substituído por uma chamada ao Supabase
  const corretoresMockados: Corretor[] = [
    {
      id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      nome: 'Ana Silva',
      telefone: '(11) 99999-1111',
      imobiliaria: 'Imobiliária Central'
    },
    {
      id: '550e8400-e29b-41d4-a716-446655440001',
      nome: 'Carlos Santos',
      telefone: '(11) 98888-2222',
      imobiliaria: 'Prime Imóveis'
    },
    {
      id: '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
      nome: 'Mariana Costa',
      telefone: '(11) 97777-3333',
      imobiliaria: undefined
    },
    {
      id: '3e2f0a4b-8c9d-4e5f-a6b7-c8d9e0f1a2b3',
      nome: 'Roberto Lima',
      telefone: '(11) 96666-4444',
      imobiliaria: 'Vista Imóveis'
    },
    {
      id: '9f8e7d6c-5b4a-3918-2736-5647382910ab',
      nome: 'Fernanda Oliveira',
      telefone: '(11) 95555-5555',
      imobiliaria: 'Casa & Cia'
    },
    {
      id: '7c6b5a49-3827-4d5e-9f1a-2b3c4d5e6f7a',
      nome: 'João Pereira',
      telefone: '(11) 94444-6666',
      imobiliaria: undefined
    },
    {
      id: '2a1b0c9d-8e7f-4635-a524-1b3c5d7e9f0a',
      nome: 'Luciana Rodrigues',
      telefone: '(11) 93333-7777',
      imobiliaria: 'Habitat Imóveis'
    },
    {
      id: '8d7c6b5a-4938-2716-5e4f-a1b2c3d4e5f6',
      nome: 'Eduardo Martins',
      telefone: '(11) 92222-8888',
      imobiliaria: undefined
    },
    {
      id: '5f4e3d2c-1b0a-9988-7766-554433221100',
      nome: 'Patrícia Souza',
      telefone: '(11) 91111-9999',
      imobiliaria: 'Moradia Fácil'
    },
    {
      id: '1e2d3c4b-5a69-7887-9665-443322110099',
      nome: 'Gabriel Torres',
      telefone: '(11) 90000-0000',
      imobiliaria: 'Premium Houses'
    }
  ]
  
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return corretoresMockados
}

export const useCorretoresStore = create<CorretoresState>((set, get) => ({
  corretores: [],
  isLoading: false,

  carregarCorretores: async () => {
    set({ isLoading: true })
    try {
      const corretores = await carregarCorretoresDoCSV()
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