import { useMemo, useState } from "react";
import { Link, useParams } from "react-router";
import PageContainer from "../components/layout/PageContainer";
import Button from "../components/ui/Button";
import QuestionCard from "../components/quiz/QuestionCard";
import QuizResult from "../components/quiz/QuizResult";
import ReinforcementTopics from "../components/quiz/ReinforcementTopics";
import { questions as allQuestions, topics } from "../data/catalog";

export default function Quiz() {
  const { topicId } = useParams();
  const topic = topics.find((t) => t.id === topicId);
  const questions = useMemo(() => allQuestions.filter((q) => q.topicId === topicId), [topicId]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [finished, setFinished] = useState(false);

  if (!topic || questions.length === 0) {
    return (
      <PageContainer>
        <p className="text-gray-600">Evaluación no disponible.</p>
        <Link to="/temas" className="font-semibold text-blue-700 hover:underline">Volver a Temas</Link>
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

  const handleNext = () => (isLast ? setFinished(true) : setCurrent(current + 1));

  const handleRetry = () => {
    setCurrent(0);
    setAnswers([]);
    setFinished(false);
  };

  const failed = questions.filter((q, i) => answers[i] !== q.correcta);
  const correct = questions.length - failed.length;

  return (
    <PageContainer>
      <Link to={`/temas/${topic.id}`} className="text-sm font-semibold text-blue-700 hover:underline">
        ← {topic.titulo}
      </Link>
      <h1 className="mt-2 text-2xl font-bold text-blue-900">Evaluación de reforzamiento</h1>

      <div className="mx-auto mt-6 max-w-2xl space-y-6">
        {finished ? (
          <>
            <QuizResult correct={correct} total={questions.length} onRetry={handleRetry} />
            <ReinforcementTopics failed={failed} topicId={topic.id} topicTitle={topic.titulo} />
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
              <Button onClick={handleNext} disabled={selected === null}>
                {isLast ? "Finalizar" : "Siguiente"}
              </Button>
            </div>
          </>
        )}
      </div>
    </PageContainer>
  );
}