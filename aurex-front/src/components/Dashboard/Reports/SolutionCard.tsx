import Button from "../../ui/Button";

interface SolutionCardProps {
  solution: string;
  onSolutionHelpful: (helpful: boolean) => void;
  onBackClick?: () => void;
  hasHistory: boolean;
}

export default function SolutionCard({
  solution,
  onSolutionHelpful,
  onBackClick,
  hasHistory,
}: SolutionCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
            <svg
              className="w-5 h-5 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            Solución recomendada
          </h2>
        </div>
        
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <p className="text-gray-700 leading-relaxed">{solution}</p>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <p className="text-sm text-gray-600 mb-3">
          ¿Esta solución te ayudó a resolver tu problema?
        </p>
        
        <div className="flex gap-3">
          <Button
            type="primary"
            className="flex-1"
            onClick={() => onSolutionHelpful(true)}
          >
            ✓ Sí, me ayudó
          </Button>
          <Button
            type="secondary"
            variant="outline"
            className="flex-1"
            onClick={() => onSolutionHelpful(false)}
          >
            ✗ No me ayudó
          </Button>
        </div>
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
