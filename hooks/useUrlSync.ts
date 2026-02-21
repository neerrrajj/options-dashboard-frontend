'use client'

import { useEffect, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';

import { useGexFilterStore } from '@/store/gexFilterStore';
import { useGreeksFilterStore } from '@/store/greeksFilterStore';
import { getISTToday, isBeforeMarketOpen } from '@/lib/utils';

/**
 * Hook to sync filter state with URL query parameters.
 * This enables:
 * - Sharing URLs with specific filters
 * - Bookmarking specific views
 * - Preserving state on page reload
 */
export const useGexUrlSync = () => {
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
  } = useGexFilterStore();

  // Read URL params and update store on initial load
  useEffect(() => {
    if (isInitialized) return; // Only run once

    const modeParam = searchParams.get('mode') as 'live' | 'historical' | null;
    const instrumentParam = searchParams.get('instrument');
    const expiryParam = searchParams.get('expiry');
    const dateParam = searchParams.get('date');

    // Determine mode
    let targetMode: 'live' | 'historical';
    if (modeParam && ['live', 'historical'].includes(modeParam)) {
      targetMode = modeParam;
    } else {
      targetMode = isBeforeMarketOpen() ? 'historical' : 'live';
    }

    // Set mode first
    setMode(targetMode);

    // Set instrument if valid
    if (instrumentParam) {
      setInstrument(instrumentParam);
    }

    // Set date if in historical mode and date is provided
    if (targetMode === 'historical' && dateParam) {
      setDate(dateParam);
    } else if (targetMode === 'live') {
      setDate(getISTToday());
    }

    // Set expiry if provided
    if (expiryParam) {
      setExpiry(expiryParam);
    }

    setInitialized(true);
  }, [searchParams, isInitialized, setInstrument, setExpiry, setMode, setDate, setInitialized]);

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

/**
 * Hook to sync Greeks filter state with URL query parameters.
 */
export const useGreeksUrlSync = () => {
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
  } = useGreeksFilterStore();

  // Read URL params and update store on initial load
  useEffect(() => {
    if (isInitialized) return;

    const modeParam = searchParams.get('mode') as 'live' | 'historical' | null;
    const instrumentParam = searchParams.get('instrument');
    const expiryParam = searchParams.get('expiry');
    const dateParam = searchParams.get('date');

    let targetMode: 'live' | 'historical';
    if (modeParam && ['live', 'historical'].includes(modeParam)) {
      targetMode = modeParam;
    } else {
      targetMode = isBeforeMarketOpen() ? 'historical' : 'live';
    }

    setMode(targetMode);

    if (instrumentParam) {
      setInstrument(instrumentParam);
    }

    if (targetMode === 'historical' && dateParam) {
      setDate(dateParam);
    } else if (targetMode === 'live') {
      setDate(getISTToday());
    }

    if (expiryParam) {
      setExpiry(expiryParam);
    }

    setInitialized(true);
  }, [searchParams, isInitialized, setInstrument, setExpiry, setMode, setDate, setInitialized]);

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
