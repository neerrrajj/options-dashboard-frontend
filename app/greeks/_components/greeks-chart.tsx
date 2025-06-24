import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const GreeksChart = () => {
  // Dummy time series data for intraday Greeks variation
  const timeSeriesData = [
    { time: "09:15", call_vega: 1180, put_vega: 1520, call_theta: -820, put_theta: -890, call_delta: 0.28, put_delta: -0.35 },
    { time: "09:30", call_vega: 1195, put_vega: 1535, call_theta: -825, put_theta: -895, call_delta: 0.30, put_delta: -0.38 },
    { time: "10:00", call_vega: 1210, put_vega: 1548, call_theta: -830, put_theta: -900, call_delta: 0.32, put_delta: -0.40 },
    { time: "10:30", call_vega: 1225, put_vega: 1560, call_theta: -835, put_theta: -905, call_delta: 0.33, put_delta: -0.41 },
    { time: "11:00", call_vega: 1238, put_vega: 1572, call_theta: -840, put_theta: -910, call_delta: 0.34, put_delta: -0.42 },
    { time: "11:30", call_vega: 1248, put_vega: 1578, call_theta: -845, put_theta: -915, call_delta: 0.355, put_delta: -0.425 },
    { time: "12:00", call_vega: 1251, put_vega: 1581, call_theta: -850, put_theta: -920, call_delta: 0.35, put_delta: -0.42 },
  ];

  const vegaConfig = {
    call_vega: { label: "Call Vega", color: "hsl(142, 76%, 36%)" },
    put_vega: { label: "Put Vega", color: "hsl(346, 87%, 43%)" },
  };

  const thetaConfig = {
    call_theta: { label: "Call Theta", color: "hsl(39, 96%, 40%)" },
    put_theta: { label: "Put Theta", color: "hsl(20, 96%, 40%)" },
  };

  const deltaConfig = {
    call_delta: { label: "Call Delta", color: "hsl(262, 83%, 58%)" },
    put_delta: { label: "Put Delta", color: "hsl(215, 100%, 50%)" },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Intraday Greeks Variation</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vega" className="w-full">
          <TabsList className="grid grid-cols-3 w-full">
            <TabsTrigger value="vega">Vega</TabsTrigger>
            <TabsTrigger value="theta">Theta</TabsTrigger>
            <TabsTrigger value="delta">Delta</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vega">
            <ChartContainer config={vegaConfig} className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="call_vega" 
                    stroke="var(--color-call_vega)" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="put_vega" 
                    stroke="var(--color-put_vega)" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="theta">
            <ChartContainer config={thetaConfig} className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="call_theta" 
                    stroke="var(--color-call_theta)" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="put_theta" 
                    stroke="var(--color-put_theta)" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
          
          <TabsContent value="delta">
            <ChartContainer config={deltaConfig} className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeSeriesData}>
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line 
                    type="monotone" 
                    dataKey="call_delta" 
                    stroke="var(--color-call_delta)" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="put_delta" 
                    stroke="var(--color-put_delta)" 
                    strokeWidth={2}
                    dot={{ r: 3 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};