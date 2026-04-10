import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import { Dish, Restaurant } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { formatEUR } from "@/lib/utils";

function mapApiRestaurant(r: Record<string, unknown>): Restaurant {
  const addr = String(r.address ?? "");
  return {
    id: String(r.id),
    name: String(r.name ?? ""),
    address: addr,
    isOpen: Boolean(r.isOpen ?? true),
  };
}

export default function Menus() {
  const qc = useQueryClient();
  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [menuName, setMenuName] = useState("Carte");
  const [form, setForm] = useState({ name: "", description: "", price: 0 });

  const { data: restaurants = [] } = useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data } = await api.get("/v2/restaurants", { params: { limit: 100, page: 1 } });
      return ((data?.data ?? []) as Record<string, unknown>[]).map(mapApiRestaurant);
    },
  });

  const { data: menus = [] } = useQuery({
    queryKey: ["menus", restaurantId],
    queryFn: async () => {
      const { data } = await api.get(`/v1/restaurants/${restaurantId}/menus`);
      return data as { id: string; name: string; items?: Record<string, unknown>[] }[];
    },
    enabled: !!restaurantId,
  });

  const dishes: Dish[] =
    menus.flatMap((m) =>
      (m.items ?? []).map((it) => ({
        id: String(it.id),
        menuId: m.id,
        name: String(it.name ?? ""),
        description: it.description ? String(it.description) : undefined,
        price: Number(it.price ?? 0),
        category: Array.isArray(it.categories)
          ? (it.categories as { name?: string }[]).map((c) => c.name).filter(Boolean).join(", ") || "—"
          : "—",
        available: it.available !== false,
      }))
    ) ?? [];

  const firstMenuId = menus[0]?.id;

  const createDish = useMutation({
    mutationFn: async () => {
      if (!restaurantId || !firstMenuId) throw new Error("Menu requis");
      await api.post("/v1/menu-items", {
        name: form.name,
        description: form.description || undefined,
        price: form.price,
        menuId: firstMenuId,
        available: true,
        categoryIds: [],
      });
    },
    onSuccess: () => {
      toast.success("Plat ajouté");
      qc.invalidateQueries({ queryKey: ["menus", restaurantId] });
      setOpen(false);
      setForm({ name: "", description: "", price: 0 });
    },
       onError: () => toast.error("Créez d’abord un menu ou vérifiez les champs"),
  });

  const delDish = useMutation({
    mutationFn: async (id: string) => api.delete(`/v1/menu-items/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["menus", restaurantId] }),
  });

  const createEmptyMenu = useMutation({
    mutationFn: async () => {
      if (!restaurantId) return;
      await api.post("/v1/menus", {
        name: menuName || "Carte",
        restaurantId,
        description: "",
      });
    },
    onSuccess: () => {
      toast.success("Menu créé");
      qc.invalidateQueries({ queryKey: ["menus", restaurantId] });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Menus & Plats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Label>Restaurant :</Label>
          <select
            className="border rounded-md h-10 px-3 text-sm min-w-[200px]"
            value={restaurantId ?? ""}
            onChange={(e) => setRestaurantId(e.target.value || null)}
          >
            <option value="">— Sélectionner —</option>
            {restaurants.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>
          {restaurantId && menus.length === 0 && (
            <div className="flex items-center gap-2">
              <Input
                className="h-10 w-40"
                placeholder="Nom du menu"
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
              />
              <Button type="button" variant="outline" size="sm" onClick={() => createEmptyMenu.mutate()}>
                Créer un menu
              </Button>
            </div>
          )}
          {restaurantId && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button className="ml-auto" disabled={menus.length === 0}>
                  <Plus className="h-4 w-4" /> Ajouter un plat
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nouveau plat</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  <div>
                    <Label>Nom</Label>
                    <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Description</Label>
                    <Input
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                  </div>
                  <div>
                    <Label>Prix (€)</Label>
                    <Input
                      type="number"
                      step="0.01"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setOpen(false)}>
                    Annuler
                  </Button>
                  <Button onClick={() => createDish.mutate()}>Créer</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {restaurantId && (
          <Table>
            <THead>
              <TR>
                <TH>Nom</TH>
                <TH>Catégorie</TH>
                <TH>Prix</TH>
                <TH>Dispo</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {dishes.map((d) => (
                <TR key={d.id}>
                  <TD className="font-medium">{d.name}</TD>
                  <TD>{d.category}</TD>
                  <TD>{formatEUR(d.price)}</TD>
                  <TD>
                    <Badge variant={d.available ? "success" : "warning"}>
                      {d.available ? "Oui" : "Non"}
                    </Badge>
                  </TD>
                  <TD className="text-right">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => confirm("Supprimer ?") && delDish.mutate(d.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TD>
                </TR>
              ))}
            </TBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
