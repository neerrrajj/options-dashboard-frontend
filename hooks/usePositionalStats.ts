'use client'

import useSWR from 'swr';
import { fetchPositionalStats, type StatsRequest, type StatsResponse } from '@/lib/api/positional';

export const usePositionalStats = (params: StatsRequest | null) => {
  const { data, error, isLoading } = useSWR(
    params ? ['positional-stats-v2', params] : null,  // Changed key to invalidate cache
    () => fetchPositionalStats(params!),
    {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
    }
  );

  return {
    data,
    error,
    isLoading,
  };
};
