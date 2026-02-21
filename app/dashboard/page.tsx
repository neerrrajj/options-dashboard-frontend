'use client'

import { Suspense } from "react";
import { DashboardFilters } from "./_components/dashboard-filters";
import { GexChart } from "./_components/gex-chart";
import { OtmGreeksChart } from "./_components/otm-greeks-chart";
import { useDashboardFilterStore } from "@/store/dashboardFilterStore";
import { useDashboardMetadata } from "@/hooks/useDashboardMetadata";
import { useDashboardAutoSwitch } from "@/hooks/useDashboardAutoSwitch";
import { useDashboardUrlSync } from "@/hooks/useDashboardUrlSync";

const DashboardContent = () => {
  // Sync store with URL params
  useDashboardUrlSync();
  
  const { mode, instrument, date } = useDashboardFilterStore();
  
  // Fetch metadata to check if live data exists
  const { availableDates, isLoading } = useDashboardMetadata({
    instrument,
    live: mode === "live",
    date: mode === "historical" ? date : undefined
  });
  
  // Auto-switch to historical if no live data
  useDashboardAutoSwitch(availableDates, isLoading);

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Unified Filters */}
      <DashboardFilters />
      
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

const Dashboard = () => {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6">Loading...</div>}>
      <DashboardContent />
    </Suspense>
  );
};

export default Dashboard;
