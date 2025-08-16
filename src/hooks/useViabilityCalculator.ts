'use client'

import { useState, useMemo } from 'react'

export interface ViabilityInputs {
  // Dados básicos
  valorCompra: number
  areaUtil: number
  valorVenda: number
  
  // Financiamento
  percentualEntrada: number // 0.2 = 20%
  percentualITBI: number // 0.03 = 3%
  mesesFinanciamento: number // 6
  
  // Custos extras
  percentualReforma: number // 0.12 = 12%
  valorCondominio: number // mensal
  valorContas: number // mensal
  
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
}

const defaultInputs: ViabilityInputs = {
  valorCompra: 830000,
  areaUtil: 105,
  valorVenda: 1220000,
  percentualEntrada: 0.2,
  percentualITBI: 0.03,
  mesesFinanciamento: 6,
  percentualReforma: 0.12,
  valorCondominio: 1700,
  valorContas: 344, // (144+200)
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
      valorCompra,
      areaUtil,
      valorVenda,
      percentualEntrada,
      percentualITBI,
      mesesFinanciamento,
      percentualReforma,
      valorCondominio,
      valorContas,
      incluirCorretagem,
      percentualCorretagem,
      incluirIR
    } = inputs

    // Custos de aquisição (baseado nas fórmulas do PAC)
    const entrada = valorCompra * percentualEntrada
    const itbi = valorCompra * percentualITBI
    const avaliacaoEscritura = 1950 // Valor fixo como no PAC
    const registroCartorio = valorCompra * 0.015 // 1.5%
    const totalAquisicao = entrada + itbi + avaliacaoEscritura + registroCartorio

    // Custos operacionais
    const financiamento6m = valorCompra * 0.01 * mesesFinanciamento // 1% a.m.
    const condominio6m = valorCondominio * mesesFinanciamento
    const contas6m = valorContas * mesesFinanciamento
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
    const valorM2Compra = areaUtil > 0 ? valorCompra / areaUtil : 0
    const valorM2Venda = areaUtil > 0 ? valorVenda / areaUtil : 0

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
      investimentoTotal
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