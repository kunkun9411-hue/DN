import { create } from 'zustand';

export type CalculatorState = {
  base: 'metin2' | 'palworld' | 'minecraft' | 'web';
  dashboard: boolean;
  automation: boolean;
  support: boolean;
  rush: boolean;
  setBase: (base: CalculatorState['base']) => void;
  toggle: (key: 'dashboard' | 'automation' | 'support' | 'rush') => void;
};

export const useCalculatorStore = create<CalculatorState>((set) => ({
  base: 'minecraft',
  dashboard: false,
  automation: false,
  support: false,
  rush: false,
  setBase: (base) => set({ base }),
  toggle: (key) => set((state) => ({ [key]: !state[key] })),
}));
