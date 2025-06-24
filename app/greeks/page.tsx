'use client'

import { useState } from "react";
import { GlobalFilters } from "./_components/greeks-filters";
import { GreeksMetrics } from "./_components/greeks-metrics";
import { GreeksChart } from "./_components/greeks-chart";
import { OTMSummaryTable } from "./_components/summary-table";

const GreeksAnalysis = () => {
  const [selectedInstrument, setSelectedInstrument] = useState("NIFTY");
  const [selectedExpiry, setSelectedExpiry] = useState("2024-01-25");
  const [timeRange, setTimeRange] = useState([540, 930]); // 9:00 AM to 3:30 PM
  const [isHistorical, setIsHistorical] = useState(false);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <GlobalFilters
        selectedInstrument={selectedInstrument}
        onInstrumentChange={setSelectedInstrument}
        selectedExpiry={selectedExpiry}
        onExpiryChange={setSelectedExpiry}
        timeRange={timeRange}
        onTimeRangeChange={setTimeRange}
        isHistorical={isHistorical}
        onHistoricalToggle={setIsHistorical}
      />

      {/* Greeks Metrics */}
      <GreeksMetrics />

      {/* Greeks Charts */}
      <GreeksChart />

      {/* OTM Summary Table */}
      <OTMSummaryTable />
    </div>
  );
};

export default GreeksAnalysis;