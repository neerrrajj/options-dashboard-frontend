import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export const TopStrikesTable = () => {
  // Dummy data - combining all strikes
  const allStrikes = [
    { strike: 21200, abs_gex: 450000, net_gex: 280000, call_oi: 1650000, put_oi: 800000 },
    { strike: 21250, abs_gex: 320000, net_gex: 125000, call_oi: 1200000, put_oi: 950000 },
    { strike: 21300, abs_gex: 620000, net_gex: 310000, call_oi: 1750000, put_oi: 950000 },
    { strike: 21350, abs_gex: 380000, net_gex: 85000, call_oi: 1400000, put_oi: 1200000 },
    { strike: 21400, abs_gex: 720000, net_gex: 350000, call_oi: 1950000, put_oi: 1100000 },
    { strike: 21450, abs_gex: 420000, net_gex: -15000, call_oi: 1300000, put_oi: 1350000 },
    { strike: 21500, abs_gex: 850000, net_gex: -420000, call_oi: 1250000, put_oi: 1850000 },
    { strike: 21550, abs_gex: 550000, net_gex: -280000, call_oi: 1100000, put_oi: 1550000 },
    { strike: 21600, abs_gex: 680000, net_gex: -280000, call_oi: 980000, put_oi: 1650000 },
    { strike: 21650, abs_gex: 420000, net_gex: -195000, call_oi: 750000, put_oi: 1400000 },
    { strike: 21700, abs_gex: 580000, net_gex: -220000, call_oi: 850000, put_oi: 1450000 },
  ];

  const formatNumber = (num: number) => {
    if (Math.abs(num) >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (Math.abs(num) >= 100000) return `${(num / 100000).toFixed(1)}L`;
    return num.toLocaleString();
  };

  // Get top 3 values for each metric to highlight
  const getTopIndices = (field: keyof typeof allStrikes[0], count = 3) => {
    return allStrikes
      .map((item, index) => ({ value: Math.abs(item[field] as number), index }))
      .sort((a, b) => b.value - a.value)
      .slice(0, count)
      .map(item => item.index);
  };

  const topAbsGex = getTopIndices('abs_gex');
  const topNetGexPos = allStrikes
    .map((item, index) => ({ value: item.net_gex, index }))
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)
    .slice(0, 3)
    .map(item => item.index);
  const topNetGexNeg = allStrikes
    .map((item, index) => ({ value: item.net_gex, index }))
    .filter(item => item.value < 0)
    .sort((a, b) => a.value - b.value)
    .slice(0, 3)
    .map(item => item.index);
  const topCallOI = getTopIndices('call_oi');
  const topPutOI = getTopIndices('put_oi');

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Strikes Analysis</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Strike</TableHead>
              <TableHead>Call OI</TableHead>
              <TableHead>Put OI</TableHead>
              <TableHead>Net GEX</TableHead>
              <TableHead>Abs GEX</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allStrikes.map((row, index) => (
              <TableRow key={row.strike}>
                <TableCell className="font-medium">
                  <Badge variant="outline">{row.strike}</Badge>
                </TableCell>
                <TableCell className={`${topCallOI.includes(index) ? 'bg-green-100 dark:bg-green-900/20 font-bold' : ''} text-green-600`}>
                  {formatNumber(row.call_oi)}
                </TableCell>
                <TableCell className={`${topPutOI.includes(index) ? 'bg-red-100 dark:bg-red-900/20 font-bold' : ''} text-red-600`}>
                  {formatNumber(row.put_oi)}
                </TableCell>
                <TableCell className={`${topNetGexPos.includes(index) || topNetGexNeg.includes(index) ? 'bg-blue-100 dark:bg-blue-900/20 font-bold' : ''} ${row.net_gex >= 0 ? "text-green-600" : "text-red-600"}`}>
                  {formatNumber(row.net_gex)}
                </TableCell>
                <TableCell className={`${topAbsGex.includes(index) ? 'bg-purple-100 dark:bg-purple-900/20 font-bold' : ''} text-blue-600`}>
                  {formatNumber(row.abs_gex)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};