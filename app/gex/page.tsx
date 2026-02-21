'use client'

import { GreeksMetrics } from "../greeks/_components/greeks-metrics";
import { GexChart } from "./_components/gex-chart";
import { GexFilters } from "./_components/gex-filters";
import { useGexAutoInitialize } from "@/hooks/useGexAutoInitialize";
import { GexMetrics } from "./_components/gex-metrics";
import { useGreeksAutoInitialize } from "@/hooks/useGreeksAutoInitialize";
import { NetGexChart } from "./_components/net-gex-chart";

const GexAnalysis = () => {

  const { isInitialized } = useGexAutoInitialize();
  const { isInitialized: isGreeksInitialized } = useGreeksAutoInitialize();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="grid grid-cols-10 gap-4">
        <GexFilters/>
        {/* <NetGexChart /> */}
      </div>
      <GexChart />
    </div>
  );
};

export default GexAnalysis;