'use client'

import { useEffect } from 'react';
import { useGexFilterStore } from '@/store/gexFilterStore';
import { useGreeksFilterStore } from '@/store/greeksFilterStore';

/**
 * Hook to auto-switch to historical mode when live mode has no data.
 * This handles the case where user reloads page on a day with no trading data.
 */
export const useGexAutoSwitch = (availableDates: string[], isLoading: boolean) => {
  const { mode, setMode, setDate, isInitialized } = useGexFilterStore();

  useEffect(() => {
    if (!isInitialized || isLoading) return;
    
    // If in live mode but no data available today, switch to historical
    if (mode === 'live' && availableDates.length === 0) {
      console.log('[AutoSwitch] No live data available, switching to historical');
      setMode('historical');
    }
  }, [mode, availableDates, isLoading, isInitialized, setMode, setDate]);
};

export const useGreeksAutoSwitch = (availableDates: string[], isLoading: boolean) => {
  const { mode, setMode, isInitialized } = useGreeksFilterStore();

  useEffect(() => {
    if (!isInitialized || isLoading) return;
    
    if (mode === 'live' && availableDates.length === 0) {
      console.log('[AutoSwitch] No live data available, switching to historical');
      setMode('historical');
    }
  }, [mode, availableDates, isLoading, isInitialized, setMode]);
};
