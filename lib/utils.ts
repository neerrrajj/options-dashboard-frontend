import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getISTNow(): Date {
  return new Date(Date.now());
}

export function getISTToday(): string {
  return getISTNow().toISOString().slice(0, 10);
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

export function isMarketOpen(): boolean {
  return isWithinISTHours('09:15', '15:30');
}

export function isBeforeMarketOpen(): boolean {
  const now = new Date();
  const istTime = new Date(now.toLocaleString("en-US", {timeZone: "Asia/Kolkata"}));
  const hours = istTime.getHours();
  const minutes = istTime.getMinutes();
  const currentTime = hours * 60 + minutes;
  const marketOpenTime = 9 * 60 + 15;
  
  return currentTime < marketOpenTime;
}