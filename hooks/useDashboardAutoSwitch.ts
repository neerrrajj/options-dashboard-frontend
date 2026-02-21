'use client'

import { useEffect } from 'react';
import { useDashboardFilterStore } from '@/store/dashboardFilterStore';
import { isHistoricalOnlyHours, isWithinISTHours } from '@/lib/utils';

/**
 * Hook to auto-switch to historical mode when:
 * 1. During historical-only hours (before 9:00 AM, weekends, holidays)
 * 2. After market hours (3:30 PM+) when no live data exists
 * 
 * Note: During market hours (9:15 AM - 3:30 PM), always stay in live mode by default
 * even if no data exists yet (user can manually switch to historical if needed).
 */
export const useDashboardAutoSwitch = (availableDates: string[], isLoading: boolean) => {
  const { mode, setMode, setDate, isInitialized } = useDashboardFilterStore();

  useEffect(() => {
    if (!isInitialized || isLoading) return;
    
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
