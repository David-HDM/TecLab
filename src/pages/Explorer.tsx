import { Link } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import { useEffect, useState } from "react";
import type { Lab } from "../types/lab";
import { api } from "../api/catalog";

// Catálogo de laboratorios que todavía no se han iniciado.
export default function Explorer() {
  const [labs, setLabs] = useState<Lab[]>([]);
  useEffect(() => {
    api.getLabs().then(setLabs);
  }, []);

  const availableLabs = labs.filter((lab) => lab.estatus === "SIN COMENZAR");

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-blue-900">Laboratorios disponibles</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {availableLabs.map((lab) => (
          <Link key={lab.id} to={`/${lab.id}`} className="block transition-shadow hover:shadow-md">
            <Card title={lab.titulo} className="h-full">
              {lab.img_oferta && <img src={lab.img_oferta} className="mb-4" />}
              <p className="text-gray-600">{lab.descripcion_corta}</p>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}