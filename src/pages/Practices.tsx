import { Link } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import { practices } from "../data/catalog";

export default function Practices() {
  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-blue-900">Prácticas</h1>
      <p className="mt-1 text-gray-600">Interactivas, simuladas y guiadas paso a paso.</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {practices.map((p) => (
          <Link key={p.id} to={`/practicas/${p.id}`} className="block transition-shadow hover:shadow-md">
            <Card title={p.titulo} className="h-full">
              <p className="text-gray-600">{p.descripcion}</p>
            </Card>
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}