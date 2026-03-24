'use client';

import { Suspense } from 'react';
import { PositionalFilters } from './positional-filters';
import { StatRangeCard } from './stat-range-card';
import { usePositionalStats } from '@/hooks/usePositionalStats';
import { usePositionalFilterStore } from '@/store/positionalFilterStore';

function PositionalDashboardContent() {
  const {
    instrument,
    startDate,
    endDate,
    frequency,
    weekStartDay,
    monthStartDay,
    metricType,
    valueMode,
  } = usePositionalFilterStore();

  const { data, isLoading } = usePositionalStats({
    symbol: instrument,
    start_date: startDate,
    end_date: endDate,
    frequency: frequency,
    week_start_day: weekStartDay,
    month_start_day: monthStartDay,
  });

  const unit = valueMode === 'points' ? 'points' : 'percentage';

  // Safety check for data structure
  const hasValidData = data && 
    data.range && 
    data.range.total_range && 
    data.range.body_range &&
    data.net_change &&
    data.net_change.from_prev_close &&
    data.net_change.from_open &&
    data.gaps &&
    data.gaps.gap_up &&
    data.gaps.gap_down;

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <PositionalFilters />

      {/* Range Metric - 2 cards */}
      {metricType === 'range' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatRangeCard
            title="Total Range"
            subtitle="High - Low"
            description="The total distance between the day's highest and lowest prices. Represents the full volatility of the day."
            stats={data?.range?.total_range?.[unit]}
            unit={unit}
            color="neutral"
            icon="📊"
            isLoading={isLoading}
          />
          <StatRangeCard
            title="Body Range"
            subtitle="|Close - Open|"
            description="The distance between open and close prices. Shows how much the price moved directionally, ignoring intraday swings."
            stats={data?.range?.body_range?.[unit]}
            unit={unit}
            color="neutral"
            icon="🕯️"
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Net Change Metric - 2 cards */}
      {metricType === 'net_change' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatRangeCard
            title="Net Change from Prev Close"
            subtitle="Close - Previous Close"
            description="How much the price changed from yesterday's close to today's close. Shows the overnight directional move."
            stats={data?.net_change?.from_prev_close?.[unit]}
            unit={unit}
            color="neutral"
            icon="📈"
            isLoading={isLoading}
          />
          <StatRangeCard
            title="Net Change from Open"
            subtitle="Close - Open"
            description="How much the price moved from today's open to close. Shows intraday directional movement."
            stats={data?.net_change?.from_open?.[unit]}
            unit={unit}
            color="neutral"
            icon="📉"
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Gaps Metric - 2 cards */}
      {metricType === 'gaps' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatRangeCard
            title="Gap Up"
            subtitle="Overnight positive gaps"
            description="How much the price opened above yesterday's close. Positive gaps often indicate bullish sentiment."
            stats={data?.gaps?.gap_up?.[unit]}
            unit={unit}
            color="positive"
            icon="🚀"
            isLoading={isLoading}
          />
          <StatRangeCard
            title="Gap Down"
            subtitle="Overnight negative gaps"
            description="How much the price opened below yesterday's close. Negative gaps often indicate bearish sentiment."
            stats={data?.gaps?.gap_down?.[unit]}
            unit={unit}
            color="negative"
            icon="🔻"
            isLoading={isLoading}
          />
        </div>
      )}

      {/* Summary Stats */}
      {/* {!isLoading && data?.metadata && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold font-sans tabular-nums">{data.metadata.total_candles}</p>
            <p className="text-xs text-muted-foreground font-sans">Total Days</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-emerald-500 font-sans tabular-nums">{data.metadata.gap_up_candles}</p>
            <p className="text-xs text-muted-foreground font-sans">Gap Up Days</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold text-red-500 font-sans tabular-nums">{data.metadata.gap_down_candles}</p>
            <p className="text-xs text-muted-foreground font-sans">Gap Down Days</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold font-sans tabular-nums">{data.metadata.no_gap_candles}</p>
            <p className="text-xs text-muted-foreground font-sans">No Gap Days</p>
          </div>
        </div>
      )} */}

      {/* Loading state for summary stats */}
      {/* {isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-muted/30 rounded-lg p-4 text-center">
              <div className="h-8 w-16 mx-auto mb-2 bg-muted rounded" />
              <div className="h-3 w-20 mx-auto bg-muted rounded" />
            </div>
          ))}
        </div>
      )} */}
    </div>
  );
}

export function PositionalContent() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-6">Loading...</div>}>
      <PositionalDashboardContent />
    </Suspense>
  );
}
