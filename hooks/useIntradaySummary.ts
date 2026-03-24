'use client'

import useSWR from 'swr';

import { useIntradayFilterStore } from '@/store/intradayFilterStore';
import { getISTToday, isMarketOpen } from '@/lib/utils';
import { fetchGreeksSummary } from '@/lib/api/greeks';

/**
 * Hook to fetch summary data for the dashboard.
 */
export const useIntradaySummary = () => {
  const { instrument, expiry, date, mode, isInitialized } = useIntradayFilterStore();
  const effectiveDate = mode === 'live' ? getISTToday() : date;
  const shouldPoll = mode === 'live' && isMarketOpen();
  
  const shouldFetch = isInitialized && instrument && expiry && (mode === 'live' || date);

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch ? ['dashboard-summary', instrument, expiry, effectiveDate, mode] : null,
    () => fetchGreeksSummary({
      instrument,
      expiry,
      date: effectiveDate!,
      live: mode === 'live'
    }),
    {
      refreshInterval: shouldPoll ? 60000 : 0,
      revalidateOnFocus: true,
      refreshWhenHidden: false,
    }
  );

  return {
    data: data || [],
    error,
    isLoading: isLoading || !isInitialized,
    refetch: mutate,
  };
};
