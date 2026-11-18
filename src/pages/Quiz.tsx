import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import QuestionCard from "../components/quiz/QuestionCard";
import QuizResult from "../components/quiz/QuizResult";
import ReinforcementTopics from "../components/quiz/ReinforcementTopics";
import { api } from "../api/catalog";
import type { QuizAttempt, Question } from "../types/quiz";

export default function Quiz() {
  const { practiceId } = useParams();
  const id = practiceId;
  const navigate = useNavigate();

  const [parentTitle, setParentTitle] = useState("");
  const [practicePath, setPracticePath] = useState("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);
  const [savingAttempt, setSavingAttempt] = useState(false);
  const [attemptError, setAttemptError] = useState("");
  const [savedAttempt, setSavedAttempt] = useState<QuizAttempt | null>(null);

  // 👇 Petición a la base de datos
  useEffect(() => {
    let active = true;
    if (!id) {
      setLoading(false);
      setLoadError("No se indicó la práctica que se va a evaluar.");
      return;
    }

    setLoading(true);
    setLoadError("");
    setPracticePath("");
    setQuestions([]);
    setCurrent(0);
    setAnswers([]);
    setFinished(false);
    setSavedAttempt(null);
    setAttemptError("");

    api.getQuestionsForPractice(id)
      .then((questionsData) => {
        if (active) setQuestions(questionsData);
      })
      .catch((error: unknown) => {
        console.error("Error al cargar las preguntas del quiz:", error);
        if (active) {
          setLoadError(error instanceof Error ? error.message : "Error desconocido al cargar las preguntas.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    api.getPractice(id)
      .then(async (practice) => {
        if (!active || !practice) return;
        setParentTitle(practice.titulo || "Evaluación");

        try {
          const topic = await api.getTopic(practice.topic_id);
          if (active && topic) {
            setPracticePath(`/${topic.lab_id}/${practice.topic_id}/${practice.id}`);
          }
        } catch (error) {
          console.error("No se pudo determinar la ruta de regreso al simulador:", error);
        }
      })
      .catch((error: unknown) => {
        console.error("No se pudieron cargar los datos de la práctica del quiz:", error);
      });

    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return (
      <PageContainer>
        <p className="text-gray-600">Cargando evaluación...</p>
      </PageContainer>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <PageContainer>
        <p className="text-gray-600">
          {loadError || "Evaluación no disponible (no hay preguntas para esta práctica)."}
        </p>
        <button
          onClick={() => (practicePath ? navigate(practicePath) : navigate(-1))}
          className="mt-4 font-semibold text-blue-700 hover:underline"
        >
          Volver atrás
        </button>
      </PageContainer>
    );
  }

  const selected = answers[current] ?? null;
  const isLast = current === questions.length - 1;

  const handleSelect = (option: number) => {
    const next = [...answers];
    next[current] = option;
    setAnswers(next);
  };

  const handleNext = async () => {
    if (!isLast) {
      setCurrent(current + 1);
      return;
    }

    const respuestas = questions.flatMap((question, index) => {
      const elegida = answers[index];
      return elegida === null || elegida === undefined
        ? []
        : [{ pregunta: question.id, elegida }];
    });

    if (!id || respuestas.length !== questions.length) {
      setAttemptError("No se pudieron validar las respuestas del quiz.");
      return;
    }

    setSavingAttempt(true);
    setAttemptError("");
    try {
      const attempt = await api.submitQuizAttempt(id, respuestas);
      setSavedAttempt(attempt);
      setFinished(true);
    } catch (error) {
      console.error("No se pudo guardar el intento del quiz:", error);
      setAttemptError(error instanceof Error ? error.message : "Error desconocido.");
    } finally {
      setSavingAttempt(false);
    }
  };

  const handleRetry = () => {
    setCurrent(0);
    setAnswers([]);
    setFinished(false);
    setAttemptError("");
    setSavedAttempt(null);
  };

  const failed = questions.filter((q, i) => answers[i] !== q.correcta);
  const correct = questions.length - failed.length;

  return (
    <PageContainer>
      <button
        onClick={() => (practicePath ? navigate(practicePath) : navigate(-1))}
        className="text-sm font-semibold text-blue-700 hover:underline cursor-pointer"
      >
        ← Volver a {parentTitle}
      </button>

      <h1 className="mt-2 text-2xl font-bold text-blue-900">Evaluación de reforzamiento</h1>

      <div className="mx-auto mt-6 max-w-2xl space-y-6">
        {finished ? (
          <>
            <QuizResult
              correct={savedAttempt?.correctas ?? correct}
              total={savedAttempt?.total ?? questions.length}
              onRetry={handleRetry}
            />
            <ReinforcementTopics failed={failed} practicePath={practicePath} topicTitle={parentTitle} />
          </>
        ) : (
          <>
            <QuestionCard
              question={questions[current]}
              index={current}
              total={questions.length}
              selected={selected}
              onSelect={handleSelect}
            />
            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={selected === null || savingAttempt}>
                {savingAttempt ? "Guardando..." : isLast ? "Finalizar" : "Siguiente"}
              </Button>
            </div>
            {attemptError && (
              <p role="alert" className="text-right text-sm text-red-600">
                No se pudo guardar el resultado: {attemptError}
              </p>
            )}
          </>
        )}
      </div>
    </PageContainer>
  );
}