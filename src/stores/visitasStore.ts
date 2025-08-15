import { create } from 'zustand'

export interface VisitaForm {
  id: string
  // Imóvel da base ou manual
  imovel_id?: string // ID do imóvel da base (opcional)
  imovel_link_manual?: string // Link manual quando não está na base
  imovel_endereco_manual?: string // Endereço manual quando não está na base
  // Corretor da base ou manual
  corretor_id?: string // ID do corretor da base (opcional)
  corretor_nome_manual?: string // Nome manual quando não está na base
  corretor_telefone_manual?: string // Telefone manual quando não está na base
  data_hora: Date
  observacoes_pre?: string
}

interface VisitasState {
  visitas: VisitaForm[]
  
  // Actions
  adicionarVisita: (visita: Omit<VisitaForm, 'id'>) => void
  editarVisita: (id: string, visita: Partial<VisitaForm>) => void
  removerVisita: (id: string) => void
  reordenarVisitas: (visitasReordenadas: VisitaForm[]) => void
  obterVisitaPorId: (id: string) => VisitaForm | undefined
}

export const useVisitasStore = create<VisitasState>((set, get) => ({
  visitas: [],

  adicionarVisita: (novaVisita) => 
    set((state) => ({
      visitas: [
        ...state.visitas,
        {
          ...novaVisita,
          id: crypto.randomUUID(),
        },
      ],
    })),

  editarVisita: (id, visitaAtualizada) =>
    set((state) => ({
      visitas: state.visitas.map((visita) =>
        visita.id === id ? { ...visita, ...visitaAtualizada } : visita
      ),
    })),

  removerVisita: (id) =>
    set((state) => ({
      visitas: state.visitas.filter((visita) => visita.id !== id),
    })),

  reordenarVisitas: (visitasReordenadas) =>
    set({ visitas: visitasReordenadas }),

  obterVisitaPorId: (id) => {
    const { visitas } = get()
    return visitas.find((visita) => visita.id === id)
  },
}))