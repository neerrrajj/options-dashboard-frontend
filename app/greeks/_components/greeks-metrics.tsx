import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

export const GreeksMetrics = () => {
  // Dummy data for intraday changes in OTM Greeks
  const greeksData = {
    otm_call_vega: { current: 1250.50, change: -45.30, percentage: -3.5 },
    otm_put_vega: { current: 1580.75, change: 62.20, percentage: 4.1 },
    otm_call_theta: { current: -850.25, change: -25.80, percentage: -3.1 },
    otm_put_theta: { current: -920.40, change: -18.90, percentage: -2.1 },
    otm_call_delta: { current: 0.35, change: 0.05, percentage: 16.7 },
    otm_put_delta: { current: -0.42, change: -0.08, percentage: -23.5 },
  };

  const MetricCard = ({ 
    title, 
    current, 
    change, 
    percentage, 
    color = "blue" 
  }: {
    title: string;
    current: number;
    change: number;
    percentage: number;
    color?: string;
  }) => {
    const isPositive = change >= 0;
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-2">
            <div className="text-sm font-medium text-muted-foreground">
              {title}
            </div>
            <div className="text-2xl font-bold">
              {current.toFixed(2)}
            </div>
            <div className="flex items-center text-xs">
              {isPositive ? (
                <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {change >= 0 ? '+' : ''}{change.toFixed(2)} ({percentage >= 0 ? '+' : ''}{percentage.toFixed(1)}%)
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">OTM Greeks Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <MetricCard
          title="OTM Call Vega"
          current={greeksData.otm_call_vega.current}
          change={greeksData.otm_call_vega.change}
          percentage={greeksData.otm_call_vega.percentage}
          color="green"
        />
        <MetricCard
          title="OTM Put Vega"
          current={greeksData.otm_put_vega.current}
          change={greeksData.otm_put_vega.change}
          percentage={greeksData.otm_put_vega.percentage}
          color="red"
        />
        <MetricCard
          title="OTM Call Theta"
          current={greeksData.otm_call_theta.current}
          change={greeksData.otm_call_theta.change}
          percentage={greeksData.otm_call_theta.percentage}
          color="orange"
        />
        <MetricCard
          title="OTM Put Theta"
          current={greeksData.otm_put_theta.current}
          change={greeksData.otm_put_theta.change}
          percentage={greeksData.otm_put_theta.percentage}
          color="orange"
        />
        <MetricCard
          title="OTM Call Delta"
          current={greeksData.otm_call_delta.current}
          change={greeksData.otm_call_delta.change}
          percentage={greeksData.otm_call_delta.percentage}
          color="purple"
        />
        <MetricCard
          title="OTM Put Delta"
          current={greeksData.otm_put_delta.current}
          change={greeksData.otm_put_delta.change}
          percentage={greeksData.otm_put_delta.percentage}
          color="indigo"
        />
      </div>
    </div>
  );
};