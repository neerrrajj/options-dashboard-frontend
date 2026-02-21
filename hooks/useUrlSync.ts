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

  // Read URL params and update store on initial load (only once on mount)
  useEffect(() => {
    if (isInitialized) return; // Only run once

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
    // If no mode in URL, keep store default (don't override)

    // Set instrument if valid
    if (instrumentParam) {
      setInstrument(instrumentParam);
    }

    // Set expiry if provided
    if (expiryParam) {
      setExpiry(expiryParam);
    }

    setInitialized(true);
  }, []); // Empty deps - only run once on mount

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
      
      if (modeParam === 'historical' && dateParam) {
        setDate(dateParam);
      }
    }
    // If no mode in URL, keep store default (don't override)

    if (instrumentParam) {
      setInstrument(instrumentParam);
    }

    if (expiryParam) {
      setExpiry(expiryParam);
    }

    setInitialized(true);
  }, []); // Empty deps - only run once on mount

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
