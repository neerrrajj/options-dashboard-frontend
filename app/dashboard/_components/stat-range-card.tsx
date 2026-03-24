'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { MetricStats } from '@/lib/api/positional';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Info } from 'lucide-react';

interface StatRangeCardProps {
  title: string;
  subtitle?: string;
  description?: string;
  stats?: MetricStats;
  unit?: 'points' | 'percentage';
  color?: 'neutral' | 'positive' | 'negative';
  icon?: string;
  isLoading?: boolean;
}

// Explanations for what std dev means for traders
const stdExplanations: Record<string, string> = {
  '68': 'About 2 out of 3 days fall in this range. This is your typical day.',
  '95': 'About 19 out of 20 days fall in this range. Unusual but happens.',
  '99': 'Almost all days (99.7%). Only extreme outliers go beyond this.',
};

// Color classes
const colorClasses = {
  neutral: {
    bar68: 'bg-blue-500',
    bar95: 'bg-blue-400/50',
    bar99: 'bg-blue-300/30',
    text: 'text-blue-500',
    border: 'border-blue-500/30',
    bg: 'bg-blue-500/5',
  },
  positive: {
    bar68: 'bg-emerald-500',
    bar95: 'bg-emerald-400/50',
    bar99: 'bg-emerald-300/30',
    text: 'text-emerald-500',
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-500/5',
  },
  negative: {
    bar68: 'bg-red-500',
    bar95: 'bg-red-400/50',
    bar99: 'bg-red-300/30',
    text: 'text-red-500',
    border: 'border-red-500/30',
    bg: 'bg-red-500/5',
  },
};

export function StatRangeCard({
  title,
  subtitle,
  description,
  stats,
  unit = 'points',
  color = 'neutral',
  icon = '📊',
  isLoading = false,
}: StatRangeCardProps) {
  const unitLabel = unit === 'points' ? 'pts' : '%';
  const colors = colorClasses[color];

  const formatNum = (num: number) => {
    if (unit === 'percentage') return num.toFixed(2);
    return num.toFixed(1);
  };

  // Loading skeleton
  if (isLoading || !stats) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
            <Skeleton className="h-8 w-8 rounded-full" />
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bar skeleton */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          {/* Legend skeleton */}
          <div className="grid grid-cols-3 gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 rounded-lg border border-muted">
                <Skeleton className="h-5 w-full mb-2" />
                <Skeleton className="h-3 w-16 mb-1" />
                <Skeleton className="h-8 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate positions for the bar visualization (0-100%)
  const range = stats.max - stats.min;
  const getPosition = (value: number) => (range > 0 ? ((value - stats.min) / range) * 100 : 50);

  const positions = {
    range99Lower: getPosition(stats.range_99_lower),
    range99Upper: getPosition(stats.range_99_upper),
    range95Lower: getPosition(stats.range_95_lower),
    range95Upper: getPosition(stats.range_95_upper),
    range68Lower: getPosition(stats.range_68_lower),
    range68Upper: getPosition(stats.range_68_upper),
    avg: getPosition(stats.avg),
  };

  // Legend items data
  const legendItems = [
    {
      label: '68',
      lower: stats.range_68_lower,
      upper: stats.range_68_upper,
      barClass: colors.bar68,
    },
    {
      label: '95',
      lower: stats.range_95_lower,
      upper: stats.range_95_upper,
      barClass: colors.bar95,
    },
    {
      label: '99',
      lower: stats.range_99_lower,
      upper: stats.range_99_upper,
      barClass: colors.bar99,
    },
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2 font-sans">
              <span>{icon}</span>
              <span>{title}</span>
            </CardTitle>
            {subtitle && <p className="text-sm text-muted-foreground mt-1 font-sans">{subtitle}</p>}
          </div>
          {description && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
                    <Info className="h-4 w-4 text-muted-foreground" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="left" className="max-w-xs font-sans">
                  <p>{description}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Range Bar with nested levels */}
        <div className="space-y-1">
          {/* Min & Max values */}
          <div className="flex justify-between text-xs text-muted-foreground font-sans tabular-nums">
            <span>{formatNum(stats.min)}</span>
            <span>{formatNum(stats.max)}</span>
          </div>

          {/* The Nested Bar */}
          <div className="relative h-10 bg-muted/30 rounded-md overflow-hidden">
            {/* 99% range (outermost) */}
            <div
              className={cn("absolute h-full", colors.bar99)}
              style={{
                left: `${positions.range99Lower}%`,
                width: `${positions.range99Upper - positions.range99Lower}%`,
              }}
            />
            {/* 95% range (middle) */}
            <div
              className={cn("absolute h-full", colors.bar95)}
              style={{
                left: `${positions.range95Lower}%`,
                width: `${positions.range95Upper - positions.range95Lower}%`,
              }}
            />
            {/* 68% range (innermost - solid) */}
            <div
              className={cn("absolute h-full", colors.bar68)}
              style={{
                left: `${positions.range68Lower}%`,
                width: `${positions.range68Upper - positions.range68Lower}%`,
              }}
            />
            {/* Average marker with value above and label below */}
            <div
              className="absolute top-0 bottom-0 w-0.5 bg-white z-10"
              style={{ left: `${positions.avg}%` }}
            >
              {/* Value above */}
              <div className="absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className="text-xs font-medium text-white font-sans tabular-nums">
                  {formatNum(stats.avg)}
                </span>
              </div>
              {/* Dot */}
              <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white rounded-full border border-black/30" />
              {/* avg label below */}
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2">
                <span className="text-xs font-medium text-white/80 font-sans">avg</span>
              </div>
            </div>
          </div>

          {/* Labels */}
          <div className="flex justify-between text-xs text-muted-foreground font-sans">
            <span>min</span>
            <span>max</span>
          </div>
        </div>

        {/* Legend Cards */}
        <div className="grid grid-cols-3 gap-3">
          {legendItems.map((item) => (
            <div
              key={item.label}
              className={cn(
                "flex flex-col gap-2 p-3 rounded-lg border",
                colors.bg,
                colors.border
              )}
            >
              {/* Range value at top */}
              <div className="flex items-center gap-2">
                <div className={cn("w-2.5 h-2.5 rounded-full", item.barClass)} />
                <span className="text-sm font-semibold tabular-nums font-sans">
                  {formatNum(item.lower)} - {formatNum(item.upper)} {unitLabel}
                </span>
              </div>
              
              {/* Percentage and explanation */}
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium text-muted-foreground font-sans">
                  {item.label}% of days
                </span>
                <span className="text-xs text-muted-foreground/70 leading-tight font-sans">
                  {stdExplanations[item.label]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
