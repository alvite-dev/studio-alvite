export interface CorretorCompleto {
  id: string
  nome: string
  telefone: string
  imobiliaria?: string
  bairros?: string[]
  created_at?: string
  updated_at?: string
}

export interface CorretorFiltros {
  busca: string
  imobiliaria: string
  bairro: string
}