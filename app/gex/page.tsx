'use client'

import { useState } from "react";
import { GlobalFilters } from "./_components/gex-filters";
import { GexMetrics } from "./_components/gex-metrics";
import { TopStrikesTable } from "./_components/top-strikes-table";
import { GexChart } from "./_components/gex-chart";
import { TradingViewWidget } from "./_components/tv-widget";

const GexAnalysis = () => {
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* GEX Metrics */}
        <GexMetrics />
        
        {/* Top Strikes Table */}
        <TopStrikesTable />
      </div>

      {/* TradingView Chart */}
      <TradingViewWidget instrument={selectedInstrument} />

      {/* GEX Chart */}
      <GexChart />
    </div>
  );
};

export default GexAnalysis;