import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, Store, UtensilsCrossed, ShoppingBag,
  Users as UsersIcon, BarChart3, Settings as SettingsIcon, Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { to: "/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { to: "/restaurants", label: "Restaurants", icon: Store },
  { to: "/menus", label: "Menus & Plats", icon: UtensilsCrossed },
  { to: "/orders", label: "Commandes", icon: ShoppingBag },
  { to: "/users", label: "Utilisateurs", icon: UsersIcon },
  { to: "/stats", label: "Statistiques", icon: BarChart3 },
  { to: "/monitoring", label: "Monitoring", icon: Activity },
  { to: "/settings", label: "Paramètres", icon: SettingsIcon },
];

export default function Sidebar() {
  return (
    <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b">
        <span className="text-lg font-bold text-primary">NexusEats</span>
        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">ADMIN</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-colors",
                isActive ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
