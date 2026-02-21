import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { useGreeksSummary } from "@/hooks/useGreeksSummary"
import { formatNumber } from "@/lib/utils"
import { CartesianGrid, Line, LineChart, ResponsiveContainer, XAxis, YAxis } from "recharts"

export const NetGexChart = () => {
  const { data: summaryData, isLoading: isSummaryLoading } = useGreeksSummary()

  const netGexConfig = {
    net_gex_positive: { label: "Net GEX", color: "hsl(142, 76%, 50%)" },
    net_gex_negative: { label: "Net GEX", color: "hsl(346, 87%, 50%)" },
  };

  const tickBuckets = summaryData
    .map((d: { ist_minute?: string }) => d.ist_minute)
    .filter((t: string | undefined): t is string => {
      if (!t) return false;
      const date = new Date(t);
      return date.getMinutes() % 15 === 0 && date.getSeconds() === 0;
    })
    .slice(1);

  return (
    <Card className="col-span-7">
      <CardHeader><CardTitle>Intraday Net GEX variation</CardTitle></CardHeader>
      <CardContent>
        <ChartContainer config={netGexConfig} className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={summaryData}>
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
              <YAxis tick={{ fontSize: 12 }} width={60} tickFormatter={formatNumber} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    labelFormatter={(label) =>
                      new Date(label).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false,
                      })
                    }
                  />
                }
              />
              <Line
                type="monotone"
                dataKey="total_net_gex"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}