import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function Monitoring() {
  const { data } = useQuery<{ status: string; services: Record<string, { status: string; latency?: number }> }>({
    queryKey: ["health"],
    queryFn: async () => {
      const { data: d } = await api.get("/health");
      return d as { status: string; services: Record<string, { status: string; latency?: number }> };
    },
    refetchInterval: 15_000,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Monitoring</h2>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            État global
            <Badge variant={data?.status === "ok" ? "success" : "danger"}>{data?.status ?? "…"}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {data &&
            Object.entries(data.services).map(([name, s]) => (
              <div key={name} className="flex items-center justify-between border-b pb-2">
                <span className="font-medium">{name}</span>
                <div className="flex items-center gap-2">
                  {s.latency !== undefined && (
                    <span className="text-xs text-muted-foreground">{s.latency} ms</span>
                  )}
                  <Badge variant={s.status === "up" ? "success" : "danger"}>{s.status}</Badge>
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
