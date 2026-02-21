'use client'

import { useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { useDashboardFilterStore } from '@/store/dashboardFilterStore';

/**
 * Hook to sync dashboard filter state with URL query parameters.
 */
export const useDashboardUrlSync = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const {
    instrument,
    expiry,
    mode,
    date,
    isInitialized,
    setInstrument,
    setExpiry,
    setMode,
    setDate,
    setInitialized,
  } = useDashboardFilterStore();

  // Read URL params and update store on initial load (only once on mount)
  useEffect(() => {
    if (isInitialized) return;

    const modeParam = searchParams.get('mode') as 'live' | 'historical' | null;
    const instrumentParam = searchParams.get('instrument');
    const expiryParam = searchParams.get('expiry');
    const dateParam = searchParams.get('date');

    // Only set mode from URL if explicitly provided
    if (modeParam && ['live', 'historical'].includes(modeParam)) {
      setMode(modeParam);
      
      // Set date if in historical mode and date is provided
      if (modeParam === 'historical' && dateParam) {
        setDate(dateParam);
      }
    }

    // Set instrument if valid
    if (instrumentParam) {
      setInstrument(instrumentParam);
    }

    // Set expiry if provided
    if (expiryParam) {
      setExpiry(expiryParam);
    }

    setInitialized(true);
  }, []);

  // Update URL when state changes
  useEffect(() => {
    if (!isInitialized) return;

    const params = new URLSearchParams();
    
    if (mode) params.set('mode', mode);
    if (instrument) params.set('instrument', instrument);
    if (expiry) params.set('expiry', expiry);
    if (mode === 'historical' && date) params.set('date', date);

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [mode, instrument, expiry, date, isInitialized, router, pathname]);
};
