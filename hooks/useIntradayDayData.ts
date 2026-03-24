'use client'

import useSWR from 'swr';

import { useIntradayFilterStore } from '@/store/intradayFilterStore';
import { getISTToday, isMarketOpen } from '@/lib/utils';
import { fetchGexData } from '@/lib/api/gex';

/**
 * Hook to fetch ALL data for a full day.
 * Used by the slider - fetches once, then client filters by timestamp.
 */
export const useIntradayDayData = () => {
  const { instrument, expiry, date, mode, isInitialized } = useIntradayFilterStore();
  const shouldPoll = isMarketOpen() && mode === 'live';
  const pollingInterval = 60000;
  const effectiveDate = mode === 'live' ? getISTToday() : date;
  
  const shouldFetch = isInitialized && instrument && expiry && (mode === 'live' || date);

  const startTime = effectiveDate ? `${effectiveDate}T09:15:00` : null;
  const endTime = effectiveDate ? `${effectiveDate}T15:30:00` : null;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch && startTime && endTime
      ? ['dashboard-day-data', instrument, expiry, effectiveDate, mode]
      : null,
    () => fetchGexData({
      instrument,
      expiry,
      start_time: startTime!,
      end_time: endTime!,
      live: mode === 'live'
    }),
    {
      refreshInterval: shouldPoll ? pollingInterval : 0,
      revalidateOnFocus: true,
      refreshWhenHidden: false,
      dedupingInterval: 5000,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    data: data || [],
    error,
    isLoading: isLoading || !isInitialized,
    refetch: mutate,
  };
};
