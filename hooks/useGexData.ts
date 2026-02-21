'use client'

import useSWR from 'swr';

import { useGexFilterStore } from '@/store/gexFilterStore';
import { getISTToday, isMarketOpen } from '@/lib/utils';
import { fetchAvailableTimestamps, fetchGexData } from '@/lib/api/gex';

export const useGexData = (timeRange?: { start: string; end: string }) => {
  const { instrument, expiry, date, mode, isInitialized } = useGexFilterStore();
  // Only poll during market hours AND when tab is visible
  const shouldPoll = isMarketOpen() && mode === 'live' && !timeRange;
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
      live: mode === 'live'
    }),
    {
      refreshInterval: shouldPoll ? pollingInterval : 0,
      revalidateOnFocus: true,
      refreshWhenHidden: false, // Stop polling when tab is hidden
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
    timeRange
  };
};

export const useAvailableTimestamps = () => {
  const { instrument, expiry, date, mode, isInitialized } = useGexFilterStore();
  const effectiveDate = mode === 'live' ? getISTToday() : date;
  
  const shouldFetch = isInitialized && instrument && expiry && (mode === 'live' || date);
  
  // Only poll during market hours
  const shouldPoll = isMarketOpen() && mode === 'live';
  
  const { data, error, isLoading } = useSWR(
    shouldFetch ? ['available-timestamps', instrument, expiry, effectiveDate, mode] : null,
    () => fetchAvailableTimestamps({
      instrument,
      expiry,
      date: effectiveDate,
      live: mode === 'live'
    }),
    {
      refreshInterval: shouldPoll ? 60000 : 0,
      revalidateOnFocus: true,
      refreshWhenHidden: false, // Stop polling when tab is hidden
    }
  );

  return {
    timestamps: data?.timestamps || [],
    latestTimestamp: data?.latest_timestamp,
    error,
    isLoading: isLoading || !isInitialized,
  };
};