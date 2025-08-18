export interface ImovelCompleto {
  id: string
  link: string
  endereco: string
  quartos: number
  banheiros: number
  vagas: number
  corretor_id?: string
  titulo?: string
  bairro?: string
  cidade?: string
  valor_anuncio?: number
  m2?: number
  valor_condominio?: number
  valor_iptu?: number
  status_processo?: string
  created_at?: string
  updated_at?: string
  // Campo computado com nome do corretor
  corretor_nome?: string
}

export interface ImovelFiltros {
  busca: string
  bairro: string
  quartos_min: number | null
  quartos_max: number | null
  banheiros_min: number | null
  vagas_min: number | null
  valor_min: number | null
  valor_max: number | null
  corretor_id: string
}

export interface ImovelFormData {
  titulo: string
  endereco: string
  bairro: string
  cidade: string
  quartos: number
  banheiros: number
  vagas: number
  valor_anuncio: number | null
  m2: number | null
  valor_condominio: number | null
  valor_iptu: number | null
  link: string
  status_processo: string
  corretor_id?: string
}