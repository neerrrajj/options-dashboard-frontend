import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export const OTMSummaryTable = () => {
  // Dummy data matching your otm-summary API response format
  const otmData = [
    {
      ist_minute: "2024-01-25T09:15:00",
      instrument: "NIFTY",
      expiry: "2024-01-25",
      otm_call_vega: 1180.50,
      otm_put_vega: 1520.25,
      otm_call_theta: -820.30,
      otm_put_theta: -890.15,
      otm_call_delta: 0.28,
      otm_put_delta: -0.35,
    },
    {
      ist_minute: "2024-01-25T09:30:00",
      instrument: "NIFTY",
      expiry: "2024-01-25",
      otm_call_vega: 1195.75,
      otm_put_vega: 1535.40,
      otm_call_theta: -825.60,
      otm_put_theta: -895.20,
      otm_call_delta: 0.30,
      otm_put_delta: -0.38,
    },
    {
      ist_minute: "2024-01-25T10:00:00",
      instrument: "NIFTY",
      expiry: "2024-01-25",
      otm_call_vega: 1210.20,
      otm_put_vega: 1548.60,
      otm_call_theta: -830.80,
      otm_put_theta: -900.45,
      otm_call_delta: 0.32,
      otm_put_delta: -0.40,
    },
    {
      ist_minute: "2024-01-25T10:30:00",
      instrument: "NIFTY",
      expiry: "2024-01-25",
      otm_call_vega: 1225.85,
      otm_put_vega: 1560.30,
      otm_call_theta: -835.40,
      otm_put_theta: -905.80,
      otm_call_delta: 0.33,
      otm_put_delta: -0.41,
    },
    {
      ist_minute: "2024-01-25T11:00:00",
      instrument: "NIFTY",
      expiry: "2024-01-25",
      otm_call_vega: 1238.90,
      otm_put_vega: 1572.15,
      otm_call_theta: -840.25,
      otm_put_theta: -910.35,
      otm_call_delta: 0.34,
      otm_put_delta: -0.42,
    },
  ];

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>OTM Greeks Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Time</TableHead>
                <TableHead className="text-green-600">Call Vega</TableHead>
                <TableHead className="text-red-600">Put Vega</TableHead>
                <TableHead className="text-orange-600">Call Theta</TableHead>
                <TableHead className="text-orange-700">Put Theta</TableHead>
                <TableHead className="text-purple-600">Call Delta</TableHead>
                <TableHead className="text-blue-600">Put Delta</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {otmData.map((row, index) => (
                <TableRow key={row.ist_minute}>
                  <TableCell className="font-medium">
                    {formatTime(row.ist_minute)}
                  </TableCell>
                  <TableCell className="text-green-600">
                    {row.otm_call_vega.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-red-600">
                    {row.otm_put_vega.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-orange-600">
                    {row.otm_call_theta.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-orange-700">
                    {row.otm_put_theta.toFixed(2)}
                  </TableCell>
                  <TableCell className="text-purple-600">
                    {row.otm_call_delta.toFixed(3)}
                  </TableCell>
                  <TableCell className="text-blue-600">
                    {row.otm_put_delta.toFixed(3)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};
