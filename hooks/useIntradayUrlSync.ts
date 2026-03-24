'use client'

import { useEffect, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { useIntradayFilterStore } from '@/store/intradayFilterStore';
import { isHistoricalOnlyHours } from '@/lib/utils';

/**
 * Hook to sync dashboard filter state with URL query parameters.
 */
export const useIntradayUrlSync = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialSyncDone = useRef(false);
  
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
  } = useIntradayFilterStore();

  // Read URL params and update store on initial load (only once on mount)
  useEffect(() => {
    if (initialSyncDone.current) return;
    initialSyncDone.current = true;

    const modeParam = searchParams.get('mode') as 'live' | 'historical' | null;
    const instrumentParam = searchParams.get('instrument');
    const expiryParam = searchParams.get('expiry');
    const dateParam = searchParams.get('date');

    // On weekends/holidays/before 9 AM, force historical mode regardless of URL
    const forceHistorical = isHistoricalOnlyHours();
    
    if (forceHistorical) {
      // Always use historical mode during historical-only hours
      setMode('historical');
      // Clear date so auto-select picks latest available
      setDate('');
    } else if (modeParam && ['live', 'historical'].includes(modeParam)) {
      // Only set mode from URL if NOT in historical-only hours
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

  // Update URL when state changes (but not during initial load)
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
