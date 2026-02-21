'use client'

import useSWR from 'swr';

import { useDashboardFilterStore } from '@/store/dashboardFilterStore';
import { getISTToday, isMarketOpen } from '@/lib/utils';
import { fetchAvailableTimestamps } from '@/lib/api/gex';

/**
 * Hook to fetch available timestamps for the dashboard.
 */
export const useDashboardTimestamps = () => {
  const { instrument, expiry, date, mode, isInitialized } = useDashboardFilterStore();
  const effectiveDate = mode === 'live' ? getISTToday() : date;
  
  const shouldFetch = isInitialized && instrument && expiry && (mode === 'live' || date);
  
  const shouldPoll = isMarketOpen() && mode === 'live';
  
  const { data, error, isLoading } = useSWR(
    shouldFetch ? ['dashboard-timestamps', instrument, expiry, effectiveDate, mode] : null,
    () => fetchAvailableTimestamps({
      instrument,
      expiry,
      date: effectiveDate,
      live: mode === 'live'
    }),
    {
      refreshInterval: shouldPoll ? 60000 : 0,
      revalidateOnFocus: true,
      refreshWhenHidden: false,
    }
  );

  return {
    timestamps: data?.timestamps || [],
    latestTimestamp: data?.latest_timestamp,
    error,
    isLoading: isLoading || !isInitialized,
  };
};
