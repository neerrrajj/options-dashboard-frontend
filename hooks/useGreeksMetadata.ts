'use client'

import useSWR from 'swr';
import { fetchMetadata } from '@/lib/api/greeks';

export const useGreeksMetadata = ({
  instrument,
  live,
  date
}: {
  instrument?: string;
  live?: boolean;
  date?: string;
}) => {
  const { data, error, isLoading } = useSWR(
    ['greeks-metadata', instrument, live ? '1' : '0', date || ''],
    () => fetchMetadata({ instrument, live, date }),
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
