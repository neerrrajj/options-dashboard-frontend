'use client'

import { useEffect } from 'react';
import { useIntradayFilterStore } from '@/store/intradayFilterStore';
import { isHistoricalOnlyHours, isWithinISTHours } from '@/lib/utils';

const IS_OPERATIONAL = process.env.NEXT_PUBLIC_OPERATIONAL === 'true';

/**
 * Hook to auto-switch to historical mode when:
 * 1. System is not operational (live API not available)
 * 2. During historical-only hours (before 9:00 AM, weekends, holidays)
 * 3. After market hours (3:30 PM+) when no live data exists
 * 
 * Note: During market hours (9:15 AM - 3:30 PM), always stay in live mode by default
 * even if no data exists yet (user can manually switch to historical if needed).
 */
export const useIntradayAutoSwitch = (availableDates: string[], isLoading: boolean) => {
  const { mode, setMode, setDate, isInitialized } = useIntradayFilterStore();

  useEffect(() => {
    if (!isInitialized || isLoading) return;
    
    // Force historical mode when system is not operational
    if (!IS_OPERATIONAL && mode === 'live') {
      console.log('[DashboardAutoSwitch] System not operational, switching to historical mode');
      setMode('historical');
      setDate('');
      return;
    }
    
    // Force historical mode during historical-only hours (before 9:00 AM, weekends, holidays)
    if (isHistoricalOnlyHours() && mode === 'live') {
      console.log('[DashboardAutoSwitch] Historical-only hours, switching to historical mode');
      setMode('historical');
      setDate('');
      return;
    }
    
    // After market hours (3:30 PM+): if no live data, switch to historical
    // During market hours: stay in live even if no data (user can manually switch)
    const isAfterMarket = !isWithinISTHours("09:15", "15:30") && !isHistoricalOnlyHours();
    
    if (mode === 'live' && availableDates.length === 0 && isAfterMarket) {
      console.log('[DashboardAutoSwitch] After market hours with no data, switching to historical');
      setMode('historical');
      setDate('');
    }
  }, [mode, availableDates, isLoading, isInitialized, setMode, setDate]);
};
