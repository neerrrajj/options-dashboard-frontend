'use client';

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { ChevronDownIcon, Info } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useIntradayMetadata } from "@/hooks/useIntradayMetadata";
import { useIntradayFilterStore } from "@/store/intradayFilterStore";
import { cn, isPreMarketHours, isHistoricalOnlyHours, isMarketOpen } from "@/lib/utils";
import { Card } from "@/components/ui/card";

export function IntradayFilters() {
  const {
    instrument,
    expiry,
    mode,
    date,
    setInstrument,
    setExpiry,
    setMode,
    setDate,
    isInitialized
  } = useIntradayFilterStore();

  const { instruments, expiries, availableDates, isLoading } = useIntradayMetadata({
    instrument,
    live: mode === "live",
    date: mode === "historical" ? date : undefined 
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isHistorical = mode === "historical";
  const selectedDate = useMemo(() => (date ? new Date(date) : undefined), [date]);

  // Check if toggle should be disabled
  const isToggleDisabled = !isInitialized || isHistoricalOnlyHours();

  // Handle mode switch
  const handleModeChange = (val: boolean) => {
    // Don't allow changes if toggle is disabled
    if (isToggleDisabled) return;
    
    const newMode = val ? "historical" : "live";
    setMode(newMode);
    
    // When switching to live, clear date (will use today)
    if (newMode === "live") {
      setDate("");
      setExpiry("");
    }
  };

  // Auto-select latest available date when in historical mode with no date
  useEffect(() => {
    console.log('[DashboardFilters] Date auto-select effect:', { isHistorical, availableDatesLength: availableDates.length, date });
    if (isHistorical && availableDates.length > 0 && !date) {
      const latestDate = availableDates[availableDates.length - 1];
      console.log('[DashboardFilters] Auto-selecting date:', latestDate);
      setDate(latestDate);
    }
  }, [isHistorical, availableDates.length, date, setDate]);

  // Auto-select instrument when date changes in historical mode
  useEffect(() => {
    if (isHistorical && date && instruments.length > 0) {
      if (!instruments.includes(instrument)) {
        setInstrument(instruments[0]);
      }
    }
  }, [isHistorical, date, instruments, instrument, setInstrument]);

  // Auto-select latest expiry when instrument is selected
  useEffect(() => {
    if (isInitialized && expiries.length > 0 && (!expiry || !expiries.includes(expiry))) {
      setExpiry(expiries[0]);
    }
  }, [expiries, expiry, isInitialized, setExpiry]);

  return (
    <div className="flex flex-wrap w-full gap-12 py-4">
      <Card className="w-full">
        <div className="flex flex-row items-start gap-16 px-8 flex-wrap">
          {/* Instrument Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-normal ml-1">Instrument</Label>
            <Select 
              value={instrument}
              onValueChange={setInstrument}
              disabled={!isInitialized}
            >
              <SelectTrigger className="w-[120px] cursor-pointer text-sm">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {instruments.map((item: string) => (
                  <SelectItem key={item} value={item}>
                    {item}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
              
          {/* Expiry Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-normal ml-1">Expiry</Label>
            <Select 
              value={expiry} 
              onValueChange={setExpiry}
              disabled={!isInitialized || expiries.length === 0}
            >
              <SelectTrigger className="w-[140px] cursor-pointer text-sm">
                <SelectValue placeholder={
                  expiries.length === 0 
                    ? "No expiry" 
                    : "Select"
                } />
              </SelectTrigger>
              <SelectContent>
                {expiries.map((item: string) => (
                  <SelectItem key={item} value={item}>
                    {new Date(item).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
    
          {/* Data Mode Toggle */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-normal">Mode</Label>
              {isHistoricalOnlyHours() && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="w-3 h-3 text-muted-foreground cursor-default" />
                  </TooltipTrigger>
                  <TooltipContent>
                    {/* <p>Live mode available at 9:00 AM</p> */}
                    <p>
                      {isHistoricalOnlyHours() ? (
                        "Historical only • Live at 9:00 AM"
                      ) : mode === 'live' ? (
                        isPreMarketHours() ? (
                          "Pre-market • Opens 9:15 AM"
                        ) : "Live data"
                      ) : (
                        `Historical • ${date}`
                      )}
                    </p>
                  </TooltipContent>
                </Tooltip>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="historical"
                checked={isHistorical}
                onCheckedChange={handleModeChange}
                disabled={isToggleDisabled}
                className={isToggleDisabled ? "" : "cursor-pointer"}
              />
              <Label htmlFor="historical" className="text-sm">Historical</Label>
            </div>
            {/* Status indicator */}
            {/* <div className="text-xs text-gray-500 pb-2">
              {!isInitialized ? (
                "Initializing..."
              ) : isHistoricalOnlyHours() ? (
                "Historical only • Live at 9:00 AM"
              ) : mode === 'live' ? (
                isPreMarketHours() ? (
                  "Pre-market • Opens 9:15 AM"
                ) : "Live data"
              ) : (
                `Historical • ${date}`
              )}
            </div> */}
          </div>
            
          {/* Date Picker (only in historical mode) */}
          {isHistorical && (
            <div className="space-y-2">
              <Label className="text-sm font-normal ml-1">Date</Label>
              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-[140px] justify-between text-left font-normal cursor-pointer text-sm",
                      !selectedDate && "text-muted-foreground"
                    )}
                    disabled={!isInitialized || availableDates.length === 0}
                  >
                    {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Pick date"}
                    <ChevronDownIcon className="h-4 w-4 text-neutral-500"/>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    defaultMonth={selectedDate}
                    captionLayout="dropdown"
                    onSelect={(d) => {
                      if (d) {
                        setDate(format(d, "yyyy-MM-dd"));
                        setIsPopoverOpen(false);
                      }
                    }}
                    modifiers={{
                      available: (day) =>
                        availableDates.includes(format(day, "yyyy-MM-dd")),
                    }}
                    disabled={(day) =>
                      !availableDates.includes(format(day, "yyyy-MM-dd"))
                    }
                  />
                </PopoverContent>
              </Popover>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
