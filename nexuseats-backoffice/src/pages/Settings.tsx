import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useState } from "react";

export default function Settings() {
  const [form, setForm] = useState({
    platformName: "NexusEats",
    contactEmail: "contact@nexuseats.io",
    deliveryFee: 2.5,
    openingHour: "10:00",
    closingHour: "23:00",
  });

  const save = () => {
    toast.success("Préférences conservées localement (pas d’endpoint /settings sur l’API)");
  };

  return (
    <Card>
      <CardHeader><CardTitle>Paramètres généraux</CardTitle></CardHeader>
      <CardContent className="space-y-4 max-w-xl">
        {Object.entries(form).map(([k, v]) => (
          <div key={k} className="space-y-1">
            <Label>{k}</Label>
            <Input value={v as any} onChange={(e) => setForm({ ...form, [k]: e.target.value })} />
          </div>
        ))}
        <Button onClick={save}>Enregistrer</Button>
      </CardContent>
    </Card>
  );
}
