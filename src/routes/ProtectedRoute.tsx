import { Navigate, Outlet, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth";

// Espera la restauración de sesión y conserva la ruta solicitada al iniciar sesión.
export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}