'use client'

import { useAutoInitialize } from "@/hooks/useGreeksAutoInitialize";
import { GreeksFilters } from "./_components/greeks-filters";
import { GreeksMetrics } from "./_components/greeks-metrics";
import { GreeksChart } from "./_components/greeks-chart";

const GreeksAnalysis = () => {

  const { isInitialized } = useAutoInitialize();

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