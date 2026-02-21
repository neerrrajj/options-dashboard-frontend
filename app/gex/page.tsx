'use client'

import { GexChart } from "./_components/gex-chart";
import { GexFilters } from "./_components/gex-filters";
import { useGexUrlSync } from "@/hooks/useUrlSync";
import { useGexFilterStore } from "@/store/gexFilterStore";

const GexAnalysis = () => {
  // Sync store with URL params
  useGexUrlSync();
  
  const { isInitialized } = useGexFilterStore();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-10 gap-4">
        <GexFilters/>
      </div>
      <GexChart />
    </div>
  );
};

export default GexAnalysis;