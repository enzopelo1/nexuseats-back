import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import { formatEUR } from "@/lib/utils";

export default function Stats() {
  const { data } = useQuery<{ monthly: { month: string; revenue: number }[]; topDishes: { name: string; count: number }[] }>({
    queryKey: ["stats"],
    queryFn: async () => {
      const { data: d } = await api.get("/v1/admin/stats/overview");
      return d as { monthly: { month: string; revenue: number }[]; topDishes: { name: string; count: number }[] };
    },
  });

  const exportCsv = async () => {
    const res = await api.get("/v1/admin/stats/export", { responseType: "blob" });
    const blob = res.data as Blob;
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "nexuseats-stats.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Statistiques</h2>
        <Button onClick={() => exportCsv()}>
          <Download className="h-4 w-4" /> Exporter CSV
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>CA mensuel (placeholder)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data?.monthly || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip formatter={(v: number) => formatEUR(v)} />
              <Line type="monotone" dataKey="revenue" stroke="hsl(24 95% 53%)" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Plats (catalogue)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {data?.topDishes?.map((d, i) => (
              <li key={i} className="flex justify-between border-b pb-2">
                <span>
                  {i + 1}. {d.name}
                </span>
                <span className="font-medium">{d.count} ventes</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
