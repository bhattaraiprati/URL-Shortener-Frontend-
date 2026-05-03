import { create } from 'zustand';
import { UrlData } from '../types';

interface UrlStore {
  selectedUrl: UrlData | null;
  error: string | null;
  
  setSelectedUrl: (url: UrlData | null) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}

export const useUrlStore = create<UrlStore>((set) => ({
  selectedUrl: null,
  error: null,

  setSelectedUrl: (url: UrlData | null) => {
    set({ selectedUrl: url });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => set({ error: null }),
}));