'use client'

import { useState, useMemo } from 'react'

export interface ViabilityInputs {
  // Dados básicos
  valorAnuncio: number | null
  valorCompra: number | null
  areaUtil: number | null
  valorVenda: number | null
  
  // Financiamento
  percentualEntrada: number // 0.2 = 20%
  percentualITBI: number // 0.03 = 3%
  mesesFinanciamento: number // 6
  
  // Custos extras
  percentualReforma: number // 0.12 = 12%
  valorCondominio: number | null // mensal
  valorIPTU: number | null // mensal
  valorContasGerais: number | null // mensal
  
  // Opcionais
  incluirCorretagem: boolean
  percentualCorretagem: number // 0.05 = 5%
  incluirIR: boolean
}

export interface ViabilityResults {
  // Custos de aquisição
  entrada: number
  itbi: number
  avaliacaoEscritura: number
  registroCartorio: number
  totalAquisicao: number
  
  // Custos operacionais
  financiamento6m: number
  condominio6m: number
  contas6m: number
  reforma: number
  totalOperacional: number
  
  // Custos totais
  custosDesembolsados: number
  
  // Custos de saída
  quitacaoFinanciamento: number
  corretagem: number
  impostoRenda: number
  
  // Resultado final
  lucro: number
  roi: number // %
  valorizacao: number // %
  valorM2Compra: number
  valorM2Venda: number
  investimentoTotal: number
  descontoAnuncio: number // %
}

const defaultInputs: ViabilityInputs = {
  valorAnuncio: null,
  valorCompra: null,
  areaUtil: null,
  valorVenda: null,
  percentualEntrada: 0.2,
  percentualITBI: 0.03,
  mesesFinanciamento: 6,
  percentualReforma: 0.12,
  valorCondominio: null,
  valorIPTU: null,
  valorContasGerais: null,
  incluirCorretagem: true,
  percentualCorretagem: 0.05,
  incluirIR: true,
}

export function useViabilityCalculator(initialInputs?: Partial<ViabilityInputs>) {
  const [inputs, setInputs] = useState<ViabilityInputs>({
    ...defaultInputs,
    ...initialInputs
  })

  const results = useMemo((): ViabilityResults => {
    const {
      valorAnuncio,
      valorCompra,
      areaUtil,
      valorVenda,
      percentualEntrada,
      percentualITBI,
      mesesFinanciamento,
      percentualReforma,
      valorCondominio,
      valorIPTU,
      valorContasGerais,
      incluirCorretagem,
      percentualCorretagem,
      incluirIR
    } = inputs

    // Se valores essenciais são null, retorna valores zerados
    if (valorCompra === null || valorVenda === null) {
      return {
        entrada: 0,
        itbi: 0,
        avaliacaoEscritura: 0,
        registroCartorio: 0,
        totalAquisicao: 0,
        financiamento6m: 0,
        condominio6m: 0,
        contas6m: 0,
        reforma: 0,
        totalOperacional: 0,
        custosDesembolsados: 0,
        quitacaoFinanciamento: 0,
        corretagem: 0,
        impostoRenda: 0,
        lucro: 0,
        roi: 0,
        valorizacao: 0,
        valorM2Compra: 0,
        valorM2Venda: 0,
        investimentoTotal: 0,
        descontoAnuncio: 0
      }
    }

    // Custos de aquisição (baseado nas fórmulas do PAC)
    const entrada = valorCompra * percentualEntrada
    const itbi = valorCompra * percentualITBI
    const avaliacaoEscritura = 1950 // Valor fixo como no PAC
    const registroCartorio = valorCompra * 0.015 // 1.5%
    const totalAquisicao = entrada + itbi + avaliacaoEscritura + registroCartorio

    // Custos operacionais
    const financiamento6m = valorCompra * 0.01 * mesesFinanciamento // 1% a.m.
    const condominio6m = (valorCondominio || 0) * mesesFinanciamento
    const contas6m = ((valorIPTU || 0) + (valorContasGerais || 0)) * mesesFinanciamento
    const reforma = valorCompra * percentualReforma
    const totalOperacional = financiamento6m + condominio6m + contas6m + reforma

    // Custos totais desembolsados
    const custosDesembolsados = totalAquisicao + totalOperacional

    // Custos de saída
    const quitacaoFinanciamento = valorCompra - entrada - (financiamento6m / 4) // Como no PAC
    const corretagem = incluirCorretagem ? valorVenda * percentualCorretagem : 0
    
    // IR: 15% sobre o lucro líquido (fórmula complexa do PAC)
    const lucroParaIR = valorVenda - totalAquisicao - quitacaoFinanciamento - corretagem - (financiamento6m * 3/4) - reforma
    const impostoRenda = incluirIR && lucroParaIR > 0 ? lucroParaIR * 0.15 : 0

    // Resultado final
    const lucro = valorVenda - custosDesembolsados - quitacaoFinanciamento - corretagem - impostoRenda
    const investimentoTotal = custosDesembolsados + quitacaoFinanciamento + corretagem + impostoRenda
    const roi = custosDesembolsados > 0 ? (lucro / custosDesembolsados) : 0

    // Métricas adicionais
    const valorizacao = valorVenda > 0 ? (valorVenda / valorCompra) - 1 : 0
    const valorM2Compra = (areaUtil || 0) > 0 ? valorCompra / (areaUtil || 1) : 0
    const valorM2Venda = (areaUtil || 0) > 0 ? valorVenda / (areaUtil || 1) : 0
    
    // Cálculo do desconto do anúncio
    const descontoAnuncio = (valorAnuncio || 0) > 0 ? ((valorAnuncio || 0) - valorCompra) / (valorAnuncio || 1) : 0

    return {
      entrada,
      itbi,
      avaliacaoEscritura,
      registroCartorio,
      totalAquisicao,
      financiamento6m,
      condominio6m,
      contas6m,
      reforma,
      totalOperacional,
      custosDesembolsados,
      quitacaoFinanciamento,
      corretagem,
      impostoRenda,
      lucro,
      roi,
      valorizacao,
      valorM2Compra,
      valorM2Venda,
      investimentoTotal,
      descontoAnuncio
    }
  }, [inputs])

  const updateInput = <K extends keyof ViabilityInputs>(
    key: K,
    value: ViabilityInputs[K]
  ) => {
    setInputs(prev => ({ ...prev, [key]: value }))
  }

  const resetToDefaults = () => {
    setInputs(defaultInputs)
  }

  return {
    inputs,
    results,
    updateInput,
    resetToDefaults
  }
}