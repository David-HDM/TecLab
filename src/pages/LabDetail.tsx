import { Link, useNavigate, useParams } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import { useEffect, useState } from "react";
import type { Lab } from "../types/lab";
import type { Topic } from "../types/topic";
import { api } from "../api/catalog";
import { searchWikipediaConcepts, type WikipediaConcept } from "../services/wikipediaService";

// Muestra el laboratorio, sus temas y los conceptos relacionados de Wikipedia.
export default function LabDetail() {
  const { labId } = useParams<{ labId: string }>();
  const navigate = useNavigate();
  const [lab, setLab] = useState<Lab | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState("");
  const [wikiConcepts, setWikiConcepts] = useState<WikipediaConcept[]>([]);
  const [wikiLoading, setWikiLoading] = useState(false);
  const [wikiError, setWikiError] = useState("");

  // Carga el laboratorio y los temas asociados a la ruta.
  useEffect(() => {
    if (!labId) return;
    api.getLab(labId).then(setLab);
    api.getTopicsByLab(labId).then(setTopics);
  }, [labId]);

  // Busca resúmenes breves usando las palabras clave del laboratorio.
  useEffect(() => {
    const keywords = lab?.palabras_clave ?? [];
    if (!keywords.length) {
      setWikiConcepts([]);
      setWikiLoading(false);
      setWikiError("");
      return;
    }

    let active = true;
    setWikiLoading(true);
    setWikiError("");
    setWikiConcepts([]);
    searchWikipediaConcepts(keywords)
      .then((concepts) => {
        if (active) setWikiConcepts(concepts);
      })
      .catch((error: unknown) => {
        console.error("No se pudieron consultar conceptos en Wikipedia:", error);
        if (active) {
          setWikiError(error instanceof Error ? error.message : "No se pudieron cargar conceptos de Wikipedia.");
        }
      })
      .finally(() => {
        if (active) setWikiLoading(false);
      });

    return () => {
      active = false;
    };
  }, [lab?.id, lab?.palabras_clave]);

  if (!lab) {
    return (
      <PageContainer>
        <p className="text-gray-600 mb-4">Laboratorio no encontrado.</p>
        <Link to="/explorar" className="font-semibold text-blue-700 hover:underline mr-4">Ir a Explorar</Link>
        <Link to="/mis-laboratorios" className="font-semibold text-blue-700 hover:underline">Ir a Mis Laboratorios</Link>
      </PageContainer>
    );
  }

  const related = topics.filter((topic) => topic.lab_id === lab.id);

  // Inicia el laboratorio y abre su vista de temas.
  const handleStart = async () => {
    setStarting(true);
    setStartError("");
    try {
      const startedLab = await api.startLab(lab.id);
      setLab(startedLab);
      navigate(`/${startedLab.id}`, { replace: true });
    } catch (error) {
      console.error("No se pudo iniciar el laboratorio:", error);
      setStartError(error instanceof Error ? error.message : "No se pudo iniciar el laboratorio.");
    } finally {
      setStarting(false);
    }
  };

  return (
    <PageContainer>
      {lab.estatus === "COMENZADO" ? (
        <>
          <Link to="/mis-laboratorios" className="text-sm font-semibold text-blue-700 hover:underline">
            ← Regresar
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-blue-900">Temas</h1>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {topics.map((topic) => (
              <Link
                key={topic.id}
                to={`/${topic.lab_id}/${topic.id}`}
                className="block transition-shadow hover:shadow-md"
              >
                <Card title={topic.titulo} className="h-full">
                  <p className="text-gray-600">{topic.descripcion}</p>
                </Card>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <>
          <Link to="/explorar" className="text-sm font-semibold text-blue-700 hover:underline">
            ← Regresar
          </Link>
          <h1 className="mb-8 mt-2 text-2xl font-bold text-blue-900">{lab.titulo}</h1>
          {lab.img_detalle && <img src={lab.img_detalle} className="mx-auto" />}

          <h2 className="mt-10 font-bold">¿De qué trata?</h2>
          <p className="mb-8 mt-4 text-justify text-gray-600">{lab.descripcion_larga}</p>

          <section aria-labelledby="wikipedia-concepts-title" className="mb-10">
            <h2 id="wikipedia-concepts-title" className="text-xl font-bold text-blue-900">
              Conceptos que deberías conocer
            </h2>
            {wikiLoading ? (
              <p className="mt-4 text-gray-600">Buscando conceptos en Wikipedia...</p>
            ) : wikiError ? (
              <p role="alert" className="mt-4 text-red-600">{wikiError}</p>
            ) : wikiConcepts.length ? (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2">
                {wikiConcepts.map((concept) => (
                  <li key={concept.id} className="rounded-lg border border-gray-200 p-4">
                    <h3 className="font-semibold text-blue-900">{concept.title}</h3>
                    <p className="mt-2 text-sm text-gray-600">{concept.summary}</p>
                    <a
                      href={concept.url}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-3 inline-block text-sm font-semibold text-blue-700 hover:underline"
                    >
                      Leer en Wikipedia
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-gray-600">Wikipedia no encontró artículos relacionados.</p>
            )}
          </section>

          <h2 className="font-bold">Temas vistos en este laboratorio:</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            {related.map((topic) => (
              <Card key={topic.id}>{topic.titulo}</Card>
            ))}
          </div>
          <div className="mt-16 flex justify-center">
            <Button onClick={handleStart} disabled={starting}>
              {starting ? "Iniciando..." : "Comenzar ahora"}
            </Button>
          </div>
          {startError && (
            <p role="alert" className="mt-4 text-center text-sm text-red-600">
              {startError}
            </p>
          )}
        </>
      )}
    </PageContainer>
  );
}