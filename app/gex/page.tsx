'use client'

import { Suspense } from "react";
import { GexChart } from "./_components/gex-chart";
import { GexFilters } from "./_components/gex-filters";
import { useGexUrlSync } from "@/hooks/useUrlSync";
import { useGexFilterStore } from "@/store/gexFilterStore";
import { useGexMetadata } from "@/hooks/useGexMetadata";
import { useGexAutoSwitch } from "@/hooks/useAutoSwitchToHistorical";

const GexAnalysisContent = () => {
  // Sync store with URL params
  useGexUrlSync();
  
  const { mode, instrument, date } = useGexFilterStore();
  
  // Fetch metadata to check if live data exists
  const { availableDates, isLoading } = useGexMetadata({
    instrument,
    live: mode === "live",
    date: mode === "historical" ? date : undefined
  });
  
  // Auto-switch to historical if no live data
  useGexAutoSwitch(availableDates, isLoading);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-10 gap-4">
        <GexFilters/>
      </div>
      <GexChart />
    </div>
  );
};

const GexAnalysis = () => {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6">Loading...</div>}>
      <GexAnalysisContent />
    </Suspense>
  );
};

export default GexAnalysis;