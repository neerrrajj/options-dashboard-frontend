'use client'

import { useEffect } from "react";
import useSWR from "swr";

import { fetchDefaults } from "@/lib/api/greeks";
import { isBeforeMarketOpen } from "@/lib/utils";
import { useGreeksFilterStore } from "@/store/greeksFilterStore";

export const useAutoInitialize = () => {
  const { 
    mode, 
    isInitialized, 
    initializeDefaults 
  } = useGreeksFilterStore();

  // Get defaults based on current mode
  const effectiveMode = (mode === 'live' && isBeforeMarketOpen()) ? 'historical' : mode;

  const { data: defaults, isLoading: defaultsLoading } = useSWR(
    !isInitialized ? ['defaults', effectiveMode === 'live' ? '1' : '0'] : null,
    () => fetchDefaults({ live: effectiveMode === 'live' }),
    { 
      revalidateOnFocus: false,
      dedupingInterval: 30000
    }
  );

  useEffect(() => {
    if (!isInitialized && !defaultsLoading && defaults) {
      console.log('Auto-initializing with defaults:', defaults);
      initializeDefaults({
        instrument: defaults.instrument,
        expiry: defaults.expiry,
        date: defaults.date
      });
    }
  }, [isInitialized, defaultsLoading, defaults, initializeDefaults]);

  return { isInitialized };
};