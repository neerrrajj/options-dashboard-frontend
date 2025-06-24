import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Calendar } from "lucide-react";

interface GlobalFiltersProps {
  selectedInstrument: string;
  onInstrumentChange: (value: string) => void;
  selectedExpiry: string;
  onExpiryChange: (value: string) => void;
  timeRange: number[];
  onTimeRangeChange: (value: number[]) => void;
  isHistorical: boolean;
  onHistoricalToggle: (value: boolean) => void;
}

export const GlobalFilters = ({
  selectedInstrument,
  onInstrumentChange,
  selectedExpiry,
  onExpiryChange,
  timeRange,
  onTimeRangeChange,
  isHistorical,
  onHistoricalToggle,
}: GlobalFiltersProps) => {
  const instruments = ["NIFTY", "BANKNIFTY", "FINNIFTY"];
  const expiries = ["2024-01-25", "2024-02-01", "2024-02-08", "All Expiries"];
  
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calendar className="h-5 w-5" />
          <span>Global Filters</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <Label>Instrument</Label>
            <Select value={selectedInstrument} onValueChange={onInstrumentChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select instrument" />
              </SelectTrigger>
              <SelectContent>
                {instruments.map((instrument) => (
                  <SelectItem key={instrument} value={instrument}>
                    {instrument}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Expiry</Label>
            <Select value={selectedExpiry} onValueChange={onExpiryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select expiry" />
              </SelectTrigger>
              <SelectContent>
                {expiries.map((expiry) => (
                  <SelectItem key={expiry} value={expiry}>
                    {expiry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Time Range: {formatTime(timeRange[0])} - {formatTime(timeRange[1])}</Label>
            <div className="px-2">
              <Slider
                value={timeRange}
                onValueChange={onTimeRangeChange}
                min={540} // 9:00 AM
                max={930} // 3:30 PM
                step={15}
                className="w-full"
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                id="historical"
                checked={isHistorical}
                onCheckedChange={onHistoricalToggle}
              />
              <Label htmlFor="historical">Historical Data</Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};