import { Link } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import { labs } from "../data/catalog";

export default function Laboratories() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-blue-900">Laboratorios disponibles</h1>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {labs.map((l) => (
          <Link key={l.id} to={`/laboratorios/${l.id}`} className="block transition-shadow hover:shadow-md">
            <Card title={l.titulo} className="h-full">
              <img src={l.imageURL} className="mb-4"/>
              <p className="text-gray-600">{l.descripcion}</p>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}