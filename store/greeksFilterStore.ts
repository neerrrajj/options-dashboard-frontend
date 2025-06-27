import { create } from 'zustand';

import { isBeforeMarketOpen } from '@/lib/utils';

type Mode = 'live' | 'historical';

interface GreeksFilterState {
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

function getISTToday(): string {
  return new Date(Date.now()).toISOString().slice(0, 10);
}

export const useGreeksFilterStore = create<GreeksFilterState>((set, get) => ({
  instrument: 'NIFTY',
  expiry: '',
  mode: isBeforeMarketOpen() ? 'historical' : 'live',
  date: getISTToday(),
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