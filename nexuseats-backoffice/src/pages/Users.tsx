import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { api } from "@/lib/api";
import { mapApiRoleToBackoffice, mapBackofficeRoleToApi } from "@/lib/roles";
import { UserRow } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, THead, TBody, TR, TH, TD } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default function Users() {
  const qc = useQueryClient();
  const { data: users = [] } = useQuery<UserRow[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const { data } = await api.get("/v1/admin/users");
      const rows = data as { id: number; email: string; role: string; createdAt: string }[];
      return rows.map((u) => ({
        id: u.id,
        email: u.email,
        firstName: "",
        lastName: "",
        role: mapApiRoleToBackoffice(u.role),
        createdAt: u.createdAt,
      }));
    },
  });

  const updateRole = useMutation({
    mutationFn: async ({ id, role }: { id: number; role: UserRow["role"] }) =>
      api.patch(`/v1/admin/users/${id}/role`, { role: mapBackofficeRoleToApi(role) }),
    onSuccess: () => {
      toast.success("Rôle mis à jour");
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: () => toast.error("Impossible de mettre à jour le rôle"),
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Utilisateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <THead>
            <TR>
              <TH>ID</TH>
              <TH>Email</TH>
              <TH>Rôle</TH>
              <TH className="text-right">Changer rôle</TH>
            </TR>
          </THead>
          <TBody>
            {users.map((u) => (
              <TR key={u.id}>
                <TD>{u.id}</TD>
                <TD>{u.email}</TD>
                <TD>
                  <Badge variant={u.role === "ADMIN" ? "danger" : u.role === "MANAGER" ? "warning" : "default"}>
                    {u.role}
                  </Badge>
                </TD>
                <TD className="text-right">
                  <select
                    className="border rounded-md h-9 px-2 text-sm"
                    value={u.role}
                    onChange={(e) =>
                      updateRole.mutate({ id: u.id, role: e.target.value as UserRow["role"] })
                    }
                  >
                    <option value="CLIENT">CLIENT</option>
                    <option value="MANAGER">MANAGER</option>
                    <option value="ADMIN">ADMIN</option>
                  </select>
                </TD>
              </TR>
            ))}
          </TBody>
        </Table>
      </CardContent>
    </Card>
  );
}
