'use client'

import useSWR from 'swr';

import { useGexFilterStore } from '@/store/gexFilterStore';
import { getISTToday, isMarketOpen } from '@/lib/utils';
import { fetchGreeksSummary } from '@/lib/api/greeks';

/**
 * Hook to fetch GEX summary data using GEX page filters.
 * This is similar to useGreeksSummary but uses gexFilterStore instead.
 */
export const useGexSummary = () => {
  const { instrument, expiry, date, mode, isInitialized } = useGexFilterStore();
  const effectiveDate = mode === 'live' ? getISTToday() : date;
  // Only poll during market hours AND when tab is visible
  const shouldPoll = mode === 'live' && isMarketOpen();
  
  const shouldFetch = isInitialized && instrument && expiry && (mode === 'live' || date);

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ['gex-summary', instrument, expiry, effectiveDate, mode] : null,
    () => fetchGreeksSummary({
      instrument,
      expiry,
      date: effectiveDate!,
      live: mode === 'live'
    }),
    {
      refreshInterval: shouldPoll ? 60000 : 0,
      revalidateOnFocus: true,
      refreshWhenHidden: false, // Stop polling when tab is hidden
    }
  );

  return {
    data: data || [],
    error,
    isLoading: isLoading || !isInitialized,
    refetch: mutate,
  };
};
