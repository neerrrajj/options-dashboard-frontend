'use client'

import useSWR from 'swr';

import { useGexFilterStore } from '@/store/gexFilterStore';
import { getISTToday, isWithinISTHours } from '@/lib/utils';
import { fetchAvailableTimestamps, fetchGexData } from '@/lib/api/gex';

/**
 * Hook to fetch ALL data for a full day.
 * Used by the slider - fetches once, then client filters by timestamp.
 * This prevents API calls on every slider movement.
 */
export const useGexDayData = () => {
  const { instrument, expiry, date, mode, isInitialized } = useGexFilterStore();
  const istMarketHours = isWithinISTHours('09:15', '15:30');
  const istLiveWindow = isWithinISTHours('09:15', '23:30');
  const shouldPoll = istMarketHours && mode === 'live';
  const pollingInterval = 60000;
  const effectiveDate = mode === 'live' ? getISTToday() : date;
  
  const shouldFetch = isInitialized && instrument && expiry && (mode === 'live' || date);

  // Build full day time range (9:15 AM to 3:30 PM IST)
  const startTime = effectiveDate ? `${effectiveDate}T09:15:00` : null;
  const endTime = effectiveDate ? `${effectiveDate}T15:30:00` : null;

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch && startTime && endTime
      ? ['gex-day-data', instrument, expiry, effectiveDate, mode]
      : null,
    () => fetchGexData({
      instrument,
      expiry,
      start_time: startTime!,
      end_time: endTime!,
      live: mode === 'live' ? istLiveWindow : false
    }),
    {
      refreshInterval: shouldPoll ? pollingInterval : 0,
      revalidateOnFocus: true,
      dedupingInterval: 5000, // 5 second dedupe
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

// useAvailableTimestamps is exported from useGexData.ts to avoid duplication
