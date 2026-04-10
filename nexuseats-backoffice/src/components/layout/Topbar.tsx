import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { Button } from "@/components/ui/button";

export default function Topbar() {
  const { user, logout } = useAuthStore();
  const nav = useNavigate();
  return (
    <header className="h-16 border-b bg-card/80 backdrop-blur sticky top-0 z-10 flex items-center justify-between px-6">
      <div>
        <h1 className="text-sm text-muted-foreground">Back-office</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-right text-sm">
          <div className="font-medium">{user?.firstName} {user?.lastName}</div>
          <div className="text-xs text-muted-foreground">{user?.email} · {user?.role}</div>
        </div>
        <Button variant="outline" size="sm" onClick={() => { logout(); nav("/login"); }}>
          <LogOut className="h-4 w-4" /> Déconnexion
        </Button>
      </div>
    </header>
  );
}
