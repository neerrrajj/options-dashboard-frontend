'use client'

import { Suspense } from "react";
import { useGreeksUrlSync } from "@/hooks/useUrlSync";
import { GreeksFilters } from "./_components/greeks-filters";
import { GreeksMetrics } from "./_components/greeks-metrics";
import { GreeksChart } from "./_components/greeks-chart";
import { useGreeksFilterStore } from "@/store/greeksFilterStore";
import { useGreeksMetadata } from "@/hooks/useGreeksMetadata";
import { useGreeksAutoSwitch } from "@/hooks/useAutoSwitchToHistorical";

const GreeksAnalysisContent = () => {
  // Sync store with URL params
  useGreeksUrlSync();
  
  const { mode, instrument, date } = useGreeksFilterStore();
  
  // Fetch metadata to check if live data exists
  const { availableDates, isLoading } = useGreeksMetadata({
    instrument,
    live: mode === "live",
    date: mode === "historical" ? date : undefined
  });
  
  // Auto-switch to historical if no live data
  useGreeksAutoSwitch(availableDates, isLoading);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-10 gap-4">
        <GreeksFilters/>
        <GreeksMetrics />
      </div>
      <GreeksChart />
    </div>
  );
};

const GreeksAnalysis = () => {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6">Loading...</div>}>
      <GreeksAnalysisContent />
    </Suspense>
  );
};

export default GreeksAnalysis;