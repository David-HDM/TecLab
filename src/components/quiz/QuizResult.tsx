import Button from "../ui/Button";
import Card from "../ui/Card";

interface QuizResultProps {
  correct: number;
  total: number;
  onRetry: () => void;
}

export default function QuizResult({ correct, total, onRetry }: QuizResultProps) {
  const score = Math.round((correct / total) * 100);

  return (
    <Card className="text-center">
      <p className="text-sm font-semibold text-gray-500">Tu resultado</p>
      <p className={`mt-2 text-5xl font-bold ${score >= 70 ? "text-green-600" : "text-red-600"}`}>{score}%</p>
      <p className="mt-2 text-gray-600">
        {correct} de {total} respuestas correctas
      </p>
      <div className="mt-6">
        <Button variant="outline" onClick={onRetry}>
          Intentar de nuevo
        </Button>
      </div>
    </Card>
  );
}