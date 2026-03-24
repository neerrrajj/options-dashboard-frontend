import { create } from 'zustand';

export type Frequency = 'Daily' | 'Weekly' | 'Monthly';
export type WeekDay = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';
export type MetricType = 'range' | 'net_change' | 'gaps';
export type ValueMode = 'points' | 'percentage';

interface PositionalFilterState {
  // Filter values
  instrument: string;
  startDate: string;
  endDate: string;
  frequency: Frequency;
  weekStartDay: WeekDay;
  monthStartDay: number;
  // Metric selection
  metricType: MetricType;
  valueMode: ValueMode;
  
  // Actions
  setInstrument: (instrument: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  setFrequency: (frequency: Frequency) => void;
  setWeekStartDay: (day: WeekDay) => void;
  setMonthStartDay: (day: number) => void;
  setMetricType: (type: MetricType) => void;
  setValueMode: (mode: ValueMode) => void;
  resetFilters: () => void;
}

// Default date range: last 365 days to today
const getDefaultEndDate = () => {
  const now = new Date();
  return now.toLocaleDateString("en-CA", { 
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

const getDefaultStartDate = () => {
  const now = new Date();
  const oneYearAgo = new Date(now);
  oneYearAgo.setDate(oneYearAgo.getDate() - 365);
  return oneYearAgo.toLocaleDateString("en-CA", { 
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
};

export const usePositionalFilterStore = create<PositionalFilterState>((set) => ({
  instrument: "^NSEI",  // NIFTY 50 default
  startDate: getDefaultStartDate(),
  endDate: getDefaultEndDate(),
  frequency: "Daily",
  weekStartDay: "Monday",
  monthStartDay: 1,
  metricType: "range",
  valueMode: "points",
  
  setInstrument: (instrument) => set({ instrument }),
  setStartDate: (startDate) => set({ startDate }),
  setEndDate: (endDate) => set({ endDate }),
  setFrequency: (frequency) => set({ frequency }),
  setWeekStartDay: (weekStartDay) => set({ weekStartDay }),
  setMonthStartDay: (monthStartDay) => set({ monthStartDay }),
  setMetricType: (metricType) => set({ metricType }),
  setValueMode: (valueMode) => set({ valueMode }),
  
  resetFilters: () => set({
    instrument: "^NSEI",
    startDate: getDefaultStartDate(),
    endDate: getDefaultEndDate(),
    frequency: "Daily",
    weekStartDay: "Monday",
    monthStartDay: 1,
    metricType: "range",
    valueMode: "points",
  }),
}));
