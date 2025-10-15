import { FAQItem, Answer } from "../../../interfaces/FAQ";
import Button from "../../ui/Button";

interface QuestionCardProps {
  question: FAQItem;
  onAnswerClick: (answer: Answer) => void;
  onBackClick?: () => void;
  hasHistory: boolean;
}

export default function QuestionCard({
  question,
  onAnswerClick,
  onBackClick,
  hasHistory,
}: QuestionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          {question.question}
        </h2>
        <p className="text-sm text-gray-600">
          Selecciona la opción que mejor describa tu situación
        </p>
      </div>

      <div className="space-y-3 mb-6">
        {question.answers.map((answer) => (
          <Button
            key={answer.id}
            type="secondary"
            variant="outline"
            className="w-full justify-start text-left h-auto py-3 px-4"
            onClick={() => onAnswerClick(answer)}
          >
            <span className="text-gray-700">{answer.text}</span>
          </Button>
        ))}
      </div>

      {hasHistory && onBackClick && (
        <div className="border-t pt-4">
          <Button
            type="secondary"
            variant="outline"
            className="w-full"
            onClick={onBackClick}
          >
            ← Volver atrás
          </Button>
        </div>
      )}
    </div>
  );
}
