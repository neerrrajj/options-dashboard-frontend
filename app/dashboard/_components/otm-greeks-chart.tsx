'use client';

import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, CartesianGrid } from "recharts";
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

import { useDashboardSummary } from "@/hooks/useDashboardSummary";

type GreeksSnapshot = {
  ist_minute: string;
  otm_call_delta: number;
  otm_put_delta: number;
  otm_call_theta: number;
  otm_put_theta: number;
  otm_call_vega: number;
  otm_put_vega: number;
};

export const OtmGreeksChart = () => {
  const { data = [], isLoading } = useDashboardSummary() as {
    data: GreeksSnapshot[];
    isLoading: boolean;
  };

  if (isLoading) return <div></div>;
  if (!data.length) return <div></div>;

  const first = data[0];

  const transformedData = data.map((d, i) => ({
    index: i,
    ist_minute: d.ist_minute,
    otm_call_delta: first.otm_call_delta - d.otm_call_delta,
    otm_put_delta: first.otm_put_delta - d.otm_put_delta,
    otm_call_theta: first.otm_call_theta - d.otm_call_theta,
    otm_put_theta: first.otm_put_theta - d.otm_put_theta,
    otm_call_vega: first.otm_call_vega - d.otm_call_vega,
    otm_put_vega: first.otm_put_vega - d.otm_put_vega,
  }));

  const vegaConfig = {
    otm_call_vega: { label: "Call Vega", color: "hsl(142, 76%, 36%)" },
    otm_put_vega: { label: "Put Vega", color: "hsl(346, 87%, 43%)" },
  };

  const thetaConfig = {
    otm_call_theta: { label: "Call Theta", color: "hsl(39, 96%, 40%)" },
    otm_put_theta: { label: "Put Theta", color: "hsl(20, 96%, 40%)" },
  };

  const deltaConfig = {
    otm_call_delta: { label: "Call Delta", color: "hsl(262, 83%, 58%)" },
    otm_put_delta: { label: "Put Delta", color: "hsl(215, 100%, 50%)" },
  };

  const tickBuckets = transformedData
    .map((d) => d.ist_minute)
    .filter((t) => {
      const date = new Date(t);
      return date.getMinutes() % 15 === 0 && date.getSeconds() === 0;
    })
    .slice(1);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Intraday change in OTM Greeks</span>
            {first?.ist_minute && (
              <span className="text-xs text-muted-foreground mr-2">
                {format(new Date(first.ist_minute), 'EEE, dd MMM yyyy')}
              </span>
            )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vega" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="vega">Vega</TabsTrigger>
            <TabsTrigger value="theta">Theta</TabsTrigger>
            <TabsTrigger value="delta">Delta</TabsTrigger>
          </TabsList>

          <TabsContent value="vega" >
            <ChartContainer config={vegaConfig} className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transformedData}>
                  <CartesianGrid />
                  <XAxis
                    dataKey="ist_minute"
                    tick={{ fontSize: 12 }}
                    ticks={tickBuckets}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} width={40} />
                  <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) =>
                    new Date(label).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                  } />} />
                  {Object.entries(vegaConfig).map(([key, { color }]) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="theta">
            <ChartContainer config={thetaConfig} className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transformedData}>
                  <CartesianGrid />
                  <XAxis
                    dataKey="ist_minute"
                    tick={{ fontSize: 12 }}
                    ticks={tickBuckets}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} width={40} />
                  <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) =>
                    new Date(label).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                  } />} />
                  {Object.entries(thetaConfig).map(([key, { color }]) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>

          <TabsContent value="delta">
            <ChartContainer config={deltaConfig} className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={transformedData}>
                  <CartesianGrid />
                  <XAxis
                    dataKey="ist_minute"
                    tick={{ fontSize: 12 }}
                    ticks={tickBuckets}
                    tickFormatter={(value) =>
                      new Date(value).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    }
                  />
                  <YAxis tick={{ fontSize: 12 }} width={40} />
                  <ChartTooltip content={<ChartTooltipContent labelFormatter={(label) =>
                    new Date(label).toLocaleTimeString('en-IN', {
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: false,
                    })
                  } />} />
                  {Object.entries(deltaConfig).map(([key, { color }]) => (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={color}
                      strokeWidth={2}
                      dot={false}
                      isAnimationActive={false}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
