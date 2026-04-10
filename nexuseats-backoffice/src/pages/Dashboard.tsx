import { useQuery } from "@tanstack/react-query";
import { Store, ShoppingBag, Users as UsersIcon, Euro } from "lucide-react";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatEUR } from "@/lib/utils";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface Kpi {
  totalRestaurants: number;
  totalOrders: number;
  totalUsers: number;
  revenueToday: number;
  revenueByDay: { day: string; revenue: number }[];
}

export default function Dashboard() {
  const { data } = useQuery<Kpi>({
    queryKey: ["dashboard"],
    queryFn: async () => {
      const { data: d } = await api.get("/v1/admin/stats/dashboard");
      return d as Kpi;
    },
  });

  const kpis = [
    { label: "Restaurants", value: data?.totalRestaurants ?? "—", icon: Store },
    { label: "Commandes", value: data?.totalOrders ?? "—", icon: ShoppingBag },
    { label: "Utilisateurs", value: data?.totalUsers ?? "—", icon: UsersIcon },
    { label: "CA du jour", value: data ? formatEUR(data.revenueToday) : "—", icon: Euro },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Tableau de bord</h2>
        <p className="text-muted-foreground">Vue d'ensemble (données Prisma + file des commandes)</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{k.label}</CardTitle>
              <k.icon className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{k.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Chiffre d'affaires — 7 derniers jours (placeholder)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data?.revenueByDay || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip formatter={(v: number) => formatEUR(v)} />
              <Bar dataKey="revenue" fill="hsl(24 95% 53%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
