import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const INSTRUMENTS = {
  "NIFTY": 50,
  "BANKNIFTY": 100
}

const HOLIDAYS = [
  "2025-08-15",
  "2025-08-27",
  "2025-10-02",
  "2025-10-21",
  "2025-10-22",
  "2025-11-05",
  "2025-12-25"
];

export function getISTNow(): Date {
  // Create a date in IST timezone
  const now = new Date();
  const istString = now.toLocaleString("en-US", { timeZone: "Asia/Kolkata" });
  return new Date(istString);
}

export function getISTToday(): string {
  const now = new Date();
  // Format date in IST timezone as YYYY-MM-DD
  return now.toLocaleDateString("en-CA", { 
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });
}

export function isWithinISTHours(start: string, end: string): boolean {
  const nowIST = getISTNow();
  const [startH, startM] = start.split(':').map(Number);
  const [endH, endM] = end.split(':').map(Number);
  
  const startTime = new Date(nowIST);
  startTime.setHours(startH, startM, 0, 0);
  
  const endTime = new Date(nowIST);
  endTime.setHours(endH, endM, 0, 0);
  
  return nowIST >= startTime && nowIST <= endTime;
}

function isTradingDay(date: Date): boolean {
  const isoDate = date.toISOString().split("T")[0];
  const isWeekend = date.getDay() === 0 || date.getDay() === 6;
  const isHoliday = HOLIDAYS.includes(isoDate);
  return !isWeekend && !isHoliday;
}

export function isMarketOpen(): boolean {
  const nowIST = getISTNow();
  const marketHours = isWithinISTHours("09:15", "15:30");
  return isTradingDay(nowIST) && marketHours;
}

export function isBeforeMarketOpen(): boolean {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentTime = hours * 60 + minutes;
  const marketOpenTime = 9 * 60; // 9:00 AM - before this is "historical only" time
  
  return currentTime < marketOpenTime;
}

export function isPreMarketHours(): boolean {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentTime = hours * 60 + minutes;
  const preMarketStart = 9 * 60; // 9:00 AM
  const marketOpenTime = 9 * 60 + 15; // 9:15 AM
  
  return currentTime >= preMarketStart && currentTime < marketOpenTime;
}

export function isHistoricalOnlyHours(): boolean {
  const nowIST = getISTNow();
  
  // Weekends and holidays are always historical only
  if (!isTradingDay(nowIST)) {
    return true;
  }
  
  // Before 9:00 AM and after 3:30 PM is historical only
  const hours = nowIST.getHours();
  const minutes = nowIST.getMinutes();
  const currentTime = hours * 60 + minutes;
  const preMarketStart = 9 * 60; // 9:00 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  
  return currentTime < preMarketStart || currentTime > marketClose;
}

export const formatNumber = (value: number) => {
  if (Math.abs(value) >= 1e9) {
    return (value / 1e9).toFixed(1) + 'B';
  } else if (Math.abs(value) >= 1e6) {
    return (value / 1e6).toFixed(1) + 'M';
  } else if (Math.abs(value) >= 1e3) {
    return (value / 1e3).toFixed(1) + 'K';
  } else {
    return value.toFixed(0);
  }
};

export const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
};