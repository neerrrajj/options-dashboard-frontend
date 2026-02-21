import { create } from 'zustand';

import { getISTToday, isBeforeMarketOpen } from '@/lib/utils';

type Mode = 'live' | 'historical';

interface GexFilterState {
  instrument: string;
  expiry: string;
  mode: Mode;
  date: string;
  isInitialized: boolean;
  setInstrument: (i: string) => void;
  setExpiry: (e: string) => void;
  setMode: (m: Mode) => void;
  setDate: (d: string) => void;
  setInitialized: (init: boolean) => void;
  initializeDefaults: (defaults: {
    instrument: string;
    expiry: string;
    date: string;
  }) => void;
}

const defaultMode = isBeforeMarketOpen() ? 'historical' : 'live';

export const useGexFilterStore = create<GexFilterState>((set, get) => ({
  instrument: 'NIFTY',
  expiry: '',
  mode: defaultMode,
  date: defaultMode === 'historical' ? '' : getISTToday(),
  isInitialized: false,
  
  setInstrument: (instrument) => {
    set({ instrument });
    set({ expiry: '' });
  },
  
  setExpiry: (expiry) => {
    set({ expiry })
  },

  setMode: (mode) => {
    set({ mode });
    
    if (mode === 'live') {
      set({ 
        date: getISTToday(),
        expiry: '',
        isInitialized: false
      });
    } else {
      set({ 
        date: '',
        expiry: '',
        isInitialized: false
      });
    }
  },
  
  setDate: (date) => {
    set({ date });
    const state = get();
    if (state.mode === 'historical') {
      set({ expiry: '' });
    }
  },
  setInitialized: (isInitialized) => set({ isInitialized }),
  
  initializeDefaults: (defaults) => {
    set({
      instrument: defaults.instrument,
      expiry: defaults.expiry,
      date: defaults.date,
      isInitialized: true
    });
  }
}));