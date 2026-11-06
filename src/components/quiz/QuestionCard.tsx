import Card from "../ui/Card";
import type { Question } from "../../types/quiz";

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selected: number | null;
  onSelect: (option: number) => void;
}

export default function QuestionCard({ question, index, total, selected, onSelect }: QuestionCardProps) {
  return (
    <Card>
      <p className="text-sm font-semibold text-gray-500">
        Pregunta {index + 1} de {total}
      </p>
      <h2 className="mt-2 text-lg font-semibold text-blue-900">{question.enunciado}</h2>

      <div className="mt-4 space-y-2">
        {question.opciones.map((opcion, i) => (
          <button
            key={i}
            onClick={() => onSelect(i)}
            className={`w-full rounded-md border px-4 py-3 text-left transition-colors ${
              selected === i
                ? "border-blue-700 bg-blue-50 text-blue-900"
                : "border-gray-300 hover:bg-gray-50"
            }`}
          >
            {opcion}
          </button>
        ))}
      </div>
    </Card>
  );
}