'use client';

import { useEffect, useMemo, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDownIcon, Info } from "lucide-react";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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

import { useGexMetadata } from "@/hooks/useGexMetadata";
import { useGexFilterStore } from "@/store/gexFilterStore";
import { cn, isBeforeMarketOpen, isMarketOpen, isPreMarketHours, isHistoricalOnlyHours } from "@/lib/utils";

export function GexFilters() {
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
  } = useGexFilterStore();

  const { instruments, expiries, availableDates, isLoading } = useGexMetadata({
    instrument,
    live: mode === "live",
    date: mode === "historical" ? date : undefined 
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const isHistorical = mode === "historical";
  const selectedDate = useMemo(() => (date ? new Date(date) : undefined), [date]);

  // Handle mode switch - force refresh
  const handleModeChange = (val: boolean) => {
    const newMode = val ? "historical" : "live";
    setMode(newMode);
    
    // When switching to live, clear date (will use today)
    if (newMode === "live") {
      setDate("");
      setExpiry("");
    }
    // When switching to historical, keep any existing date or let auto-select pick one
  };

  // Auto-select latest available date when in historical mode with no date
  useEffect(() => {
    console.log('[GexFilters] Date auto-select effect:', { isHistorical, availableDatesLength: availableDates.length, date });
    if (isHistorical && availableDates.length > 0 && !date) {
      const latestDate = availableDates[availableDates.length - 1];
      console.log('[GexFilters] Auto-selecting date:', latestDate);
      setDate(latestDate);
    }
  }, [isHistorical, availableDates.length, date, setDate]);

  // Auto-select instrument when date changes in historical mode
  useEffect(() => {
    if (isHistorical && date && instruments.length > 0) {
      // If current instrument is not available for this date, select first available
      if (!instruments.includes(instrument)) {
        setInstrument(instruments[0]);
      }
    }
  }, [isHistorical, date, instruments, instrument, setInstrument]);

  // Auto-select latest expiry when instrument is selected
  useEffect(() => {
    if (isInitialized && expiries.length > 0 && (!expiry || !expiries.includes(expiry))) {
      // Select the latest expiry
      setExpiry(expiries[0]);
    }
  }, [expiries, expiry, isInitialized, setExpiry]);

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5" />
            <span>Global Filters</span>
            {(isLoading || !isInitialized) && (
              <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
            )}
          </div>
          
          {/* Market Status Badge */}
          <div className={`px-2 py-1 rounded-full text-xs font-medium ${
            isHistoricalOnlyHours()
              ? 'bg-red-100 text-red-800'
              : isPreMarketHours()
              ? 'bg-yellow-100 text-yellow-800' 
              : isMarketOpen()
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {isHistoricalOnlyHours() ? 'Market Closed' : isPreMarketHours() ? 'Pre-Market' : isMarketOpen() ? 'Market Open' : 'Market Closed'}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-rows-2 gap-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Historical Toggle */}
            <div className="cols-span-1 space-y-4">
              <div className="flex items-center gap-2">
                <Label>Data Mode</Label>
                {isHistoricalOnlyHours() && (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Info className="w-4 h-4 text-muted-foreground cursor-default" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Live mode available at 9:00 AM</p>
                    </TooltipContent>
                  </Tooltip>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="historical"
                  checked={isHistorical}
                  onCheckedChange={handleModeChange}
                  disabled={!isInitialized || isHistoricalOnlyHours()}
                  className="cursor-pointer"
                />
                <Label htmlFor="historical">Historical</Label>
              </div>
            </div>

            {/* Date Picker (only in historical mode) */}
            {isHistorical && (
              <div className="cols-span-1 space-y-2">
                <Label>Date</Label>
                <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-between text-left font-normal cursor-pointer",
                        !selectedDate && "text-muted-foreground"
                      )}
                      disabled={!isInitialized || availableDates.length === 0}
                    >
                      {selectedDate ? format(selectedDate, "yyyy-MM-dd") : "Pick a date"}
                    <ChevronDownIcon className="text-neutral-500"/>
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

          <div className="grid grid-cols-2 gap-4">
            {/* Instrument Selector */}
            <div className="cols-span-1 space-y-2">
              <Label>Instrument</Label>
              <Select 
                value={instrument}
                onValueChange={setInstrument}
                disabled={!isInitialized}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Select instrument" />
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
            <div className="cols-span-1 space-y-2">
              <Label>Expiry</Label>
              <Select value={expiry} onValueChange={setExpiry}
                disabled={!isInitialized || expiries.length === 0}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder={
                    expiries.length === 0 
                      ? "No expiries available" 
                      : "Select expiry"
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
          </div>
        </div>
          </CardContent>

        {/* Updated Status indicator */}
        <div className="text-sm text-gray-500 px-6 mt-2">
          {!isInitialized ? (
            "Initializing filters..."
          ) : isHistoricalOnlyHours() ? (
            "Historical mode only • Live available at 9:00 AM"
          ) : mode === 'live' ? (
            isPreMarketHours() ? (
              "Pre-market • Market opens at 9:15 AM"
            ) : isMarketOpen() ? (
              "Live data • Auto-refreshing during market hours"
            ) : (
              "Live data • Market closed"
            )
          ) : (
            `Historical data • ${date}`
          )}
        </div>
    </Card>
  );
}
