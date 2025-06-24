'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from "@/components/ui/chart";
import { ComposedChart, Bar, Area, XAxis, YAxis, ResponsiveContainer, ReferenceLine } from "recharts";
import { useState } from "react";

export const GexChart = () => {
  const [visibleLines, setVisibleLines] = useState({
    call_oi: true,
    put_oi: true,
    net_gex: true,
    abs_gex: true,
  });

  // Dummy data matching your chart-data API response format
  const chartData = [
    { strike: 21200, call_oi: 1650000, put_oi: 800000, net_gex: 280000, abs_gex: 450000 },
    { strike: 21250, call_oi: 1200000, put_oi: 950000, net_gex: 125000, abs_gex: 320000 },
    { strike: 21300, call_oi: 1750000, put_oi: 950000, net_gex: 310000, abs_gex: 620000 },
    { strike: 21350, call_oi: 1400000, put_oi: 1200000, net_gex: 85000, abs_gex: 380000 },
    { strike: 21400, call_oi: 1950000, put_oi: 1100000, net_gex: 350000, abs_gex: 720000 },
    { strike: 21450, call_oi: 1300000, put_oi: 1350000, net_gex: -15000, abs_gex: 420000 },
    { strike: 21500, call_oi: 1250000, put_oi: 1850000, net_gex: -420000, abs_gex: 850000 },
    { strike: 21550, call_oi: 1100000, put_oi: 1550000, net_gex: -280000, abs_gex: 550000 },
    { strike: 21600, call_oi: 980000, put_oi: 1650000, net_gex: -280000, abs_gex: 680000 },
    { strike: 21650, call_oi: 750000, put_oi: 1400000, net_gex: -195000, abs_gex: 420000 },
    { strike: 21700, call_oi: 850000, put_oi: 1450000, net_gex: -220000, abs_gex: 580000 },
  ];

  const config = {
    call_oi: { label: "Call OI", color: "hsl(142, 76%, 36%)" },
    put_oi: { label: "Put OI", color: "hsl(346, 87%, 43%)" },
    net_gex: { label: "Net GEX", color: "hsl(221, 83%, 53%)" },
    abs_gex: { label: "Abs GEX", color: "hsl(270, 95%, 60%)" },
  };

  const handleLegendClick = (dataKey: string) => {
    setVisibleLines(prev => ({
      ...prev,
      [dataKey]: !prev[dataKey as keyof typeof prev]
    }));
  };

  const CustomLegend = (props: any) => {
    return (
      <div className="flex items-center justify-center gap-6 mt-4">
        {Object.entries(config).map(([key, { label, color }]) => (
          <div
            key={key}
            className={`flex items-center gap-2 cursor-pointer transition-opacity ${
              visibleLines[key as keyof typeof visibleLines] ? 'opacity-100' : 'opacity-50'
            }`}
            onClick={() => handleLegendClick(key)}
          >
            <div
              className="h-3 w-3 rounded-sm"
              style={{ backgroundColor: color }}
            />
            <span className="text-sm font-medium">{label}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Strike-wise GEX Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="strike" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ReferenceLine y={0} stroke="#666" strokeDasharray="3 3" />
              
              {visibleLines.abs_gex && (
                <Area 
                  dataKey="abs_gex" 
                  fill="var(--color-abs_gex)" 
                  stroke="var(--color-abs_gex)"
                  fillOpacity={0.3}
                  name="Abs GEX"
                />
              )}
              
              {visibleLines.call_oi && (
                <Bar 
                  dataKey="call_oi" 
                  fill="var(--color-call_oi)" 
                  name="Call OI"
                  opacity={0.7}
                />
              )}
              
              {visibleLines.put_oi && (
                <Bar 
                  dataKey="put_oi" 
                  fill="var(--color-put_oi)" 
                  name="Put OI" 
                  opacity={0.7}
                />
              )}
              
              {visibleLines.net_gex && (
                <Bar 
                  dataKey="net_gex" 
                  fill="var(--color-net_gex)" 
                  name="Net GEX"
                  opacity={0.8}
                />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
        <CustomLegend />
      </CardContent>
    </Card>
  );
};