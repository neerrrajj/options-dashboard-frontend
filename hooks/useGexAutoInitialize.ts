'use client'

import { useEffect } from "react";
import useSWR from "swr";

import { isBeforeMarketOpen } from "@/lib/utils";
import { fetchGexDefaults } from "@/lib/api/gex";
import { useGexFilterStore } from "@/store/gexFilterStore";

export const useGexAutoInitialize = () => {
  const { 
    mode, 
    isInitialized, 
    initializeDefaults 
  } = useGexFilterStore();

  // Get defaults based on current mode
  const effectiveMode = (mode === 'live' && isBeforeMarketOpen()) ? 'historical' : mode;

  const { data: defaults, isLoading: defaultsLoading } = useSWR(
    !isInitialized ? ['defaults', effectiveMode === 'live' ? '1' : '0'] : null,
    () => fetchGexDefaults({ live: effectiveMode === 'live' }),
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