import { Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { token, user } = useAuthStore();
  if (!token || !user) return <Navigate to="/login" replace />;
  if (user.role === "CLIENT") return <Navigate to="/login" replace />;
  return <>{children}</>;
}
