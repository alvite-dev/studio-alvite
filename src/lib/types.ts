export interface User {
  id: string;
  username: string;
  email?: string;
}

export interface Imovel {
  id: string;
  titulo: string;
  endereco_completo: string;
  bairro: string;
  cidade: string;
  cep?: string;
  m2_terreno?: number;
  
  // Dados originais (prospecção)
  quartos_original: number;
  banheiros_original: number;
  vagas_original: number;
  m2_util_original: number;
  link_anuncio_original?: string;
  valor_anuncio: number;
  fonte_prospeccao: string;
  
  // Dados pós-reforma
  quartos_final?: number;
  banheiros_final?: number;
  vagas_final?: number;
  m2_util_final?: number;
  
  // Dados financeiros
  valor_compra?: number;
  valor_compra_total?: number;
  data_compra?: Date;
  valor_venda?: number;
  data_venda?: Date;
  
  // Custos mensais
  valor_condominio?: number;
  valor_iptu?: number;
  valor_contas_gerais?: number;
  
  // Controle de processo
  status_processo: StatusProcesso;
  observacoes?: string;
  
  created_at: Date;
  updated_at: Date;
}

export type StatusProcesso = 
  | 'prospectando'
  | 'analisando'
  | 'negociando'
  | 'comprado'
  | 'reformando'
  | 'vendendo'
  | 'vendido'
  | 'cancelado';

export interface Viabilidade {
  id: string;
  imovel_id: string;
  valor_compra_estimado: number;
  custo_reforma_estimado: number;
  valor_venda_estimado: number;
  roi_percentual: number;
  roi_valor: number;
  tempo_estimado_meses: number;
  observacoes?: string;
  aprovado?: boolean;
  created_at: Date;
}

export interface Visita {
  id: string;
  imovel_id: string;
  data_hora: Date;
  status: StatusVisita;
  observacoes_pre?: string;
  created_at: Date;
}

export type StatusVisita = 'agendada' | 'realizada' | 'cancelada';

export interface AvaliacaoVisita {
  id: string;
  visita_id: string;
  imovel_id: string;
  estado_geral: number; // 1-10
  acabamentos: number; // 1-10
  localizacao: number; // 1-10
  potencial_reforma: number; // 1-10
  problemas_estruturais?: string;
  pontos_positivos?: string;
  pontos_negativos?: string;
  fotos_visita?: string[];
  recomenda_compra: boolean;
  created_at: Date;
}

export interface Noticia {
  id: string;
  titulo: string;
  resumo?: string;
  link: string;
  fonte: string;
  data_publicacao: Date;
  relevancia: number; // 1-10
  tags?: string[];
  created_at: Date;
}

// Property data from scraping
export interface PropertyData {
  id: string;
  title: string;
  price: string;
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  description: string;
  features: string[];
  images: string[];
  url: string;
  propertyType: string;
  condominiumFee: string;
  iptu: string;
  totalCost: string;
  pricePerSqm: string;
  buildingAge?: string;
  floor?: string;
  totalFloors?: string;
  furnished: boolean;
  petFriendly?: boolean;
  hasElevator?: boolean;
  has24hSecurity?: boolean;
  createdDate?: string;
  createdAt?: string;
  lastUpdated?: string;
  contact: {
    name: string;
    phone: string;
    email: string;
  };
}