import { Link, useParams } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import { topics, labs } from "../data/catalog";

export default function LabDetail() {
  const { labId } = useParams();
  const lab = labs.find((t) => t.id === labId);

  if (!lab) {
    return (
      <PageContainer>
        <p className="text-gray-600">Laboratorio no encontrado.</p>
        <Link to="/laboratorios" className="font-semibold text-blue-700 hover:underline">Volver a Laboratorios</Link>
      </PageContainer>
    );
  }

  const related = topics.filter((p) => p.labId === lab.id);

  return (
    <PageContainer>
      <Link to="/laboratorios" className="text-sm font-semibold text-blue-700 hover:underline">← Laboratorios</Link>
      <h1 className="mt-2 text-2xl font-bold text-blue-900">{lab.titulo}</h1>
      <p className="mt-2 text-gray-600">{lab.descripcion}</p>

      {/* Aquí irá el contenido del tema y el resumen de la Wikipedia API */}

      <div className="mt-8 flex flex-wrap gap-3">
        {related.map((p) => (
          <Link
            key={p.id}
            to={`/temas/${p.id}`}
            className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-800"
          >
            Tema: {p.titulo}
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}