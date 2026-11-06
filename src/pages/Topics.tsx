import { Link } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import { topics } from "../data/catalog";

export default function Topics() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-blue-900">Temas</h1>
      <p className="mt-1 text-gray-600">Categoría: Redes</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {topics.map((t) => (
          <Link key={t.id} to={`/temas/${t.id}`} className="block transition-shadow hover:shadow-md">
            <Card title={t.titulo} className="h-full">
              <p className="text-gray-600">{t.descripcion}</p>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}