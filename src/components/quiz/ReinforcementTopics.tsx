import { Link } from "react-router";
import Card from "../ui/Card";
import InlineText from "../ui/InlineText";
import type { Question } from "../../types/quiz";

interface ReinforcementTopicsProps {
  failed: Question[];
  topicId: string;
  topicTitle: string;
}

export default function ReinforcementTopics({ failed, topicId, topicTitle }: ReinforcementTopicsProps) {
  if (failed.length === 0) {
    return (
      <Card title="Reforzamiento">
        <p className="text-gray-600">¡Sin errores! No necesitas reforzar ningún concepto.</p>
      </Card>
    );
  }

  return (
    <Card title="Conceptos a reforzar">
      <ul className="space-y-4">
        {failed.map((q) => (
          <li key={q.id} className="border-l-4 border-red-400 pl-3">
            <p className="font-semibold text-gray-800">{q.concepto}</p>
            <p className="mt-1 text-sm text-gray-600">
              <InlineText text={q.explicacion} />
            </p>
          </li>
        ))}
      </ul>
      <Link
        to={`/temas/${topicId}`}
        className="mt-5 inline-block font-semibold text-blue-700 hover:underline"
      >
        Repasar el tema: {topicTitle}
      </Link>
    </Card>
  );
}
