import { Link, useParams } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import { useEffect, useState } from "react";
import type { Practice } from "../types/practice";
import type { Topic } from "../types/topic";
import { api } from "../api/catalog";

// Detalle del tema y enlaces a las prácticas que pertenecen a él.
export default function TopicDetail() {
  const { labId, topicId } = useParams<{ labId: string; topicId: string }>();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [practices, setPractices] = useState<Practice[]>([]);

  // Carga el tema y sus prácticas cuando cambia el identificador de ruta.
  useEffect(() => {
    if (!topicId) return;
    api.getTopic(topicId).then(setTopic);
    api.getPracticesByTopic(topicId).then(setPractices);
  }, [topicId]);

  if (!topic) {
    return (
      <PageContainer>
        <p className="text-gray-600">Tema no encontrado.</p>
        <Link to={`/${labId}`} className="font-semibold text-blue-700 hover:underline">Volver a Temas</Link>
      </PageContainer>
    );
  }

  const related = practices.filter((practice) => practice.topic_id === topic.id);

  return (
    <PageContainer>
      <Link to={`/${topic.lab_id}`} className="text-sm font-semibold text-blue-700 hover:underline">← Temas</Link>
      <h1 className="mt-2 text-2xl font-bold text-blue-900">{topic.titulo}</h1>
      <p className="mt-2 text-gray-600">{topic.descripcion}</p>

      <h2 className="mt-8 text-xl font-bold">Prácticas disponibles:</h2>
      <div className="mt-8 flex flex-wrap gap-3">
        {related.map((practice) => (
          <Link
            key={practice.id}
            to={`/${topic.lab_id}/${topic.id}/${practice.id}`}
            className="rounded-md bg-blue-700 px-4 py-2 font-semibold text-white transition-colors hover:bg-blue-800"
          >
            {practice.titulo}
          </Link>
        ))}
      </div>
    </PageContainer>
  );
}