import type { AuthUser } from "@/store/auth";

/** Rôles Prisma / API : customer | owner | admin */
export function mapApiRoleToBackoffice(role: string): AuthUser["role"] {
  if (role === "admin") return "ADMIN";
  if (role === "owner") return "MANAGER";
  return "CLIENT";
}

export function mapBackofficeRoleToApi(
  role: AuthUser["role"]
): "customer" | "owner" | "admin" {
  if (role === "ADMIN") return "admin";
  if (role === "MANAGER") return "owner";
  return "customer";
}
