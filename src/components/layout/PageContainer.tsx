import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";

export default function PageContainer({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  return <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: user ? "none" : `url('/fondo_inicio_registro.png')` }}>{children}</div>;
}