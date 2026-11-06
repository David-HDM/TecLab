import { Link, useParams } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import { practices, topics } from "../data/catalog";

export default function TopicDetail() {
  const { topicId } = useParams();
  const topic = topics.find((t) => t.id === topicId);

  if (!topic) {
    return (
      <PageContainer>
        <p className="text-gray-600">Tema no encontrado.</p>
        <Link to="/temas" className="font-semibold text-blue-700 hover:underline">Volver a Temas</Link>
      </PageContainer>
    );
  }

  const related = practices.filter((p) => p.topicId === topic.id);

  return (
    <PageContainer>
      <Link to="/temas" className="text-sm font-semibold text-blue-700 hover:underline">← Temas</Link>
      <h1 className="mt-2 text-2xl font-bold text-blue-900">{topic.titulo}</h1>
      <p className="mt-2 text-gray-600">{topic.descripcion}</p>

      {/* Aquí irá el contenido del tema y el resumen de la Wikipedia API */}

      <div className="mt-8 flex flex-wrap gap-3">
        {related.map((p) => (
          <Link
            key={p.id}
            to={`/practicas/${p.id}`}
            className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-800"
          >
            Practicar: {p.titulo}
          </Link>
        ))}
        <Link
          to={`/evaluacion/${topic.id}`}
          className="rounded-md border border-blue-700 px-4 py-2 font-semibold text-blue-700 transition-colors hover:bg-blue-50"
        >
          Evaluación de reforzamiento
        </Link>
      </div>
    </PageContainer>
  );
}