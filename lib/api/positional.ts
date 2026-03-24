export type MetricStats = {
  min: number;
  max: number;
  avg: number;
  range_68_lower: number;
  range_68_upper: number;
  range_95_lower: number;
  range_95_upper: number;
  range_99_lower: number;
  range_99_upper: number;
};

export type MetricData = {
  points: MetricStats;
  percentage: MetricStats;
};

export type RangeData = {
  total_range: MetricData;
  body_range: MetricData;
};

export type NetChangeData = {
  from_prev_close: MetricData;
  from_open: MetricData;
};

export type GapData = {
  gap_up: MetricData;
  gap_down: MetricData;
};

export type StatsMetadata = {
  symbol: string;
  start_date: string;
  end_date: string;
  frequency: string;
  total_candles: number;
  gap_up_candles: number;
  gap_down_candles: number;
  no_gap_candles: number;
};

export type StatsResponse = {
  metadata: StatsMetadata;
  range: RangeData;
  net_change: NetChangeData;
  gaps: GapData;
};

export type StatsRequest = {
  symbol: string;
  start_date: string;
  end_date: string;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  week_start_day?: string;
  month_start_day?: number;
};

export async function fetchPositionalStats(params: StatsRequest): Promise<StatsResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/positional/stats`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  });
  if (!res.ok) throw new Error('Failed to fetch stats');
  return res.json();
}
