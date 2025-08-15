export interface CorretorCompleto {
  id: string
  nome: string
  telefone: string
  imobiliaria?: string
  created_at?: string
  updated_at?: string
}

export interface CorretorFiltros {
  busca: string
  regiao: string
}