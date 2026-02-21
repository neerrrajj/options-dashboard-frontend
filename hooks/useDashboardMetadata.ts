'use client'

import useSWR from 'swr';
import { fetchGexMetadata } from '@/lib/api/gex';

export const useDashboardMetadata = ({
  instrument,
  live,
  date
}: {
  instrument?: string;
  live?: boolean;
  date?: string;
}) => {
  const { data, error, isLoading } = useSWR(
    ['dashboard-metadata', instrument, live ? '1' : '0', date || ''],
    () => fetchGexMetadata({ instrument, live, date }),
    {
      revalidateOnFocus: false,
      dedupingInterval: 30000,
    }
  );

  return {
    instruments: data?.instruments || [],
    expiries: data?.expiries || [],
    nearestExpiry: data?.nearest_expiry || '',
    availableDates: data?.available_dates || [],
    currentDate: data?.current_date || '',
    error,
    isLoading,
  };
};
