'use client';

import { format } from "date-fns";
import { ChevronDownIcon, Check, Loader2 } from "lucide-react";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { usePositionalFilterStore, type WeekDay, type MetricType } from "@/store/positionalFilterStore";
import { useSymbols } from "@/hooks/useSymbols";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

const weekDays: WeekDay[] = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const metricOptions: { value: MetricType; label: string }[] = [
  { value: "range", label: "Range" },
  { value: "net_change", label: "Net Change" },
  { value: "gaps", label: "Gaps" },
];

export function PositionalFilters() {
  const {
    instrument,
    startDate,
    endDate,
    frequency,
    weekStartDay,
    monthStartDay,
    metricType,
    valueMode,
    setInstrument,
    setStartDate,
    setEndDate,
    setFrequency,
    setWeekStartDay,
    setMonthStartDay,
    setMetricType,
    setValueMode,
  } = usePositionalFilterStore();

  const [isStartDateOpen, setIsStartDateOpen] = useState(false);
  const [isEndDateOpen, setIsEndDateOpen] = useState(false);
  const [isInstrumentOpen, setIsInstrumentOpen] = useState(false);
  const [instrumentSearch, setInstrumentSearch] = useState("");

  const { symbols, metadata, isLoading } = useSymbols();

  const selectedStartDate = startDate ? new Date(startDate) : undefined;
  const selectedEndDate = endDate ? new Date(endDate) : undefined;

  // Get display info for selected instrument
  const selectedSymbolInfo = useMemo(() => {
    return symbols.find(s => s.symbol === instrument);
  }, [symbols, instrument]);

  // Check if current instrument is valid (in our list)
  const isValidInstrument = symbols.some(s => s.symbol === instrument);

  // Filter symbols based on search query (client-side)
  const filteredSymbols = useMemo(() => {
    if (!instrumentSearch.trim()) {
      return symbols.slice(0, 50); // Return first 50 if no search
    }

    const query = instrumentSearch.toLowerCase().trim();
    
    // Score and sort symbols
    const scored = symbols.map((symbol) => {
      const symbolLower = symbol.symbol.toLowerCase();
      const nameLower = symbol.name.toLowerCase();
      let score = 0;

      // Exact matches
      if (symbolLower === query || nameLower === query) {
        score = 100;
      }
      // Starts with
      else if (symbolLower.startsWith(query) || nameLower.startsWith(query)) {
        score = 80;
      }
      // Contains as whole word
      else if (nameLower.includes(` ${query}`) || nameLower.includes(`${query} `)) {
        score = 60;
      }
      // Contains anywhere
      else if (symbolLower.includes(query) || nameLower.includes(query)) {
        score = 40;
      }
      // Individual word starts with query
      else if (nameLower.split(/\s+/).some(word => word.startsWith(query))) {
        score = 20;
      }

      return { symbol, score };
    });

    // Filter out zero scores and sort by score desc
    return scored
      .filter(item => item.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.symbol.name.localeCompare(b.symbol.name);
      })
      .slice(0, 50)
      .map(item => item.symbol);
  }, [symbols, instrumentSearch]);

  // Handle instrument selection
  const handleSelectInstrument = (symbol: string) => {
    setInstrument(symbol);
    setIsInstrumentOpen(false);
    setInstrumentSearch("");
  };

  // Check if data is stale (from previous day)
  const isStale = metadata && metadata.last_fetch_date !== new Date().toLocaleDateString("en-CA", { 
    timeZone: "Asia/Kolkata",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  });

  return (
    <div className="w-full py-4 space-y-8">
      {/* Filters Card */}
      <Card className="w-full">
        <div className="flex flex-row items-start gap-16 px-8 flex-wrap">
          {/* Instrument Combobox */}
          <div className="space-y-2">
            <Label className="text-sm font-normal ml-1">Instrument</Label>
            <Popover open={isInstrumentOpen} onOpenChange={setIsInstrumentOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[220px] justify-between text-left font-normal cursor-pointer text-sm",
                    !isValidInstrument && instrument && "border-red-500/50 text-red-500"
                  )}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Loading...
                    </span>
                  ) : selectedSymbolInfo ? (
                    <span className="truncate">{selectedSymbolInfo.name}</span>
                  ) : (
                    <span className="text-muted-foreground">Search symbol...</span>
                  )}
                  <ChevronDownIcon className="h-4 w-4 text-neutral-500 shrink-0 ml-2"/>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] p-0" align="start">
                <div className="p-2 border-b">
                  <Input
                    placeholder="Search by name or ticker (e.g., RELIANCE)"
                    value={instrumentSearch}
                    onChange={(e) => setInstrumentSearch(e.target.value)}
                    className="h-9 text-sm"
                    autoFocus
                  />
                </div>
                <div className="max-h-[280px] overflow-auto">
                  {filteredSymbols.length === 0 ? (
                    <div className="px-3 py-4 text-sm text-muted-foreground text-center">
                      {instrumentSearch ? (
                        <>
                          No symbols found for &quot;{instrumentSearch}&quot;
                          <br />
                          <span className="text-xs">Try a different search term</span>
                        </>
                      ) : (
                        "Type to search symbols"
                      )}
                    </div>
                  ) : (
                    <div className="py-1">
                      {filteredSymbols.map((item) => (
                        <button
                          key={item.symbol}
                          onClick={() => handleSelectInstrument(item.symbol)}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm hover:bg-muted flex items-center justify-between gap-2",
                            instrument === item.symbol && "bg-muted"
                          )}
                        >
                          <div className="flex flex-col min-w-0">
                            <span className="font-medium truncate">{item.name}</span>
                            <span className="text-xs text-muted-foreground">{item.symbol}</span>
                          </div>
                          {instrument === item.symbol && (
                            <Check className="h-4 w-4 text-primary shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="px-3 py-2 border-t text-xs text-muted-foreground flex justify-between">
                  <span>{filteredSymbols.length > 0 && `Showing ${filteredSymbols.length} results`}</span>
                  {isStale && <span className="text-yellow-500">Using cached data</span>}
                </div>
              </PopoverContent>
            </Popover>
            {!isValidInstrument && instrument && !isLoading && (
              <p className="text-xs text-red-500 ml-1">Please select a valid symbol</p>
            )}
          </div>

          {/* Start Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-normal ml-1">Start Date</Label>
            <Popover open={isStartDateOpen} onOpenChange={setIsStartDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-between text-left font-normal cursor-pointer text-sm",
                    !selectedStartDate && "text-muted-foreground"
                  )}
                >
                  {selectedStartDate ? format(selectedStartDate, "yyyy-MM-dd") : "Pick date"}
                  <ChevronDownIcon className="h-4 w-4 text-neutral-500"/>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedStartDate}
                  defaultMonth={selectedStartDate}
                  captionLayout="dropdown"
                  onSelect={(d) => {
                    if (d) {
                      setStartDate(format(d, "yyyy-MM-dd"));
                      setIsStartDateOpen(false);
                    }
                  }}
                  disabled={(day) => {
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    if (day > today) return true;
                    if (endDate && day > new Date(endDate)) return true;
                    return false;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* End Date Picker */}
          <div className="space-y-2">
            <Label className="text-sm font-normal ml-1">End Date</Label>
            <Popover open={isEndDateOpen} onOpenChange={setIsEndDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-[140px] justify-between text-left font-normal cursor-pointer text-sm",
                    !selectedEndDate && "text-muted-foreground"
                  )}
                >
                  {selectedEndDate ? format(selectedEndDate, "yyyy-MM-dd") : "Pick date"}
                  <ChevronDownIcon className="h-4 w-4 text-neutral-500"/>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedEndDate}
                  defaultMonth={selectedEndDate}
                  captionLayout="dropdown"
                  onSelect={(d) => {
                    if (d) {
                      setEndDate(format(d, "yyyy-MM-dd"));
                      setIsEndDateOpen(false);
                    }
                  }}
                  disabled={(day) => {
                    const today = new Date();
                    today.setHours(23, 59, 59, 999);
                    if (day > today) return true;
                    if (startDate && day < new Date(startDate)) return true;
                    return false;
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Frequency Selector */}
          <div className="space-y-2">
            <Label className="text-sm font-normal ml-1">Frequency</Label>
            <Select
              value={frequency}
              onValueChange={(val) => setFrequency(val as "Daily" | "Weekly" | "Monthly")}
            >
              <SelectTrigger className="w-[140px] cursor-pointer text-sm">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Daily">Daily</SelectItem>
                <SelectItem value="Weekly">Weekly</SelectItem>
                <SelectItem value="Monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Week Starting Day (shown only for Weekly frequency) */}
          {frequency === "Weekly" && (
            <div className="space-y-2">
              <Label className="text-sm font-normal ml-1">Week Starting Day</Label>
              <Select
                value={weekStartDay}
                onValueChange={(val) => setWeekStartDay(val as WeekDay)}
              >
                <SelectTrigger className="w-[160px] cursor-pointer text-sm">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {weekDays.map((day) => (
                    <SelectItem key={day} value={day}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Month Starting Day (shown only for Monthly frequency) */}
          {frequency === "Monthly" && (
            <div className="space-y-2">
              <Label className="text-sm font-normal ml-1">Month Starting Day</Label>
              <Select
                value={monthStartDay.toString()}
                onValueChange={(val) => setMonthStartDay(parseInt(val))}
              >
                <SelectTrigger className="w-[140px] cursor-pointer text-sm">
                  <SelectValue placeholder="Select day" />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: 28 }, (_, i) => i + 1).map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </Card>

      {/* Metric Selection Row - Below the filters card */}
      <div className="flex flex-row items-center justify-between">
        {/* Left: Metric Type Dropdown */}
        <div className="flex items-center gap-4">
          <Label className="text-sm font-medium">Metric</Label>
          <Select
            value={metricType}
            onValueChange={(val) => setMetricType(val as MetricType)}
          >
            <SelectTrigger className="w-[160px] cursor-pointer text-sm">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metricOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Right: Points/Percentage Tabs */}
        <Tabs 
          value={valueMode} 
          onValueChange={(val) => setValueMode(val as "points" | "percentage")}
        >
          <TabsList>
            <TabsTrigger value="points" className="text-sm tracking-wide">Points</TabsTrigger>
            <TabsTrigger value="percentage" className="text-sm tracking-wide">Percentage</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
    </div>
  );
}
