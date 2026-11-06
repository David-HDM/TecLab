import { Link, useParams } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import { practices } from "../data/catalog";

export default function PracticeRunner() {
  const { practiceId } = useParams();
  const practice = practices.find((p) => p.id === practiceId);

  if (!practice) {
    return (
      <PageContainer>
        <p className="text-gray-600">Práctica no encontrada.</p>
        <Link to="/practicas" className="font-semibold text-blue-700 hover:underline">Volver a Prácticas</Link>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Link to="/practicas" className="text-sm font-semibold text-blue-700 hover:underline">← Prácticas</Link>
      <h1 className="mt-2 text-2xl font-bold text-blue-900">{practice.titulo}</h1>
      <p className="mt-2 text-gray-600">{practice.descripcion}</p>

      <div className="mt-6 rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center text-gray-500">
        Aquí se renderizarán StepGuide y el componente de la práctica ({practice.id}).
      </div>
    </PageContainer>
  );
}