import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { useGreeksSummary } from '@/hooks/useGreeksSummary';

const labels = [
  "Call Vega",
  "Put Vega",
  "Call Theta",
  "Put Theta",
  "Call Delta",
  "Put Delta",
];

export const GreeksMetrics = () => {
  const { data = [], isLoading } = useGreeksSummary()
  
  if (isLoading) {
    return (
      <div className="col-span-7">
        <div className="w-full flex items-end justify-between mt-4">
          <h1 className="text-3xl font-bold pl-2">OTM Greeks</h1>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="mt-4 grid grid-rows-2 grid-flow-col gap-4">
          {labels.map((label) => (
            <Card key={label} className="py-4">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="col-span-7">
        <div className="w-full flex items-end justify-between mt-4">
          <h1 className="text-3xl font-bold pl-2">OTM Greeks</h1>
        </div>
        <div className="mt-4 grid grid-rows-2 grid-flow-col gap-4">
          {labels.map(label => (
            <Card key={label} className="py-4 gap-4">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {label}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-end justify-between">
                <span className="text-2xl font-semibold tabular-nums w-[12ch]">
                  -
                </span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const first = data[0];
  const last = data[data.length - 1];
  const lastTime = new Date(last.ist_minute).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });

  const diff = {
    "Call Vega": first.otm_call_vega - last.otm_call_vega,
    "Put Vega": first.otm_put_vega - last.otm_put_vega,
    "Call Theta": first.otm_call_theta - last.otm_call_theta,
    "Put Theta": first.otm_put_theta - last.otm_put_theta,
    "Call Delta": first.otm_call_delta - last.otm_call_delta,
    "Put Delta": first.otm_put_delta - last.otm_put_delta,
  };

  return (
    <div className="col-span-7">
      <div className="w-full flex items-end justify-between mt-4">
        <h1 className="text-3xl font-bold pl-2">OTM Greeks</h1>
        <span className="text-sm text-muted-foreground">Last updated: {lastTime}</span>
      </div>
      <div className="mt-4 grid grid-rows-2 grid-flow-col gap-4">
        {Object.entries(diff).map(([label, value]) => (
          <Card key={label} className="py-4 gap-4">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {label}
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-end justify-between">
              <span className="text-2xl font-semibold tabular-nums w-[12ch]">
                {value.toFixed(2)}
              </span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

