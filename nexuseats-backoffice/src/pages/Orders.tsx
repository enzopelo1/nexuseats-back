import { Fragment, useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ChevronDown, ChevronRight } from "lucide-react";
import { api } from "@/lib/api";
import { Order } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatEUR } from "@/lib/utils";

const STATUS_LABELS: Record<Order["status"], string> = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  PREPARING: "En préparation",
  READY: "Prête",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const statusVariant: Record<Order["status"], "default" | "warning" | "success" | "danger"> = {
  PENDING: "warning",
  ACCEPTED: "default",
  PREPARING: "default",
  READY: "success",
  DELIVERED: "success",
  CANCELLED: "danger",
};

const nextStatus: Partial<Record<Order["status"], Order["status"]>> = {
  PENDING: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY",
  READY: "DELIVERED",
};

function normalizeOrder(raw: Record<string, unknown>): Order {
  const created = raw.createdAt;
  const createdAt =
    typeof created === "string"
      ? created
      : created instanceof Date
        ? created.toISOString()
        : new Date().toISOString();
  const itemsRaw = Array.isArray(raw.items) ? (raw.items as Record<string, unknown>[]) : [];
  return {
    id: String(raw.id),
    customerEmail: raw.customerEmail ? String(raw.customerEmail) : undefined,
    restaurantId: String(raw.restaurantId ?? ""),
    status: (raw.status as Order["status"]) || "PENDING",
    total: Number(raw.total ?? 0),
    createdAt,
    items: itemsRaw.map((it) => {
      const name =
        typeof it.name === "string" && it.name.trim() !== ""
          ? it.name
          : it.menuItemId != null
            ? `Article ${String(it.menuItemId).slice(0, 8)}…`
            : "Article";
      return {
        menuItemId: it.menuItemId != null ? String(it.menuItemId) : undefined,
        quantity: Number(it.quantity ?? 1),
        name,
        price: Number(it.unitPrice ?? it.price ?? 0),
      };
    }),
  };
}

export default function Orders() {
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState<string | null>(null);

  const { data: restaurants = [] } = useQuery({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data } = await api.get("/v2/restaurants", { params: { limit: 100, page: 1 } });
      const rows = (data?.data ?? []) as Record<string, unknown>[];
      return rows.map((r) => ({ id: String(r.id), name: String(r.name ?? "") }));
    },
  });

  const restaurantNameById = useMemo(
    () => new Map(restaurants.map((r) => [r.id, r.name])),
    [restaurants]
  );

  const { data: orders = [] } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/v1/orders");
      const list = Array.isArray(data) ? data : [];
      return list.map((o) => normalizeOrder(o as Record<string, unknown>));
    },
    refetchInterval: 10_000,
  });

  const update = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: Order["status"] }) =>
      api.patch(`/v1/orders/${id}/status`, { status }),
    onSuccess: () => {
      toast.success("Statut mis à jour");
      qc.invalidateQueries({ queryKey: ["orders"] });
    },
    onError: () => toast.error("Mise à jour impossible (rôle admin/owner + API + orders-service requis)"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Commandes — gestion opérationnelle</CardTitle>
        <p className="text-sm text-muted-foreground mt-1">
          Faites avancer les statuts ou annulez une commande. Comptes&nbsp;:{" "}
          <strong>admin@nexus.dev</strong> ou <strong>owner@nexus.dev</strong> (mot de passe seed).
        </p>
      </CardHeader>
      <CardContent>
        <Table>
          <THead>
            <TR>
              <TH className="w-8" />
              <TH>#</TH>
              <TH>Restaurant</TH>
              <TH>Client</TH>
              <TH>Total</TH>
              <TH>Statut</TH>
              <TH className="text-right">Actions</TH>
            </TR>
          </THead>
          <TBody>
            {orders.map((o) => (
              <Fragment key={o.id}>
                <TR>
                  <TD>
                    <button
                      type="button"
                      className="p-1 rounded hover:bg-secondary text-muted-foreground"
                      aria-label={expanded === o.id ? "Replier le détail" : "Voir les articles"}
                      onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                    >
                      {expanded === o.id ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </TD>
                  <TD className="font-mono text-xs max-w-[100px] truncate">{o.id}</TD>
                  <TD>
                    {restaurantNameById.get(o.restaurantId) || (
                      <span className="font-mono text-xs text-muted-foreground">{o.restaurantId}</span>
                    )}
                  </TD>
                  <TD>{o.customerEmail ?? "—"}</TD>
                  <TD>{formatEUR(o.total)}</TD>
                  <TD>
                    <Badge variant={statusVariant[o.status]}>{STATUS_LABELS[o.status]}</Badge>
                  </TD>
                  <TD className="text-right space-x-2">
                    {nextStatus[o.status] && (
                      <button
                        type="button"
                        className="text-sm text-primary hover:underline"
                        onClick={() => update.mutate({ id: o.id, status: nextStatus[o.status]! })}
                      >
                        → {STATUS_LABELS[nextStatus[o.status]!]}
                      </button>
                    )}
                    {o.status !== "CANCELLED" && o.status !== "DELIVERED" && (
                      <button
                        type="button"
                        className="text-sm text-destructive hover:underline"
                        onClick={() => {
                          if (window.confirm("Annuler cette commande ?")) {
                            update.mutate({ id: o.id, status: "CANCELLED" });
                          }
                        }}
                      >
                        Annuler
                      </button>
                    )}
                  </TD>
                </TR>
                {expanded === o.id && (
                  <TR>
                    <TD colSpan={7} className="bg-muted/30">
                      <div className="py-2 px-1">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Articles</p>
                        {o.items.length === 0 ? (
                          <p className="text-sm text-muted-foreground">Aucune ligne détaillée.</p>
                        ) : (
                          <ul className="text-sm space-y-1">
                            {o.items.map((it, i) => {
                              const unit = Number(it.price ?? 0);
                              return (
                                <li key={`${it.menuItemId ?? i}-${i}`} className="flex flex-wrap gap-x-4 gap-y-0.5">
                                  <span className="font-medium">{it.name}</span>
                                  <span className="text-muted-foreground">× {it.quantity}</span>
                                  {unit > 0 && (
                                    <span>
                                      {formatEUR(unit)} u. → {formatEUR(unit * it.quantity)}
                                    </span>
                                  )}
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    </TD>
                  </TR>
                )}
              </Fragment>
            ))}
          </TBody>
        </Table>
        {orders.length === 0 && (
          <p className="text-sm text-muted-foreground mt-4">
            Aucune commande. Créez-en depuis le front client (port 3000) avec le microservice Orders
            démarré.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
