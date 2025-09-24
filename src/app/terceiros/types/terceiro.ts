export interface TerceiroCompleto {
  id: string
  nome: string
  especialidade: string
  nota?: number | null
  contato: string
  created_at?: string
  updated_at?: string
}

export interface TerceiroFiltros {
  busca: string
  especialidade: string
  nota_minima: number | null
}

export interface TerceiroFormData {
  nome: string
  especialidade: string
  nota?: number | null
  contato: string
}