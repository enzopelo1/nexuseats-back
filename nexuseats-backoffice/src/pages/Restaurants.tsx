import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { api } from "@/lib/api";
import {
  getApiErrorMessages,
  getApiErrorToastLine,
  restaurantMessagesByField,
  type RestaurantFormFieldKey,
} from "@/lib/api-errors";
import { cn } from "@/lib/utils";
import { Restaurant } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";

const CUISINES = [
  "FRENCH",
  "ITALIAN",
  "JAPANESE",
  "CHINESE",
  "INDIAN",
  "MEXICAN",
  "AMERICAN",
  "MEDITERRANEAN",
  "THAI",
  "OTHER",
] as const;

type FormState = {
  name: string;
  street: string;
  city: string;
  zipCode: string;
  country: string;
  countryCode: string;
  localNumber: string;
  phone: string;
  email: string;
  cuisineType: (typeof CUISINES)[number];
  averagePrice: number;
  deliveryTime: number;
};

const emptyForm = (): FormState => ({
  name: "",
  street: "",
  city: "",
  zipCode: "75001",
  country: "FR",
  countryCode: "+33",
  localNumber: "",
  phone: "+33612345678",
  email: "contact@restaurant.fr",
  cuisineType: "FRENCH",
  averagePrice: 25,
  deliveryTime: 30,
});

function mapApiToRow(r: Record<string, unknown>): Restaurant {
  const addr = String(r.address ?? "");
  const parts = addr.split(",");
  return {
    id: String(r.id),
    name: String(r.name ?? ""),
    address: addr,
    city: parts[1]?.trim()?.split(" ")?.slice(1)?.join(" ") || parts[1]?.trim(),
    countryCode: r.countryCode ? String(r.countryCode) : undefined,
    localNumber: r.localNumber ? String(r.localNumber) : undefined,
    phone:
      r.countryCode && r.localNumber
        ? `${r.countryCode} ${r.localNumber}`
        : undefined,
    isOpen: Boolean(r.isOpen ?? true),
    cuisine: r.cuisine ? String(r.cuisine) : undefined,
    createdAt: r.createdAt ? String(r.createdAt) : undefined,
  };
}

export default function Restaurants() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Restaurant | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<RestaurantFormFieldKey, string>>>({});
  const [generalFormError, setGeneralFormError] = useState<string | null>(null);

  const clearFieldError = (key: RestaurantFormFieldKey) => {
    setFieldErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  useEffect(() => {
    if (open) {
      setFieldErrors({});
      setGeneralFormError(null);
    }
  }, [open]);

  const { data: list = [], isLoading } = useQuery<Restaurant[]>({
    queryKey: ["restaurants"],
    queryFn: async () => {
      const { data } = await api.get("/v2/restaurants", { params: { limit: 100, page: 1 } });
      const rows = (data?.data ?? []) as Record<string, unknown>[];
      return rows.map(mapApiToRow);
    },
  });

  const buildPayload = (f: FormState) => ({
    name: f.name,
    address: {
      street: f.street,
      city: f.city,
      zipCode: f.zipCode,
      country: f.country,
    },
    countryCode: f.countryCode,
    localNumber: f.localNumber.replace(/\s/g, ""),
    phone: f.phone.replace(/\s/g, ""),
    email: f.email,
    cuisineType: f.cuisineType,
    averagePrice: Number(f.averagePrice),
    deliveryTime: Number(f.deliveryTime),
    isOpen: true,
  });

  const save = useMutation({
    mutationFn: async () => {
      if (editing) {
        await api.patch(`/v2/restaurants/${editing.id}`, buildPayload(form));
        return;
      }
      await api.post("/v2/restaurants", buildPayload(form));
    },
    onSuccess: () => {
      toast.success(editing ? "Restaurant modifié" : "Restaurant créé");
      qc.invalidateQueries({ queryKey: ["restaurants"] });
      setOpen(false);
      setForm(emptyForm());
      setEditing(null);
    },
    onError: (e: unknown) => {
      const messages = getApiErrorMessages(e);
      if (messages.length) {
        const { fields, general } = restaurantMessagesByField(messages);
        setFieldErrors(fields);
        setGeneralFormError(general.length ? general.join("\n") : null);
        const summary =
          messages.length > 4
            ? `${messages.slice(0, 4).join(" · ")} · … (${messages.length} au total)`
            : messages.join(" · ");
        toast.error(summary);
      } else {
        const line = getApiErrorToastLine(e);
        setFieldErrors({});
        setGeneralFormError(line);
        toast.error(line);
      }
    },
  });

  const del = useMutation({
    mutationFn: async (id: string) => api.delete(`/v2/restaurants/${id}`),
    onSuccess: () => {
      toast.success("Restaurant supprimé");
      qc.invalidateQueries({ queryKey: ["restaurants"] });
    },
  });

  const onEdit = (r: Restaurant) => {
    setEditing(r);
    const addr = r.address || "";
    const firstLine = addr.split(",")[0]?.trim() ?? "";
    setForm({
      name: r.name,
      street: firstLine,
      city: r.city ?? "",
      zipCode: "75001",
      country: "FR",
      countryCode: r.countryCode ?? "+33",
      localNumber: r.localNumber ?? "",
      phone: `${r.countryCode ?? "+33"}${r.localNumber ?? ""}`.replace(/\s/g, "") || "+33612345678",
      email: "contact@restaurant.fr",
      cuisineType: (r.cuisine as FormState["cuisineType"]) || "FRENCH",
      averagePrice: 25,
      deliveryTime: 30,
    });
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Restaurants</CardTitle>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditing(null);
                setForm(emptyForm());
              }}
            >
              <Plus className="h-4 w-4" /> Nouveau
            </Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editing ? "Modifier" : "Créer"} un restaurant</DialogTitle>
            </DialogHeader>
            {generalFormError && (
              <div className="rounded-md border border-destructive/50 bg-destructive/10 text-destructive text-sm p-3 whitespace-pre-wrap">
                {generalFormError}
              </div>
            )}
            <div className="space-y-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1 sm:col-span-2">
                <Label>Nom</Label>
                <Input
                  value={form.name}
                  className={cn(fieldErrors.name && "border-destructive focus-visible:ring-destructive")}
                  onChange={(e) => {
                    clearFieldError("name");
                    setForm({ ...form, name: e.target.value });
                  }}
                />
                {fieldErrors.name && <p className="text-sm text-destructive">{fieldErrors.name}</p>}
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Rue</Label>
                <Input
                  value={form.street}
                  className={cn(fieldErrors.street && "border-destructive focus-visible:ring-destructive")}
                  onChange={(e) => {
                    clearFieldError("street");
                    setForm({ ...form, street: e.target.value });
                  }}
                />
                {fieldErrors.street && <p className="text-sm text-destructive">{fieldErrors.street}</p>}
              </div>
              <div className="space-y-1">
                <Label>Ville</Label>
                <Input
                  value={form.city}
                  className={cn(fieldErrors.city && "border-destructive focus-visible:ring-destructive")}
                  onChange={(e) => {
                    clearFieldError("city");
                    setForm({ ...form, city: e.target.value });
                  }}
                />
                {fieldErrors.city && <p className="text-sm text-destructive">{fieldErrors.city}</p>}
              </div>
              <div className="space-y-1">
                <Label>Code postal (5 chiffres)</Label>
                <Input
                  value={form.zipCode}
                  className={cn(fieldErrors.zipCode && "border-destructive focus-visible:ring-destructive")}
                  onChange={(e) => {
                    clearFieldError("zipCode");
                    setForm({ ...form, zipCode: e.target.value });
                  }}
                />
                {fieldErrors.zipCode && <p className="text-sm text-destructive">{fieldErrors.zipCode}</p>}
              </div>
              <div className="space-y-1">
                <Label>Pays (ISO, ex. FR)</Label>
                <Input
                  value={form.country}
                  className={cn(fieldErrors.country && "border-destructive focus-visible:ring-destructive")}
                  onChange={(e) => {
                    clearFieldError("country");
                    setForm({ ...form, country: e.target.value });
                  }}
                />
                {fieldErrors.country && <p className="text-sm text-destructive">{fieldErrors.country}</p>}
              </div>
              <div className="space-y-1">
                <Label>Indicatif (ex. +33)</Label>
                <Input
                  value={form.countryCode}
                  className={cn(fieldErrors.countryCode && "border-destructive focus-visible:ring-destructive")}
                  onChange={(e) => {
                    clearFieldError("countryCode");
                    setForm({ ...form, countryCode: e.target.value });
                  }}
                />
                {fieldErrors.countryCode && (
                  <p className="text-sm text-destructive">{fieldErrors.countryCode}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label>Numéro local</Label>
                <Input
                  value={form.localNumber}
                  className={cn(fieldErrors.localNumber && "border-destructive focus-visible:ring-destructive")}
                  onChange={(e) => {
                    clearFieldError("localNumber");
                    setForm({ ...form, localNumber: e.target.value });
                  }}
                />
                {fieldErrors.localNumber && (
                  <p className="text-sm text-destructive">{fieldErrors.localNumber}</p>
                )}
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Téléphone international (validation API)</Label>
                <Input
                  value={form.phone}
                  className={cn(fieldErrors.phone && "border-destructive focus-visible:ring-destructive")}
                  onChange={(e) => {
                    clearFieldError("phone");
                    setForm({ ...form, phone: e.target.value });
                  }}
                />
                {fieldErrors.phone && <p className="text-sm text-destructive">{fieldErrors.phone}</p>}
              </div>
              <div className="space-y-1 sm:col-span-2">
                <Label>Email de contact</Label>
                <Input
                  value={form.email}
                  className={cn(fieldErrors.email && "border-destructive focus-visible:ring-destructive")}
                  onChange={(e) => {
                    clearFieldError("email");
                    setForm({ ...form, email: e.target.value });
                  }}
                />
                {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
              </div>
              <div className="space-y-1">
                <Label>Cuisine</Label>
                <select
                  className={cn(
                    "border rounded-md h-10 px-3 text-sm w-full bg-background",
                    fieldErrors.cuisineType && "border-destructive"
                  )}
                  value={form.cuisineType}
                  onChange={(e) => {
                    clearFieldError("cuisineType");
                    setForm({ ...form, cuisineType: e.target.value as FormState["cuisineType"] });
                  }}
                >
                  {CUISINES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {fieldErrors.cuisineType && (
                  <p className="text-sm text-destructive">{fieldErrors.cuisineType}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label>Prix moyen (€)</Label>
                <Input
                  type="number"
                  value={form.averagePrice}
                  className={cn(fieldErrors.averagePrice && "border-destructive focus-visible:ring-destructive")}
                  onChange={(e) => {
                    clearFieldError("averagePrice");
                    setForm({ ...form, averagePrice: parseFloat(e.target.value) || 0 });
                  }}
                />
                {fieldErrors.averagePrice && (
                  <p className="text-sm text-destructive">{fieldErrors.averagePrice}</p>
                )}
              </div>
              <div className="space-y-1">
                <Label>Délai livraison (min)</Label>
                <Input
                  type="number"
                  value={form.deliveryTime}
                  className={cn(fieldErrors.deliveryTime && "border-destructive focus-visible:ring-destructive")}
                  onChange={(e) => {
                    clearFieldError("deliveryTime");
                    setForm({ ...form, deliveryTime: parseInt(e.target.value, 10) || 30 });
                  }}
                />
                {fieldErrors.deliveryTime && (
                  <p className="text-sm text-destructive">{fieldErrors.deliveryTime}</p>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Annuler
              </Button>
              <Button onClick={() => save.mutate()} disabled={save.isPending}>
                Enregistrer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <p className="text-muted-foreground">Chargement...</p>
        ) : (
          <Table>
            <THead>
              <TR>
                <TH>ID</TH>
                <TH>Nom</TH>
                <TH>Adresse</TH>
                <TH>Téléphone</TH>
                <TH>État</TH>
                <TH className="text-right">Actions</TH>
              </TR>
            </THead>
            <TBody>
              {list.map((r) => (
                <TR key={r.id}>
                  <TD className="font-mono text-xs max-w-[120px] truncate">{r.id}</TD>
                  <TD className="font-medium">{r.name}</TD>
                  <TD className="max-w-[200px] truncate">{r.address}</TD>
                  <TD>{r.phone || "—"}</TD>
                  <TD>
                    <Badge variant={r.isOpen ? "success" : "danger"}>
                      {r.isOpen ? "Ouvert" : "Fermé"}
                    </Badge>
                  </TD>
                  <TD className="text-right space-x-1">
                    <Button size="sm" variant="ghost" onClick={() => onEdit(r)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => confirm("Supprimer ?") && del.mutate(r.id)}
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
