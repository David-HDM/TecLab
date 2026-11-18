import type { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";

// Ancho, espaciado y fondo comunes para el contenido de cada página.
export default function PageContainer({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const backgroundImage = user ? "none" : "url('/fondo_inicio_registro.png')";

  return (
    <div
      className="mx-auto max-w-6xl bg-cover bg-center bg-no-repeat px-4 py-8 sm:px-6 lg:px-8"
      style={{ backgroundImage }}
    >
      {children}
    </div>
  );
}
