import { z } from "zod";

// Validation schemas using Zod

export const imovelSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório"),
  endereco_completo: z.string().min(1, "Endereço é obrigatório"),
  bairro: z.string().min(1, "Bairro é obrigatório"),
  cidade: z.string().min(1, "Cidade é obrigatória"),
  cep: z.string().optional(),
  m2_terreno: z.number().positive().optional(),
  
  // Dados originais
  quartos_original: z.number().int().min(0),
  banheiros_original: z.number().int().min(0),
  vagas_original: z.number().int().min(0),
  m2_util_original: z.number().positive(),
  link_anuncio_original: z.string().url().optional().or(z.literal("")),
  valor_anuncio: z.number().positive(),
  fonte_prospeccao: z.enum(["vivareal", "zapimoveis", "imovelweb", "olx", "outros"]),
  
  // Dados pós-reforma
  quartos_final: z.number().int().min(0).optional(),
  banheiros_final: z.number().int().min(0).optional(),
  vagas_final: z.number().int().min(0).optional(),
  m2_util_final: z.number().positive().optional(),
  
  // Dados financeiros
  valor_compra: z.number().positive().optional(),
  valor_compra_total: z.number().positive().optional(),
  data_compra: z.date().optional(),
  valor_venda: z.number().positive().optional(),
  data_venda: z.date().optional(),
  
  // Controle de processo
  status_processo: z.enum([
    "prospectando",
    "analisando", 
    "negociando",
    "comprado",
    "reformando",
    "vendendo",
    "vendido",
    "cancelado"
  ]),
  observacoes: z.string().optional(),
});

export const viabilidadeSchema = z.object({
  valor_compra_estimado: z.number().positive(),
  custo_reforma_estimado: z.number().min(0),
  valor_venda_estimado: z.number().positive(),
  tempo_estimado_meses: z.number().int().min(1).max(60),
  observacoes: z.string().optional(),
});


export const scrapingUrlSchema = z.object({
  url: z.string().url("URL inválida"),
});

// Form validation types
export type ImovelFormData = z.infer<typeof imovelSchema>;
export type ViabilidadeFormData = z.infer<typeof viabilidadeSchema>;
export type ScrapingUrlData = z.infer<typeof scrapingUrlSchema>;