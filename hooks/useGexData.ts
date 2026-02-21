'use client'

import useSWR from 'swr';

import { useGexFilterStore } from '@/store/gexFilterStore';
import { getISTToday, isWithinISTHours } from '@/lib/utils';
import { fetchAvailableTimestamps, fetchGexData } from '@/lib/api/gex';

export const useGexData = (timeRange?: { start: string; end: string }) => {
  const { instrument, expiry, date, mode, isInitialized } = useGexFilterStore();
  const istMarketHours = isWithinISTHours('09:15', '15:30');
  const istLiveWindow = isWithinISTHours('09:15', '23:30');
  const shouldPoll = istMarketHours && mode === 'live' && !timeRange;
  const pollingInterval = 60000;
  const effectiveDate = mode === 'live' ? getISTToday() : date;
  
  const shouldFetch = isInitialized && instrument && expiry && (mode === 'live' || date);

  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch && timeRange
      ? ['gex-data', instrument, expiry, effectiveDate, mode, timeRange.start, timeRange.end]
      : null,
    () => fetchGexData({
      instrument,
      expiry,
      start_time: timeRange!.start,
      end_time: timeRange!.end,
      live: mode === 'live' ? istLiveWindow : false
    }),
    {
      refreshInterval: shouldPoll ? pollingInterval : 0,
      revalidateOnFocus: true,
      dedupingInterval: 0,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    data: data || [],
    error,
    isLoading: isLoading || !isInitialized,
    refetch: mutate,
    timeRange
  };
};

export const useAvailableTimestamps = () => {
  const { instrument, expiry, date, mode, isInitialized } = useGexFilterStore();
  const effectiveDate = mode === 'live' ? getISTToday() : date;
  
  const shouldFetch = isInitialized && instrument && expiry && (mode === 'live' || date);
  
  const { data, error, isLoading } = useSWR(
    shouldFetch ? ['available-timestamps', instrument, expiry, effectiveDate, mode] : null,
    () => fetchAvailableTimestamps({
      instrument,
      expiry,
      date: effectiveDate,
      live: mode === 'live'
    }),
    {
      refreshInterval: mode === 'live' ? 60000 : 0,
      revalidateOnFocus: true,
    }
  );

  return {
    timestamps: data?.timestamps || [],
    latestTimestamp: data?.latest_timestamp,
    error,
    isLoading: isLoading || !isInitialized,
  };
};