import { create } from 'zustand'

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

// Função para carregar dados do CSV mockado
const carregarImoveisDoCSV = async (): Promise<Imovel[]> => {
  // Por enquanto vamos usar dados mockados diretamente
  // Mais tarde isso será substituído por uma chamada ao Supabase
  const imoveisMockados: Imovel[] = [
    {
      id: 'a1b2c3d4-e5f6-7890-1234-567890abcdef',
      link: 'https://www.zapimoveis.com.br/imovel/apartamento-3-quartos-vila-madalena',
      endereco: 'Rua Harmonia 123 - Vila Madalena - São Paulo - SP',
      quartos: 3,
      banheiros: 2,
      vagas: 1,
      corretor_id: 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    },
    {
      id: 'b2c3d4e5-f6g7-8901-2345-678901bcdefg',
      link: 'https://www.vivareal.com.br/imovel/casa-4-quartos-jardins',
      endereco: 'Av. Paulista 456 - Jardins - São Paulo - SP',
      quartos: 4,
      banheiros: 3,
      vagas: 2,
      corretor_id: '550e8400-e29b-41d4-a716-446655440001'
    },
    {
      id: 'c3d4e5f6-g7h8-9012-3456-789012cdefgh',
      link: 'https://www.zapimoveis.com.br/imovel/apartamento-2-quartos-moema',
      endereco: 'Rua dos Açores 789 - Moema - São Paulo - SP',
      quartos: 2,
      banheiros: 1,
      vagas: 1,
      corretor_id: undefined
    },
    {
      id: 'd4e5f6g7-h8i9-0123-4567-890123defghi',
      link: 'https://www.vivareal.com.br/imovel/cobertura-perdizes',
      endereco: 'Rua Monte Alegre 321 - Perdizes - São Paulo - SP',
      quartos: 3,
      banheiros: 3,
      vagas: 2,
      corretor_id: '3e2f0a4b-8c9d-4e5f-a6b7-c8d9e0f1a2b3'
    },
    {
      id: 'e5f6g7h8-i9j0-1234-5678-901234efghij',
      link: 'https://www.zapimoveis.com.br/imovel/casa-5-quartos-alto-pinheiros',
      endereco: 'Rua Cardeal Arcoverde 654 - Alto de Pinheiros - SP',
      quartos: 5,
      banheiros: 4,
      vagas: 3,
      corretor_id: '9f8e7d6c-5b4a-3918-2736-5647382910ab'
    },
    {
      id: 'f6g7h8i9-j0k1-2345-6789-012345fghijk',
      link: 'https://www.vivareal.com.br/imovel/apartamento-1-quarto-vila-olimpia',
      endereco: 'Rua Gomes de Carvalho 987 - Vila Olímpia - SP',
      quartos: 1,
      banheiros: 1,
      vagas: 1,
      corretor_id: undefined
    },
    {
      id: 'g7h8i9j0-k1l2-3456-7890-123456ghijkl',
      link: 'https://www.zapimoveis.com.br/imovel/duplex-itaim-bibi',
      endereco: 'Av. Brigadeiro Faria Lima 159 - Itaim Bibi - SP',
      quartos: 4,
      banheiros: 3,
      vagas: 2,
      corretor_id: '2a1b0c9d-8e7f-4635-a524-1b3c5d7e9f0a'
    },
    {
      id: 'h8i9j0k1-l2m3-4567-8901-234567hijklm',
      link: 'https://www.vivareal.com.br/imovel/apartamento-3-quartos-brooklin',
      endereco: 'Rua Joaquim Floriano 753 - Brooklin - São Paulo - SP',
      quartos: 3,
      banheiros: 2,
      vagas: 1,
      corretor_id: undefined
    },
    {
      id: 'i9j0k1l2-m3n4-5678-9012-345678ijklmn',
      link: 'https://www.zapimoveis.com.br/imovel/casa-6-quartos-morumbi',
      endereco: 'Av. Giovanni Gronchi 852 - Morumbi - São Paulo - SP',
      quartos: 6,
      banheiros: 5,
      vagas: 4,
      corretor_id: '5f4e3d2c-1b0a-9988-7766-554433221100'
    },
    {
      id: 'j0k1l2m3-n4o5-6789-0123-456789jklmno',
      link: 'https://www.vivareal.com.br/imovel/loft-pinheiros',
      endereco: 'Rua dos Pinheiros 741 - Pinheiros - São Paulo - SP',
      quartos: 1,
      banheiros: 1,
      vagas: 0,
      corretor_id: '1e2d3c4b-5a69-7887-9665-443322110099'
    }
  ]
  
  // Simular delay de rede
  await new Promise(resolve => setTimeout(resolve, 500))
  
  return imoveisMockados
}

export const useImoveisStore = create<ImoveisState>((set, get) => ({
  imoveis: [],
  isLoading: false,

  carregarImoveis: async () => {
    set({ isLoading: true })
    try {
      const imoveis = await carregarImoveisDoCSV()
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