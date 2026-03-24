'use client'

import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { IntradayFilters } from "../_components/intraday-filters";
import { GexChart } from "../_components/gex-chart";
import { OtmGreeksChart } from "../_components/otm-greeks-chart";
import { useIntradayFilterStore } from "@/store/intradayFilterStore";
import { useIntradayMetadata } from "@/hooks/useIntradayMetadata";
import { useIntradayAutoSwitch } from "@/hooks/useIntradayAutoSwitch";
import { isHistoricalOnlyHours } from "@/lib/utils";

const IntradayContent = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const { mode, instrument, date, expiry, isInitialized, setMode, setDate, setInitialized } = useIntradayFilterStore();
  
  // Initial setup - check historical mode on mount
  useEffect(() => {
    if (isInitialized) return;
    
    // Check if we need to force historical mode
    const forceHistorical = isHistoricalOnlyHours();
    
    if (forceHistorical) {
      console.log('[Dashboard] Forcing historical mode - market closed');
      setMode('historical');
      setDate('');
    }
    
    setInitialized(true);
  }, [isInitialized, setMode, setDate, setInitialized]);
  
  // Fetch metadata to check if live data exists
  const { availableDates, isLoading } = useIntradayMetadata({
    instrument,
    live: mode === "live",
    date: mode === "historical" ? date : undefined
  });
  
  // Auto-switch to historical if no live data
  useIntradayAutoSwitch(availableDates, isLoading);

  // Sync URL with store state
  useEffect(() => {
    if (!isInitialized) return;
    
    const params = new URLSearchParams();
    
    if (mode) params.set('mode', mode);
    if (instrument) params.set('instrument', instrument);
    if (expiry) params.set('expiry', expiry);
    if (mode === 'historical' && date) params.set('date', date);

    const newUrl = `${pathname}?${params.toString()}`;
    router.replace(newUrl, { scroll: false });
  }, [mode, instrument, expiry, date, isInitialized, pathname, router]);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Unified Filters */}
      <IntradayFilters />
      
      {/* Charts */}
      <div className="space-y-6">
        {/* GEX Chart */}
        <GexChart />
        
        {/* OTM Greeks Chart */}
        <OtmGreeksChart />
      </div>
    </div>
  );
};

export default function IntradayPage() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6">Loading...</div>}>
      <IntradayContent />
    </Suspense>
  );
}
