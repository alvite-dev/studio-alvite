import { create } from 'zustand';
import type { Imovel } from '@/lib/types';

interface ImoveisState {
  imoveis: Imovel[];
  isLoading: boolean;
  selectedImovel: Imovel | null;
  
  // Actions
  setImoveis: (imoveis: Imovel[]) => void;
  addImovel: (imovel: Imovel) => void;
  updateImovel: (id: string, data: Partial<Imovel>) => void;
  removeImovel: (id: string) => void;
  setSelectedImovel: (imovel: Imovel | null) => void;
  setLoading: (loading: boolean) => void;
}

export const useImoveisStore = create<ImoveisState>((set) => ({
  imoveis: [],
  isLoading: false,
  selectedImovel: null,

  setImoveis: (imoveis) => set({ imoveis }),
  
  addImovel: (imovel) => set((state) => ({ 
    imoveis: [...state.imoveis, imovel] 
  })),
  
  updateImovel: (id, data) => set((state) => ({
    imoveis: state.imoveis.map((imovel) =>
      imovel.id === id 
        ? { ...imovel, ...data, updated_at: new Date() }
        : imovel
    )
  })),
  
  removeImovel: (id) => set((state) => ({
    imoveis: state.imoveis.filter((imovel) => imovel.id !== id)
  })),
  
  setSelectedImovel: (imovel) => set({ selectedImovel: imovel }),
  
  setLoading: (loading) => set({ isLoading: loading }),
}));