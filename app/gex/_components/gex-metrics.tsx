import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon, TrendingUpIcon, ActivityIcon } from "lucide-react";

export const GexMetrics = () => {
  // Dummy data matching your API response format
  const metrics = {
    totalCallOI: 15420000,
    totalPutOI: 18950000,
    totalNetGex: -2530000,
    gammaFlipLevel: 21450.50,
    change: {
      callOI: 5.2,
      putOI: -2.8,
      netGex: -15.6,
      gammaFlip: 0.3
    }
  };

  const MetricCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = "blue",
    format = "number" 
  }: {
    title: string;
    value: number;
    change: number;
    icon: any;
    color?: string;
    format?: "number" | "currency";
  }) => {
    const formatValue = (val: number) => {
      if (format === "currency") return `₹${val.toLocaleString()}`;
      return val.toLocaleString();
    };

    const isPositive = change >= 0;
    
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            <Icon className={`h-4 w-4 text-${color}-600`} />
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-bold">
              {formatValue(value)}
            </div>
            <div className="flex items-center text-xs">
              {isPositive ? (
                <ArrowUpIcon className="h-3 w-3 text-green-500 mr-1" />
              ) : (
                <ArrowDownIcon className="h-3 w-3 text-red-500 mr-1" />
              )}
              <span className={isPositive ? "text-green-500" : "text-red-500"}>
                {Math.abs(change)}%
              </span>
              <span className="text-muted-foreground ml-1">from previous</span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">GEX Metrics</h2>
      <div className="grid grid-cols-2 gap-4">
        <MetricCard
          title="Total Call OI"
          value={metrics.totalCallOI}
          change={metrics.change.callOI}
          icon={TrendingUpIcon}
          color="green"
        />
        <MetricCard
          title="Total Put OI"
          value={metrics.totalPutOI}
          change={metrics.change.putOI}
          icon={TrendingUpIcon}
          color="red"
        />
        <MetricCard
          title="Total Net GEX"
          value={metrics.totalNetGex}
          change={metrics.change.netGex}
          icon={ActivityIcon}
          color="blue"
        />
        <MetricCard
          title="Gamma Flip Level"
          value={metrics.gammaFlipLevel}
          change={metrics.change.gammaFlip}
          icon={ArrowUpIcon}
          color="purple"
          format="currency"
        />
      </div>
    </div>
  );
};