'use client'

import { useGreeksUrlSync } from "@/hooks/useUrlSync";
import { GreeksFilters } from "./_components/greeks-filters";
import { GreeksMetrics } from "./_components/greeks-metrics";
import { GreeksChart } from "./_components/greeks-chart";
import { useGreeksFilterStore } from "@/store/greeksFilterStore";

const GreeksAnalysis = () => {
  // Sync store with URL params
  useGreeksUrlSync();
  
  const { isInitialized } = useGreeksFilterStore();

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

export default GreeksAnalysis;