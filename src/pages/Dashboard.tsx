import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Card from "../components/ui/Card";
import ProgressBar from "../components/ui/ProgressBar";
import ProgressChart from "../components/dashboard/ProgressChart";
import ScoreHistoryChart from "../components/dashboard/ScoreHistoryChart";
import TopicProgressTable from "../components/dashboard/TopicProgressTable";
import DesplegableFiltro from "../components/ui/DesplegableFiltro";
import Button from "../components/ui/Button";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api/catalog";
import type { Lab } from "../types/lab";
import type { PracticeProgress, TopicProgress } from "../types/topic";
import type { QuizAttempt } from "../types/quiz";

const LEVELS = [
  { value: "PRINCIPIANTE", label: "Principiante" },
  { value: "INTERMEDIO", label: "Intermedio" },
  { value: "AVANZADO", label: "Avanzado" },
] as const;

// Normaliza errores de API para mostrarlos como mensajes legibles.
function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

// Panel de avance con filtros por laboratorio, nivel, tema y práctica.
export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [labs, setLabs] = useState<Lab[]>([]);
  const [topics, setTopics] = useState<TopicProgress[]>([]);
  const [practices, setPractices] = useState<PracticeProgress[]>([]);
  const [quizHistory, setQuizHistory] = useState<QuizAttempt[]>([]);
  const [labId, setLabId] = useState("");
  const [level, setLevel] = useState("");
  const [topicId, setTopicId] = useState("");
  const [practiceId, setPracticeId] = useState("");
  const [labsLoading, setLabsLoading] = useState(true);
  const [topicsLoading, setTopicsLoading] = useState(false);
  const [practicesLoading, setPracticesLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState("");

  // Carga laboratorios disponibles al montar el panel.
  useEffect(() => {
    let active = true;
    api.getLabs()
      .then((data) => {
        if (active) setLabs(data);
      })
      .catch((cause: unknown) => {
        console.error("No se pudieron cargar los laboratorios del Dashboard:", cause);
        if (active) setError(getErrorMessage(cause, "No se pudieron cargar los laboratorios."));
      })
      .finally(() => {
        if (active) setLabsLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  // Actualiza el progreso de temas cuando cambia el laboratorio.
  useEffect(() => {
    if (!labId) {
      setTopics([]);
      setTopicsLoading(false);
      return;
    }

    let active = true;
    setTopicsLoading(true);
    setTopics([]);
    setError("");
    api.getDashboardTopics(labId)
      .then((data) => {
        if (active) setTopics(data);
      })
      .catch((cause: unknown) => {
        console.error("No se pudo cargar el progreso por tema:", cause);
        if (active) setError(getErrorMessage(cause, "No se pudo cargar el progreso de este laboratorio."));
      })
      .finally(() => {
        if (active) setTopicsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [labId]);

  // Actualiza las prácticas cuando cambia el tema seleccionado.
  useEffect(() => {
    if (!topicId) {
      setPractices([]);
      setPracticesLoading(false);
      return;
    }

    let active = true;
    setPracticesLoading(true);
    setPractices([]);
    setError("");
    api.getDashboardPractices(topicId)
      .then((data) => {
        if (active) setPractices(data);
      })
      .catch((cause: unknown) => {
        console.error("No se pudo cargar el progreso de prácticas:", cause);
        if (active) setError(getErrorMessage(cause, "No se pudo cargar el progreso de las prácticas."));
      })
      .finally(() => {
        if (active) setPracticesLoading(false);
      });

    return () => {
      active = false;
    };
  }, [topicId]);

  // Recupera el historial de evaluaciones de la práctica seleccionada.
  useEffect(() => {
    if (!practiceId) {
      setQuizHistory([]);
      setHistoryLoading(false);
      return;
    }

    let active = true;
    setHistoryLoading(true);
    setQuizHistory([]);
    setError("");
    api.getQuizHistory(practiceId)
      .then((data) => {
        if (active) setQuizHistory(data);
      })
      .catch((cause: unknown) => {
        console.error("No se pudo cargar el historial de evaluaciones:", cause);
        if (active) setError(getErrorMessage(cause, "No se pudo cargar el historial de evaluaciones."));
      })
      .finally(() => {
        if (active) setHistoryLoading(false);
      });

    return () => {
      active = false;
    };
  }, [practiceId]);

  // Deriva opciones y porcentajes para los gráficos a partir de los datos cargados.
  const startedLabs = labs.filter((lab) => lab.estatus === "COMENZADO");
  const levels = useMemo(
    () => LEVELS.filter(({ value }) => topics.some((topic) => topic.nivel === value)),
    [topics]
  );
  const visibleTopics = useMemo(
    () => topics.filter((topic) => !level || topic.nivel === level),
    [topics, level]
  );
  const overallProgress = topics.length
    ? Math.round(topics.reduce((sum, topic) => sum + topic.progreso, 0) / topics.length)
    : 0;
  const selectedPractice = practices.find((practice) => practice.practice_id === practiceId);

  // Cada cambio de filtro reinicia las selecciones dependientes.
  const handleLabChange = (nextLabId: string) => {
    setLabId(nextLabId);
    setLevel("");
    setTopicId("");
    setPracticeId("");
    setPractices([]);
    setQuizHistory([]);
    setError("");
  };

  const handleTopicChange = (nextTopicId: string) => {
    setTopicId(nextTopicId);
    setPracticeId("");
    setPractices([]);
    setQuizHistory([]);
    setError("");
  };

  const handleLevelChange = (nextLevel: string) => {
    setLevel(nextLevel);
    setTopicId("");
    setPracticeId("");
    setPractices([]);
    setQuizHistory([]);
    setError("");
  };

  const handleGoToPractice = () => {
    if (labId && topicId && practiceId) {
      navigate(`/${labId}/${topicId}/${practiceId}`);
    }
  };

  return (
    <PageContainer>
      <h1 className="text-2xl font-bold text-blue-900">Hola, {user?.nombre}</h1>
      <p className="mt-1 text-gray-600">Aquí tienes un resumen de tu progreso guardado.</p>

      <DesplegableFiltro
        id="laboratorio"
        value={labId}
        disabled={labsLoading}
        className="mt-8"
        onChange={(event) => handleLabChange(event.target.value)}
      >
        <option value="">{labsLoading ? "Cargando laboratorios..." : "Seleccionar laboratorio"}</option>
        {startedLabs.map((lab) => (
          <option key={lab.id} value={lab.id}>{lab.titulo}</option>
        ))}
      </DesplegableFiltro>

      {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}

      {!labId ? (
        <div className="flex min-h-[400px] items-center justify-center">
          <h2 className="text-center">Selecciona un laboratorio iniciado para consultar tus estadísticas.</h2>
        </div>
      ) : (
        <>
          <Card className="mt-6">
            <ProgressBar value={overallProgress} label="Progreso promedio del laboratorio" />
          </Card>

          <Card title="Progreso por tema" className="mt-4">
            <label htmlFor="niveles">Nivel:</label>
            <DesplegableFiltro
              id="niveles"
              value={level}
              disabled={topicsLoading}
              onChange={(event) => handleLevelChange(event.target.value)}
              className="mb-4 ml-2 mt-2"
            >
              <option value="">Todos los niveles</option>
              {levels.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </DesplegableFiltro>
            {topicsLoading ? (
              <p className="text-gray-600">Cargando progreso por tema...</p>
            ) : visibleTopics.length ? (
              <ProgressChart data={visibleTopics} />
            ) : (
              <p className="text-gray-600">No hay temas para este laboratorio y nivel.</p>
            )}
          </Card>

          <Card title="Progreso de prácticas" className="mt-4">
            <label htmlFor="temas">Tema:</label>
            <DesplegableFiltro
              id="temas"
              value={topicId}
              disabled={topicsLoading || visibleTopics.length === 0}
              onChange={(event) => handleTopicChange(event.target.value)}
              className="mb-4 ml-2 mt-2"
            >
              <option value="">Selecciona un tema</option>
              {visibleTopics.map((topic) => (
                <option key={topic.topic_id} value={topic.topic_id}>{topic.titulo}</option>
              ))}
            </DesplegableFiltro>
            {practicesLoading ? (
              <p className="text-gray-600">Cargando progreso de prácticas...</p>
            ) : topicId && practices.length ? (
              <ProgressChart data={practices} />
            ) : (
              <p className="text-center text-gray-600">
                {topicId ? "Este tema todavía no tiene prácticas." : "Selecciona un tema para ver tus prácticas."}
              </p>
            )}
          </Card>

          <Card title="Estadísticas de las prácticas" className="mt-4">
            <label htmlFor="practicas">Práctica:</label>
            <DesplegableFiltro
              id="practicas"
              value={practiceId}
              disabled={!topicId || practicesLoading}
              onChange={(event) => setPracticeId(event.target.value)}
              className="mb-4 ml-2 mt-2"
            >
              <option value="">Selecciona una práctica</option>
              {practices.map((practice) => (
                <option key={practice.practice_id} value={practice.practice_id}>
                  {practice.titulo}
                </option>
              ))}
            </DesplegableFiltro>
            <Button className="ml-4" disabled={!selectedPractice} onClick={handleGoToPractice}>
              Ir a práctica
            </Button>

            {historyLoading ? (
              <p className="mt-4 text-gray-600">Cargando historial...</p>
            ) : practiceId && quizHistory.length ? (
              <div className="mt-4">
                <ScoreHistoryChart data={quizHistory} />
              </div>
            ) : (
              <p className="mt-4 text-center text-gray-600">
                {practiceId ? "No hay evaluaciones registradas para esta práctica." : "Selecciona una práctica para ver el historial."}
              </p>
            )}

            <div className="mt-4">
              {topicId && practices.length ? (
                <TopicProgressTable data={practices} />
              ) : (
                <p className="text-center text-gray-600">
                  Selecciona un tema para ver las estadísticas de sus prácticas.
                </p>
              )}
            </div>
          </Card>
        </>
      )}
    </PageContainer>
  );
}
