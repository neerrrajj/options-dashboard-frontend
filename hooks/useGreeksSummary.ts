'use client'

import useSWR from 'swr';

import { fetchGreeksSummary } from '@/lib/api/greeks';
import { getISTToday, isMarketOpen } from '@/lib/utils';
import { useGreeksFilterStore } from '@/store/greeksFilterStore';

export const useGreeksSummary = () => {
  const { instrument, expiry, date, mode, isInitialized } = useGreeksFilterStore();
  
  // Only poll during market hours AND when tab is visible
  const shouldPoll = isMarketOpen() && mode === 'live';
  const pollingInterval = 60000; // 1 minute
  const effectiveDate = mode === 'live' ? getISTToday() : date;
  
  // Only fetch when all required params are available and initialized
  const shouldFetch = isInitialized && instrument && expiry && (mode === 'live' || date);
  
  const { data, error, isLoading, mutate } = useSWR(
    shouldFetch 
      ? ['greeks-summary', instrument, expiry, effectiveDate, mode]
      : null,
    () => fetchGreeksSummary({
      instrument,
      expiry,
      date: effectiveDate,
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

  // console.log('useGreeksSummary state:', {
  //   shouldFetch,
  //   isInitialized,
  //   instrument,
  //   expiry,
  //   date,
  //   effectiveDate,
  //   mode,
  //   shouldPoll,
  //   dataLength: data?.length || 0
  // });

  return { 
    data: data || [], 
    error, 
    isLoading: isLoading || !isInitialized,
    refetch: mutate 
  };
};
