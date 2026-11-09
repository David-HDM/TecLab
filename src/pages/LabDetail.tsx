import { Link, useParams } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import { topics, labs } from "../data/catalog";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";

export default function LabDetail() {
  const { labId } = useParams();
  const lab = labs.find((t) => t.id === labId);

  if (!lab) {
    return (
      <PageContainer>
        <p className="text-gray-600 mb-4">Laboratorio no encontrado.</p>
        <Link to="/explorar" className="font-semibold text-blue-700 hover:underline mr-4">Ir a Explorar</Link>
        <Link to="/mis-laboratorios" className="font-semibold text-blue-700 hover:underline">Ir a Mis Laboratorios</Link>
      </PageContainer>
    );
  }

  const related = topics.filter((p) => p.labId === lab.id);

  return (
    <PageContainer>
      { lab.estatus == "COMENZADO" ? (
          <>
            <Link to="/mis-laboratorios" className="text-sm font-semibold text-blue-700 hover:underline">← Regresar</Link>
            <h1 className="text-2xl font-bold text-blue-900 mt-2">Temas</h1>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {topics.map((t) => (
                <Link key={t.id} to={`/${t.labId}/${t.id}`} className="block transition-shadow hover:shadow-md">
                  <Card title={t.titulo} className="h-full">
                    <p className="text-gray-600">{t.descripcion}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        ) : (
          <>
            <Link to="/explorar" className="text-sm font-semibold text-blue-700 hover:underline">← Regresar</Link>
            <h1 className="mt-2 text-2xl font-bold text-blue-900 mb-8">{lab.titulo}</h1>
            <img src={lab.imgDetalle} className="mx-auto"/>

            {/* Aquí irá el contenido del tema y el resumen de la Wikipedia API */}

            <h1 className="font-bold mt-10">¿De qué trata?</h1> 

            <p className="mt-4 mb-8 text-gray-600 text-justify">{lab.descripcion_larga}</p>

            <h1 className="font-bold">Temas vistos en este Laboratorio:</h1>
            <div className="mt-8 flex flex-wrap gap-3">
              {related.map((p) => (
                <Card
                  key={p.id}
                >
                  {p.titulo}
                </Card>
              ))}
            </div>
            <div className="mt-16 flex justify-center">
              <Button>
                Comenzar ahora
              </Button>
            </div>
          </>
        )
      }
    </PageContainer>
  );
}