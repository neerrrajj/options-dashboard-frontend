import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Loader } from 'lucide-react';
import { format } from 'date-fns';
import { debounce } from 'lodash';
import {
  ComposedChart,
  Bar,
  Area,
  XAxis,
  YAxis,
  Cell,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
} from 'recharts';

import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { ChartTooltip, ChartContainer, ChartTooltipContent } from "@/components/ui/chart"
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { useAvailableTimestamps, useGexData } from '@/hooks/useGexData';
import { useGreeksSummary } from '@/hooks/useGreeksSummary';
import { formatNumber, formatTime } from '@/lib/utils';

interface TimeRange {
  start: string;
  end: string;
}

export const GexChart = () => {
  const [visibleCharts, setVisibleCharts] = useState({
    oi: false,
    vol: false,
    net_gex: true,
    abs_gex: true,
  });

  const [timeRange, setTimeRange] = useState<TimeRange | undefined>();
  const [selectedTimeIndex, setSelectedTimeIndex] = useState<number>(0);
  const [tempSelectedTimeIndex, setTempSelectedTimeIndex] = useState<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [spotPrice, setSpotPrice] = useState<number | null>(null);
  const [isSliderActive, setIsSliderActive] = useState(false);

  const { timestamps, latestTimestamp, isLoading: timestampsLoading } = useAvailableTimestamps();
  const { data, isLoading, error } = useGexData(timeRange);
  const { data: summaryData, isLoading: isSummaryLoading } = useGreeksSummary()
  const [totalNetGex, setTotalNetGex] = useState<number | null>(null);

  const [initialStrikeRange, setInitialStrikeRange] = useState<{ min: number, max: number } | null>(null);
  const firstTimestamp = timestamps[0];

  const { data: firstData } = useGexData(
    firstTimestamp
      ? { start: firstTimestamp, end: firstTimestamp }
      : undefined
  );

  // Extract total net GEX from summary data based on selected timestamp
  useEffect(() => {
    if (summaryData && summaryData.length > 0 && timestamps.length > 0) {
      const selectedTime = timestamps[selectedTimeIndex];

      // Find the summary data for the selected timestamp
      const summaryForTime = summaryData.find(item => item.ist_minute === selectedTime);

      setTotalNetGex(summaryForTime?.total_net_gex || null);
    }
  }, [summaryData, timestamps, selectedTimeIndex]);

  // Debounced function to update time range
  const debouncedSetTimeRange = useCallback(
    debounce((timeIndex: number) => {
      if (timestamps.length === 0) return;

      const selectedTime = timestamps[timeIndex];

      setTimeRange({
        start: selectedTime,
        end: selectedTime
      });
      setSelectedTimeIndex(timeIndex);
    }, 100),
    [timestamps]
  );

  // Initialize slider to latest timestamp when data is available
  useEffect(() => {
    if (timestamps.length > 0 && latestTimestamp && !isInitialized) {
      const latestIndex = timestamps.findIndex(ts => ts === latestTimestamp);
      const actualLatestIndex = latestIndex !== -1 ? latestIndex : timestamps.length - 1;

      setSelectedTimeIndex(actualLatestIndex);
      setTempSelectedTimeIndex(actualLatestIndex);
      setTimeRange({
        start: timestamps[actualLatestIndex],
        end: timestamps[actualLatestIndex]
      });
      setIsInitialized(true);
    }
  }, [timestamps, latestTimestamp, isInitialized]);

  // Reset to latest timestamp when data changes (e.g., when date filter changes)
  useEffect(() => {
    if (timestamps.length > 0 && latestTimestamp && isInitialized) {
      const latestIndex = timestamps.findIndex(ts => ts === latestTimestamp);
      const actualLatestIndex = latestIndex !== -1 ? latestIndex : timestamps.length - 1;

      setSelectedTimeIndex(actualLatestIndex);
      setTempSelectedTimeIndex(actualLatestIndex);
      setTimeRange({
        start: timestamps[actualLatestIndex],
        end: timestamps[actualLatestIndex]
      });
      // Reset initial strike range for a new day
      console.log("clearing initial strike range..")
      setInitialStrikeRange(null);
    }
  }, [timestamps, latestTimestamp]);

  // Extract spot price from current data
  useEffect(() => {
    if (data && data.length > 0) {
      const recentData = data.find(d => d.underlying_price != null);
      if (recentData && recentData.underlying_price) {
        console.log("spot from effect: ", recentData.underlying_price)
        setSpotPrice(recentData.underlying_price);
      }
    }
  }, [data]);

  // Handle slider changes
  const handleSliderChange = (values: number[]) => {
    const timeIndex = values[0];
    setTempSelectedTimeIndex(timeIndex);

    // Only trigger API call if slider is not being actively dragged
    if (!isSliderActive) {
      debouncedSetTimeRange(timeIndex);
    }
  };

  // Handle slider interaction start
  const handleSliderStart = () => {
    setIsSliderActive(true);
  };

  // Handle slider interaction end
  const handleSliderEnd = () => {
    setIsSliderActive(false);
    debouncedSetTimeRange(tempSelectedTimeIndex);
  };

  // Reset to latest
  const resetToLatest = () => {
    if (timestamps.length === 0 || !latestTimestamp) return;

    const latestIndex = timestamps.findIndex(ts => ts === latestTimestamp);
    const actualLatestIndex = latestIndex !== -1 ? latestIndex : timestamps.length - 1;

    setSelectedTimeIndex(actualLatestIndex);
    setTempSelectedTimeIndex(actualLatestIndex);
    setTimeRange({
      start: timestamps[actualLatestIndex],
      end: timestamps[actualLatestIndex]
    });
  };

  // useEffect(() => {
  //   if (!data || !spotPrice || initialStrikeRange) return;

  //   const firstTime = timestamps[0];
  //   const firstTimeData = data
  //     .filter(d => d.ist_minute === firstTime)
  //     .sort((a, b) => a.strike - b.strike);

  //   if (firstTimeData.length < 2) return;

  //   const strikeGap = firstTimeData[1].strike - firstTimeData[0].strike;
  //   const atmStrike = Math.round(spotPrice / strikeGap) * strikeGap;

  //   const range = {
  //     minStrike: atmStrike - 20 * strikeGap,
  //     maxStrike: atmStrike + 20 * strikeGap
  //   };

  //   console.log("Setting initial strike range from", firstTime, "with ATM", atmStrike, "→", range);
  //   setInitialStrikeRange(range);
  // }, [data, spotPrice, timestamps, initialStrikeRange]);

  useEffect(() => {
    if (!firstData || initialStrikeRange) return;

    const sorted = [...firstData]
      .filter(d => d.strike != null && d.underlying_price != null)
      .sort((a, b) => a.strike - b.strike);

    if (sorted.length < 2) return;

    const strikeGap = sorted[1].strike - sorted[0].strike;
    const spot = sorted.find(d => d.underlying_price)?.underlying_price;
    if (!spot) return;

    const atm = Math.round(spot / strikeGap) * strikeGap;
    const range = {
      min: atm - 20 * strikeGap,
      max: atm + 20 * strikeGap,
    };

    setInitialStrikeRange(range);
    console.log("ATM:", atm, "Range:", range);
  }, [firstData, initialStrikeRange]);


  // Process data for chart display with ATM filtering
  const chartData = useMemo(() => {
    // if (!data || data.length === 0 || !spotPrice) return [];
    if (!data || data.length === 0 || !initialStrikeRange) return [];

    // Show data for the selected timestamp
    const selectedTime = timestamps[selectedTimeIndex];
    const processedData = data
      .filter(d => d.ist_minute === selectedTime)
      .map(item => ({
        strike: item.strike,
        call_oi: item.call_oi || 0,
        put_oi: item.put_oi || 0,
        call_volume: item.call_volume || 0,
        put_volume: item.put_volume || 0,
        net_gex: item.net_gex || 0,
        abs_gex: item.abs_gex || 0,
      }))
      .sort((a, b) => a.strike - b.strike);

    if (processedData.length < 2) return processedData;

    // const strikeGap = processedData[1].strike - processedData[0].strike;
    // const atmStrike = Math.round(spotPrice / strikeGap) * strikeGap; // Round to nearest strikeGap
    // return processedData.filter(item => Math.abs(item.strike - atmStrike) <= 20 * strikeGap) // 20 strikes * strikeGap points

    // return processedData.filter(item =>
    //   item.strike >= initialStrikeRange.minStrike &&
    //   item.strike <= initialStrikeRange.maxStrike
    // );

    console.log(initialStrikeRange.min, initialStrikeRange.max)

    return processedData.filter(item =>
      item.strike >= initialStrikeRange.min &&
      item.strike <= initialStrikeRange.max
    );
  }, [data, timestamps, selectedTimeIndex, spotPrice]);

  const config = {
    call_oi: { label: "Call OI", color: "hsl(142, 76%, 50%)" },
    put_oi: { label: "Put OI", color: "hsl(346, 87%, 50%)" },
    call_volume: { label: "Call Vol", color: "hsl(142, 76%, 80%)" }, // "hsl(199, 74%, 56%)"
    put_volume: { label: "Put Vol", color: "hsl(346, 87%, 80%)" }, // "hsl(41, 83%, 80%)"
    net_gex_positive: { label: "Net GEX +", color: "hsl(142, 76%, 50%)" },
    net_gex_negative: { label: "Net GEX -", color: "hsl(346, 87%, 50%)" },
    abs_gex: { label: "Abs GEX", color: "hsl(270, 95%, 60%)" },
  };

  const netGexConfig = {
    net_gex_positive: { label: "Net GEX", color: "hsl(142, 76%, 50%)" },
    net_gex_negative: { label: "Net GEX", color: "hsl(346, 87%, 50%)" },
  };

  const gradientOffset = () => {
    const dataMax = Math.max(...summaryData.map((i) => i.total_net_gex));
    const dataMin = Math.min(...summaryData.map((i) => i.total_net_gex));

    if (dataMax <= 0) {
      return 0;
    }
    if (dataMin >= 0) {
      return 1;
    }

    return dataMax / (dataMax - dataMin);
  };

  const off = gradientOffset();

  const tickBuckets = summaryData
    .map((d) => d.ist_minute)
    .filter((t) => {
      const date = new Date(t);
      return date.getMinutes() % 15 === 0 && date.getSeconds() === 0;
    })
    .slice(1);

  const handleChartToggle = (chartType: string) => {
    setVisibleCharts(prev => {
      const newState = { ...prev };

      if (chartType === 'oi') {
        newState.oi = !prev.oi;
        if (newState.oi) newState.net_gex = false;
      } else if (chartType === 'vol') {
        newState.vol = !prev.vol;
        if (newState.vol) newState.abs_gex = false;
      } else if (chartType === 'net_gex') {
        newState.net_gex = !prev.net_gex;
        if (newState.net_gex) newState.oi = false;
      } else if (chartType === 'abs_gex') {
        newState.abs_gex = !prev.abs_gex;
        if (newState.abs_gex) newState.vol = false;
      }

      return newState;
    });
  };

  if (timestampsLoading || !isInitialized) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">Loading chart data...</div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center text-red-500">Error loading data: {error.message}</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className='flex flex-col items-start'>
              <span>
                Strike-wise GEX Analysis
              </span>
              <div className="text-sm text-gray-600 mt-2">
                {/* {spotPrice && <span >Spot: {spotPrice.toFixed(1)}</span>} */}
                {totalNetGex !== null && (
                  <span className="text-sm text-muted-foreground/70">
                    Total Net GEX:
                    <span className={`ml-1 ${totalNetGex > 0 ? "text-green-600/70" : "text-red-600/70"}`}>
                      {formatNumber(totalNetGex)}
                    </span>
                  </span>
                )}
              </div>
            </div>
            <CustomLegend config={config} handleChartToggle={handleChartToggle} visibleCharts={visibleCharts} />
            <div className='flex flex-col items-end space-y-2'>
              <Button
                onClick={resetToLatest}
                className='cursor-pointer duration-300 ease-in-out text-xs'
                variant='outline'
                size='sm'
                disabled={isLoading}
              >
                <Loader className='size-3' />
                {isLoading ? "Updating..." : "Show Latest"}
              </Button>
              {timestamps.length > 0 && (
                <div className="text-xs text-muted-foreground mr-2">
                  {format(new Date(timestamps[0]), 'EEE, dd MMM yyyy')}
                </div>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] mb-6">
            <div style={{ position: 'relative', width: '100%', height: '100%' }}>
              <ChartContainer config={config} className='w-full h-full'>
                <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid />
                  <XAxis
                    xAxisId="strikes"
                    dataKey="strike"
                    tick={{ fontSize: 12 }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    yAxisId="left"
                    tick={{ fontSize: 12 }}
                    tickFormatter={formatNumber}
                  />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    hide={true}
                  />
                  <ChartTooltip content={<CustomChartTooltipContent />} />
                  {/* <ReferenceLine yAxisId="left" y={0} stroke="#666" strokeDasharray="3 3" /> */}

                  {/* Area Charts */}
                  {visibleCharts.abs_gex && (
                    <Area
                      xAxisId="strikes"
                      yAxisId="right"
                      dataKey="abs_gex"
                      fill={config.abs_gex.color}
                      stroke={config.abs_gex.color}
                      fillOpacity={0.3}
                      name="Abs GEX"
                      type="monotone"
                    />
                  )}

                  {visibleCharts.vol && (
                    <>
                      <Area
                        xAxisId="strikes"
                        yAxisId="right"
                        dataKey="call_volume"
                        fill={config.call_volume.color}
                        stroke={config.call_volume.color}
                        fillOpacity={0.2}
                        name="Call Vol"
                        type="monotone"
                      />
                      <Area
                        xAxisId="strikes"
                        yAxisId="right"
                        dataKey="put_volume"
                        fill={config.put_volume.color}
                        stroke={config.put_volume.color}
                        fillOpacity={0.2}
                        name="Put Vol"
                        type="monotone"
                      />
                    </>
                  )}

                  {/* Bar Charts */}
                  {visibleCharts.oi && (
                    <>
                      <Bar
                        xAxisId="strikes"
                        yAxisId="left"
                        dataKey="call_oi"
                        fill={config.call_oi.color}
                        name="Call OI"
                        opacity={0.7}
                      />
                      <Bar
                        xAxisId="strikes"
                        yAxisId="left"
                        dataKey="put_oi"
                        fill={config.put_oi.color}
                        name="Put OI"
                        opacity={0.7}
                      />
                    </>
                  )}

                  {visibleCharts.net_gex && (
                    <Bar
                      xAxisId="strikes"
                      yAxisId="left"
                      dataKey="net_gex"
                      name="Net GEX"
                      opacity={0.8}
                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.net_gex >= 0 ? config.net_gex_positive.color : config.net_gex_negative.color}
                        />
                      ))}
                    </Bar>
                  )}
                </ComposedChart>
              </ChartContainer>

              {/* Custom spot price line overlay */}
              {spotPrice && chartData.length > 0 && (() => {
                const strikes = chartData.map(d => d.strike);
                const minStrike = Math.min(...strikes);
                const maxStrike = Math.max(...strikes);

                // Find the exact left % based on ordinal spacing
                const indexBelow = strikes.findIndex((strike, i) => strike <= spotPrice && (i === strikes.length - 1 || strikes[i + 1] > spotPrice));
                if (indexBelow === -1 || indexBelow === strikes.length - 1) return null;

                const lowerStrike = strikes[indexBelow];
                const upperStrike = strikes[indexBelow + 1];
                const ratioBetween = (spotPrice - lowerStrike) / (upperStrike - lowerStrike);
                const percentLeft = ((indexBelow + ratioBetween) / (strikes.length - 1)) * 100;

                return (
                  <div
                    style={{
                      position: 'absolute',
                      left: `calc(24px + ${percentLeft}% )`,
                      top: '20px',
                      bottom: '65px',
                      width: '2px',
                      borderLeft: '2px dashed #fbbf24',
                      pointerEvents: 'none',
                      zIndex: 10,
                      opacity: 0.8
                    }}
                  >
                    <div style={{
                      position: 'absolute',
                      top: '-25px',
                      left: '-40px',
                      fontSize: '11px',
                      color: '#fbbf24',
                      fontWeight: 'bold',
                      whiteSpace: 'nowrap',
                      padding: '2px 6px',
                      borderRadius: '3px',
                    }}>
                      Spot: {spotPrice.toFixed(1)}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Time Range Slider */}
          {timestamps.length > 0 && (
            <div className="mb-4 space-y-3">
              <div className="flex items-center text-sm space-x-6 text-muted-foreground px-10">
                <span>{timestamps.length > 0 ? formatTime(timestamps[0]) : ''}</span>
                <Slider
                  value={[tempSelectedTimeIndex]}
                  onValueChange={handleSliderChange}
                  onPointerDown={handleSliderStart}
                  onPointerUp={handleSliderEnd}
                  min={0}
                  max={timestamps.length - 1}
                  step={1}
                  className="w-full"
                />
                <span>
                  {formatTime(timestamps[tempSelectedTimeIndex])}</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className='flex items-center justify-between'>
            <div>
              Intraday Total Net GEX variation
            </div>
            {summaryData.length > 0 && (
              <div className="text-xs text-muted-foreground mr-2">
                {format(new Date(summaryData[0].ist_minute), 'EEE, dd MMM yyyy')}
              </div>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={netGexConfig} className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={summaryData}>
                <CartesianGrid />
                <XAxis
                  dataKey="ist_minute"
                  tick={{ fontSize: 12 }}
                  ticks={tickBuckets}
                  tickFormatter={(value) =>
                    new Date(value).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                  }
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  width={60}
                  tickFormatter={formatNumber}
                />
                <ChartTooltip content={<NetGexChartTooltipContent />} />
                <defs>
                  <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(142, 76%, 50%)" stopOpacity={0.1} />
                    <stop offset={off} stopColor="hsl(142, 76%, 50%)" stopOpacity={0.8} />
                    <stop offset={off} stopColor="hsl(346, 87%, 50%)" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="hsl(346, 87%, 50%)" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="total_net_gex"
                  stroke="#777777"
                  strokeWidth={0.5}
                  fill="url(#splitColor)"
                  dot={false}
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </>
  );
};

const CustomChartTooltipContent = ({ payload }) => {
  if (!payload || payload.length === 0) return null;
  const data = payload[0].payload;
  const strike = data.strike

  return (
    <div className="rounded-md border bg-background p-2 shadow-sm text-xs space-y-1 -z-50">
      <div className="font-lg font-bold text-primary">{strike}</div>

      {payload.map((entry, index) => {
        return (
          <div key={index} className="flex justify-between gap-4">
            <span style={{ color: entry.color }}>{entry.name}</span>
            <span className='text-foreground font-mono font-medium tabular-nums'>{formatNumber(entry.value)}</span>
          </div>
        )
      })}
    </div>
  );
};

const NetGexChartTooltipContent = ({ payload }) => {
  if (!payload || payload.length === 0) return null;
  const data = payload[0].payload;

  let label
  if (data.strike) {
    label = data.strike;
  } else {
    label = formatTime(data.ist_minute)
  }

  return (
    <div className="rounded-md border bg-background p-2 shadow-sm text-xs space-y-1 -z-50">
      <div className="font-lg font-bold text-primary">{label}</div>

      {payload.map((entry, index) => {
        const isPositive = entry.value >= 0;
        const dynamicColor = isPositive ? "hsl(142, 76%, 50%)" : "hsl(346, 87%, 50%)";
        return (
          <div key={index} className="flex justify-between gap-4">
            <span style={{ color: dynamicColor }}>{entry.name}</span>
            <span className='text-foreground font-mono font-medium tabular-nums'>{formatNumber(entry.value)}</span>
          </div>
        )
      })}
    </div>
  );
};

const CustomLegend = ({ config, visibleCharts, handleChartToggle }) => {
  const legendItems = [
    { key: 'oi', label: 'OI', active: visibleCharts.oi },
    { key: 'vol', label: 'Volume', active: visibleCharts.vol },
    { key: 'net_gex', label: 'Net GEX', active: visibleCharts.net_gex },
    { key: 'abs_gex', label: 'Abs GEX', active: visibleCharts.abs_gex },
  ];

  return (
    <div className="flex items-center justify-center gap-6 mt-4">
      {legendItems.map(({ key, label, active }) => (
        <div
          key={key}
          className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-md duration-300 ease-in-out ${active
            ? 'bg-muted text-primary'
            : 'text-muted-foreground'
            }`}
          onClick={() => handleChartToggle(key)}
        >
          <div
            className={`h-3 w-3 rounded-sm transition-all duration-200 ${active ? 'opacity-100' : 'opacity-40'
              }`}
            style={{
              backgroundColor: key === 'oi' ? config.call_oi.color :
                key === 'vol' ? config.call_volume.color :
                  key === 'net_gex' ? config.net_gex_negative.color :
                    config.abs_gex.color
            }}
          />
          <span className="text-sm font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
};
